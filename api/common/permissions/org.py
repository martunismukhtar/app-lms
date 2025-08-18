from rest_framework.permissions import BasePermission

class HasOrganizationPermission(BasePermission):
    """
    Izinkan akses hanya jika user sudah login dan memiliki organisasi.
    """

    message = "Anda belum melengkapi data organisasi."

    def has_permission(self, request, view):
        user = request.user        
        # Harus sudah login dan memiliki organisasi
        return bool(
            user and
            user.is_authenticated and
            hasattr(user, 'organization') and
            user.organization is not None
        )