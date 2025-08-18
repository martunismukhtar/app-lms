import PyPDF2
import fitz  # PyMuPDF
import pandas as pd
import json
import re
import io
import base64
from PIL import Image
try:
    import camelot.io as camelot
    CAMELOT_AVAILABLE = True
except ImportError:
    try:
        import camelot
        CAMELOT_AVAILABLE = True
    except ImportError:
        CAMELOT_AVAILABLE = False
        print("Warning: Camelot tidak tersedia. Hanya akan menggunakan tabula untuk ekstraksi tabel.")

try:
    import tabula
    TABULA_AVAILABLE = True
except ImportError:
    TABULA_AVAILABLE = False
    print("Warning: Tabula tidak tersedia. Ekstraksi tabel akan dilewati.")

from typing import List, Dict, Any
import sqlite3
import os

class PDFQuestionExtractor:
    def __init__(self):
        self.questions_data = []
        
    def extract_images_from_pdf(self, pdf_path: str, page_num: int) -> List[Dict]:
        images = []
        try:
            with fitz.open(pdf_path) as doc:
                page = doc[page_num]
                image_list = page.get_images()
                
                for img_index, img in enumerate(image_list):
                    xref = img[0]
                    with fitz.Pixmap(doc, xref) as pix:
                        if pix.n - pix.alpha < 4:
                            img_data = pix.tobytes("png")
                            img_base64 = base64.b64encode(img_data).decode()
                            images.append({
                                "image_id": f"page_{page_num}_img_{img_index}",
                                "format": "png",
                                "data": img_base64,
                                "bbox": img[1:5]
                            })
        except Exception as e:
            print(f"Error extracting images from page {page_num}: {e}")
        
        return images
    
    def extract_tables_from_pdf(self, pdf_path: str, page_num: int) -> List[Dict]:
        """Ekstrak tabel dari halaman PDF"""
        tables = []
        
        # Coba dengan camelot jika tersedia
        if CAMELOT_AVAILABLE:
            try:
                camelot_tables = camelot.read_pdf(pdf_path, pages=str(page_num + 1), flavor='lattice')
                for i, table in enumerate(camelot_tables):
                    if hasattr(table, 'df') and not table.df.empty:
                        table_data = {
                            "table_id": f"page_{page_num}_table_{i}",
                            "method": "camelot_lattice",
                            "data": table.df.to_dict('records'),
                            "shape": list(table.df.shape),
                            "accuracy": getattr(table, 'accuracy', 0) if hasattr(table, 'accuracy') else 0
                        }
                        tables.append(table_data)
            except Exception as e:
                print(f"Camelot lattice error on page {page_num}: {e}")
                
                # Coba dengan flavor 'stream' jika lattice gagal
                try:
                    camelot_tables = camelot.read_pdf(pdf_path, pages=str(page_num + 1), flavor='stream')
                    for i, table in enumerate(camelot_tables):
                        if hasattr(table, 'df') and not table.df.empty:
                            table_data = {
                                "table_id": f"page_{page_num}_table_stream_{i}",
                                "method": "camelot_stream",
                                "data": table.df.to_dict('records'),
                                "shape": list(table.df.shape),
                                "accuracy": getattr(table, 'accuracy', 0) if hasattr(table, 'accuracy') else 0
                            }
                            tables.append(table_data)
                except Exception as e2:
                    print(f"Camelot stream error on page {page_num}: {e2}")
        
        # Coba dengan tabula sebagai backup
        if TABULA_AVAILABLE:
            try:
                tabula_tables = tabula.read_pdf(pdf_path, pages=page_num + 1, multiple_tables=True, silent=True)
                for i, table in enumerate(tabula_tables):
                    if not table.empty:
                        # Bersihkan data NaN
                        table_clean = table.fillna('')
                        table_data = {
                            "table_id": f"page_{page_num}_tabula_{i}",
                            "method": "tabula",
                            "data": table_clean.to_dict('records'),
                            "shape": list(table.shape)
                        }
                        tables.append(table_data)
            except Exception as e:
                print(f"Tabula error on page {page_num}: {e}")
        
        # Jika tidak ada library tabel yang tersedia, coba ekstrak tabel sederhana dari teks
        if not CAMELOT_AVAILABLE and not TABULA_AVAILABLE:
            tables.extend(self.extract_simple_tables_from_text(pdf_path, page_num))
        
        return tables
    
    def extract_simple_tables_from_text(self, pdf_path: str, page_num: int) -> List[Dict]:
        tables = []
        try:
            with fitz.open(pdf_path) as doc:
                page = doc[page_num]
                text = page.get_text()

                lines = text.split('\n')
                table_lines = []

                for line in lines:
                    if re.search(r'[\t\|]', line) or re.search(r'\s{3,}', line):
                        if '|' in line:
                            cols = [col.strip() for col in line.split('|') if col.strip()]
                        elif '\t' in line:
                            cols = [col.strip() for col in line.split('\t') if col.strip()]
                        else:
                            cols = [col.strip() for col in re.split(r'\s{3,}', line) if col.strip()]
                        
                        if len(cols) >= 2:
                            table_lines.append(cols)

                if table_lines:
                    max_cols = max(len(row) for row in table_lines)
                    normalized_table = [row + [''] * (max_cols - len(row)) for row in table_lines]

                    headers = [f"col_{i}" if not cell else cell for i, cell in enumerate(normalized_table[0])]
                    data_rows = normalized_table[1:] if len(normalized_table) > 1 else []

                    table_data = []
                    for row in data_rows:
                        row_dict = {headers[i] if i < len(headers) else f"col_{i}": cell for i, cell in enumerate(row)}
                        table_data.append(row_dict)

                    if table_data:
                        tables.append({
                            "table_id": f"page_{page_num}_simple_table",
                            "method": "text_pattern",
                            "data": table_data,
                            "shape": [len(table_data), len(headers)],
                            "headers": headers
                        })
        except Exception as e:
            print(f"Error extracting simple tables from page {page_num}: {e}")

        return tables
    
    def extract_text_from_pdf(self, pdf_path: str) -> List[str]:
        texts = []
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    texts.append(page.extract_text())
        except Exception as e:
            print(f"Error extracting text: {e}")
            # Fallback menggunakan PyMuPDF
            try:
                with fitz.open(pdf_path) as doc:
                    texts = [page.get_text() for page in doc]
            except Exception as e2:
                print(f"Fallback error: {e2}")

        return texts
    
    def parse_questions(self, text: str) -> List[Dict]:
        """Parse pertanyaan dari teks"""
        questions = []
        
        # Pattern untuk mendeteksi soal (bisa disesuaikan)
        question_patterns = [
            r'(\d+)\.\s*(.*?)(?=\d+\.|$)',  # Soal bernomor
            r'Soal\s*(\d+)\s*[:\.]?\s*(.*?)(?=Soal\s*\d+|$)',  # Format "Soal 1:"
            r'(\d+)\)\s*(.*?)(?=\d+\)|$)',  # Soal dengan kurung
        ]
        
        for pattern in question_patterns:
            matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
            if matches:
                for match in matches:
                    if len(match) >= 2:
                        question_num = match[0].strip()
                        question_text = match[1].strip()
                        
                        if len(question_text) > 10:  # Filter pertanyaan yang terlalu pendek
                            # Ekstrak pilihan jawaban
                            choices = self.extract_choices(question_text)
                            # print(choices)
                            # Bersihkan teks pertanyaan dari pilihan
                            clean_question = self.clean_question_text(question_text)
                            
                            questions.append({
                                'question_number': question_num,
                                'question_text': clean_question,
                                'choices': choices
                            })
                break  # Gunakan pattern pertama yang berhasil
        
        return questions
    
    def extract_choices(self, text: str) -> List[Dict]:
        """Ekstrak pilihan jawaban dari teks"""
        choices = []
        
        # Pattern untuk pilihan (A, B, C, D, dll.)
        choice_patterns = [
            r'([A-E])\.\s*(.*?)(?=[A-E]\.|$)',
            r'([A-E])\)\s*(.*?)(?=[A-E]\)|$)',
            r'([a-e])\.\s*(.*?)(?=[a-e]\.|$)',
            r'([a-e])\)\s*(.*?)(?=[a-e]\)|$)',
        ]
        
        for pattern in choice_patterns:
            matches = re.findall(pattern, text, re.DOTALL | re.IGNORECASE)
            if matches and len(matches) >= 2:  # Minimal 2 pilihan
                for match in matches:
                    choice_letter = match[0].upper()
                    choice_text = match[1].strip()
                    # print(choice_text)
                    if choice_text:
                        choices.append({
                            'letter': choice_letter,
                            'text': choice_text
                        })
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
            cleaned_text = re.sub(pattern, '', cleaned_text, flags=re.DOTALL | re.IGNORECASE)
        
        return cleaned_text.strip()
    
    def process_pdf(self, pdf_path: str) -> pd.DataFrame:
        """Proses PDF dan ekstrak semua data"""
        print(f"Memproses PDF: {pdf_path}")
        
        # Ekstrak teks dari semua halaman
        page_texts = self.extract_text_from_pdf(pdf_path)
        
        for page_num, text in enumerate(page_texts):
            print(f"Memproses halaman {page_num + 1}...")
            
            # Parse pertanyaan dari teks
            questions = self.parse_questions(text)
            
            # Ekstrak gambar
            images = self.extract_images_from_pdf(pdf_path, page_num)
            
            # Ekstrak tabel
            tables = self.extract_tables_from_pdf(pdf_path, page_num)
            
            # Gabungkan data untuk setiap pertanyaan
            for i, question in enumerate(questions):
                # Tentukan gambar dan tabel yang terkait dengan pertanyaan ini
                question_images = images if images else []
                question_tables = tables if tables else []
                
                # Buat record data
                record = {
                    'page_number': page_num + 1,
                    'question_number': question['question_number'],
                    'question_text': question['question_text'],
                    'choices_json': json.dumps(question['choices'], ensure_ascii=False) if question['choices'] else None,
                    'images_json': json.dumps(question_images, ensure_ascii=False) if question_images else None,
                    'tables_json': json.dumps(question_tables, ensure_ascii=False) if question_tables else None,
                    'raw_text': text[:500] + "..." if len(text) > 500 else text  # Sample dari teks mentah
                }
                
                self.questions_data.append(record)
        # print(self.questions_data)
        # Konversi ke DataFrame
        # df = pd.DataFrame(self.questions_data)
        return self.questions_data
    
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

