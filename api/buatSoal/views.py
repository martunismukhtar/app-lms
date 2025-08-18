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
from soal.serializers import SoalSerializer
from common.permissions.org import HasOrganizationPermission
from semester.models import Semester
# from soal.serializers import SoalSerializer
import re
import fitz
from ujian.models import Ujian

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


def validate_soal(soal):
    """Validate generated question structure and content"""
    try:
        # Check if all required fields exist
        if not all(key in soal for key in ['pertanyaan', 'pilihan', 'jawaban']):
            return False

        # Check if question ends with ?
        if not soal['pertanyaan'].strip().endswith('?'):
            return False

        # Check if answer is valid (A, B, C, or D)
        if soal['jawaban'] not in ['A', 'B', 'C', 'D']:
            return False

        # Check if pilihan has exactly 4 choices
        if not isinstance(soal['pilihan'], dict) or len(soal['pilihan']) != 4:
            return False

        # Check if all choices A, B, C, D exist
        required_choices = ['A', 'B', 'C', 'D']
        if not all(choice in soal['pilihan'] for choice in required_choices):
            return False

        # Check if all choices have content
        if not all(soal['pilihan'][choice].strip() for choice in required_choices):
            return False

        return True

    except Exception as e:
        print(f"Validation error: {str(e)}")
        return False

prompt = PromptTemplate(
    input_variables=["context", "jumlah", "tingkat"],
    template="""
    Generate exactly {jumlah} high-quality multiple-choice questions (MCQs) in Indonesian, with a {tingkat} difficulty level, based strictly on the following material.

    ### 📄 Question Format:
    1. Number each question (1., 2., 3., etc.)
    2. Each question must end with a question mark (?)
    3. Provide four answer choices labeled A. to D., one per line
    4. Add a line at the end: Jawaban: X (A/B/C/D only)
    5. Leave one blank line between questions
    6. Do not include any instructions, explanations, or comments

    ### ✅ Quality Criteria:
    - Use clear and formal Bahasa Indonesia
    - Avoid ambiguous or confusing phrasing
    - Only one correct and logical answer per question
    - Distractors must be plausible (not random or nonsensical)
    - Vary question verbs: jelaskan, tentukan, identifikasi, etc.
    - Focus on conceptual understanding, not memorization
    - Avoid repetition of ideas, structures, or wording between questions

    ### 🎯 Difficulty Level: {tingkat}
    - Mudah (Easy): basic definitions, factual recall
    - Sedang (Medium): applying concepts, simple analysis
    - Sulit (Hard): deep reasoning, evaluation, synthesis, complex problem-solving

    ### 📚 Source Material:
    {context}

    ⚠️ Make sure to generate exactly {jumlah} questions — no more, no less.

    ⚠️ Ensure that the correct answer is based on the provided material only.
    """
)

# ====== Utilitas ======
def trim_context(docs, max_chars=3000):
    """Gabungkan dan potong isi dokumen agar tidak melebihi panjang karakter tertentu"""
    combined = "\n\n".join(doc.page_content for doc in docs)
    return combined[:max_chars]

