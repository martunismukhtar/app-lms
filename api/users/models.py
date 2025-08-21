from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager
import uuid
from django.contrib.auth.models import Group
from permissions.models import CustomPermission

# buatkan kustom user sebelum melakukan migrate

# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, username=None,  password=None, **extra_fields):
        if not username:
            raise ValueError("Username wajib diisi")
        
        # email = self.normalize_email(email) if email else None
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
    
        return user

    def create_superuser(self, username=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username=username, password=password, **extra_fields)    

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nama = models.CharField(max_length=100, blank=True, null=True)
    email = models.CharField(unique=True, null=True, blank=True)
    username = models.CharField(max_length=100, unique=True, null=True, blank=True)
    
    organization = models.ForeignKey(
        'Organization', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='organisasi_user'
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()    

    tanggal_lahir = models.DateField(blank=True, null=True)
    alamat = models.CharField(max_length=100, blank=True, null=True)
    jenis_kelamin = models.CharField(
        max_length=10, 
        choices=[('L', 'Laki-laki'), ('P', 'Perempuan')],
        blank=True,
        null=True
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.username
    
    def get_custom_permissions(self):
        groups = self.groups.all()
        return CustomPermission.objects.filter(
            usercustompermission__user_group__in=groups
        )#.distinct()
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        db_table = 'users'

        indexes = [
            models.Index(fields=['date_joined'], name='date_joined_idx'),
            models.Index(fields=['nama'], name='nama_idx'),
        ]

class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True, null=True)
    email = models.CharField(unique=True, null=True, blank=True)
    alamat = models.CharField(max_length=100, blank=True, null=True)
    kota = models.CharField(max_length=100, blank=True, null=True)
    provinsi = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Organization'
        verbose_name_plural = 'Organizations'
        db_table = 'organizations'

# class UserMapel(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     user= models.ForeignKey(
#         'User',
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True
#     )
#     mapel = models.ForeignKey(
#         'mapel.Mapel',
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True  
#     )
#     semester = models.ForeignKey(
#         'semester.Semester',
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True
#     )
#     class Meta:
#         db_table = 'user_mapel'
#         unique_together = ('user', 'mapel')

# class UserKelas(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     user= models.ForeignKey(
#         'User',
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True
#     )
#     kelas = models.ForeignKey(
#         'kelas_siswa.KelasSiswa',
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True  
#     )
#     class Meta:
#         db_table = 'user_kelas'
#         unique_together = ('user', 'kelas')

class UserCustomPermission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    permission = models.ForeignKey(
        'permissions.CustomPermission',
        on_delete=models.CASCADE,
        null=True,
        blank=True  
    )
    class Meta:
        db_table = 'user_custom_permission'
        unique_together = ('user_group', 'permission')
