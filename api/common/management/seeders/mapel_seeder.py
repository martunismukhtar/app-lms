# from mapel.models import Mapel

from mapel.models import Mapel

def run():
    Mapel.objects.bulk_create([
        Mapel(kode='MTK', kelompok='IPA', nama='Matematika'),
        Mapel(kode='FQH', kelompok='PAI', nama='Fiqih'),
        Mapel(kode='BING', kelompok='IPS', nama='Bahasa Inggris'),
        Mapel(kode='SB', kelompok='SB', nama='Seni Budaya')
    ])
