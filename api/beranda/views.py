from django.views.generic import TemplateView
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

# Create your views here.
# @cache_page(60 * 15)  # Cache selama 15 menit
# @method_decorator(cache_page(60 * 15), name='dispatch') 
class BerandaView(TemplateView):
    template_name = 'beranda/index.html'