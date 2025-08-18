from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import UjianSerializer
from .models import Ujian, ExamResult
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from datetime import date
from django.utils import timezone

# Create your views here.


class UjianView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UjianSerializer

    def get_queryset(self):
        # Filter by organisasi user
        mapel = self.request.query_params.get("mapel", "")
        kelas = self.request.query_params.get("kelas", "")
        search = self.request.query_params.get("search", "")
        print(mapel, kelas, search)

        ujian = Ujian.objects.filter(organization=self.request.user.organization)
        if mapel:
            ujian = ujian.filter(mapel=mapel)
        if kelas:
            ujian = ujian.filter(kelas=kelas)
        if search:
            ujian = ujian.filter(name__icontains=search)

        return ujian

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


class DaftarUjianAktifView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            tanggal_sekarang = date.today()
            sekarang = timezone.now()
            waktu_sekarang = sekarang.time()
            
            ujian = Ujian.objects.filter(
                organization=request.user.organization,
                # tanggal mulai kurang dari atau sama dengan hari ini
                tanggal__lte=tanggal_sekarang,
                # tanggal akhir lebih dari atau sama dengan hari ini
                tanggal_akhir__gte=tanggal_sekarang
            )
            # ambil score terakhir siswa

            # for u in ujian:
            #     # print(u.id)
            #     hasil = ExamResult.objects.filter(
            #         user = request.user,
            #         ujian_id = u.id
            #     ).order_by('-submitted_at').first()
            #     if hasil is not None:
            #         print(hasil.score)                    
            #         setattr(u, 'score', hasil.score)
            #     else:
            #         setattr(u, 'score', None)
            # Ambil semua hasil ujian terakhir user untuk ujian-ujian tersebut
            hasil_ujian_terakhir = (
                ExamResult.objects.filter(
                    user=request.user,
                    ujian_id__in=ujian.values_list("id", flat=True)
                )
                .order_by('ujian_id', '-submitted_at')
                .distinct('ujian_id')  # Ambil hanya satu hasil per ujian
            )

            # Buat mapping ujian_id → score
            mapping_score = {h.ujian_id: h.score for h in hasil_ujian_terakhir}

            # Sisipkan score ke instance Ujian
            for u in ujian:
                setattr(u, 'score', mapping_score.get(u.id))

            serializer = UjianSerializer(ujian, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