def mulai_ektrak(url):
    """Fungsi utama untuk menjalankan ekstraksi"""
    
    # Inisialisasi extractor
    extractor = PDFQuestionExtractor()
    
    # Path ke file PDF (ganti dengan path yang sesuai)
    pdf_path = "dokumen.pdf" if url is None else url  # Ganti dengan path file PDF Anda
    
    if not os.path.exists(pdf_path):
        print(f"File PDF tidak ditemukan: {pdf_path}")
        print("Silakan ganti variabel 'pdf_path' dengan path yang benar")
        return
    
    try:
        # Proses PDF
        df = extractor.process_pdf(pdf_path)
        return df
        if df.empty:
            print("Tidak ada data yang berhasil diekstrak")
            return
        
        # Tampilkan ringkasan hasil
        print(f"\nHasil Ekstraksi:")
        print(f"Total pertanyaan diekstrak: {len(df)}")
        print(f"Halaman yang diproses: {df['page_number'].nunique()}")
        
        # Tampilkan preview data
        print("\nPreview data:")
        print(df[['page_number', 'question_number', 'question_text']].head())
        
        # Simpan hasil
        # extractor.save_to_csv(df, "hasil_ekstraksi.csv")
        # extractor.save_to_excel(df, "hasil_ekstraksi.xlsx")
        # extractor.save_to_database(df, "hasil_ekstraksi.db")
        
        # Tampilkan contoh data JSON
        if not df['choices_json'].isna().all():
            print("\nContoh pilihan jawaban (JSON):")
            sample_choices = df['choices_json'].dropna().iloc[0]
            print(sample_choices)
        
        if not df['images_json'].isna().all():
            print(f"\nJumlah gambar ditemukan: {df['images_json'].notna().sum()}")
        
        if not df['tables_json'].isna().all():
            print(f"Jumlah tabel ditemukan: {df['tables_json'].notna().sum()}")
            
    except Exception as e:
        print(f"Error dalam proses ekstraksi: {e}")

