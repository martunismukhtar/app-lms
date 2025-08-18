from rest_framework import serializers
from users.models import Organization

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ('id', 'name', 'email', 'alamat', 'kota', 'provinsi')
        extra_kwargs = {
            'name': {
                'required': True,
                'allow_blank': False,
                'error_messages': {
                    'required': 'Nama organisasi harus diisi.',
                    'blank': 'Nama organisasi tidak boleh kosong.',
                },
            },
            'email': {
                'required': True,
                'allow_blank': False,
                'error_messages': {
                    'required': 'Email organisasi harus diisi.',
                    'blank': 'Email tidak boleh kosong.',
                },
            },
            'alamat': {
                'required': True,
                'allow_blank': False,
                'error_messages': {
                    'required': 'Alamat organisasi harus diisi.',
                    'blank': 'Alamat tidak boleh kosong.',
                },
            },
            'kota': {
                'required': True,
                'allow_blank': False,
                'error_messages': {
                    'required': 'Kota organisasi harus diisi.',
                    'blank': 'Kota tidak boleh kosong.',
                },
            },
            'provinsi': {
                'required': True,
                'allow_blank': False,
                'error_messages': {
                    'required': 'Provinsi organisasi harus diisi.',
                    'blank': 'Provinsi tidak boleh kosong.',
                },
            },   
        }
        

    # def validate_email(self, value):
    #     user = self.context['request'].user
    #     existing = Organization.objects.filter(email=value).exclude(user=user)
    #     if existing.exists():
    #         raise serializers.ValidationError("Email sudah digunakan oleh organisasi lain.")
    #     return value