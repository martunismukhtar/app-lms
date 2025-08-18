from django.db import models
import uuid

# Create your models here.
# class Enrollment(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     siswa = models.ForeignKey("siswa.Siswa", 
#                 on_delete=models.CASCADE, 
#                 null=True, blank=True,
#                 related_name="enrollment_siswa"
#             )
#     kelas = models.ForeignKey("kelas_siswa.KelasSiswa", 
#             on_delete=models.CASCADE, null=True, blank=True,
#             related_name="enrollment_kelas"
#         )
#     semester = models.ForeignKey("semester.Semester", 
#             on_delete=models.CASCADE, null=True, blank=True,
#             related_name="enrollment_semester"
#         )
#     mapel = models.ForeignKey("mapel.Mapel", 
#             on_delete=models.CASCADE, null=True, blank=True,
#             related_name="enrollment_mapel"
#         )
#     created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
#     updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    

#     class Meta:
#         unique_together = ("siswa", "kelas", "semester")
#         db_table = "enrollment"