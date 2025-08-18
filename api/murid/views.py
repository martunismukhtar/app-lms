from django.shortcuts import redirect, render, get_object_or_404
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from users.models import User
import csv
from django.contrib.auth.hashers import make_password
from django.contrib import messages
from django.http import JsonResponse, HttpResponseBadRequest
from django.utils.dateparse import parse_datetime

from datetime import datetime
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_naive, make_aware

@login_required(login_url='login')
def load_data(request):    
    org = request.user.organization
    if not org:
        return JsonResponse({'message': 'Organisasi tidak ditemukan.'}, status=400)

    queryset = User.objects.filter(
        groups__name='Student',
        organization=org
    ).order_by('-date_joined')

    last_id = request.GET.get('cursor')
    queryParams = request.GET.get('queryString')
    if last_id and last_id != 'null' and ' 00:00' in last_id:
        last_id = last_id.replace(' 00:00', '+00:00')        
        dt = datetime.fromisoformat(last_id)        
        queryset = queryset.filter(
            date_joined__lt=dt
        )

    if queryParams:
        queryParams = queryParams.strip()
        queryset = queryset.filter(
            nama__icontains=queryParams
        )

    items = queryset[:11]  # ambil 11 data
    has_more = items.count() > 10
    data = [
        {
            'id': item.id,
            'username': item.username,
            'email': item.email,
            'nama': item.nama,
            'date_joined': item.date_joined
        }
        for item in items
    ]

    return JsonResponse({
        'data': data,
        'next_cursor': str(data[-1]['date_joined']) if data else None,
        'has_more': has_more,
    }, status=201)

def create(request):
    return render(request, 'murid/form_upload.html')

@login_required(login_url='login')
def jumlah_data(request):
    org = request.user.organization
    queryParams = request.GET.get('queryString')
    count = User.objects.filter(
        groups__name='Student',
        organization=org,
    ).filter(
        username__icontains=queryParams or ''
    ).count()

    return JsonResponse({'jumlah': count}, status=201)

class MuridView(LoginRequiredMixin, TemplateView):
    template_name = 'murid/index.html'
    login_url = 'login'

    # Kalau kamu ingin menampilkan data di template:
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        org = self.request.user.organization        
        siswa = User.objects.filter(
            groups__name='Student',
            organization=org
        ).order_by('-date_joined')

        context['murid'] = siswa if org else []
        
        return context

class MuridCreateView(LoginRequiredMixin, CreateView):
    model = User
    login_url = 'login'

    def get(self, request, *args, **kwargs):
        return render(request, 'murid/form_upload.html')

    def post(self, request, *args, **kwargs):
        if 'file' not in request.FILES:
            return HttpResponseBadRequest("File tidak ditemukan.")

        file = request.FILES['file']
        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)

        org = request.user.organization
        if not org:
            messages.error(request, "Organisasi tidak ditemukan.")
            return redirect('murid')

        # Dapatkan group Student
        try:
            student_group = Group.objects.get(name='Student')
        except Group.DoesNotExist:
            messages.error(request, "Group Student belum tersedia.")
            return redirect('murid')

        for row in reader:
            nama = row['nama'].strip()
            username = row['nim'].strip()
            password = row['password'].strip()

            if not username or not password or not nama:
                continue

            if not User.objects.filter(username=username).exists():

                user = User.objects.create_user(
                    username=username,
                    password=password,  # Gunakan create_user agar otomatis hash
                    email=username,  # opsional
                    nama=nama,
                    organization=org,
                    created_by=request.user
                )
                user.groups.add(student_group)                

        messages.success(request, "Data siswa berhasil diimpor.")
        return redirect('murid')

class MuridEditView(LoginRequiredMixin, UpdateView):
    model = User
    login_url = 'login'
    template_name = 'murid/edit.html'

    def get(self, request, *args, **kwargs):
        user_id = kwargs.get('id')
        user = get_object_or_404(User, id=user_id)
        
        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'nama': user.nama
        }        
        return render(request, self.template_name, data)
    
    def post(self, request, *args, **kwargs):
        user_id = kwargs.get('id')
        user = get_object_or_404(User, id=user_id)
        
        user.username = request.POST.get('username')
        user.email = request.POST.get('email')
        user.nama = request.POST.get('nama')
        user.save()

        messages.success(request, 'Data siswa berhasil diupdate')
        
        return redirect('murid')
    
class MuridDeleteView(LoginRequiredMixin, DeleteView):
    model = User
    login_url = 'login'
    
    def delete(self, request, *args, **kwargs):
        user_id = kwargs.get('id')
        user = get_object_or_404(User, id=user_id)
        user.delete()

        return JsonResponse({
            'message': 'Data siswa berhasil dihapus'
            })
        