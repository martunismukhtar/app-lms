from django import forms
from ckeditor.widgets import CKEditorWidget
from materi.models import Materi

class FormMateri(forms.ModelForm):
    class Meta:
        model = Materi
        fields = ['title', 'content', 'file', 'mapel']
        widgets = {
            'content': CKEditorWidget(),
        }
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
