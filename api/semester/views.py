from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
from .models import Semester
from .serializers import SemesterSerializer

class SemesterView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):        
        active_semester = self.get_active_semester(request.user.organization)
        serializer = SemesterSerializer(active_semester, many=True)
        return Response(serializer.data)

    def post(self, request):
        organization = request.user.organization
        tahun = request.data.get('tahun')
        jenis_semester = request.data.get('semester')

        # Nonaktifkan semester aktif sebelumnya dengan tahun dan jenis semester yang sama
        updated_count = self.deactivate_previous_active(tahun, jenis_semester, organization)

        created = True
        serializer = SemesterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(organization=organization)                
            except IntegrityError:
                # Rollback jika terjadi kesalahan unik
                if updated_count:
                    self.reactivate_previous(tahun, jenis_semester, organization)
                    created = False

            return Response({
                    "message": "Semester berhasil dibuat" if created else "Semester berhasil diperbaharui",
                    "data": serializer.data
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_active_semester(self, organization):
        return Semester.objects.filter(is_aktif=True, organization=organization)

    def deactivate_previous_active(self, tahun, semester, organization):
        return Semester.objects.filter(
            is_aktif=True,
            tahun=tahun,
            semester=semester,
            organization=organization
        ).update(is_aktif=False)

    def reactivate_previous(self, tahun, semester, organization):
        Semester.objects.filter(
            tahun=tahun,
            semester=semester,
            organization=organization
        ).update(is_aktif=True)
