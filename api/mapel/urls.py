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
    path('', views.MapelView.as_view(), name='mapel'),
    path('list/', views.MapelList.as_view(), name='dropdown_mapel'),
    path('<uuid:pk>', views.MapelView.as_view(), name='edit-mapel'),
    path('<uuid:pk>/update', views.MapelView.as_view(), name='update-mapel'),
    path('<uuid:pk>/delete', views.MapelView.as_view(), name='delete-mapel'),
    path('daftar-guru-mengajar/<uuid:id_mapel>', views.GuruMengajarMapel.as_view(), name='daftar-guru-mengajar'),
    path('guru/enroll', views.EnrollGuruMapel.as_view(), name='enroll-guru-mapel'),
    path('guru/unenroll', views.UnenrollGuruMapel.as_view(), name='un-enroll-guru-mapel'),
    
]
