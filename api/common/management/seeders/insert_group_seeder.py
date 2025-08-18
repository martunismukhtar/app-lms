from django.contrib.auth.models import Group

def run():
    data_group = Group.objects.all()
    data_insert = ['Administrator', 'Manager', 'Teacher', 'Student']

    for g in data_insert:
        if not data_group.filter(name=g).exists():
            Group.objects.create(name=g)