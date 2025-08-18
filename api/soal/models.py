from django.db import models
import uuid

# Create your models here.
class Soal(models.Model):
    TIPE_SOAL_CHOICES = [
        ('pilihan_ganda', 'Pilihan Ganda'),
        ('esai', 'Esai')
    ]
    
    TINGKAT_KESULITAN_CHOICES = [
        ('mudah', 'Mudah'),
        ('sedang', 'Sedang'),
        ('sulit', 'Sulit')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # mapel = models.ForeignKey(
    #     'mapel.Mapel',
    #     related_name='soal_mapel',
    #     on_delete=models.CASCADE
    # )
    tipe_soal = models.CharField(
        max_length=20,
        choices=TIPE_SOAL_CHOICES
    )
    pertanyaan = models.TextField()
    pilihan = models.JSONField(null=True, blank=True)  # only for multiple choice questions
    jawaban_benar = models.TextField(blank=True, null=True)
    tingkat_kesulitan = models.CharField(
        max_length=10,
        choices=TINGKAT_KESULITAN_CHOICES,
        blank=True,
        null=True,
        default='mudah'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        'users.User',
        related_name='soal_created_by',
        on_delete=models.CASCADE,
        default=None
    )
    # organization = models.ForeignKey(
    #     'users.Organization',
    #     related_name='soal_organization',
    #     on_delete=models.DO_NOTHING,
    #     null=True,
    #     blank=True
    # )
    # semester = models.ForeignKey(
    #     'semester.Semester',
    #     related_name='soal_semester',
    #     on_delete=models.DO_NOTHING,        
    #     null=True,
    #     blank=True
    # )
    # kelas = models.ForeignKey(
    #     'kelas_siswa.KelasSiswa',
    #     related_name='soal_kelas',
    #     on_delete=models.DO_NOTHING,        
    #     null=True,
    #     blank=True
    # )
    gambar = models.JSONField(null=True, blank=True)
    tabel = models.JSONField(null=True, blank=True)

    ujian = models.ForeignKey(
        'ujian.Ujian',
        related_name='soal_ujian',
        on_delete=models.DO_NOTHING,        
        null=True,
        blank=True
    )
    
    class Meta:
        db_table = 'soal'
    
    def __str__(self):
        return self.soal