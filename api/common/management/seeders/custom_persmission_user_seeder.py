# from mapel.models import Mapel

from permissions.models import CustomPermission
from users.models import UserCustomPermission
from django.contrib.auth.models import Group
from django.db.models import Q

def insert_admin_permissions(group_id):
    permisi = CustomPermission.objects.all()
    for p in permisi:
        UserCustomPermission.objects.create(
            user_group_id=group_id,
            permission_id=p.id
        )

def insert_manager_permissions(group_id):

    # hapus data lama
    UserCustomPermission.objects.filter(user_group_id=group_id).delete()

    g_name = ('organisasi', 'user', 'guru')
    query = Q()
    for name in g_name:
        query |= Q(name__iendswith=name)

    permisi = CustomPermission.objects.filter(query)
    for p in permisi:
        UserCustomPermission.objects.create(
            user_group_id=group_id,
            permission_id=p.id
        )

def insert_teacher_permissions(group_id):
    # hapus data lama
    UserCustomPermission.objects.filter(user_group_id=group_id).delete()

    g_name = ('siswa', 'materi', 'buat_ujian', 'kelas_siswa', 'semester')
    query = Q()
    for name in g_name:
        query |= Q(name__iendswith=name)

    permisi = CustomPermission.objects.filter(query)
    for p in permisi:
        UserCustomPermission.objects.create(
            user_group_id=group_id,
            permission_id=p.id
        )

def insert_student_permissions(group_id):
    # hapus data lama
    UserCustomPermission.objects.filter(user_group_id=group_id).delete()

    g_name = ('ujian', 'materi_siswa', 'chat_materi')
    query = Q()
    for name in g_name:
        query |= Q(name__iendswith=name)

    permisi = CustomPermission.objects.filter(query)
    for p in permisi:
        UserCustomPermission.objects.create(
            user_group_id=group_id,
            permission_id=p.id
        )

def run():
    data_group = Group.objects.all()
    for g in data_group:
        if g.name=='Administrator':            
            insert_admin_permissions(g.id)
        elif g.name=='Manager':
            insert_manager_permissions(g.id)
        elif g.name=='Teacher':
            insert_teacher_permissions(g.id)
        else:
            insert_student_permissions(g.id)

