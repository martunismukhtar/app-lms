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
# Create your views here.


# class LoadDataView(LoginRequiredMixin, View):
#     def get(self, request):
#         queryset = Materi.objects.all().order_by('-created_at').filter(
#             organization=request.user.organization,
#             created_by=request.user
#         )

#         last_id = request.GET.get('cursor')
#         queryParams = request.GET.get('queryString')

#         if last_id and last_id != 'null' and ' 00:00' in last_id:
#             last_id = last_id.replace(' 00:00', '+00:00')
#             dt = datetime.fromisoformat(last_id)
#             queryset = queryset.filter(
#                 created_at__lt=dt
#             )

#         if queryParams:
#             queryParams = queryParams.strip()
#             queryset = queryset.filter(
#                 title__icontains=queryParams
#             )

#         items = queryset[:11]  # ambil 11 data
#         has_more = items.count() > 10
#         data = [
#             {
#                 'id': item.id,
#                 'title': item.title,
#                 'created_at': item.created_at
#             }
#             for item in items
#         ]

#         return JsonResponse({
#             'data': data,
#             'next_cursor': str(data[-1]['created_at']) if data else None,
#             'has_more': has_more,
#         }, status=201)


# class TotalData(LoginRequiredMixin, View):
#     def get(self, request):
#         queryParams = request.GET.get('queryString')
#         queryset = Materi.objects.filter(
#             organization=request.user.organization,
#             created_by=request.user)

#         if queryParams:
#             queryParams = queryParams.strip()
#             queryset = queryset.filter(
#                 title__icontains=queryParams
#             )
#         queryset = queryset.count()

#         return JsonResponse({'jumlah': queryset}, status=201)


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
    
# class MateriDeleteAPIView(DestroyAPIView):
#     queryset = Materi.objects.all()
#     serializer_class = MateriSerializer
#     permission_classes = [IsAuthenticated]
#     lookup_field = 'id'

#     def perform_destroy(self, instance):
#         # Hapus file jika ada
#         if instance.file and hasattr(instance.file, 'path'):
#             if os.path.isfile(instance.file.path):
#                 os.remove(instance.file.path)
        
#         # Hapus instance dari database
#         instance.delete()

#     def delete(self, request, *args, **kwargs):
#         instance = self.get_object()
#         self.perform_destroy(instance)
#         return Response(status=status.HTTP_200_OK)    

# class MateriView(LoginRequiredMixin, TemplateView):
#     template_name = 'materi/index.html'
#     login_url = 'login'


# class MateriCreateView(LoginRequiredMixin, CreateView):
#     model = Materi
#     template_name = 'materi/add.html'
#     login_url = 'login'
#     success_url = reverse_lazy('materi')
#     form_class = FormMateri

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['mapels'] = Mapel.objects.filter(
#             organization=self.request.user.organization
#         )

#         return context

#     def form_valid(self, form):
#         form.instance.created_by = self.request.user
#         form.instance.organization = self.request.user.organization

#         messages.success(self.request, "Materi berhasil dibuat.")
#         return super().form_valid(form)


# class MateriEditView(LoginRequiredMixin, UpdateView):
#     template_name = 'materi/edit.html'
#     login_url = 'login'
#     model = Materi
#     pk_url_kwarg = 'id'
#     success_url = reverse_lazy('materi')
#     form_class = FormMateri

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['mapels'] = Mapel.objects.filter(
#             organization=self.request.user.organization
#         )

#         return context

#     def form_valid(self, form):
#         form.instance.created_by = self.request.user
#         form.instance.organization = self.request.user.organization
#         messages.success(self.request, "Materi berhasil diubah.")
#         return super().form_valid(form)


# class MateriDetailView(LoginRequiredMixin, DetailView):
#     template_name = 'materi/detil.html'
#     login_url = 'login'
#     model = Materi
#     pk_url_kwarg = 'id'

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         try:
#             materi = Materi.objects.get(id=self.kwargs['id'])
#             # Pastikan file ada dan valid
#             if materi.file and os.path.isfile(materi.file.path):
#                 with open(materi.file.path, 'rb') as f:
#                     pdf_base64 = base64.b64encode(f.read()).decode('utf-8')
#                     context['pdf'] = pdf_base64
#             else:
#                 context['pdf'] = None
#         except ObjectDoesNotExist:
#             context['pdf'] = None

#         return context


# class MateriDeleteView(LoginRequiredMixin, DeleteView):
#     model = Materi
#     login_url = 'login'
#     pk_url_kwarg = 'id'

#     def delete(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         self.object.delete()
#         return JsonResponse({
#             'message': 'Data siswa berhasil dihapus'
#         })
