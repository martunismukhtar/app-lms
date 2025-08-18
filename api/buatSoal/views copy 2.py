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
from mapel.models import Mapel
from dotenv import load_dotenv
from soal.models import Soal

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

def parse_soal(text):
    soal_list = []
    blocks = text.strip().split('\n\n')  # Pisahkan per soal

    for block in blocks:
        lines = block.split('\n')
        
        if len(lines) < 6:
            continue  # Skip blok yang tidak lengkap
        
        try:
            # Parsing pertanyaan
            pertanyaan = lines[0].split('. ', 1)[1]
        except IndexError:
            pertanyaan = lines[0]

        try:
            # Parsing pilihan
            pilihan = {
                'A': lines[1][3:].strip(),
                'B': lines[2][3:].strip(),
                'C': lines[3][3:].strip(),
                'D': lines[4][3:].strip()
            }
        except IndexError:
            continue  # Skip jika pilihan tidak lengkap

        try:
            # Parsing jawaban
            if ': ' in lines[5]:
                jawaban = lines[5].split(': ')[1].strip()
            else:
                jawaban = ''
        except IndexError:
            jawaban = ''

        soal = {
            'pertanyaan': pertanyaan,
            'pilihan': pilihan,
            'jawaban': jawaban
        }
        soal_list.append(soal)

    return soal_list

class BuatSoal(APIView):
    def post(self, request, *args, **kwargs):
        user = request.user
        mapel = request.data['topik']
        filter_topic = Mapel.objects.filter(id=mapel).first()
        jumlah_soal=5
        try:
            vectorstore = load_pgvector_vectorstore()
            prompt = PromptTemplate(
                input_variables=["context", "jumlah"],
                template="""
                    Buatkan {jumlah} soal pilihan ganda berdasarkan dokumen berikut dengan format:

                    [Contoh Format]
                    1. Pertanyaan lengkap di sini?
                    A. Pilihan A
                    B. Pilihan B
                    C. Pilihan C
                    D. Pilihan D
                    Jawaban: X  // (Hanya huruf A/B/C/D)

                    [Aturan]
                    1. Soal diberi nomor urut (1., 2., dst)
                    2. Pertanyaan diakhiri tanda tanya (?)
                    3. Pilihan ditandai A. sampai D.
                    4. Jawaban ditulis: "Jawaban: X"
                    5. Beri 1 baris kosong antar soal
                    6. Tampilkan soal saja, tanpa penjelasan tambahan
                    7. Pastikan jumlah soal tepat {jumlah}, tidak kurang tidak lebih
                    8. Hindari soal yang berulang

                    [Konteks]
                    Gunakan materi berikut sebagai referensi:
                    {context}
                """
            )

            combine_docs_chain = create_stuff_documents_chain(
                llm=OpenAI(
                    model="gpt-3.5-turbo-instruct", 
                    temperature=0.3, 
                    max_tokens=1500
                ),
                prompt=prompt
            )

            retriever = vectorstore.as_retriever(
                search_kwargs={
                    "k": 10,
                    "filter": {"topic": filter_topic.nama}
                }
            )
            rag_chain = create_retrieval_chain(
                retriever=retriever,
                combine_docs_chain=combine_docs_chain
            )

            result = rag_chain.invoke({
                "jumlah": jumlah_soal,
                "input": f"Buatkan {jumlah_soal} soal pilihan ganda"
            })
            print(result["answer"])

            data_parse = parse_soal(result["answer"])

            Soal.objects.bulk_create([
                Soal(                    
                    mapel_id=mapel,
                    tipe_soal='pilihan_ganda',
                    pertanyaan=soal['pertanyaan'],
                    pilihan=soal['pilihan'],
                    jawaban_benar=soal['jawaban'],
                    tingkat_kesulitan='mudah',
                    created_by_id=user.id
                ) for soal in data_parse
            ])
            
            return Response({
                "status": "success",                
                "answer": data_parse  # Untuk debugging
            }, status=status.HTTP_200_OK)
           
        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
