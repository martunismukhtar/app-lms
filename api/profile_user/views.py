from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from users.models import User
from users.serializers import AllUserSerializer
from rest_framework import status

# Create your views here.

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = AllUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data.copy()

        # Jika password tidak dikirim, jangan ubah password
        password = data.pop("password", None)

        serializer = AllUserSerializer(user, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()

            if password:
                user.set_password(password)
                user.save()

            return Response({
                "message": "Profil berhasil diperbarui",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # serializer = UserSerializer(user, data=request.data)
        # serializer.is_valid(raise_exception=True)
        # serializer.save()
        # return Response({
        #     "message": "Data berhasil diupdate",
        #     "data": serializer.data
        # })

    # def get(self):
    #     # Filter by organisasi user
    #     return User.objects.filter(id=self.request.user.id).all()

    # def update(self, request, *args, **kwargs):
    #     instance = self.request.user
    #     serializer = self.get_serializer(instance, data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)
    #     return Response({
    #         "message": "Data berhasil diupdate",
    #         "data": serializer.data
    #     })
