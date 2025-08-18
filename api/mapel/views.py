from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from mapel.models import Mapel
from django.contrib import messages
from django.urls import reverse_lazy, reverse

from django.http import JsonResponse
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import MapelListSerializer, MapelSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.models import User
# from users.serializers import AllUserSerializer
from kelas_siswa.models import KelasSiswa
from semester.models import Semester
from guru.models import Mengajar
from guru.serializers import GuruTerdaftarSerializer
from django.db.models import F


class MapelList(ListAPIView):
    queryset = Mapel.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = MapelListSerializer


class MapelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        id = kwargs.get('pk', None)
        if id is not None:
            mapels = Mapel.objects.filter(id=id)
        else:
            mapels = Mapel.objects.all()

        serializer = MapelSerializer(mapels, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):

        obj_user = request.user
        nama = request.data.get('nama')
        kode = request.data.get('kode')
        kelompok = request.data.get('kelompok')

        try:
            data = Mapel.objects.create(
                nama=nama,
                kode=kode,
                kelompok=kelompok
            )
            serializer = MapelListSerializer(data)
            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        try:
            mapel_ada = Mapel.objects.get(id=pk)
        except Mapel.DoesNotExist:
            return Response({'error': 'Mapel tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        serializer = MapelListSerializer(mapel_ada, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            data_mapel = Mapel.objects.get(pk=pk)
            data_mapel.delete()
            return Response({'message': 'Mapel berhasil dihapus'}, status=status.HTTP_204_NO_CONTENT)
        except data_mapel.DoesNotExist:
            return Response({'error': 'Mapel tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)


class GuruMengajarMapel(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        id = kwargs.get('id_mapel', None)
        kelas_id = kwargs.get('id_kelas', None)

        if id is not None:
            org = request.user.organization           
            guru = (
                User.objects.filter(
                    organization=org,
                    guru_mengajar__mapel_id=id,
                    # groups__name="Teacher"
                )                
                .exclude(id=request.user.id)
                .annotate(
                    mengajar_id=F('guru_mengajar__id')
                )                
                .values(
                    'id',
                    'username',
                    'nama',
                    'email',
                    'mengajar_id'
                )
            )
        else:
            return Response(
                {"message": "Pilih mata pelajaran"},
                status=status.HTTP_404_NOT_FOUND
            )

        print(guru.query)

        serializer = GuruTerdaftarSerializer(guru, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EnrollGuruMapel(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        teacher_id = request.data.get('teacher_id')
        mapel_id = request.data.get('mapel_id')
        kelas_id = request.data.get('kelas_id')

        if teacher_id and mapel_id and kelas_id:
            try:
                teacher = User.objects.get(id=teacher_id)
                mapel = Mapel.objects.get(id=mapel_id)
                kelas = KelasSiswa.objects.get(id=kelas_id)

                org = request.user.organization
                semester = Semester.objects.filter(
                    organization=org, is_aktif=True).first()
                tahun_ajaran = semester.tahun
                teacher.guru_mengajar.create(
                    mapel=mapel,
                    kelas=kelas,
                    semester=semester,
                    tahun_ajaran=tahun_ajaran
                )

                return Response({'message': 'Data berhasil disimpan'}, status=status.HTTP_201_CREATED)
            except (User.DoesNotExist, Mapel.DoesNotExist, KelasSiswa.DoesNotExist):
                return Response({'error': 'User, Mapel, atau Kelas tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'error': 'Data tidak lengkap'}, status=status.HTTP_400_BAD_REQUEST)

class UnenrollGuruMapel(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        mengajar_id = request.data.get('mengajar_id')        
        if mengajar_id:
            Mengajar.objects.filter(id=mengajar_id).delete()
            return Response({'message': 'Data berhasil dihapus'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'Data tidak lengkap'}, status=status.HTTP_400_BAD_REQUEST)
# class MapelView(LoginRequiredMixin, TemplateView):
#     login_url = 'login'
#     template_name = 'mapel/index.html'

# class MapelTotalData(LoginRequiredMixin, View):
#     def get(self, request):
#         queryParams = request.GET.get('queryString')
#         queryset = Mapel.objects.filter(
#             organization=request.user.organization,
#             created_by=request.user)

#         if queryParams:
#             queryParams = queryParams.strip()
#             queryset = queryset.filter(
#                 nama__icontains=queryParams
#             )
#         queryset = queryset.count()

#         return JsonResponse({'jumlah': queryset}, status=201)

# class LoadDataView(LoginRequiredMixin, View):
#     def get(self, request):
#         queryset = Mapel.objects.all().order_by('-created_at').filter(
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
#                 nama__icontains=queryParams
#             )

#         items = queryset[:11]  # ambil 11 data
#         has_more = items.count() > 10
#         data = [
#             {
#                 'id': item.id,
#                 'nama': item.nama,
#                 'kode': item.kode,
#                 'kelompok': item.kelompok,
#                 'created_at': item.created_at
#             }
#             for item in items
#         ]

#         return JsonResponse({
#             'data': data,
#             'next_cursor': str(data[-1]['created_at']) if data else None,
#             'has_more': has_more,
#         }, status=201)


# class MapelCreateView(LoginRequiredMixin, CreateView):
#     model = Mapel
#     login_url = 'login'
#     template_name = 'mapel/add.html'
#     success_url = reverse_lazy('mapel')
#     form_class = FormMapel

#     def form_valid(self, form):
#         form.instance.created_by = self.request.user
#         form.instance.organization = self.request.user.organization
#         messages.success(self.request, "Mata Pelajaran berhasil dibuat.")
#         return super().form_valid(form)


# class MapelEditView(LoginRequiredMixin, UpdateView):
#     login_url = 'login'
#     template_name = 'mapel/edit.html'
#     model = Mapel
#     form_class = FormMapel
#     pk_url_kwarg = 'id'

#     def form_valid(self, form):
#         form.instance.created_by = self.request.user
#         form.instance.organization = self.request.user.organization
#         messages.success(self.request, "Mata Pelajaran berhasil diubah.")
#         return super().form_valid(form)

#     def get_success_url(self):
#         return reverse('edit_mapel', kwargs={'id': self.object.id})


# class MapelDeleteView(LoginRequiredMixin, DeleteView):
#     login_url = 'login'
#     model = Mapel
#     success_url = reverse_lazy('mapel')
#     pk_url_kwarg = 'id'

#     def delete(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         self.object.delete()
#         return JsonResponse({
#             'message': 'Data siswa berhasil dihapus'
#         })
