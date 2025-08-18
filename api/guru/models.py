from django.db import models
import uuid

# Create your models here.
class Guru(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User", 
        on_delete=models.CASCADE, null=True, blank=True, related_name="guru_user")
    tanggal_lahir = models.DateField(blank=True, null=True)
    alamat = models.CharField(max_length=100, blank=True, null=True)
    jenis_kelamin = models.CharField(
        max_length=10, 
        choices=[('L', 'Laki-laki'), ('p', 'Perempuan')],
        blank=True,
        null=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "guru"


class Mengajar(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    kelas = models.ForeignKey("kelas_siswa.KelasSiswa", 
        on_delete=models.CASCADE, null=True, blank=True,
        related_name="guru_mengajar_kelas")
    guru = models.ForeignKey("users.User", 
        on_delete=models.CASCADE, null=True, blank=True, 
        related_name="guru_mengajar")
    mapel = models.ForeignKey("mapel.Mapel", on_delete=models.CASCADE, null=True, blank=True)
    semester = models.ForeignKey("semester.Semester", on_delete=models.CASCADE, null=True, blank=True)
    tahun_ajaran = models.CharField(max_length=9)
    jam_mulai = models.TimeField(null=True, blank=True)
    jam_selesai = models.TimeField(null=True, blank=True)
    hari = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("guru", "mapel", "kelas", "tahun_ajaran", "semester")
        db_table = "mengajar"