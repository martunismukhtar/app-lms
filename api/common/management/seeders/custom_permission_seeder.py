# from mapel.models import Mapel

from permissions.models import CustomPermission
from users.models import UserCustomPermission
from django.db import connection

def run():

    # hapus data lama
    CustomPermission.objects.all().delete()
    # UserCustomPermission.objects().delete()

    with connection.cursor() as cursor:
        cursor.execute("DELETE FROM user_custom_permission")

    CustomPermission.objects.bulk_create([
        # user
        CustomPermission(code='view_user', name='Lihat User'),
        CustomPermission(code='tambah_user', name='Tambah User'),
        CustomPermission(code='edit_user', name='Edit User'),
        CustomPermission(code='delete_user', name='Delete User'),

        # Organisasi
        CustomPermission(code='view_organisasi', name='Lihat Organisasi'),
        CustomPermission(code='tambah_organisasi', name='Tambah Organisasi'),
        CustomPermission(code='edit_organisasi', name='Edit Organisasi'),
        CustomPermission(code='delete_organisasi', name='Delete Organisasi'),

        # Buat Soal
        CustomPermission(code='view_buat_soal', name='Lihat Buat Soal'),
        CustomPermission(code='tambah_buat_soal', name='Tambah Buat Soal'),
        CustomPermission(code='edit_buat_soal', name='Edit Buat Soal'),
        CustomPermission(code='delete_buat_soal', name='Delete Buat Soal'),

        # Chat Materi
        CustomPermission(code='view_chat_materi', name='Lihat Chat Materi'),
        CustomPermission(code='tambah_chat_materi', name='Tambah Chat Materi'),
        CustomPermission(code='edit_chat_materi', name='Edit Chat Materi'),
        CustomPermission(code='delete_chat_materi', name='Delete Chat Materi'),

        # Guru
        CustomPermission(code='view_guru', name='Lihat Guru'),
        CustomPermission(code='tambah_guru', name='Tambah Guru'),
        CustomPermission(code='edit_guru', name='Edit Guru'),
        CustomPermission(code='delete_guru', name='Delete Guru'),

        # Ikut Ujian
        CustomPermission(code='view_ikut_ujian', name='Lihat Ikut Ujian'),
        CustomPermission(code='tambah_ikut_ujian', name='Tambah Ikut Ujian'),
        CustomPermission(code='edit_ikut_ujian', name='Edit Ikut Ujian'),
        CustomPermission(code='delete_ikut_ujian', name='Delete Ikut Ujian'),

        # Kelas Siswa
        CustomPermission(code='view_kelas_siswa', name='Lihat Kelas Siswa'),
        CustomPermission(code='tambah_kelas_siswa', name='Tambah Kelas Siswa'),
        CustomPermission(code='edit_kelas_siswa', name='Edit Kelas Siswa'),
        CustomPermission(code='delete_kelas_siswa', name='Delete Kelas Siswa'),

        # Mapel
        CustomPermission(code='view_mapel', name='Lihat Mapel'),
        CustomPermission(code='tambah_mapel', name='Tambah Mapel'),
        CustomPermission(code='edit_mapel', name='Edit Mapel'),
        CustomPermission(code='delete_mapel', name='Delete Mapel'),

        # Materi
        CustomPermission(code='view_materi', name='Lihat Materi'),
        CustomPermission(code='tambah_materi', name='Tambah Materi'),
        CustomPermission(code='edit_materi', name='Edit Materi'),
        CustomPermission(code='delete_materi', name='Delete Materi'),

        # Materi Siswa
        CustomPermission(code='view_materi_siswa', name='Lihat Materi Siswa'),
        CustomPermission(code='tambah_materi_siswa',
                         name='Tambah Materi Siswa'),
        CustomPermission(code='edit_materi_siswa', name='Edit Materi Siswa'),
        CustomPermission(code='delete_materi_siswa',
                         name='Delete Materi Siswa'),

        # Semester
        CustomPermission(code='view_semester', name='Lihat Semester'),
        CustomPermission(code='tambah_semester', name='Tambah Semester'),
        CustomPermission(code='edit_semester', name='Edit Semester'),
        CustomPermission(code='delete_semester', name='Delete Semester'),

        # Soal
        CustomPermission(code='view_soal', name='Lihat Soal'),
        CustomPermission(code='tambah_soal', name='Tambah Soal'),
        CustomPermission(code='edit_soal', name='Edit Soal'),
        CustomPermission(code='delete_soal', name='Delete Soal'),

        # Ujian
        CustomPermission(code='view_ujian', name='Lihat Ujian'),
        CustomPermission(code='tambah_ujian', name='Tambah Ujian'),
        CustomPermission(code='edit_ujian', name='Edit Ujian'),
        CustomPermission(code='delete_ujian', name='Delete Ujian'),

        # Upload siswa
        # CustomPermission(code='view_siswa', name='Lihat Siswa'),
        # CustomPermission(code='tambah_siswa', name='Tambah Siswa'),
        # CustomPermission(code='edit_siswa', name='Edit Siswa'),
        # CustomPermission(code='delete_siswa', name='Delete Siswa'),

        # hak akses
        CustomPermission(code='view_akses', name='Lihat Akses'),
        CustomPermission(code='tambah_akses', name='Tambah Akses'),
        CustomPermission(code='edit_akses', name='Edit Akses'),
        CustomPermission(code='delete_akses', name='Delete Akses'),

        # dashboard
        CustomPermission(code='view_dashboard', name='Lihat Dashboard'),
        CustomPermission(code='tambah_dashboard', name='Tambah Dashboard'),
        CustomPermission(code='edit_dashboard', name='Edit Dashboard'),
        CustomPermission(code='delete_dashboard', name='Delete Dashboard'),

        # dashboard siswa
        CustomPermission(code='view_dashboard_siswa', name='Lihat Dashboard Siswa'),
        CustomPermission(code='tambah_dashboard_siswa', name='Tambah Dashboard Siswa'),
        CustomPermission(code='edit_dashboard_siswa', name='Edit Dashboard Siswa'),
        CustomPermission(code='delete_dashboard_siswa', name='Delete Dashboard Siswa'),

        # dashboard guru
        CustomPermission(code='view_dashboard_teacher', name='Lihat Dashboard Teacher'),
        CustomPermission(code='tambah_dashboard_teacher', name='Tambah Dashboard Teacher'),
        CustomPermission(code='edit_dashboard_teacher', name='Edit Dashboard Teacher'),
        CustomPermission(code='delete_dashboard_teacher', name='Delete Dashboard Teacher'),

        # dashboard manager
        CustomPermission(code='view_dashboard_manager', name='Lihat Dashboard Manager'),
        CustomPermission(code='tambah_dashboard_manager', name='Tambah Dashboard Manager'),
        CustomPermission(code='edit_dashboard_manager', name='Edit Dashboard Manager'),
        CustomPermission(code='delete_dashboard_manager', name='Delete Dashboard Manager'),

        # siswa
        CustomPermission(code='view_siswa', name='Lihat Siswa'),
        CustomPermission(code='tambah_siswa', name='Tambah Siswa'),
        CustomPermission(code='edit_siswa', name='Edit Siswa'),
        CustomPermission(code='delete_siswa', name='Delete Siswa'),
    ])
