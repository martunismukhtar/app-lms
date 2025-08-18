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
from .views import SiswaView, SiswaPerKelas, SiswaEnrollMp

urlpatterns = [
    path('', SiswaView.as_view(), name='siswa'),    
    path('<uuid:pk>/delete', SiswaView.as_view(), name='delete_siswa'),

    path('per-kelas/<int:kelas_id>', SiswaPerKelas.as_view(), name='siswa-per-kelas'),
    path('enroll-mtkul', SiswaEnrollMp.as_view(), name='enroll-mtkul'),
]
