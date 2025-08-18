from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from mapel.serializers import MapelListSerializer
from rest_framework import status
from semester.models import Semester
from materi.models import Materi
from materi.serializers import MateriSerializer
# Create your views here.


class MateriSiswaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        mapel_queryset = user.user_mapel.all()  # ambil mapel yang dimiliki user
        serializer = MapelListSerializer(mapel_queryset, many=True)
        return Response({
            "data": serializer.data
        }, status=status.HTTP_200_OK)


class MateriSiswaDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, mapel_id, kelas_id):    
        user = request.user
        org = user.organization
        semester = Semester.objects.get(is_aktif=True,organization=org)
        
        # kelas = user.user_kelas.first()
        
        data = (
            Materi.objects.filter(
                semester=semester, 
                kelas_id=kelas_id, 
                mapel_id=mapel_id
            )
        )
        print(data.query)
        serializer = MateriSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        # return Response({
        #     "data": {
        #         "materi": 1
        #     }
        # }, status=status.HTTP_200_OK)