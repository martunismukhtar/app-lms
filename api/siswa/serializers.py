from rest_framework import serializers
from users.models import User

class SiswaPerKelasSerializer(serializers.ModelSerializer):
    siswa_id = serializers.CharField(read_only= True)
    mapel = serializers.CharField(read_only= True)
    class Meta:
        model = User
        fields = ('siswa_id', 'username', 'nama', 'mapel')

class PelajaranSayaSerializer(serializers.Serializer):
    id_pelajaran = serializers.CharField(read_only=True)
    nama_pelajaran = serializers.CharField(read_only=True)
    id_kelas = serializers.CharField(read_only=True)