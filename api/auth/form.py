from django.contrib.auth.forms import AuthenticationForm
from django import forms

class LoginForm(AuthenticationForm):
    username = forms.CharField(
        required=True
    )
    password = forms.CharField(
        required=True
    )