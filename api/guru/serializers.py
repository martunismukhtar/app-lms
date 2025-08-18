from rest_framework import serializers
from users.models import User
from .models import Mengajar, Guru
from collections import OrderedDict

class GuruSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'nama', 'email','tanggal_lahir', 'jenis_kelamin', 'alamat')

    
class GuruTerdaftarSerializer(serializers.ModelSerializer):
    mengajar_id = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'nama', 'email',
                  'tanggal_lahir', 'jenis_kelamin', 'alamat', 'mengajar_id')

    # def to_representation(self, instance):
    #     data = super().to_representation(instance)        
    #     data['nama'] = instance.user.nama
    #     return data
        # return OrderedDict([
        #     ('id', instance.id),
        #     ('username', instance.user.username),
        #     ('nama', instance.user.nama),
        #     ('email', instance.user.email),
        #     # ('mengajar_id', mengajar_id),
        #     ('tanggal_lahir', data['tanggal_lahir']),
        #     ('jenis_kelamin', data['jenis_kelamin']),
        #     ('alamat', data['alamat']),
        # ])    

class MengajarSerializer(serializers.ModelSerializer):
    mata_pelajaran = serializers.CharField(read_only=True)
    jumlah_siswa = serializers.IntegerField(read_only=True)  # ambil dari annotate
    id_pelajaran = serializers.CharField(read_only=True)
    id_kelas = serializers.CharField(read_only=True)
    nama_kelas = serializers.CharField(read_only=True)
    jumlah_siswa = serializers.IntegerField(read_only=True)

    class Meta:
        model = Mengajar
        fields = ('id', 
                  'id_pelajaran', 
                  'id_kelas', 
                  'nama_kelas', 
                  'mata_pelajaran', 
                #   'tahun_ajaran',                   
                  'jumlah_siswa')