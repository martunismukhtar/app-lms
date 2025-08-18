from rest_framework import serializers
from .models import Materi
from mapel.serializers import MapelSerializer
from mapel.models import Mapel


class MateriSerializer(serializers.ModelSerializer):
    mapel = serializers.PrimaryKeyRelatedField(
        queryset=Mapel.objects.all(),
        error_messages={
            'required': 'Mata pelajaran harus dipilih.',
            'does_not_exist': 'Mata pelajaran tidak ditemukan.',
            'incorrect_type': 'Format mata pelajaran tidak valid.',
        }
    )
    mapel_nama = serializers.ReadOnlyField(source='mapel.nama')

    class Meta:
        model = Materi
        fields = ('id', 'title', 'file', 'content', 'mapel', 'mapel_nama', 'semester', 'kelas')
        extra_kwargs = {
            'kelas':{
                'required': True,
                'error_messages':{
                    'required': 'Kelas harus dipilih.',
                }
            },
            'title': {
                'required': True,
                # 'allow_blank': False,
                'error_messages': {
                    'required': 'Judul materi harus diisi.',
                    'blank': 'Judul materi tidak boleh kosong.',
                },
            },
            'mapel': {
                'required': True,
                # 'allow_blank': False,
                'error_messages': {
                    'required': 'Mata pelajaran harus dipilih.',
                    'blank': 'Mata pelajaran tidak boleh kosong.',
                },
            },
            # 'file': {
            #     'required': True,
            #     # 'allow_blank': False,
            #     'error_messages': {
            #         'required': 'File harus diisi.',
            #         'blank': 'File tidak boleh kosong.',
            #     },
            # },
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Jika serializer digunakan untuk update (ada instance), file jadi optional
        if self.instance:
            self.fields['file'].required = False
        else:
            self.fields['file'].required = True

    def validate_file(self, value):
        if not self.instance and not value:
            raise serializers.ValidationError("File harus diisi")
        return value
    