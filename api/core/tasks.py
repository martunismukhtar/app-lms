from celery import shared_task
import time
from .doc_to_vector import process_pdf_parallel_batch
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

@shared_task
def process_pdf_to_vector(file_path, mapel, semester, kelas, org):
    # print(f"Processing file in background: {file_path}")
    time.sleep(5)  # Simulasi proses lama
    
    process_pdf_parallel_batch(
        pdf_path=file_path, 
        mapel=mapel,
        semester=semester,
        kelas=kelas,
        org=org
    )
    print("File processing completed.")
    # return f"Processed file: {file_path}"

@shared_task
def send_email(username, email, verify_link):
    from_email = "no-reply@eduforge.com"
    to = [email]
    subject = "[EduForge] Verifikasi Alamat Email Anda"
    html_content = render_to_string("email/verify_email.html", {
        "username": username,
        "verification_link": verify_link,
    })
    text_content = f"Halo {username},\n\nKlik link berikut untuk verifikasi akun Anda:\n{verify_link}"

    msg = EmailMultiAlternatives(subject, text_content, from_email, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()