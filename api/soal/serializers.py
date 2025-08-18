from rest_framework import serializers
from .models import Soal

class SoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Soal
        fields = ('id', 'tipe_soal', 'pertanyaan', 'pilihan',
                  'jawaban_benar', 'tingkat_kesulitan', 'created_at',
                  'gambar', 'tabel',
                  'ujian_id', 'created_by_id')
        read_only_fields = ('created_at','id')

class SoalSiswaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Soal
        fields = ('id', 'tipe_soal', 'pertanyaan', 'pilihan',
                  'gambar', 'tabel',
                  'ujian_id', 'created_by_id')
        read_only_fields = ('created_at','id')