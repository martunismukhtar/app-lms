from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    kelas = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'nama', 'kelas')

    def get_kelas(self, obj):
        return None
        # kelas = obj.user_kelas.first()
        # return kelas.name if kelas else None    
    
class AllUserSerializer(serializers.ModelSerializer):    
    class Meta:
        model = User
        fields = ('id', 'username', 'nama', 'email', 
                  'jenis_kelamin', 'alamat', 'tanggal_lahir')
        
# class RiwayatKelasSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RiwayatKelas
#         fields = ('id', 'siswa', 'kelas', 'active')