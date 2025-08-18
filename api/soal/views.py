from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from soal.models import Soal
from soal.serializers import SoalSerializer, SoalSiswaSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ujian.models import Ujian


class DaftarSoal(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ujian):
        ujian = Ujian.objects.filter(id=ujian).first()
        soal = Soal.objects.filter(ujian_id=ujian)
        serializer = SoalSiswaSerializer(soal, many=True)
        return Response(
            {
                "data": serializer.data,
                "durasi": ujian.durasi
            }, status=status.HTTP_200_OK)


class ShowSoal(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Soal.objects.all()
    serializer_class = SoalSerializer
    lookup_field = 'id'


class UpdateSoalView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        soal = get_object_or_404(Soal, id=id)
        serializer = SoalSerializer(soal, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Soal berhasil diupdate",
                "data": serializer.data,
            }, status=status.HTTP_200_OK)

        return Response({
            "message": "Validasi gagal",
            "errors": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)


class HapusSoal(APIView):
    def delete(self, request, id):
        soal = Soal.objects.get(id=id)
        soal.delete()
        return Response(
            {"message": "Soal berhasil dihapus"},
            status=status.HTTP_200_OK
        )
