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
# from .serializers import ChatSessionSerializer

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


class BuatSoal(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        mapel = "Matematika"
        # Prompt Template
        prompt_template = PromptTemplate.from_template("""
            Buatkan {jumlah} soal pilihan ganda berdasarkan konteks berikut.

            Konteks:
            {context}

            Ikuti petunjuk berikut:
            - Soal harus relevan dengan konteks
            - Sertakan 4 pilihan jawaban (A, B, C, D)
            - Tentukan satu jawaban yang benar
            - Tambahkan tingkat kesulitan (mudah / sedang / sulit)

            Tampilkan hasil akhir dalam format JSON sebagai list soal seperti ini:

            [
              {{
                "tipe_soal": "pilihan ganda",
                "pertanyaan": "...",
                "pilihan": {{
                  "A": "...",
                  "B": "...",
                  "C": "...",
                  "D": "..."
                }},
                "jawaban_benar": "...",
                "tingkat_kesulitan": "..."
              }},
              ...
            ]

            Tampilkan hanya output JSON tanpa penjelasan tambahan.
        """)

        try:
            # Ambil vectorstore
            vectorstore = load_pgvector_vectorstore()

            # Siapkan prompt dengan jumlah soal
            prompt = prompt_template.partial(jumlah=2)

            # Chain penggabung dokumen
            combine_docs_chain = create_stuff_documents_chain(
                llm=OpenAI(model="gpt-3.5-turbo-instruct"),
                prompt=prompt
            )
            retriever = vectorstore.as_retriever(
                search_kwargs={
                    "k": 4,
                    "filter": {"topic": mapel}  # pastikan metadata-nya benar: "mapel"
                }
            )
            print(retriever)
            # Ambil dokumen kontekstual dari vectorstore berdasarkan mapel
            # docs = retriever.get_relevant_documents(
            #     query="buatkan soal berdasarkan dokumen"
            #     )
            docs = retriever.get_relevant_documents()
            # Gabungkan dokumen dan buat soal dari isinya
            result = combine_docs_chain.invoke({"context": docs})
    
            return Response({"soal": result}, status=status.HTTP_200_OK)

            return Response({"soal": str(result)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
