from django.db import models
import uuid
import os
from ckeditor.fields import RichTextField

def unique_file_path(instance, filename):
    # ext = filename.split('.')[-1]
    folder_uuid = uuid.uuid4().hex
    # new_filename = f"{uuid.uuid4().hex}.{ext}"  # nama unik
    # return os.path.join('materi/', new_filename)  # folder "uploads"
    return os.path.join('materi', folder_uuid, filename)


# Create your models here.
class Materi(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    content = models.TextField()
    file = models.FileField(upload_to=unique_file_path, null=True, blank=True)

    mapel = models.ForeignKey(
        'mapel.Mapel', 
        related_name='mata_pelajaran',
        on_delete=models.CASCADE)
    
    created_by = models.ForeignKey(
        'users.User', 
        related_name='guru',
        on_delete=models.CASCADE)
    
    organization = models.ForeignKey('users.Organization', on_delete=models.CASCADE, 
            null=True, blank=True)
    semester = models.ForeignKey('semester.Semester', on_delete=models.SET_NULL, 
            null=True, blank=True)
    kelas = models.ForeignKey('kelas_siswa.KelasSiswa', on_delete=models.SET_NULL, 
            null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Materi'
        verbose_name_plural = 'Materi'
        db_table = 'materi'
