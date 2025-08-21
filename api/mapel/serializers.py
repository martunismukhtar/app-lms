from rest_framework import serializers
from .models import Mapel

class MapelListSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Mapel
        fields = ('id', 'nama')


class MapelSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Mapel
        fields = ('id', 'nama', 'kode', 'kelompok')

class MapelMateriSerializer(serializers.ModelSerializer):    
    jumlah_materi = serializers.ReadOnlyField(read_only=True)
    class Meta:
        model = Mapel
        fields = ('id', 'nama', 'kode', 'kelompok', 'jumlah_materi')