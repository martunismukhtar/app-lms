from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from kelas_siswa.serializers import KelasSerializer
from kelas_siswa.models import KelasSiswa
from django.db.models import F
from django.db.models import Count
# Create your views here.


class KelasView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = KelasSerializer

    def get_queryset(self):
        data_kelas = (
            KelasSiswa.objects.filter(
                organization=self.request.user.organization
            )
            .select_related('wali_kelas')
            .order_by('id')
            .annotate(
                nama_wali_kelas=F('wali_kelas__nama'),
                jumlah_siswa=Count('riwayat_kelas_siswa')
            ).values(
                'id',
                'name',
                'nama_wali_kelas',
                'jumlah_siswa'
            ))
        print(data_kelas.query)
        return data_kelas

    def perform_create(self, serializer):
        # Set organisasi saat create
        serializer.save(organization=self.request.user.organization)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Kelas berhasil dihapus"}, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            "message": "Kelas berhasil diupdate",
            "data": serializer.data
        })

    # def get(self, request):
    #     org = request.user.organization
    #     kelas = KelasSiswa.objects.filter(organization=org).all()
    #     serializer = KelasSerializer(kelas, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    # def post(self, request):
    #     serializer = KelasSerializer(data=request.data)
    #     org = request.user.organization

    #     if serializer.is_valid():
    #         serializer.save(organization=org)
    #         return Response({
    #             "message": "Kelas berhasil dibuat",
    #             "data": serializer.data
    #         }, status=status.HTTP_201_CREATED)

    #     return Response({
    #         "message": "Terjadi kesalahan",
    #         "errors": serializer.errors
    #     }, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request, id):
    #     kelas = KelasSiswa.objects.get(id=id)
    #     serializer = KelasSerializer(kelas, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(
    #             {"message": "Kelas berhasil diupdate"},
    #             serializer.data, status=status.HTTP_200_OK)
    #     return Response(
    #         {"message": "Terjadi kesalahn"},
    #         serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, id):
    #     kelas = get_object_or_404(KelasSiswa, id=id)
    #     kelas.delete()
    #     return Response(
    #         {"message": "Kelas berhasil dihapus"},
    #         status=status.HTTP_200_OK
    #     )
