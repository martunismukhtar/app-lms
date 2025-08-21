from users.models import User
from django.db.models import Q
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import json
from django.http import JsonResponse
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import Group
from organization.serializers import OrganizationSerializer
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils import timezone
from core.tasks import send_email

CLIENT_ID = settings.GOOGLE_CLIENT_ID

def send_verification_email(user, uid, token):
    url = settings.APP_URL
    verify_link = f"{url}auth/verify?uid={uid}&token={token}"
    send_email.delay(user.username, user.email, verify_link)    

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

            permission_codes = list(
                user.get_custom_permissions().values_list('code', flat=True))
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "email": user.email,
                    "username": user.username,
                },
                "organization": org_data,
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

            if not user.is_active:
                return Response({"message": "User belum aktif"}, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            permission_codes = list(
                user.get_custom_permissions().values_list('code', flat=True))

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
                "organization": org_data,
                "roles": list(user.groups.values_list("name", flat=True)),
                "permissions": permission_codes
            })

        return Response({"message": "Username atau password salah"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")            
            token = RefreshToken(refresh_token)
            token.blacklist()  # blacklist refresh token agar tidak bisa dipakai lagi
            return Response({
                "message": "Logout berhasil"
            },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(e)
            return Response({"message": "Token tidak valid atau sudah expired"},
                            status=status.HTTP_400_BAD_REQUEST)
# Create your views here.


class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        # print(username, password, email)
        # cek email
        cek_email = User.objects.filter(email=email).first()
        if cek_email is not None:
            return Response({"message": "Email sudah terdaftar"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(username=username, email=email, is_active=False)
            user.set_password(password)
            user.save()

            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = default_token_generator.make_token(user)

            send_verification_email(user, uid, token)

            return Response({"message": "User berhasil dibuat, silahkan cek email anda untuk verifikasi email"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmail(APIView):
    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")

        try:
            uid = urlsafe_base64_decode(uid).decode()        
            user = User.objects.get(pk=uid)
        except:
            return Response({"message": "Link tidak valid"}, status=status.HTTP_400_BAD_REQUEST)

        if user and default_token_generator.check_token(user, token):
            user.is_active = True
            user.verified_at = timezone.localtime(timezone.now())
            user.save()
            return Response({"message": "Email berhasil diverifikasi"}, status=status.HTTP_200_OK)
        return Response({"message": "Token tidak valid atau sudah kadaluarsa"}, status=status.HTTP_400_BAD_REQUEST)

class ResendVerification(APIView):
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if user is not None:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            send_verification_email(user, uid, token)
            return Response({"detail": "Email berhasil dikirim"}, status=status.HTTP_200_OK)
        return Response({"detail": "Email tidak ditemukan"}, status=status.HTTP_400_BAD_REQUEST)