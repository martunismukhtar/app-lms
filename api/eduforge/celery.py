# myproject/celery.py
import os
from celery import Celery

# Set default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eduforge.settings')

app = Celery('eduforge')

# Menggunakan namespace CELERY pada settings.py
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto discover tasks dari semua registered apps
app.autodiscover_tasks()