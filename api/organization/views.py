from users.models import Organization
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import OrganizationSerializer
from rest_framework import status

# Create your views here.
class OrganizationView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationSerializer

class OrganizationCreateView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrganizationSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data

        try:
            organization = user.organization
        except Organization.DoesNotExist:
            organization = None

        created = False  # Flag untuk cek apakah baru dibuat

        if organization is None:
            # Buat organisasi baru
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            organization = serializer.save()

            # Assign ke user
            user.organization = organization
            user.save(update_fields=['organization'])
            created = True
        else:
            # Update organisasi yang sudah ada
            serializer = self.get_serializer(
                organization, data=data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return Response({
            "message": "Organisasi berhasil dibuat" if created else "Organisasi berhasil diperbarui",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    
        # return Response(serializer.data, status=status.HTTP_200_OK)    
    
    # return JsonResponse({
    #             "access": str(refresh.access_token),
    #             "refresh": str(refresh),
    #             "user": {
    #                 "email": user.email,
    #                 "username": user.username,
    #             },
    #             "organization":org_data,
    #             "roles": list(user.groups.values_list("name", flat=True)),
    #             "permissions": [name.split(".")[1] for name in user.get_all_permissions()]
    #         })
    
# class OrganisasiView(RetrieveUpdateAPIView):
#     permission_classes = [IsAuthenticated]    
#     serializer_class = OrganizationSerializer

#     def get_object(self):
#         # Ambil organisasi berdasarkan user yang sedang login
#         org, created = Organization.objects.get_or_create(user=self.request.user)
#         return org

# class OrganizationView(LoginRequiredMixin, TemplateView):
#     login_url = 'login'        
#     template_name = 'organization/index.html'

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)        
#         # Mengambil organisasi dari user
#         user = self.request.user
#         try:
#             org_id = user.organization.id
#             organization = get_object_or_404(Organization, id=org_id)
#         except AttributeError:
#             organization = None  # atau bisa redirect / beri pesan

#         context['organization'] = organization
#         return context
    
# class OrganizationCreateView(LoginRequiredMixin, CreateView):
#     model = Organization
#     login_url = 'login'
#     fields = ['name', 'email', 'alamat', 'kota', 'provinsi']
#     success_url = reverse_lazy('organization')

#     def post(self, request, *args, **kwargs):
#         org_id = request.POST.get('id')
#         if org_id:
#             try:
#                 org = Organization.objects.get(id=org_id)
#                 org.name = request.POST.get('name')
#                 org.email = request.POST.get('email')
#                 org.alamat = request.POST.get('alamat')
#                 org.kota = request.POST.get('kota')
#                 org.provinsi = request.POST.get('provinsi')
#                 org.save()
#                 messages.success(request, "Organisasi berhasil diperbarui.")
#             except Organization.DoesNotExist:
#                 messages.error(request, "Organisasi tidak ditemukan.")
            
#             return redirect(self.success_url)
#         else:
#             messages.error(request, "ID organisasi tidak ditemukan.")            
#             return redirect(self.success_url)
                

#     def form_valid(self, form):                
#         messages.success(self.request, "Organisasi berhasil dibuat.")
#         return super().form_valid(form)

#     def form_invalid(self, form):
#         messages.error(self.request, "Terjadi kesalahan saat menyimpan data.")
#         return super().form_invalid(form)

