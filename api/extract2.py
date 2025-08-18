import PyPDF2
import fitz  # PyMuPDF
import pandas as pd
import json
import re
import base64
from typing import List, Dict, Any
import sqlite3
import os

class SimplePDFQuestionExtractor:
    def __init__(self):
        self.questions_data = []
        
    def extract_images_from_pdf(self, pdf_path: str, page_num: int) -> List[Dict]:
        """Ekstrak gambar dari halaman PDF tertentu"""
        images = []
        try:
            doc = fitz.open(pdf_path)
            page = doc[page_num]
            image_list = page.get_images()
            
            for img_index, img in enumerate(image_list):
                try:
                    # Dapatkan data gambar
                    xref = img[0]
                    pix = fitz.Pixmap(doc, xref)
                    
                    if pix.n - pix.alpha < 4:  # GRAY atau RGB
                        # Konversi ke bytes
                        img_data = pix.tobytes("png")
                        # Encode ke base64 untuk penyimpanan
                        img_base64 = base64.b64encode(img_data).decode()
                        
                        images.append({
                            "image_id": f"page_{page_num}_img_{img_index}",
                            "format": "png",
                            "data": img_base64,
                            "width": pix.width,
                            "height": pix.height,
                            "bbox": list(img[1:5])  # bounding box
                        })
                    pix = None
                except Exception as e:
                    print(f"Error processing image {img_index} on page {page_num}: {e}")
                    continue
                    
            doc.close()
        except Exception as e:
            print(f"Error extracting images from page {page_num}: {e}")
        
        return images
    
    def extract_tables_from_text(self, text: str, page_num: int) -> List[Dict]:
        """Ekstrak tabel dari teks menggunakan pattern sederhana"""
        tables = []
        
        try:
            lines = text.split('\n')
            table_candidates = []
            current_table = []
            
            for line in lines:
                line = line.strip()
                if not line:
                    if current_table:
                        table_candidates.append(current_table)
                        current_table = []
                    continue
                
                # Deteksi baris yang memiliki multiple kolom
                # Pattern 1: Separated by |
                if '|' in line:
                    cols = [col.strip() for col in line.split('|') if col.strip()]
                    if len(cols) >= 2:
                        current_table.append(cols)
                        continue
                
                # Pattern 2: Separated by tabs
                if '\t' in line:
                    cols = [col.strip() for col in line.split('\t') if col.strip()]
                    if len(cols) >= 2:
                        current_table.append(cols)
                        continue
                
                # Pattern 3: Multiple spaces (3 or more)
                if re.search(r'\s{3,}', line):
                    cols = [col.strip() for col in re.split(r'\s{3,}', line) if col.strip()]
                    if len(cols) >= 2:
                        current_table.append(cols)
                        continue
                
                # Pattern 4: Deteksi nomor urut di awal (untuk tabel data)
                if re.match(r'^\d+[\.\)]\s+', line):
                    # Split berdasarkan spasi dengan minimal 2 kata
                    parts = line.split()
                    if len(parts) >= 3:  # Nomor + minimal 2 kolom data
                        current_table.append(parts)
                        continue
                
                # Jika tidak cocok pattern tabel, akhiri tabel saat ini
                if current_table:
                    table_candidates.append(current_table)
                    current_table = []
            
            # Jangan lupa tabel terakhir
            if current_table:
                table_candidates.append(current_table)
            
            # Process table candidates
            for table_idx, table_rows in enumerate(table_candidates):
                if len(table_rows) < 2:  # Minimal 2 baris
                    continue
                
                # Normalisasi jumlah kolom
                max_cols = max(len(row) for row in table_rows)
                if max_cols < 2:  # Minimal 2 kolom
                    continue
                
                # Pad rows to have same number of columns
                normalized_rows = []
                for row in table_rows:
                    padded_row = row + [''] * (max_cols - len(row))
                    normalized_rows.append(padded_row[:max_cols])  # Trim if too long
                
                # Create headers
                headers = []
                for i in range(max_cols):
                    if normalized_rows[0][i] and not normalized_rows[0][i].isdigit():
                        headers.append(normalized_rows[0][i])
                    else:
                        headers.append(f"column_{i+1}")
                
                # Determine if first row is header
                first_row_is_header = any(
                    not cell.isdigit() and len(cell) > 0 
                    for cell in normalized_rows[0]
                )
                
                if first_row_is_header:
                    data_rows = normalized_rows[1:]
                    headers = [cell if cell else f"column_{i+1}" 
                              for i, cell in enumerate(normalized_rows[0])]
                else:
                    data_rows = normalized_rows
                    headers = [f"column_{i+1}" for i in range(max_cols)]
                
                # Convert to dictionary format
                table_data = []
                for row in data_rows:
                    row_dict = {}
                    for i, cell in enumerate(row):
                        header = headers[i] if i < len(headers) else f"column_{i+1}"
                        row_dict[header] = cell
                    table_data.append(row_dict)
                
                if table_data:
                    tables.append({
                        "table_id": f"page_{page_num}_table_{table_idx}",
                        "method": "text_pattern",
                        "headers": headers,
                        "data": table_data,
                        "shape": [len(table_data), len(headers)],
                        "raw_rows": len(table_rows)
                    })
        
        except Exception as e:
            print(f"Error extracting tables from text on page {page_num}: {e}")
        
        return tables
    
    def extract_text_from_pdf(self, pdf_path: str) -> List[str]:
        """Ekstrak teks dari semua halaman PDF"""
        texts = []
        try:
            # Coba dengan PyMuPDF dulu (lebih baik untuk layout)
            doc = fitz.open(pdf_path)
            for page in doc:
                texts.append(page.get_text())
            doc.close()
        except Exception as e:
            print(f"PyMuPDF error: {e}, trying PyPDF2...")
            # Fallback ke PyPDF2
            try:
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page in pdf_reader.pages:
                        texts.append(page.extract_text())
            except Exception as e2:
                print(f"PyPDF2 error: {e2}")
        
        return texts
    
    def parse_questions(self, text: str) -> List[Dict]:
        """Parse pertanyaan dari teks"""
        questions = []
        
        # Multiple patterns untuk mendeteksi soal
        question_patterns = [
            r'(\d+)\.\s*(.*?)(?=\d+\.|$)',  # 1. Pertanyaan...
            r'Soal\s*(\d+)[:\.]?\s*(.*?)(?=Soal\s*\d+|$)',  # Soal 1: Pertanyaan...
            r'(\d+)\)\s*(.*?)(?=\d+\)|$)',  # 1) Pertanyaan...
            r'No[\.:]?\s*(\d+)[\.:]?\s*(.*?)(?=No[\.:]?\s*\d+|$)',  # No. 1. Pertanyaan...
            r'(\d+)[\.]\s+([^\.]+.*?)(?=\d+\.|$)',  # Alternative numbering
        ]
        
        best_matches = []
        for pattern in question_patterns:
            matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
            if matches and len(matches) > len(best_matches):
                best_matches = matches
        
        for match in best_matches:
            if len(match) >= 2:
                question_num = match[0].strip()
                question_text = match[1].strip()
                
                # Filter pertanyaan yang terlalu pendek atau tidak masuk akal
                if len(question_text) > 10 and not question_text.isdigit():
                    # Ekstrak pilihan jawaban
                    choices = self.extract_choices(question_text)
                    
                    # Bersihkan teks pertanyaan dari pilihan
                    clean_question = self.clean_question_text(question_text)
                    
                    # Validasi pertanyaan
                    if len(clean_question.strip()) > 5:
                        questions.append({
                            'question_number': question_num,
                            'question_text': clean_question,
                            'choices': choices,
                            'has_choices': len(choices) > 0
                        })
        
        return questions
    
    def extract_choices(self, text: str) -> List[Dict]:
        """Ekstrak pilihan jawaban dari teks"""
        choices = []
        
        # Pattern untuk pilihan dengan berbagai format
        choice_patterns = [
            r'([A-E])\.\s*(.*?)(?=[A-E]\.|$)',  # A. Pilihan
            r'([A-E])\)\s*(.*?)(?=[A-E]\)|$)',  # A) Pilihan
            r'([a-e])\.\s*(.*?)(?=[a-e]\.|$)',  # a. pilihan
            r'([a-e])\)\s*(.*?)(?=[a-e]\)|$)',  # a) pilihan
            r'(\d+)\.\s*(.*?)(?=\d+\.|$)',      # 1. Pilihan (untuk soal dengan pilihan numerik)
        ]
        
        for pattern in choice_patterns:
            matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
            if matches and len(matches) >= 2:  # Minimal 2 pilihan
                temp_choices = []
                for match in matches:
                    choice_letter = match[0].upper()
                    choice_text = match[1].strip()
                    
                    # Bersihkan choice text
                    choice_text = re.sub(r'\s+', ' ', choice_text)
                    choice_text = choice_text.strip()
                    
                    if choice_text and len(choice_text) > 1:
                        temp_choices.append({
                            'letter': choice_letter,
                            'text': choice_text
                        })
                
                # Gunakan pilihan terbaik (yang paling banyak dan masuk akal)
                if len(temp_choices) >= 2:
                    choices = temp_choices
                    break
        
        return choices
    
    def clean_question_text(self, text: str) -> str:
        """Bersihkan teks pertanyaan dari pilihan jawaban"""
        # Hapus pilihan jawaban dari teks pertanyaan
        patterns_to_remove = [
            r'[A-E]\.\s*.*?(?=[A-E]\.|$)',
            r'[A-E]\)\s*.*?(?=[A-E]\)|$)',
            r'[a-e]\.\s*.*?(?=[a-e]\.|$)',
            r'[a-e]\)\s*.*?(?=[a-e]\)|$)',
        ]
        
        cleaned_text = text
        for pattern in patterns_to_remove:
            # Hapus hanya jika ada minimal 2 pilihan
            matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
            if len(matches) >= 2:
                cleaned_text = re.sub(pattern, '', cleaned_text, flags=re.DOTALL | re.IGNORECASE)
                break
        
        # Bersihkan whitespace berlebih
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
        return cleaned_text.strip()
    
    def process_pdf(self, pdf_path: str) -> pd.DataFrame:
        """Proses PDF dan ekstrak semua data"""
        print(f"Memproses PDF: {pdf_path}")
        
        # Ekstrak teks dari semua halaman
        page_texts = self.extract_text_from_pdf(pdf_path)
        
        if not page_texts:
            print("Tidak ada teks yang berhasil diekstrak dari PDF")
            return pd.DataFrame()
        
        for page_num, text in enumerate(page_texts):
            if not text.strip():
                continue
                
            print(f"Memproses halaman {page_num + 1}...")
            
            # Parse pertanyaan dari teks
            questions = self.parse_questions(text)
            
            # Ekstrak gambar
            images = self.extract_images_from_pdf(pdf_path, page_num)
            
            # Ekstrak tabel
            tables = self.extract_tables_from_text(text, page_num)
            
            # Jika tidak ada pertanyaan yang terdeteksi, buat entry umum
            if not questions:
                # Coba deteksi konten penting lainnya
                important_content = self.extract_important_content(text)
                if important_content or images or tables:
                    questions = [{
                        'question_number': f"content_{page_num}",
                        'question_text': important_content[:500] + "..." if len(important_content) > 500 else important_content,
                        'choices': [],
                        'has_choices': False
                    }]
            
            # Gabungkan data untuk setiap pertanyaan
            for i, question in enumerate(questions):
                record = {
                    'page_number': page_num + 1,
                    'question_number': question['question_number'],
                    'question_text': question['question_text'],
                    'has_choices': question['has_choices'],
                    'choices_json': json.dumps(question['choices'], ensure_ascii=False) if question['choices'] else None,
                    'images_json': json.dumps(images, ensure_ascii=False) if images else None,
                    'tables_json': json.dumps(tables, ensure_ascii=False) if tables else None,
                    'images_count': len(images),
                    'tables_count': len(tables),
                    'choices_count': len(question['choices']),
                    'text_length': len(question['question_text']),
                    'raw_text_sample': text[:200] + "..." if len(text) > 200 else text
                }
                
                self.questions_data.append(record)
        
        # Konversi ke DataFrame
        df = pd.DataFrame(self.questions_data)
        return df
    
    def extract_important_content(self, text: str) -> str:
        """Ekstrak konten penting jika tidak ada pertanyaan yang terdeteksi"""
        # Hapus whitespace berlebih
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Cari paragraf yang panjang atau berisi informasi penting
        sentences = text.split('. ')
        important_sentences = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            # Prioritaskan kalimat yang panjang atau mengandung kata kunci
            if (len(sentence) > 50 or 
                any(keyword in sentence.lower() for keyword in 
                    ['definisi', 'pengertian', 'rumus', 'contoh', 'jawab', 'selesai', 'hitung', 'tentukan'])):
                important_sentences.append(sentence)
        
        return '. '.join(important_sentences) if important_sentences else text[:500]
    
    def save_to_database(self, df: pd.DataFrame, db_path: str = "questions.db"):
        """Simpan data ke database SQLite"""
        conn = sqlite3.connect(db_path)
        df.to_sql('questions', conn, if_exists='replace', index=False)
        conn.close()
        print(f"Data berhasil disimpan ke database: {db_path}")
    
    def save_to_csv(self, df: pd.DataFrame, csv_path: str = "questions.csv"):
        """Simpan data ke file CSV"""
        df.to_csv(csv_path, index=False, encoding='utf-8')
        print(f"Data berhasil disimpan ke CSV: {csv_path}")
    
    def save_to_excel(self, df: pd.DataFrame, excel_path: str = "questions.xlsx"):
        """Simpan data ke file Excel"""
        df.to_excel(excel_path, index=False, engine='openpyxl')
        print(f"Data berhasil disimpan ke Excel: {excel_path}")