# Fungsi utilitas untuk membaca hasil
def read_extracted_data(source="csv"):
    """Membaca data hasil ekstraksi"""
    if source == "csv":
        return pd.read_csv("hasil_ekstraksi.csv")
    elif source == "excel":
        return pd.read_excel("hasil_ekstraksi.xlsx")
    elif source == "database":
        conn = sqlite3.connect("hasil_ekstraksi.db")
        df = pd.read_sql_query("SELECT * FROM questions", conn)
        conn.close()
        return df

def parse_json_column(df: pd.DataFrame, column_name: str):
    """Parse kolom JSON kembali menjadi objek Python"""
    def safe_json_loads(x):
        if pd.isna(x):
            return None
        try:
            return json.loads(x)
        except:
            return None
    
    df[column_name + '_parsed'] = df[column_name].apply(safe_json_loads)
    return df

# if __name__ == "__main__":
#     # Install dependencies yang diperlukan:
#     print("Pastikan Anda telah menginstall dependencies berikut:")
#     print("pip install PyPDF2 PyMuPDF pandas pillow openpyxl")
#     print("\nUntuk ekstraksi tabel (opsional, pilih salah satu atau keduanya):")
#     print("pip install 'camelot-py[base]'  # Untuk camelot")
#     print("pip install tabula-py           # Untuk tabula")
#     print("\nUntuk Ubuntu/Debian (jika menggunakan camelot):")
#     print("apt-get install python3-tk ghostscript")
#     print("\nCatatan: Jika tidak ada library tabel, script akan tetap berjalan")
#     print("dengan ekstraksi tabel sederhana dari pattern teks.")
#     print("\n" + "="*50)
    
#     main()

