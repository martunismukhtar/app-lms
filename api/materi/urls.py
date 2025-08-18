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
    path('', views.MateriListView.as_view(), name='materi'),
    path('<uuid:id>', views.MateriDetailView.as_view(), name='get_materi'),
    path('tambah/', views.MateriCreateAPIView.as_view(), name='tambah_materi'),
    # # path('create/', views.MuridCreateView.as_view(), name='murid_store'),
    # path('load/', views.LoadDataView.as_view(), name='load_data_materi'),
    path('<uuid:id>/edit', views.MateriUpdateAPIView.as_view(), name='edit_materi'),
    # path('<uuid:id>/detil', views.MateriDetailView.as_view(), name='detil_materi'),
    path('<uuid:id>/delete', views.MateriDeleteAPIView.as_view(), name='delete_materi'),
    # path('jumlah', views.TotalData.as_view(), name='jumlah_materi'),
]
