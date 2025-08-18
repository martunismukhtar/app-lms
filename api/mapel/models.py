from django.db import models
import uuid

# Create your models here.
class Mapel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nama = models.CharField(max_length=100)
    kode = models.CharField(max_length=10, unique=True)
    kelompok = models.CharField(max_length=10)

    organization = models.ForeignKey('users.Organization', on_delete=models.CASCADE, 
            null=True, blank=True)
    
    created_by = models.ForeignKey(
        'users.User', 
        related_name='guru_mapel',
        on_delete=models.CASCADE,
        null=True,
        blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nama
    
    class Meta:
        verbose_name = 'Mapel'
        verbose_name_plural = 'Mapel'
        db_table = 'mapel'
        # permissions = [
        #     ('view_mapel', 'Can view mapel'),
        #     ('add_mapel', 'Can add mapel'),
        #     ('change_mapel', 'Can change mapel'),
        #     ('delete_mapel', 'Can delete mapel'),
        # ]