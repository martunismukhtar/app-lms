from celery import shared_task
import time
from .doc_to_vector import process_pdf_parallel_batch

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