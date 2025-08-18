from django.db import models

# Create your models here.
class KelasSiswa(models.Model):    
    name = models.CharField(max_length=100)
    organization = models.ForeignKey('users.Organization', 
        on_delete=models.CASCADE,
        null=True, blank=True)
    wali_kelas = models.ForeignKey('users.User', 
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='guru_wali_kelas'
    )
    tahun_ajaran=models.CharField(null=True, blank=True, max_length=9)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Kelas'
        verbose_name_plural = 'Kelas'
        db_table = 'kelas'