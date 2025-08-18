from rest_framework import serializers
from .models import Semester

class SemesterSerializer(serializers.ModelSerializer):        
    class Meta:
        model = Semester
        fields = ('id', 'tahun', 'semester', 'is_aktif', 'organization')
        extra_kwargs = {
            'tahun': {
                'required': True,
                'allow_blank': False,
                'error_messages': {
                    'required': 'Pilih tahun ajaran.'
                },
            },
            'semester': {
                'required': True,
                'allow_blank': False,
                'error_messages': {
                    'required': 'Pilih jenis semester.'
                }
            }            
        }
