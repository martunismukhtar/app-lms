from django.db import models
import uuid

# Create your models here.
class Semester(models.Model):
    JENIS_SEMESTER = [
        ('ganjil', 'Ganjil'),
        ('genap', 'Genap')
    ]


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tahun = models.CharField(max_length=10)
    semester = models.CharField(max_length=10,
                                choices=JENIS_SEMESTER)    
    is_aktif = models.BooleanField(default=False)
    organization = models.ForeignKey(
        'users.Organization',
        related_name='semester_organization',
        on_delete=models.CASCADE,
        default=None
    )

    class Meta:
        db_table = 'semester'
        unique_together = ['tahun', 'semester', 'organization']