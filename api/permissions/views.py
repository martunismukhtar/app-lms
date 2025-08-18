from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomPermissionSerializer, GroupSerializer, PermissionByGroupSerializer
from .models import CustomPermission
from django.contrib.auth.models import Group
from users.models import UserCustomPermission

# Create your views here.

class GroupNameById(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, group_id):
        if group_id is None:
            return Response({
                    "message":"ID tidak boleh kosong"
                }, status=status.HTTP_400_BAD_REQUEST
            )
        group_name = Group.objects.filter(id=group_id)
        serializer = GroupSerializer(group_name, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PermissionByGroup(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_id):
        permissions = UserCustomPermission.objects.filter(user_group_id=group_id)
        for kk in permissions:
            print(kk.permission_id)
        # print(permissions)
        serializer = PermissionByGroupSerializer(permissions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GroupView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomPermissionSerializer

    def get(self, request):
        group = Group.objects.all()
        serializer = GroupSerializer(group, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PermissionView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CustomPermissionSerializer

    def get(self, request):
        permission = CustomPermission.objects.all()
        serializer = CustomPermissionSerializer(permission, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        group_id = request.data.get('group_id')
        permissions = request.data.get('permissions', [])        
        try:
            UserCustomPermission.objects.filter(user_group_id=group_id).delete()
            user_permission = []
            for permission_id in permissions:
                user_permission.append(UserCustomPermission(
                    user_group_id=group_id,
                    permission_id=permission_id
                ))
            UserCustomPermission.objects.bulk_create(user_permission)
            return Response({'message': 'Permissions updated successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)