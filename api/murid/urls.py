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
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.MuridView.as_view(), name='murid'),
    path('tambah', views.create, name='tambah_siswa'),
    path('create/', views.MuridCreateView.as_view(), name='murid_store'),
    path('load/', views.load_data, name='load_data_siswa'),
    path('<uuid:id>/edit', views.MuridEditView.as_view(), name='edit_siswa'),
    path('<uuid:id>/delete', views.MuridDeleteView.as_view(), name='delete_siswa'),
    path('jumlah', views.jumlah_data, name='jumlah_siswa'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)