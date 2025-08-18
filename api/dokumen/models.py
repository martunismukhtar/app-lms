from django.db import models

# Create your models here.
class Dokumen(models.Model):
    judul = models.CharField(max_length=255)
    file = models.FileField(upload_to='dokumen/')