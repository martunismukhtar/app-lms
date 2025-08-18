from django.shortcuts import redirect
from django.urls import reverse
from rest_framework_simplejwt.authentication import JWTAuthentication

class AllowIframeForMediaMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith('/media/'):
            response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        return response