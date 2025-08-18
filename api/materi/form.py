from django import forms
from materi.models import Materi

class FormMateri(forms.ModelForm):
    class Meta:
        model = Materi
        fields = ['title', 'content', 'file', 'mapel']        
        error_messages = {
            'title': {
                'required': 'Judul harus diisi'
            },
            'mapel': {
                'required': 'Mata Pelajaran harus diisi'
            },
            'content': {
                'required': 'Konten harus diisi'
            }
        }
