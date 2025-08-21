from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.models import User
from users.serializers import UserSerializer
from mapel.models import Mapel
from siswa.models import SiswaKelas, RiwayatKelas, SiswaMapel
import csv
from django.contrib.auth.models import Group
from django.db import transaction
from semester.models import Semester
from kelas_siswa.models import KelasSiswa
from rest_framework.pagination import CursorPagination
import datetime
from siswa.serializers import SiswaPerKelasSerializer
from django.db.models import F, Value, Q
from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models.functions import Coalesce
# Create your views here.


class UserCursorPagination(CursorPagination):
    page_size = 10
    ordering = '-date_joined'


class SiswaView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = UserCursorPagination

    def get(self, request):
        user = request.user
        org = user.organization

        kelas = self.request.query_params.get("kelas", "").strip()
        search = self.request.query_params.get("search", "").strip()

        siswa = User.objects.filter(
            organization=org,
            groups__name='Student'
        )

        # if kelas:
        #     siswa = siswa.filter(user_kelas__id=kelas)
        # if search:
        #     siswa = siswa.filter(nama__icontains=search)

        siswa = siswa.order_by('-date_joined')

        # Gunakan pagination_class yang sudah didefinisikan
        paginator = self.pagination_class()
        paginated_qs = paginator.paginate_queryset(siswa, request, view=self)
        serializer = UserSerializer(paginated_qs, many=True)

        return paginator.get_paginated_response(serializer.data)

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return self._error("File tidak ditemukan")

        kelas = request.data.get('kelas')
        # mapels = self._get_mapel_list(request)

        # if mapels is None:
        #     return self._error("Format atau ID mapel tidak valid")

        organization = getattr(request.user, 'organization', None)
        if not organization:
            return self._error("Organisasi tidak ditemukan")

        student_group = self._get_student_group()
        if not student_group:
            return self._error("Group Student belum tersedia")

        try:
            decoded_file = file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)
        except Exception as e:
            return self._error(f"File tidak valid: {str(e)}")

        created_count = self._process_csv_rows(
            reader, organization, student_group, kelas)
        msg = f"{created_count} siswa berhasil diimport." if created_count > 0 else "Data siswa berhasil diimport."

        return Response({
            "message": msg,
        }, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        user = User.objects.get(id=kwargs['pk'])
        user.delete()
        return Response({"message": 'User berhasil dihapus'},
                        status=status.HTTP_200_OK)

    def _get_mapel_list(self, request):
        mapel_ids = request.data.get('mapel', '')
        try:
            mapel_id_list = [x.strip()
                             for x in mapel_ids.split(',') if x.strip()]
            return list(Mapel.objects.filter(id__in=mapel_id_list))
        except Exception:
            return None

    def _get_student_group(self):
        try:
            return Group.objects.get(name='Student')
        except Group.DoesNotExist:
            return None

    def _process_csv_rows(self, reader, organization, student_group, kelas):
        users_to_create = []
        # users_riwayat_kelas = []
        # user_mapel_relasi = []
        usernames_in_file = set()
        rows = []
        # user_kelas = []
        # semester = Semester.objects.filter(
        #     is_aktif=True, organization=organization).first()
        # kelas_siswa = KelasSiswa.objects.filter(id=kelas).first()

        # SiswaKelas, RiwayatKelas

        for row in reader:
            nama = row.get('nama', '').strip()
            username = row.get('nis', '').strip()
            password = row.get('password', '').strip()

            if not (nama and username and password):
                continue

            usernames_in_file.add(username)
            rows.append((nama, username, password))

        # Cek username yang sudah ada
        existing_usernames = set(
            User.objects.filter(username__in=usernames_in_file).values_list(
                'username', flat=True)
        )

        # Buat user baru
        for nama, username, password in rows:
            if username in existing_usernames:
                continue

            user = User(
                username=username,
                email=username,
                nama=nama,
                organization=organization
            )
            user.set_password(password)
            users_to_create.append(user)

        # Eksekusi bulk create user
        with transaction.atomic():
            created_users = User.objects.bulk_create(
                users_to_create, batch_size=500)

            # Tambah ke group (1 query untuk ambil ulang)
            User.groups.through.objects.bulk_create([
                User.groups.through(user_id=u.id, group_id=student_group.id)
                for u in created_users
            ])

            if len(created_users) > 0:
                # tambahkan ke tabel kelas siswa
                siswa_kelas_list = [
                    SiswaKelas(
                        user_id=u.id,
                        kelas_id=kelas
                    )
                    for u in created_users
                ]
                SiswaKelas.objects.bulk_create(
                    siswa_kelas_list, batch_size=500)

                # tambahkan ke riwayat kelas
                riwayat_kelas_list = [
                    RiwayatKelas(
                        siswa_id=u.id,
                        kelas_id=kelas,
                        tahun_ajaran=tahun_ajaran(),
                        status=True
                    )
                    for u in created_users
                ]
                RiwayatKelas.objects.bulk_create(
                    riwayat_kelas_list, batch_size=500)

        return len(created_users)

    def _error(self, message):
        return Response({"message": message}, status=status.HTTP_400_BAD_REQUEST)


class SiswaPerKelas(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        search = self.request.query_params.get("search", "").strip()
        kelas = kwargs['kelas_id']
        kelas_siswa = (
            SiswaKelas.objects.filter(kelas_id=kelas)
            .select_related('user')
            .order_by('kelas_id')
            .annotate(
                mapel=Coalesce(
            ArrayAgg(
                'user__siswa_mapel__mapel__nama',
                distinct=True,
                filter=~Q(user__siswa_mapel__mapel__nama=None)  # buang NULL
            ),
            Value([])  # kalau kosong jadi []
        )
            )
            .values(
                siswa_id=F('user__id'),
                username=F('user__username'),
                nama=F('user__nama'),
                mapel=F('mapel')
            )
        )

        if search:
            kelas_siswa = kelas_siswa.filter(nama__icontains=search)

        serializer = SiswaPerKelasSerializer(kelas_siswa, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SiswaEnrollMp(APIView):
    def post(self, request, *args, **kwargs):
        kelas_id = request.data.get('kelas_id')
        mt_kul = request.data.get('mapel_id')
        data = []

        # ambil siswa berdasarkan kelas
        siswas = list(SiswaKelas.objects.filter(
            kelas_id=kelas_id
        ).values_list('user_id', flat=True))

        data = [
            SiswaMapel(user_id=u, mapel_id=kk, kelas_id=kelas_id)
            for kk in mt_kul
            for u in siswas
        ]

        with transaction.atomic():
            SiswaMapel.objects.bulk_create(
                data, batch_size=500, ignore_conflicts=True)

        return Response({"message": 'Mata kuliah berhasil didaftarkan'},
                        status=status.HTTP_200_OK)


def tahun_ajaran():
    today = datetime.datetime.now()
    if today.month >= 7:
        start_year = today.year
    else:
        start_year = today.year - 1

    return f"{start_year}/{start_year+1}"

#     const today = new Date();
#   let startYear;

#   if (today.getMonth() + 1 >= 7) {
#     startYear = today.getFullYear();
#   } else {
#     startYear = today.getFullYear() - 1;
#   }

#   return `${startYear}/${startYear + 1}`;
