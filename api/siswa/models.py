from django.db import models
import uuid

# Create your models here.
class SiswaKelas(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user=models.ForeignKey(
        "users.User", 
        on_delete=models.CASCADE, 
        related_name="siswa"
    )
    kelas=models.ForeignKey(
        "kelas_siswa.KelasSiswa",
        related_name="kelas_siswa",
        on_delete=models.DO_NOTHING
    )

    class Meta:
        db_table = 'siswa_kelas'

class RiwayatKelas(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    siswa = models.ForeignKey(
        "users.User", 
        on_delete=models.CASCADE, 
        related_name='riwayat_siswa'
    )
    kelas= models.ForeignKey(
        "kelas_siswa.KelasSiswa", 
        on_delete=models.CASCADE, 
        related_name='riwayat_kelas_siswa'        
    )
    tahun_ajaran = models.CharField(max_length=9)  # contoh: "2024/2025"
    status=models.CharField(
        choices=[
            ('aktif', 'Aktif'),
            ('lulus', 'Lulus'),
            ('mengulang', 'Mengulang')
        ],
        default='aktif',
        max_length=10,        
    )
    tanggal_update=models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'riwayat_kelas'

class SiswaMapel(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user=models.ForeignKey(
        "users.User", 
        on_delete=models.CASCADE, 
        related_name="siswa_mapel"
    )
    mapel=models.ForeignKey(
        "mapel.Mapel",
        related_name="mapel_siswa",
        on_delete=models.DO_NOTHING
    )
    kelas=models.ForeignKey(
        "kelas_siswa.KelasSiswa",
        related_name="kelas_siswa_mapel",
        on_delete=models.DO_NOTHING
    )

    class Meta:
        db_table = 'siswa_mapel'
        unique_together = ('user', 'mapel', 'kelas')