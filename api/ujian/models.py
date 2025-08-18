from django.db import models
from users.models import User
import uuid

class Ujian(models.Model):

    JENIS_UJIAN = (        
        ('UTS', 'UTS'),
        ('UAS', 'UAS'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    judul = models.CharField(max_length=100)
    jenis_ujian = models.CharField(max_length=10, choices=JENIS_UJIAN, default='UTS')
    tanggal = models.DateField()
    waktu_mulai = models.TimeField()
    durasi = models.IntegerField(help_text="Durasi ujian dalam detik")    
    bobot_nilai = models.DecimalField(max_digits=5, decimal_places=2, default=100.00)
    passing_grade = models.DecimalField(max_digits=5, decimal_places=2, default=70.00)
    tanggal_akhir = models.DateField(null=True, blank=True)

    kelas = models.ForeignKey('kelas_siswa.KelasSiswa', on_delete=models.CASCADE)
    mapel = models.ForeignKey('mapel.Mapel', on_delete=models.CASCADE)
    organization = models.ForeignKey('users.Organization', on_delete=models.CASCADE, 
        null=True, blank=True)
    semester = models.ForeignKey('semester.Semester', on_delete=models.CASCADE, 
        null=True, blank=True)

    class Meta:
        db_table = 'ujian'

# Create your models here.
class ExamResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)    
    submitted_at = models.DateTimeField(auto_now_add=True)
    duration = models.IntegerField(help_text="Durasi ujian dalam detik", null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    attempt = models.IntegerField(default=1)    
    ujian = models.ForeignKey(Ujian, on_delete=models.CASCADE, null=True, blank=True)
    waktu_mulai = models.TimeField(null=True, blank=True)

    class Meta:
        db_table = 'exam_result'


class ExamAnswer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    result = models.ForeignKey(ExamResult, on_delete=models.CASCADE, related_name='answers')
    # question_number = models.IntegerField()
    soal = models.ForeignKey('soal.Soal', on_delete=models.CASCADE, null=True, blank=True)
    selected_choice = models.CharField(max_length=10)

    class Meta:
        db_table = 'exam_answer'