class BuatSoal(APIView):
    def validate_soal(self, soal):
        """Validate generated question structure and content"""
        try:
            # Check if all required fields exist
            if not all(key in soal for key in ['pertanyaan', 'pilihan', 'jawaban']):
                return False

            # Check if question ends with ?
            if not soal['pertanyaan'].strip().endswith('?'):
                return False

            # Check if answer is valid (A, B, C, or D)
            if soal['jawaban'] not in ['A', 'B', 'C', 'D']:
                return False

            # Check if pilihan has exactly 4 choices
            if not isinstance(soal['pilihan'], dict) or len(soal['pilihan']) != 4:
                return False

            # Check if all choices A, B, C, D exist
            required_choices = ['A', 'B', 'C', 'D']
            if not all(choice in soal['pilihan'] for choice in required_choices):
                return False

            # Check if all choices have content
            if not all(soal['pilihan'][choice].strip() for choice in required_choices):
                return False

            return True

        except Exception as e:
            print(f"Validation error: {str(e)}")
            return False

    def post(self, request, *args, **kwargs):
        user = request.user        
        # int(request.data.get("jumlah", 20))  # Bisa dari input user
        jumlah_soal_total = 5
        ujian_id = request.data.get('ujian_id')
        ujian = Ujian.objects.filter(id=ujian_id).first()
        semester = ujian.semester.id
        
        try:
            vectorstore = load_pgvector_vectorstore()
            retriever = vectorstore.as_retriever(
                # Increased k for better context
                search_kwargs={"k": 10, 
                    "filter": {
                        "mapel": str(ujian.mapel.id),
                        "kelas": int(ujian.kelas.id),
                        "semester": str(semester),
                        "organization": str(ujian.organization.id)

                }}
            )

            combine_docs_chain = create_stuff_documents_chain(
                llm=OpenAI(model="gpt-3.5-turbo-instruct",
                           temperature=0.1, max_tokens=1500),  # Lower temperature for consistency, higher tokens
                prompt=prompt
            )
            
            # rag_chain = create_retrieval_chain(
            #     retriever=retriever,
            #     combine_docs_chain=combine_docs_chain
            # )

            soal_objects = []
            tingkat_batch = [("mudah", 2), ("sedang", 2),
                             ("sulit", 1)]  # Adjusted distribution
            nomor_global = 1
            total_dibuat = 0
            gagal_batch = []

            for tingkat, jumlah in tingkat_batch:
                if total_dibuat >= jumlah_soal_total:
                    break
                target = min(jumlah, jumlah_soal_total - total_dibuat)

                # Retry mechanism for better quality
                max_retries = 3
                for attempt in range(max_retries):
                    docs = retriever.get_relevant_documents(f"Buat soal {tingkat} untuk {ujian.mapel.nama}")
                    
                    combined = "\n\n".join(doc.page_content for doc in docs)
                    context = combined[:3000]
                    # print(combined[:3000])
                    # for doc in docs:
                    #     print(doc.page_content)
                    #     combined = "\n\n".join(doc.page_content for doc in docs)
                    #     return combined[:max_chars]

                    # context = trim_context(docs)

                    try:
                        result = combine_docs_chain.invoke({
                            "context": context,
                            "jumlah": target,
                            "tingkat": tingkat
                        })
                        # result = rag_chain.invoke({
                        #     "input": f"Buat soal {tingkat} untuk mata pelajaran {ujian.mapel.nama}",
                        #     "jumlah": target,
                        #     "tingkat": tingkat
                        # })

                        print(f"AI Response for {tingkat}: {result}")
                        parsed = parse_soal(result["answer"])

                        # Validate parsed questions
                        valid_soals = []
                        for soal in parsed:
                            # Add validation function
                            if self.validate_soal(soal):
                                valid_soals.append(soal)

                        if len(valid_soals) >= target:
                            for i, soal in enumerate(valid_soals[:target]):
                                soal_objects.append(Soal(
                                    ujian=ujian,                                    
                                    tipe_soal='pilihan_ganda',
                                    pertanyaan=soal['pertanyaan'],
                                    pilihan=soal['pilihan'],
                                    jawaban_benar=soal['jawaban'],
                                    tingkat_kesulitan=tingkat,
                                    created_by_id=user.id,
                                    created_at=timezone.now()
                                ))
                                nomor_global += 1

                            total_dibuat += len(valid_soals[:target])
                            break  # Success, exit retry loop
                        else:
                            if attempt == max_retries - 1:
                                raise Exception(
                                    f"Tidak bisa membuat soal {tingkat} yang valid setelah {max_retries} percobaan")

                    except Exception as e:
                        if attempt == max_retries - 1:
                            gagal_batch.append({
                                "tingkat": tingkat,
                                "jumlah_diminta": target,
                                "error": str(e)
                            })
                        else:
                            print(
                                f"Attempt {attempt + 1} failed for {tingkat}: {str(e)}")
                            continue

            if soal_objects:
                Soal.objects.bulk_create(soal_objects)

            return Response({
                "status": "success",
                "message": "Soal berhasil dibuat",
                "soal": SoalSerializer(soal_objects, many=True).data if soal_objects else [],
                "jumlah_soal_disimpan": len(soal_objects),
                "gagal_batch": gagal_batch,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DaftarSoal(APIView):
    permission_classes = [IsAuthenticated, HasOrganizationPermission]

    def get(self, request):
        soal = Soal.objects.all()
        serializer = SoalSerializer(soal, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UploadSoal(APIView):
    permission_classes = [IsAuthenticated, HasOrganizationPermission]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return self._error("File tidak ditemukan")
        
        ujian_id = request.data.get('ujian_id')
        ujian = Ujian.objects.filter(id=ujian_id).first()
        doc = fitz.open(file)
        # Gabungkan semua teks dari setiap halaman
        full_text = ""
        for page in doc:
            full_text += page.get_text()

        # === 2. Ekstrak Soal dengan Regex ===
        # Cocokkan: nomor soal, pertanyaan, pilihan A–D, dan jawaban
        # soal_regex = r"(\d+)\.\s+(.*?)(?:\nA\.|\nA\.\s)(.*?)\nB\.\s(.*?)\nC\.\s(.*?)\nD\.\s(.*?)\nJawaban:\s([A-D])"
        soal_regex = r"(\d+)\.\s+(.*?)(?:\nA\.|\nA\.\s)(.*?)\nB\.\s(.*?)\nC\.\s(.*?)\nD\.\s(.*?)\nJawaban\s*:\s*([A-D])"

        matches = re.findall(soal_regex, full_text, re.DOTALL)

        soal_objects = []
        org = request.user.organization
        user = request.user
        
        for match in matches:
            _, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, jawaban = match
            pilihan = {
                "A": pilihan_a.strip(),
                "B": pilihan_b.strip(),
                "C": pilihan_c.strip(),
                "D": pilihan_d.strip()
            }

            soal_objects.append(Soal(
                ujian=ujian,
                tipe_soal='pilihan_ganda',
                pertanyaan=pertanyaan,
                pilihan=pilihan,
                jawaban_benar=jawaban,
                tingkat_kesulitan='mudah',
                created_by_id=user.id,
                created_at=timezone.now()
            ))

        Soal.objects.bulk_create(soal_objects)

        return Response({
            "message": "Soal berhasil diupload",
            "soal": SoalSerializer(soal_objects, many=True).data
        }, status=status.HTTP_200_OK)

    def _error(self, message):
        return Response({"message": message}, status=status.HTTP_400_BAD_REQUEST)


class BuatSoalManual(APIView):
    permission_classes = [IsAuthenticated, HasOrganizationPermission]

    def post(self, request):
        user = request.user        
        ujian_id = request.data.get('ujian_id')
        ujian = Ujian.objects.filter(id=ujian_id).first()
        pertanyaans = request.data.get('fields')        

        if len(pertanyaans) == 0:
            return self._error("Pertanyaan tidak boleh kosong")

        user = request.user
        soal_objects = []
        for pertanyaan in pertanyaans:
            tipe = "pilihan_ganda" if pertanyaan["type"] == "radio" else "essay"
            jawaban_benar_idx = ['A', 'B', 'C', 'D'][int(
                pertanyaan['correctAnswerIndex'])]

            soal_objects.append(Soal(
                ujian=ujian,
                tipe_soal=tipe,
                pertanyaan=pertanyaan['question'],
                pilihan={
                    "A": pertanyaan['options'][0],
                    "B": pertanyaan['options'][1],
                    "C": pertanyaan['options'][2],
                    "D": pertanyaan['options'][3],
                },
                jawaban_benar=jawaban_benar_idx,
                tingkat_kesulitan='mudah',
                created_by_id=user.id
            ))

        Soal.objects.bulk_create(soal_objects)

        return Response(
            {
                "message": "Soal berhasil dibuat",
                "soal": SoalSerializer(soal_objects, many=True).data
            },
            status=status.HTTP_200_OK
        )

    def _error(self, message):
        return Response({"message": message}, status=status.HTTP_400_BAD_REQUEST)
