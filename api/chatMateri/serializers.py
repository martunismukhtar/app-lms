from rest_framework import serializers
from chatMateri.models import ChatSession, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ('id', 'chat_session', 'sender', 'message', 'created_at', 'source_docs')
        # ordering = ['-created_at']

class ChatSessionSerializer(serializers.ModelSerializer):
    chat_messages = ChatMessageSerializer(many=True, read_only=True)
    class Meta:
        model = ChatSession
        fields = ('id', 'materi', 'user_id', 'created_at', 'chat_messages')        
