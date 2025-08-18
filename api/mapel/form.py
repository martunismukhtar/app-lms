from django import forms
from mapel.models import Mapel

class FormMapel(forms.ModelForm):
    class Meta:
        model = Mapel
        fields = ['nama', 'kode', 'kelompok',]        
        error_messages = {
            'nama': {
                'required': 'Nama harus diisi'
            },
            'kode': {
                'required': 'Kode Pelajaran harus diisi'
            },
            'kelompok': {
                'required': 'Kelompok harus diisi'
            }
        }
