"""
URL configuration for eduforge project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from django.conf import settings
from django.conf.urls.static import static
import os

urlpatterns = [
    path('api/auth/', include('auth.urls')),
    path('api/users/', include('users.urls')),
    path('api/semester/', include('semester.urls')),
    path('api/organisasi/', include('organization.urls')),
    path('api/mata-pelajaran/', include('mapel.urls')),
    path('api/materi/', include('materi.urls')),
    path('api/chat-materi/', include('chatMateri.urls')),
    path('api/buat-soal/', include('buatSoal.urls')),
    path('api/soal/', include('soal.urls')),
    path('api/kelas/', include('kelas_siswa.urls')),
    path('api/materi-siswa/', include('materi_siswa.urls')),
    path('api/buat-ujian/', include('ujian.urls')),
    path('api/ikut-ujian/', include('ikut_ujian.urls')),
    path('api/profile/', include('profile_user.urls')),
    path('api/guru/', include('guru.urls')),
    path('api/hak-akses/', include('permissions.urls')),
    path('api/mapel/', include('mapel.urls')),
    path('api/siswa/', include('siswa.urls')),
    path('api/dashboard/', include('dashboard.urls')),

    path('admin/', admin.site.urls),

]

if settings.DEBUG:
    # urlpatterns += static(settings.STATIC_URL, document_root=os.path.join(settings.BASE_DIR, 'static'))
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)