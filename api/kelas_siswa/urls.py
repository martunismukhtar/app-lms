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
from .views import KelasSiswaView

urlpatterns = [
    # path('', include(router.urls)),
    path('', KelasSiswaView.as_view(), name='kelas'),
    # path('list/', views.MapelList.as_view(), name='dropdown_mapel'),
    path('<int:id>', KelasSiswaView.as_view(), name='edit-kelas'),
    path('<int:id>/update', KelasSiswaView.as_view(), name='update-kelas'),
    path('<int:id>/delete', KelasSiswaView.as_view(), name='delete-kelas'),
]
