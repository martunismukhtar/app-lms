from django.shortcuts import render
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView, DetailView
from materi.models import Materi
from mapel.models import Mapel
from django.views import View
from datetime import datetime
from django.http import JsonResponse
from django.contrib import messages
from django.urls import reverse_lazy
from .form import FormMateri
import base64
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView
import os
from .models import Materi
from .serializers import MateriSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import CursorPagination
from core.tasks import process_pdf_to_vector
from semester.models import Semester
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from kelas_siswa.models import KelasSiswa
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
# Create your views here.

class MateriCursorPagination(CursorPagination):
    page_size = 10
    ordering = '-created_at'


class MateriListView(ListAPIView):
    queryset = Materi.objects.all()
    serializer_class = MateriSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = MateriCursorPagination

class MateriDetailView(RetrieveAPIView):
    queryset = Materi.objects.all()
    serializer_class = MateriSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


class MateriCreateAPIView(CreateAPIView):
    queryset = Materi.objects.all()
    serializer_class = MateriSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        kelas = KelasSiswa.objects.get(pk=data['kelas'])        
        semester = Semester.objects.get(
            is_aktif=True,organization=self.request.user.organization
        )
        # semester=semester
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        data_instance = serializer.save(
            created_by=self.request.user,
            organization=self.request.user.organization,
            semester=semester,
            kelas=kelas,
        ) #serializer.save()
        self.run_in_back(data_instance=data_instance)
        return Response({
            "message": "Materi berhasil dibuat",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
   
    def run_in_back(self, data_instance):
        mapel = data_instance.mapel.id
        semester = data_instance.semester.id
        kelas = data_instance.kelas.id
        org = data_instance.organization.id
        print(semester)
        print(kelas)
        # process_pdf_to_vector.delay(
        #     data_instance.file.path,
        #     mapel,
        #     semester,
        #     kelas, org
        # )

class MateriUpdateAPIView(CreateAPIView):
    queryset = Materi.objects.all()
    serializer_class = MateriSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data
        data_instance = get_object_or_404(Materi, id=kwargs['id'])
        serializer = self.get_serializer(data_instance, data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message": "Materi berhasil diupdate",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

class MateriDeleteAPIView(DestroyAPIView):
    queryset = Materi.objects.all()
    serializer_class = MateriSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def perform_destroy(self, instance):
        # Hapus file jika ada dan masih tersedia secara fisik
        try:
            if instance.file and instance.file.name and os.path.isfile(instance.file.path):
                os.remove(instance.file.path)
        except Exception as e:
            # Bisa ditambah logging di sini jika diperlukan
            print(f"Gagal menghapus file: {e}")
        
        # Hapus instance dari database
        instance.delete()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Materi berhasil dihapus."}, status=status.HTTP_200_OK)
    
class MateriByMapel(APIView):
    def get(self, request, mapel):
        materi = Materi.objects.filter(mapel_id=mapel)
        serializer = MateriSerializer(materi, many=True)
        return Response(serializer.data)