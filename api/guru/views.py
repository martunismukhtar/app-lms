from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.models import User
from .models import Guru
from .serializers import GuruSerializer
from users.serializers import AllUserSerializer
from rest_framework.response import Response
from django.contrib.auth.models import Group
from django.db.models import F
# Create your views here.


class GuruView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        id = kwargs.get('pk', None)
        if id is not None:
            users = User.objects.filter(id=id)
        else:
            org = request.user.organization
            users = (
                User.objects.filter(
                    organization=org,
                    groups__name="Teacher"
                )
                # .exclude(id=request.user.id)
                .values(
                    'id',
                    'username',
                    'nama',
                    'email',
                    'jenis_kelamin',
                    'alamat',
                    'tanggal_lahir'

                )
            )        
        serializer = GuruSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        obj_user = request.user
        nama = request.data.get('nama')
        username = request.data.get('username')
        password = request.data.get('password') or username
        email = request.data.get('email')
        jenis_kelamin = request.data.get('jenis_kelamin')
        alamat = request.data.get('alamat')
        tanggal_lahir = request.data.get('tanggal_lahir')

        try:
            user = User.objects.create(
                nama=nama,
                username=username,
                email=email,
                organization=obj_user.organization,
                jenis_kelamin=jenis_kelamin,
                alamat=alamat,
                tanggal_lahir=tanggal_lahir
            )
            user.set_password(password)
            user.save()

            # Tambahkan ke grup Teacher
            group, _ = Group.objects.get_or_create(name="Teacher")
            user.groups.add(group)

            serializer = AllUserSerializer(user)
            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            # Ambil guru
            guru = User.objects.get(
                id=pk
            )
        except Guru.DoesNotExist:
            return Response({'error': 'Guru tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        password = data.pop('password', None)

        # Update data user
        serializer = AllUserSerializer(
            guru,
            data={
                'username': data.get('username'),
                'email': data.get('email'),
                'nama': data.get('nama'),
                'jenis_kelamin': data.get('jenis_kelamin'),
                'alamat': data.get('alamat'),
                'tanggal_lahir': data.get('tanggal_lahir')
            },
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Update password jika diisi
        if password:
            guru.set_password(password)
            guru.save()

        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    def delete(self, request, pk=None):
        try:
            guru = User.objects.get(
                id=pk
            )
        except Guru.DoesNotExist:
            return Response({'error': 'Guru tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)

        guru.delete()

        return Response({'message': 'Guru berhasil dihapus'}, status=status.HTTP_204_NO_CONTENT)
