from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from users.models import User
from django.db.models import Q
from django.contrib.auth.hashers import make_password
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView, View
from rest_framework.response import Response
import json
from django.http import JsonResponse
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import Group
from organization.serializers import OrganizationSerializer
from django.core.exceptions import ObjectDoesNotExist
from permissions.models import CustomPermission

CLIENT_ID = settings.GOOGLE_CLIENT_ID

class GoogleLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            body = json.loads(request.body)            
            token = body.get("id_token")   
            print(token)         
            if not token:
                return JsonResponse({"error": "id_token tidak ditemukan"}, status=400)

            payload = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                CLIENT_ID
            )

            if payload["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
                return JsonResponse({"error": "Issuer tidak valid"}, status=400)

            user, _ = User.objects.get_or_create(
                email=payload["email"],
                defaults={
                    "username": payload["email"],
                    "first_name": payload.get("given_name", ""),
                    "last_name": payload.get("family_name", ""),
                    "nama": payload.get("given_name", "")+" "+payload.get("given_name", ""),
                }
            )

            manager, _ = Group.objects.get_or_create(name="Manager")
            if not user.groups.filter(name="Manager").exists():
                user.groups.add(manager)
            
            if user.organization:
                org_data = OrganizationSerializer(user.organization).data
            else:
                org_data = None

            permission_codes = list(user.get_custom_permissions().values_list('code', flat=True))    
            refresh = RefreshToken.for_user(user)            
            return JsonResponse({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "email": user.email,
                    "username": user.username,
                },
                "organization":org_data,
                "roles": list(user.groups.values_list("name", flat=True)),
                "permissions": permission_codes
            })

        except ValueError:
            return JsonResponse({"error": "id_token tidak valid"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")                
        user = User.objects.filter(username=username).first()                

        if user is not None and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            permission_codes = list(user.get_custom_permissions().values_list('code', flat=True))
            
            if user.organization:
                org_data = OrganizationSerializer(user.organization).data
            else:
                org_data = None

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "email": user.email,
                    "username": user.username,
                },
                "organization":org_data,
                "roles": list(user.groups.values_list("name", flat=True)),
                "permissions": permission_codes
            })

        return Response({"error": "Username atau password salah"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            print(refresh_token)
            token = RefreshToken(refresh_token)
            token.blacklist()  # blacklist refresh token agar tidak bisa dipakai lagi
            return Response({
                "detail": "Logout berhasil"
                }, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(e)
            return Response({"error": "Token tidak valid atau sudah expired"}, 
                            status=status.HTTP_400_BAD_REQUEST)
# Create your views here.

class RegisterView(APIView):
    permission_classes = (AllowAny,)
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")  
        email = request.data.get("email")
        print(username, password, email)
        # cek email
        cek_email = User.objects.filter(email=email).first()
        print(cek_email)
        if cek_email is not None:
            return Response({"detail": "Email sudah terdaftar"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.create_user(username=username, email=email)
            user.set_password(password)
            user.save()
            return Response({"detail": "User berhasil dibuat"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

def login_view(request):
    return render(request, 'auth/login.html')


def reset_password(request):
    return render(request, 'auth/reset-password.html')


def register(request):
    return render(request, 'auth/register.html')


def proses_login(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'Username atau password salah')
            return redirect('login')
    else:
        return redirect('login')


def proses_reset_password(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        password1 = request.POST.get('password1')

        if password != password1:
            messages.error(request, 'Password tidak sama')
            return redirect('reset-password')

        try:
            user = User.objects.get(Q(username=username) | Q(email=username))
            user.password = make_password(password)
            user.save()
            messages.success(request, 'Password berhasil direset')
            return redirect('login')
        except User.DoesNotExist:
            messages.error(request, 'User tidak ditemukan')
            return redirect('reset-password')
    else:
        return redirect('reset-password')


def proses_register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Cek apakah username atau email sudah digunakan
        if User.objects.filter(Q(username=username) | Q(email=username)).exists():
            messages.error(request, 'Username atau email sudah digunakan')
            return redirect('register')

        try:
            user = User.objects.create_user(username=username, email=username,
                                            password=password)

            # tambahkan user group
            # secara default
            user.groups.add(3)

            messages.success(request, 'Berhasil mendaftar')
            return redirect('login')  # arahkan ke login setelah berhasil
        except Exception as e:
            messages.error(request, f'Gagal mendaftar: {e}')
            return redirect('register')

    return redirect('register')


def proses_logout(request):
    logout(request)
    return redirect('home')
