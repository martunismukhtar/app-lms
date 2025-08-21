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
from .views import GoogleLogin, LogoutView, LoginView, RegisterView, VerifyEmail
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # path('login/', views.login_view, name='login'),
    # path('logout/', views.proses_logout, name='logout'),
    # path('reset-password/', views.reset_password, name='reset-password'),
    # path('register/', views.register, name='register'),
    # path('proses_login/', views.proses_login, name='proses_login'),
    # path('proses_register/', views.proses_register, name='proses_register'),
    # path('proses_reset_password/', views.proses_reset_password, 
    #     name='proses_reset_password'),
    # path('csrf/', GetCSRFToken.as_view(), name='get_csrf'),
    path('google/', GoogleLogin.as_view(), name='google_login'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('verify-email/', VerifyEmail.as_view(), name='verify-email'),
    path('resend-verification/', VerifyEmail.as_view(), name='resend-verification')
]