def main():
    """Fungsi utama untuk menjalankan ekstraksi"""
    
    # Inisialisasi extractor
    extractor = SimplePDFQuestionExtractor()
    
    # Path ke file PDF (ganti dengan path yang sesuai)
    pdf_path = "soal_ujian.pdf"  # Ganti dengan path file PDF Anda
    
    if not os.path.exists(pdf_path):
        print(f"File PDF tidak ditemukan: {pdf_path}")
        print("Silakan ganti variabel 'pdf_path' dengan path yang benar")
        return
    
    try:
        # Proses PDF
        df = extractor.process_pdf(pdf_path)
        
        if df.empty:
            print("Tidak ada data yang berhasil diekstrak")
            return
        
        # Tampilkan ringkasan hasil
        print(f"\n" + "="*50)
        print(f"HASIL EKSTRAKSI PDF")
        print(f"="*50)
        print(f"Total records: {len(df)}")
        print(f"Halaman yang diproses: {df['page_number'].nunique()}")
        print(f"Pertanyaan dengan pilihan: {df['has_choices'].sum()}")
        print(f"Records dengan gambar: {df['images_count'].sum()}")
        print(f"Records dengan tabel: {df['tables_count'].sum()}")
        
        # Tampilkan preview data
        print(f"\nPreview data:")
        preview_cols = ['page_number', 'question_number', 'question_text', 'choices_count', 'images_count', 'tables_count']
        print(df[preview_cols].head())
        
        # Simpan hasil
        extractor.save_to_csv(df, "hasil_ekstraksi_sederhana.csv")
        extractor.save_to_excel(df, "hasil_ekstraksi_sederhana.xlsx")
        extractor.save_to_database(df, "hasil_ekstraksi_sederhana.db")
        
        # Tampilkan contoh data JSON jika ada
        if not df['choices_json'].isna().all():
            print(f"\nContoh pilihan jawaban (JSON):")
            sample_choices = df['choices_json'].dropna().iloc[0]
            print(sample_choices)
        
        if not df['tables_json'].isna().all():
            print(f"\nContoh tabel (JSON):")
            sample_table = df['tables_json'].dropna().iloc[0]
            # Tampilkan hanya sebagian untuk preview
            print(sample_table[:200] + "..." if len(sample_table) > 200 else sample_table)
            
    except Exception as e:
        print(f"Error dalam proses ekstraksi: {e}")
        import traceback
        traceback.print_exc()

