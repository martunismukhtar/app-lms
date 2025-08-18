from django.db import models
from users.models import User
import uuid

# Create your models here.
class ChatSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)        
    created_at = models.DateTimeField(auto_now_add=True)
    materi = models.ForeignKey(
        'materi.Materi',
        related_name='chat_session_materi',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )    

    class Meta:
        ordering = ['-created_at']
        db_table = 'chat_session'

class ChatMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    chat_session = models.ForeignKey(
        ChatSession, 
        related_name='chat_messages',
        on_delete=models.CASCADE)
    sender = models.CharField(max_length=10, choices=[('user', 'User'), ('ai', 'AI')])
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    source_docs = models.JSONField(blank=True, null=True)

    class Meta:
        ordering = ['created_at']
        db_table = 'chat_message'