from rest_framework import serializers
from .models import CustomPermission
from django.contrib.auth.models import Group
from users.models import UserCustomPermission

class CustomPermissionSerializer(serializers.ModelSerializer):        
    class Meta:
        model = CustomPermission
        fields = ('id', 'code', 'name')        

class GroupSerializer(serializers.ModelSerializer):        
    class Meta:
        model = Group
        fields = ('id', 'name')

class PermissionByGroupSerializer(serializers.ModelSerializer):        
    class Meta:
        model = UserCustomPermission
        fields = ('id', 'permission_id')