import fitz  # PyMuPDF
import pdfplumber
import json
import base64
from PIL import Image
import io
import psycopg2
from datetime import datetime
import re

class PDFConverter:
    def __init__(self):
        pass
    def extract_images_from_page(self, pdf_document, page_num):
        """Ekstrak gambar dari halaman PDF"""
        page = pdf_document[page_num]
        image_list = page.get_images(full=True)
        images = []        

        for img_index, img in enumerate(image_list):
            xref = img[0]  # ID unik gambar
            try:
                pix = fitz.Pixmap(pdf_document, xref)            
                if pix.n - pix.alpha < 4:  # GRAY atau RGB
                    # Convert ke PNG bytes
                    img_data = pix.tobytes("png")
                    img_base64 = base64.b64encode(img_data).decode()

                    # Posisi gambar di halaman
                    img_rect = page.get_image_bbox(img)

                    images.append({
                        'data': img_base64,
                        'position': {
                            'x0': img_rect.x0,
                            'y0': img_rect.y0,
                            'x1': img_rect.x1,
                            'y1': img_rect.y1
                        },
                        'index': img_index
                    })
            except Exception as e:
                print(f"Gagal memproses gambar ke-{img_index} di halaman {page_num}: {e}")
            finally:
                if 'pix' in locals():
                    pix = None
        
        return images
    
    def extract_tables_from_page(self, pdf_path, page_num):
        """Ekstrak tabel dari halaman PDF menggunakan pdfplumber"""
        tables = []
        
        with pdfplumber.open(pdf_path) as pdf:
            if page_num < len(pdf.pages):
                page = pdf.pages[page_num]
                page_tables = page.extract_tables()
                
                for table_index, table in enumerate(page_tables):
                    if table:  # Pastikan tabel tidak kosong
                        # Bersihkan data tabel
                        cleaned_table = []
                        for row in table:
                            cleaned_row = [cell.strip() if cell else '' for cell in row]
                            cleaned_table.append(cleaned_row)
                        
                        tables.append({
                            'data': cleaned_table,
                            'index': table_index,
                            'headers': cleaned_table[0] if cleaned_table else [],
                            'rows': cleaned_table[1:] if len(cleaned_table) > 1 else []
                        })
        
        return tables
    
    def extract_text_with_position(self, pdf_document, page_num):
        """Ekstrak teks dengan informasi posisi"""
        page = pdf_document[page_num]
        
        # Ekstrak teks dengan posisi
        text_dict = page.get_text("dict")
        
        text_blocks = []
        for block in text_dict["blocks"]:
            # print(block)
            if "lines" in block:
                block_text = ""
                for line in block["lines"]:
                    for span in line["spans"]:
                        block_text += span["text"]
                
                if block_text.strip():
                    text_blocks.append({
                        'text': block_text.strip(),
                        'position': {
                            'x0': block['bbox'][0],
                            'y0': block['bbox'][1],
                            'x1': block['bbox'][2],
                            'y1': block['bbox'][3]
                        }
                    })
        # print(text_blocks)
        
        return text_blocks
    
    def identify_questions(self, text_blocks):
        """Identifikasi soal berdasarkan pattern nomor"""
        questions = []
        question_patterns = [
            r'^\d+\)',  # 1) 2) 3)
            r'^\d+\.',  # 1. 2. 3.

            r'^Soal\s+\d+',  # Soal 1, Soal 2
            r'^No\.\s*\d+',  # No. 1, No. 2
        ]
        
        current_question = None
        
        for block in text_blocks:
            text = block['text']
            print(text.strip())
            # Cek apakah ini awal soal baru
            is_question_start = any(re.match(pattern, text.strip()) for pattern in question_patterns)
            # print(is_question_start)
            if is_question_start:
                # Simpan soal sebelumnya jika ada
                if current_question:
                    questions.append(current_question)
                
                # Ekstrak nomor soal
                question_number = self.extract_question_number(text)
                
                current_question = {
                    'number': question_number,
                    'text': text,
                    'position': block['position'],
                    'full_text': text
                }
            elif current_question:
                # Tambahkan teks ke soal yang sedang aktif
                current_question['full_text'] += ' ' + text

            # print(current_question)    
        
        
        # Simpan soal terakhir
        if current_question:
            questions.append(current_question)
        
        # print(questions)

        return questions
    
    def extract_question_number(self, text):
        """Ekstrak nomor soal dari teks"""
        patterns = [
            r'(\d+)\.',
            r'(\d+)\)',
            r'Soal\s+(\d+)',
            r'No\.\s*(\d+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return int(match.group(1))
        
        return 1
    
    def extract_mathematical_expressions(self, text):
        """Ekstrak ekspresi matematika dari teks"""
        # Pattern untuk mendeteksi rumus matematika
        math_patterns = [
            r'[a-zA-Z][\+\-\*/\=][a-zA-Z0-9]',  # x + y, a = b
            r'\d+[\+\-\*/\=]\d+',  # 2 + 3, 5 = 5
            r'[a-zA-Z]\^[0-9]',  # x^2, y^3
            r'√\d+',  # √4, √9
            r'\([^)]+\)',  # (x + 1)
            r'\d+/\d+',  # 1/2, 3/4
            r'[a-zA-Z]+\([^)]+\)',  # sin(x), cos(x)
        ]
        
        math_expressions = []
        for pattern in math_patterns:
            matches = re.findall(pattern, text)
            math_expressions.extend(matches)
        
        return math_expressions
    
    def extract_multiple_choice_options(self, text_blocks, question_position):
        """Ekstrak opsi pilihan ganda"""
        options = {}
        option_patterns = [
            r'^[A-E]\.',  # A. B. C. D. E.
            r'^[A-E]\)',  # A) B) C) D) E)
            r'^\([A-E]\)',  # (A) (B) (C) (D) (E)
        ]
        
        # Cari opsi setelah posisi soal
        for block in text_blocks:
            if block['position']['y0'] > question_position['y1']:  # Di bawah soal
                text = block['text'].strip()
                # print(text)
                # print(block['position'])
                for pattern in option_patterns:
                    match = re.match(pattern, text)
                    if match:
                        option_key = re.findall(r'[A-E]', match.group())[0]
                        option_text = re.sub(pattern, '', text).strip()
                        # print(option_key)
                        # print(option_text)
                        options[option_key] = {
                            'text': option_text,
                            # 'position': block['position']
                        }
                        # print(options)
        print(options)
        return options
    
    def extract_question_number(self, text):
        """Ekstrak nomor soal dari teks"""
        patterns = [
            r'(\d+)\.',
            r'(\d+)\)',
            r'(\d+).)',
            r'Soal\s+(\d+)',
            r'No\.\s*(\d+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return int(match.group(1))
        
        return 1

    def identify_math_questions(self, text_blocks):
        """Identifikasi soal matematika dengan pattern khusus"""
        questions = []
        question_patterns = [
            r'^\d+\.',  # 1. 2. 3.
            r'^\d+\)',  # 1) 2) 3)
            r'^Soal\s+\d+',  # Soal 1, Soal 2
            r'^No\.\s*\d+',  # No. 1, No. 2
            r'^\d+\.\s*',  # 1. dengan spasi
        ]
        
        current_question = None
        question_buffer = []
        
        for i, block in enumerate(text_blocks):
            text = block['text'].strip()
            
            # Cek apakah ini awal soal baru
            is_question_start = any(re.match(pattern, text) for pattern in question_patterns)
            
            if is_question_start:
                # Simpan soal sebelumnya jika ada
                if current_question and question_buffer:
                    # print(current_question)
                    current_question['full_text'] = ' '.join(question_buffer)
                    # current_question['math_expressions'] = self.extract_mathematical_expressions(current_question['full_text'])
                    questions.append(current_question)
                
                # Reset buffer
                question_buffer = [text]
                
                # Ekstrak nomor soal
                question_number = self.extract_question_number(text)
                
                current_question = {
                    'number': question_number,
                    'text': text,
                    # 'position': block['position'],
                    # 'start_position': block['position']
                }
            elif current_question:
                # Tambahkan teks ke buffer soal yang sedang aktif
                # Hentikan jika menemukan soal baru atau kata kunci tertentu
                if any(keyword in text.lower() for keyword in ['jawaban:', 'pilihan:', 'a.', 'b.', 'c.', 'd.', 'e.']):
                    question_buffer.append(text)
                elif len(question_buffer) < 10:  # Batasi panjang soal
                    question_buffer.append(text)
        
        # Simpan soal terakhir
        if current_question and question_buffer:
            current_question['full_text'] = ' '.join(question_buffer)
            # current_question['math_expressions'] = self.extract_mathematical_expressions(current_question['full_text'])
            questions.append(current_question)
        
        # questions.append(
        #     {
        #         'number': len(questions) + 1,
        #         'text': 'Jawaban:',
        #         # 'position': block['position'],
        #         # 'start_position': block['position']
        #     }            
        # )

        print(questions)
        return questions
    
    def classify_question_type(self, question_text, options):
        """Klasifikasi jenis soal matematika"""
        text_lower = question_text.lower()
        
        # Deteksi topik matematika
        topics = {
            'aljabar': ['persamaan', 'pertidaksamaan', 'fungsi', 'grafik', 'x =', 'y ='],
            'geometri': ['segitiga', 'lingkaran', 'luas', 'keliling', 'volume', 'sudut'],
            'trigonometri': ['sin', 'cos', 'tan', 'sinus', 'cosinus', 'tangen'],
            'kalkulus': ['turunan', 'integral', 'limit', 'diferensial'],
            'statistik': ['rata-rata', 'median', 'modus', 'standar deviasi'],
            'probabilitas': ['peluang', 'kemungkinan', 'probabilitas']
        }
        
        detected_topics = []
        for topic, keywords in topics.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_topics.append(topic)
        
        # Tentukan tipe soal
        question_type = 'multiple_choice' if options else 'essay'
        
        return {
            'type': question_type,
            'topics': detected_topics,
            'difficulty': self.estimate_difficulty(question_text)
        }
    
    def estimate_difficulty(self, question_text):
        """Estimasi tingkat kesulitan soal"""
        difficulty_indicators = {
            'mudah': ['hitung', 'tentukan nilai', 'berapa', 'sederhana'],
            'sedang': ['buktikan', 'jelaskan', 'analisis', 'gambarkan'],
            'sulit': ['optimasi', 'kompleks', 'integralkan', 'diferensialkan']
        }
        
        text_lower = question_text.lower()
        
        for level, indicators in difficulty_indicators.items():
            if any(indicator in text_lower for indicator in indicators):
                return level
        
        # Default berdasarkan panjang teks
        if len(question_text) > 200:
            return 'sulit'
        elif len(question_text) > 100:
            return 'sedang'
        else:
            return 'mudah'

    def process_pdf(self, pdf_path):
        """Proses PDF dan simpan ke database"""
        try:
            # Buka PDF dengan PyMuPDF
            pdf_document = fitz.open(pdf_path)
            
            all_questions = []
            # print(pdf_document)
            # Proses setiap halaman
            for page_num in range(len(pdf_document)):
            #     print(f"Processing page {page_num + 1}...")
                
            #     # Ekstrak teks dengan posisi
                text_blocks = self.extract_text_with_position(pdf_document, page_num)
                # print(text_blocks)
            #     # Identifikasi soal matematika
                page_questions = self.identify_math_questions(text_blocks)
                # print(page_questions)
            #     # Ekstrak gambar dan diagram
            #     page_images = self.extract_images_from_page(pdf_document, page_num)
            #     # print(page_images)
            #     # Ekstrak tabel
            #     page_tables = self.extract_tables_from_page(pdf_path, page_num)
            #     # print(page_tables)
            #     # Proses setiap soal
            #     for question in page_questions:
            #         question['page_number'] = page_num + 1
                    
            #         # Ekstrak opsi pilihan ganda
            #         # options = self.extract_multiple_choice_options(text_blocks, question['position'])
            #         # # print(options)
            #         # # break
            #         # question['options'] = options
                    
                
            #         # Assign images and tables (refined assignment could be implemented)
            #         question['images'] = page_images
            #         question['tables'] = page_tables
                    
            #         all_questions.append(question)
            
            pdf_document.close()
            
            # Simpan ke database
            # filename = pdf_path.split('/')[-1]
            
            
            return all_questions
            
        except Exception as e:
            print(f"Error processing PDF: {e}")
            return False

# Contoh penggunaan
if __name__ == "__main__":
    # Konfigurasi database
    
    # Inisialisasi converter
    
    # Koneksi ke database
    path = "dokumen.pdf"
    processor = PDFConverter()
    hasil = processor.process_pdf(path)

    # print(hasil)