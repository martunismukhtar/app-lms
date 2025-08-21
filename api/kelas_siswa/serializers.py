from rest_framework import serializers
from .models import KelasSiswa

class KelasSerializer(serializers.ModelSerializer):    
    class Meta:
        model = KelasSiswa
        fields = ('id', 'name', 'wali_kelas', 'tahun_ajaran')
        extra_kwargs = {
            'name': {
                'required': True,
                # 'allow_blank': False,
                'error_messages': {
                    'required': 'Nama kelas harus diisi.',
                    'blank': 'Nama kelas tidak boleh kosong.',
                },
            },
            'wali_kelas': {
                'required': True,
                # 'allow_blank': False,
                'error_messages': {
                    'required': 'Wali kelas harus diisi.',
                    'blank': 'Wali kelas tidak boleh kosong.',
                },
            }      
        }

class KelasSiswaSerializer(serializers.ModelSerializer):
    nama_wali_kelas = serializers.CharField(read_only=True)

    class Meta:
        model = KelasSiswa
        fields = ('id', 'name', 'nama_wali_kelas')
    
class ViewKelasSerializer(serializers.ModelSerializer):
    nama_wali_kelas = serializers.CharField(read_only=True)
    jumlah_siswa = serializers.IntegerField(read_only=True)
    class Meta:
        model = KelasSiswa
        fields = ('id', 'name', 'nama_wali_kelas', 'jumlah_siswa')
    