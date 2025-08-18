# from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import PromptTemplate
from langchain_openai import OpenAIEmbeddings, OpenAI
from langchain_community.vectorstores import PGVector
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from chatMateri.models import ChatSession, ChatMessage
import os
from dotenv import load_dotenv
from .serializers import ChatSessionSerializer
from materi.models import Materi
from django.db import transaction

load_dotenv()


def load_pgvector_vectorstore():
    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
    connection_string = os.getenv("LANGCHAIN_POSTGRES_CONNECTION_STRING")

    return PGVector(
        collection_name='documents',
        connection_string=connection_string,
        embedding_function=embeddings,
        use_jsonb=True
    )

# Create your views here.

class ChatMateriView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        materi_id = request.data.get("id_materi")
        question = request.data.get("pertanyaan") or request.data.get("question")
        
        # Validasi input
        if not question:
            return Response(
                {"error": "Pertanyaan wajib diisi"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not materi_id:
            return Response(
                {"error": "ID materi wajib diisi"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Ambil data dengan select_related untuk mengurangi query
            # kelas = UserKelas.objects.select_related('kelas').filter(user=user).first()
            # if not kelas:
            #     return Response(
            #         {"error": "User tidak memiliki kelas"}, 
            #         status=status.HTTP_404_NOT_FOUND
            #     )
            
            materi = Materi.objects.select_related('semester').filter(id=materi_id).first()
            if not materi:
                return Response(
                    {"error": "Materi tidak ditemukan"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            semester = materi.semester_id

            # Cari atau buat sesi chat
            chat_session, _ = ChatSession.objects.get_or_create(
                user=user, 
                materi_id=materi_id
            )

            # Ambil 3 chat terakhir untuk chat_history
            previous_messages = ChatMessage.objects.filter(
                chat_session=chat_session
            ).order_by("-created_at")[:3]
            
            # Balik urutan agar dari lama ke baru
            formatted_history = "\n".join([
                f"{msg.sender.capitalize()}: {msg.message}" 
                for msg in reversed(previous_messages)
            ])

            # Proses RAG
            vectorstore = load_pgvector_vectorstore()
            
            # Setup retriever dengan filter
            retriever = vectorstore.as_retriever(
                search_kwargs={
                    "k": 4, 
                    "filter": {
                        "mapel": str(materi_id),
                        # "kelas": int(kelas.kelas_id),
                        "semester": str(semester),
                        "organization": str(user.organization.id)
                    }
                }
            )
            
            # Ambil dokumen yang relevan terlebih dahulu
            retrieved_docs = retriever.invoke(question)
            
            # Validasi apakah ada konteks yang relevan
            if not retrieved_docs:
                # logger.warning(f"Tidak ada konteks ditemukan untuk pertanyaan: {question}")
                return Response({
                    "session_id": chat_session.id,
                    "question": question,
                    "answer": "Saya tidak memiliki informasi tentang hal tersebut.",
                    "source_docs": []
                }, status=status.HTTP_200_OK)
            
            # Periksa kualitas konteks (opsional: tambahkan threshold score)
            has_relevant_context = any(
                hasattr(doc, 'metadata') and doc.page_content.strip() 
                for doc in retrieved_docs
            )
            
            if not has_relevant_context:
                # logger.warning(f"Konteks tidak relevan untuk pertanyaan: {question}")
                return Response({
                    "session_id": chat_session.id,
                    "question": question,
                    "answer": "Saya tidak memiliki informasi tentang hal tersebut.",
                    "source_docs": []
                }, status=status.HTTP_200_OK)

            # Buat prompt yang lebih ketat
            custom_prompt = PromptTemplate.from_template(
                """
                {chat_history}

                Berdasarkan konteks berikut, jawablah pertanyaan dengan singkat dan akurat.
                PENTING: Jika konteks tidak mengandung informasi yang relevan dengan pertanyaan, 
                jawab HANYA: "Saya tidak memiliki informasi tentang hal tersebut."
                
                Jangan membuat jawaban berdasarkan pengetahuan umum jika tidak ada dalam konteks.

                Konteks:
                {context}

                Pertanyaan:
                {input}

                Jawaban:
                """
            )

            # Gabungkan dokumen dan buat jawaban
            combine_docs_chain = create_stuff_documents_chain(
                llm=OpenAI(model="gpt-3.5-turbo-instruct", temperature=0.1),
                prompt=custom_prompt
            )

            # Buat retrieval chain
            retrieval_chain = create_retrieval_chain(
                retriever=retriever,
                combine_docs_chain=combine_docs_chain
            )

            # Invoke chain
            result = retrieval_chain.invoke({
                "input": question,
                "chat_history": formatted_history
            })

            ai_response = result.get("answer", "").strip()
            source_docs = result.get("context", [])

            # Validasi tambahan untuk respons AI
            if not ai_response or ai_response.lower() in [
                "saya tidak tahu", 
                "tidak ada informasi", 
                "maaf saya tidak dapat menjawab"
            ]:
                ai_response = "Saya tidak memiliki informasi tentang hal tersebut."
                source_docs = []

            # Simpan dalam satu transaksi
            with transaction.atomic():
                # Simpan pertanyaan user
                user_message = ChatMessage.objects.create(
                    chat_session=chat_session,
                    sender="user",
                    message=question,
                    created_at=timezone.now()
                )

                # Simpan respons AI
                ai_message = ChatMessage.objects.create(
                    chat_session=chat_session,
                    sender="ai",
                    message=ai_response,
                    source_docs=[
                        doc.metadata for doc in source_docs
                    ] if source_docs else [],
                    created_at=timezone.now()
                )

            return Response({
                "session_id": chat_session.id,
                "question": question,
                "answer": ai_response,
                "source_docs": ai_message.source_docs,
                "has_context": bool(source_docs)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # logger.error(f"Error in ChatMateriView: {str(e)}", exc_info=True)
            return Response(
                {"error": "Terjadi kesalahan pada server"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ChatMateriView1(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        materi_id = request.data.get("id_materi")

        question = request.data.get(
            "pertanyaan") or request.data.get("question")
        
        # kelas = UserKelas.objects.filter(user=user).first()
        materi = Materi.objects.filter(id=materi_id).first()
        semester = materi.semester_id

        if not question:
            return Response({"error": "Pertanyaan wajib diisi"}, status=status.HTTP_400_BAD_REQUEST)

        # cari atau buat sesi chat
        chat_session, _ = ChatSession.objects.get_or_create(
            user=user, materi_id=materi_id)

        # ambil 3 chat terakhir untuk chat_history
        previous_messages = ChatMessage.objects.filter(
            chat_session=chat_session).order_by("created_at")[:3]
        formatted_history = "\n".join([
            f"{msg.sender.capitalize()}: {msg.message}" for msg in previous_messages
        ])

        # simpan pertanyaan user
        user_message = ChatMessage.objects.create(
            chat_session=chat_session,
            sender="user",
            message=question,
            created_at=timezone.now()
        )

        # kirim ke RAG
        try:
            vectorstore = load_pgvector_vectorstore()
            custom_prompt = PromptTemplate.from_template(
                """
                {chat_history}

                Berdasarkan konteks berikut, jawablah pertanyaan dengan singkat dan akurat.
                Jika tidak ada informasi yang relevan, jawab: "Saya tidak memiliki informasi tentang hal tersebut."

                Konteks:
                {context}

                Pertanyaan:
                {input}

                Jawaban:
                """
            )
            # Gabungkan dokumen yang diretriev dan buat jawaban
            combine_docs_chain = create_stuff_documents_chain(
                # pastikan model yang tersedia di akunmu
                llm=OpenAI(model="gpt-3.5-turbo-instruct"),
                prompt=custom_prompt
            )
           
            # print(kelas.kelas_id, str(semester),str(user.organization.id))

            # Buat retrieval chain dari vectorstore
            retrieval_chain = create_retrieval_chain(
                retriever=vectorstore.as_retriever(
                    search_kwargs={"k": 4, "filter": {
                        "mapel": str(materi_id),
                        # "kelas": int(kelas.kelas_id),
                        "semester": str(semester),
                        "organization": str(user.organization.id)
                    }},
                ),
                combine_docs_chain=combine_docs_chain
            )
            result = retrieval_chain.invoke({
                "input": question,
                "chat_history": formatted_history
            })

            print(result)

            ai_response = result.get("answer") or result.get(
                "output") or result  # tergantung chain kamu
            source_docs = result.get("source_documents", [])                        

            # simpan respons AI
            ai_message = ChatMessage.objects.create(
                chat_session=chat_session,
                sender="ai",
                message=ai_response,
                source_docs=[
                    doc.metadata for doc in source_docs] if source_docs else None,
                created_at=timezone.now()
            )

            return Response({
                "session_id": chat_session.id,
                "question": question,
                "answer": ai_response,
                "source_docs": ai_message.source_docs
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatSessionSerializer

    def get(self, request, *args, **kwargs):
        user = request.user
        id_materi = kwargs['id_materi']
        chat_sessions = ChatSession.objects.filter(
            user=user, materi_id=id_materi)  # opsional: urutkan dari terbaru
        serializer = ChatSessionSerializer(chat_sessions, many=True)
        return Response({"chat_sessions": serializer.data}, status=status.HTTP_200_OK)
