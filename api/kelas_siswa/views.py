from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from kelas_siswa.serializers import KelasSerializer, ViewKelasSerializer
from kelas_siswa.models import KelasSiswa
from django.db.models import F
from django.db.models import Count
from rest_framework.views import APIView
# Create your views here.


class KelasSiswaView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = KelasSerializer

    def get(self, request, *args, **kwargs):

        id = kwargs.get('id', None)
        org = self.request.user.organization

        if id is not None:
            kelas = (
                KelasSiswa.objects.filter(id=id)                
                .order_by('id')
                
            )
            serializer = KelasSerializer(kelas, many=True)
            return Response(serializer.data)
        else:
            kelas = (
                KelasSiswa.objects.filter(organization=org)
                .select_related('wali_kelas')
                .order_by('id')
                .annotate(
                    nama_wali_kelas=F('wali_kelas__nama'),
                    jumlah_siswa=Count('riwayat_kelas_siswa')
                )
                .values(
                    'id',
                    'name',
                    'nama_wali_kelas',
                    'jumlah_siswa'
                )
            )
            serializer = ViewKelasSerializer(kelas, many=True)
            return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        name = request.data.get('name')
        wali_kelas = request.data.get('wali_kelas')
        tahun_ajaran = request.data.get('tahun_ajaran')

        try:
            kelas = KelasSiswa.objects.create(
                name=name,
                wali_kelas=wali_kelas,
                tahun_ajaran=tahun_ajaran
            )
            serializer = KelasSerializer(kelas)
            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id=None):
        try:
            kelas_ada = KelasSiswa.objects.get(id=id)
        except KelasSiswa.DoesNotExist:
            return Response({'error': 'Data tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        serializer = KelasSerializer(kelas_ada, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Kelas berhasil diupdate'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None):
        try:
            data_kelas = KelasSiswa.objects.get(id=id)
            data_kelas.delete()
            return Response({'message': 'Kelas berhasil dihapus'}, status=status.HTTP_204_NO_CONTENT)
        except data_kelas.DoesNotExist:
            return Response({'error': 'Kelas tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)


# class KelasView(viewsets.ModelViewSet):
#     permission_classes = [IsAuthenticated]
#     serializer_class = KelasSerializer

#     def get_queryset(self):
#         data_kelas = (
#             KelasSiswa.objects.filter(
#                 organization=self.request.user.organization
#             )
#             .select_related('wali_kelas')
#             .order_by('id')
#             # .annotate(
#             #     nama_wali_kelas=F('wali_kelas__nama'),
#             #     id_wali_kelas=F('wali_kelas__id'),
#             #     jumlah_siswa=Count('riwayat_kelas_siswa')
#             # )
#             # .values(
#             #     'id',
#             #     'id_wali_kelas',
#             #     'name',
#             #     'nama_wali_kelas',
#             #     'jumlah_siswa'
#             # )
#         )
#         # print(data_kelas.query)
#         return data_kelas

#     def perform_create(self, serializer):
#         # Set organisasi saat create
#         serializer.save(organization=self.request.user.organization)

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         instance.delete()
#         return Response({"message": "Kelas berhasil dihapus"}, status=status.HTTP_200_OK)

#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_update(serializer)
#         return Response({
#             "message": "Kelas berhasil diupdate",
#             "data": serializer.data
#         })
