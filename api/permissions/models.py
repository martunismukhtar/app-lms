from django.db import models

# Create your models here.
class CustomPermission(models.Model):
    code = models.CharField(max_length=100, unique=True)  # e.g., 'view_user', 'edit_user'
    name = models.CharField(max_length=255)  # e.g., 'Lihat User'
    class Meta:
        db_table = 'custom_permission'

