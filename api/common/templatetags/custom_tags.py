from django import template
from django.urls import resolve

register = template.Library()

@register.simple_tag(takes_context=True)
def is_active_url(context, *url_names):
    """
    Cek apakah URL yang sedang aktif sama dengan salah satu dari `url_names`.
    """
    current_url_name = resolve(context['request'].path_info).url_name
    if current_url_name in url_names:
        return 'hover show'
    return ''

@register.filter
def in_group(user, role):
    return user.groups.filter(name=role).exists()