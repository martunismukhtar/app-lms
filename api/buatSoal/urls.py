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
from django.urls import path
from . import views

urlpatterns = [
    path('', views.DaftarSoal.as_view(), name='soal'),
    path('create', views.BuatSoal.as_view(), name='buat_soal'),
    path('upload', views.UploadSoal.as_view(), name='upload_soal'),
    path('manual', views.BuatSoalManual.as_view(), name='buat_soal_manual'),
]
