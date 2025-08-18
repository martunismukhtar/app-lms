from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from datetime import datetime, timedelta
from soal.models import Soal
from ujian.models import Ujian, ExamResult, ExamAnswer
from ujian.serializers import ExamResultSerializer
# Create your views here.


class IkutUjianView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        id_ujian = request.data.get("id_ujian")
        waktu_mulai = request.data.get("waktu_mulai")
        jawaban = request.data.get("jawaban")
        print(jawaban)
        # soal = [data['id_soal'] for data in jawaban]
        # Parsing string ke object waktu (datetime.time)
        waktu_mulai_obj = datetime.strptime(waktu_mulai, "%H.%M.%S").time()

        # Ambil waktu sekarang
        sekarang = timezone.localtime()  # <- ini penting, jadi waktu lokal (Asia/Jakarta)
        waktu_sekarang = sekarang.time()
        today = sekarang.date()

        dt_mulai = datetime.combine(today, waktu_mulai_obj)
        dt_sekarang = datetime.combine(today, waktu_sekarang)
        durasi = dt_sekarang - dt_mulai

        # Jika durasi negatif, berarti waktu_mulai lebih lambat dari sekarang
        if durasi.total_seconds() < 0:
            durasi = timedelta(seconds=0)

        # print(durasi.total_seconds())

        data_soal = Soal.objects.filter(ujian_id=id_ujian)
        jumlah_soal = len(data_soal)
        soal_db = [
            {"id_soal": str(soal.id),  "jawaban": soal.jawaban_benar}
            for soal in data_soal
        ]

        kunci_jawaban = {item["id_soal"]: item["jawaban"] for item in soal_db}
        print(kunci_jawaban)
        jumlah_benar = 0
        for jwb in jawaban:
            id_soal = jwb.get("id_soal")
            jawaban_siswa = jwb.get("jawaban")

            if kunci_jawaban.get(id_soal) == jawaban_siswa:
                jumlah_benar += 1

        nilai = round((jumlah_benar / jumlah_soal) * 100, 2)

        # ambil jumlah percobaan
        data_ujian = Ujian.objects.get(id=id_ujian)
        attempt = ExamResult.objects.filter(
            ujian=data_ujian,
            user=user
        ).count()
        
        # simpan hasil ujian
        hasil_ujian = ExamResult.objects.create(
            ujian=data_ujian,
            user=user,
            submitted_at=sekarang,
            duration=durasi.total_seconds(),
            score=nilai,
            waktu_mulai=waktu_mulai_obj,
            attempt=(attempt+1)
        )
        # simpan jawaban
        answers = []
        for jwb in jawaban:
            id_soal = jwb.get("id_soal")
            jawaban_siswa = jwb.get("jawaban")
            answers.append(
                ExamAnswer(
                    result=hasil_ujian,
                    soal=Soal.objects.get(id=id_soal),
                    selected_choice=jawaban_siswa
                )
            )
        ExamAnswer.objects.bulk_create(answers)
        # hasil_ujian_serialier = ExamResultSerializer(hasil_ujian)
        # jumlah_soal = jumlah_soal
        # score = hasil_ujian.score
        # jawaban benar = jumlah_benar
        # jawaban salah = jumlah_soal - jumlah_benar
        hasil = {
            "jumlah_soal": jumlah_soal,
            "score": nilai,
            "jawaban_benar": jumlah_benar,
            "jawaban_salah": jumlah_soal - jumlah_benar
        }
        return Response(hasil, status=status.HTTP_200_OK)