# Fungsi utilitas untuk membaca hasil
def read_extracted_data(source="csv"):
    """Membaca data hasil ekstraksi"""
    if source == "csv":
        return pd.read_csv("hasil_ekstraksi_sederhana.csv")
    elif source == "excel":
        return pd.read_excel("hasil_ekstraksi_sederhana.xlsx")
    elif source == "database":
        conn = sqlite3.connect("hasil_ekstraksi_sederhana.db")
        df = pd.read_sql_query("SELECT * FROM questions", conn)
        conn.close()
        return df

def parse_json_column(df: pd.DataFrame, column_name: str):
    """Parse kolom JSON kembali menjadi objek Python"""
    def safe_json_loads(x):
        if pd.isna(x) or x is None:
            return None
        try:
            return json.loads(x)
        except:
            return None
    
    df[column_name + '_parsed'] = df[column_name].apply(safe_json_loads)
    return df

def analyze_extraction_results(df: pd.DataFrame):
    """Analisis hasil ekstraksi"""
    print("ANALISIS HASIL EKSTRAKSI")
    print("="*40)
    print(f"Total records: {len(df)}")
    print(f"Halaman: {df['page_number'].min()} - {df['page_number'].max()}")
    print(f"Rata-rata panjang teks: {df['text_length'].mean():.1f} karakter")
    print(f"Records dengan pilihan: {df['has_choices'].sum()} ({df['has_choices'].mean()*100:.1f}%)")
    print(f"Records dengan gambar: {(df['images_count'] > 0).sum()}")
    print(f"Records dengan tabel: {(df['tables_count'] > 0).sum()}")
    
    # Distribusi per halaman
    print(f"\nDistribusi per halaman:")
    page_stats = df.groupby('page_number').agg({
        'question_number': 'count',
        'has_choices': 'sum',
        'images_count': 'sum',
        'tables_count': 'sum'
    }).rename(columns={'question_number':