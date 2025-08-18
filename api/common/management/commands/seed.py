from django.core.management.base import BaseCommand
from common.management.seeders import mapel_seeder, custom_permission_seeder, custom_persmission_user_seeder, insert_group_seeder

class Command(BaseCommand):
    help = 'Seed data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--only',
            type=str,
            help='Nama seeder yang ingin dijalankan, contoh: --only=mapel'
        )

    def handle(self, *args, **options):
        only = options.get('only')
        if only=='mapel':
            mapel_seeder.run()
        elif only=='group':
            insert_group_seeder.run()            
        elif only=='custom_permission':
            custom_permission_seeder.run()   
        elif only=='custom_persmission_user':
            custom_persmission_user_seeder.run() 
        else:
            self.stdout.write(self.style.WARNING(
                "Masukkan seeder ex: python manage.py seed --only=custom_permission "))

        self.stdout.write(self.style.SUCCESS("Seeder finished."))