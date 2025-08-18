from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import User
from guru.models import Mengajar
from guru.serializers import MengajarSerializer
from semester.models import Semester
# from enroll.models import Enrollment
from django.db.models import Count
from django.db.models import Q, F
from siswa.models import SiswaMapel
from siswa.serializers import PelajaranSayaSerializer
# Create your views here.


class DashboardGuruView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logged_user = request.user
        org = logged_user.organization
        semester = Semester.objects.filter(is_aktif=True, organization=org)

        mapel = (
            Mengajar.objects.filter(
                guru=logged_user,
                semester=semester.first(),
                tahun_ajaran=semester.first().tahun
            )
            .select_related('mapel', 'kelas')
            .annotate(
                jumlah_siswa=Count(
                    "kelas__kelas_siswa_mapel",   # relasi dari kelas → SiswaMapel
                    filter=Q(kelas__kelas_siswa_mapel__mapel=F("mapel")),
                    distinct=True
                )
            )
            .values(
                id_mengajar=F("id"),
                id_pelajaran=F("mapel__id"),
                id_kelas=F("kelas__id"),
                mata_pelajaran=F("mapel__nama"),
                nama_kelas=F("kelas__name"),
                # tahun_ajaran=F("tahun_ajaran"),
                jumlah_siswa=F("jumlah_siswa")
            )
        )

        context = {
            "user": logged_user.id,
            "nama": logged_user.nama,
            "mapel": MengajarSerializer(mapel, many=True).data if mapel else mapel
        }
        return Response({"user": context})

class DashboardSiswaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logged_user = request.user
        

        data = (
            SiswaMapel.objects.filter(user=logged_user)
            .select_related("mapel")
            .values(
                id_pelajaran=F("mapel__id"),
                id_kelas=F("kelas_id"),
                nama_pelajaran=F("mapel__nama")  # harus sama dengan field serializer
            )
        )

        print(data.query)
        return Response({
            "pelajaran": PelajaranSayaSerializer(data, many=True).data
        })