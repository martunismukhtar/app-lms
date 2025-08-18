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
from .views import PermissionView, GroupView, PermissionByGroup, GroupNameById

urlpatterns = [    
    path('', PermissionView.as_view(), name='hak-akses'),
    path('group/', GroupView.as_view(), name='group-akses'),
    path('group/<int:group_id>', PermissionByGroup.as_view(), name='permission-by-group'),
    path('group/name/<int:group_id>', GroupNameById.as_view(), name='nama-group'),
    # 
]
