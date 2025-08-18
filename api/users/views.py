from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView
from .serializers import UserSerializer
from .models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import CursorPagination
from rest_framework import status
from rest_framework.response import Response
import csv
from django.contrib.auth.models import Group
from mapel.models import Mapel
from django.db import transaction
# from django.contrib.auth.hashers import make_password
from semester.models import Semester
from kelas_siswa.models import KelasSiswa

class UserCursorPagination(CursorPagination):
    page_size = 10
    ordering = '-date_joined'

# Create your views here.

class UserListView(ListAPIView):    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = UserCursorPagination

    def get_queryset(self):
        org = self.request.user.organization
        user_login = self.request.user
        user = User.objects.filter(organization=org).exclude(id=user_login.id)
        return user


class UserCreateView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return self._error("File tidak ditemukan")

        kelas = request.data.get('kelas')
        mapels = self._get_mapel_list(request)
        # print(mapels)
        if mapels is None:
            return self._error("Format atau ID mapel tidak valid")

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

        created_count = self._process_csv_rows(reader, organization, student_group, mapels, kelas)
        msg = f"{created_count} siswa berhasil diimport." if created_count > 0 else "Data siswa berhasil diimport."

        return Response({
            "message": msg,
        }, status=status.HTTP_201_CREATED)

    def _get_mapel_list(self, request):
        mapel_ids = request.data.get('mapel', '')        
        try:
            mapel_id_list = [x.strip() for x in mapel_ids.split(',') if x.strip()]            
            return list(Mapel.objects.filter(id__in=mapel_id_list))
        except Exception:
            return None

    def _get_student_group(self):
        try:
            return Group.objects.get(name='Student')
        except Group.DoesNotExist:
            return None

    def _process_csv_rows(self, reader, organization, student_group, mapels, kelas):
        users_to_create = []
        user_mapel_relasi = []
        usernames_in_file = set()
        rows = []
        user_kelas = []
        semester = Semester.objects.filter(is_aktif=True, organization=organization).first()
        kelas_siswa = KelasSiswa.objects.filter(id=kelas).first()
        for row in reader:
            nama = row.get('nama', '').strip()
            username = row.get('nis', '').strip()
            password = row.get('nis', '').strip()

            if not (nama and username and password):
                continue

            usernames_in_file.add(username)
            rows.append((nama, username, password))

        # Cek username yang sudah ada
        existing_usernames = set(
            User.objects.filter(username__in=usernames_in_file).values_list('username', flat=True)
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
            created_users = User.objects.bulk_create(users_to_create, batch_size=500)

            # Tambah ke group (1 query untuk ambil ulang)
            User.groups.through.objects.bulk_create([
                User.groups.through(user_id=u.id, group_id=student_group.id)
                for u in created_users
            ])

            # Buat relasi UserMapel (kombinasi Cartesian)
            # for user in created_users:
            #     for mapel in mapels:
            #         user_mapel_relasi.append(UserMapel(user=user, semester=semester, mapel=mapel))

            #     user_kelas.append(
            #         UserKelas(
            #             user=user,
            #             kelas=kelas_siswa
            #         )
            #     )

            # UserKelas.objects.bulk_create(user_kelas, batch_size=500)
            # UserMapel.objects.bulk_create(user_mapel_relasi, batch_size=500)

        return len(created_users)

    def _error(self, message):
        return Response({"message": message}, status=status.HTTP_400_BAD_REQUEST)

class DeleteUserView(DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response({"message": 'User berhasil dihapus'}, 
                        status=status.HTTP_200_OK)