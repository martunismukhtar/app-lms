# EduForge LMS

EduForge adalah platform Learning Management System (LMS) berbasis Django yang mendukung fitur login menggunakan akun Google, sistem otentikasi pengguna kustom, dan tampilan modern.

## Fitur

- Registrasi & login dengan email/username
- Login menggunakan akun Google (Django-Allauth)
- Reset password
- Manajemen pengguna dengan custom `User` model
- Struktur proyek modular dan rapi
- Dukungan frontend modern (Bootstrap / Metronic / React jika diinginkan)
- Middleware, pesan flash, dan validasi form

## Teknologi

- Django 5.x
- Django Allauth
- PostgreSQL / SQLite (bisa dikonfigurasi)
- Bootstrap / Metronic UI (opsional)
- Python 3.10+

## Instalasi

### 1. Clone repositori
```bash
git clone https://github.com/username/eduforge.git
cd eduforge

### 2. Buat virtual environment & install dependensi
python -m venv env
source env/bin/activate
pip install -r requirements.txt

### 3. Konfigurasi .env
Buat file .env dan isi:

SECRET_KEY=django-secret-key-anda
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

### 4. Migrasi database & buat superuser

python manage.py migrate
python manage.py createsuperuser

### 5. Jalankan server
python manage.py runserver

### 6. Konfigurasi Login Google
Daftar ke Google Developer Console

Aktifkan OAuth 2.0 dan dapatkan CLIENT_ID dan SECRET

Tambahkan ke settings.py:
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': 'GOOGLE_CLIENT_ID',
            'secret': 'GOOGLE_SECRET',
            'key': ''
        }
    }
}

---

Silakan sesuaikan bagian **teknologi**, **fitur**, atau **setup Google login** jika proyekmu memiliki perbedaan. Perlu versi dalam Bahasa Indonesia juga?

