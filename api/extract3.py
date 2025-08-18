import re
import PyPDF2
import fitz  # PyMuPDF
import pandas as pd
from typing import List, Dict, Optional

class PDFQuestionExtractor:
    def extract_text_from_pdf(self, pdf_path: str) -> List[Dict]:
        """Ekstrak teks, tabel, dan gambar dari semua halaman PDF"""
        pages_data = []
        
        try:
            # Coba ekstrak dengan PyMuPDF untuk mendapatkan lebih banyak informasi
            doc = fitz.open(pdf_path)
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                page_dict = {
                    'text': page.get_text(),
                    'tables': self._extract_tables(page),
                    'images': self._extract_images(page),
                    'page_number': page_num + 1
                }
                pages_data.append(page_dict)
            doc.close()
            
        except Exception as e:
            print(f"Error extracting with PyMuPDF: {e}")
            # Fallback ke PyPDF2 untuk ekstrak teks dasar
            try:
                with open(pdf_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page_num in range(len(pdf_reader.pages)):
                        page_dict = {
                            'text': pdf_reader.pages[page_num].extract_text(),
                            'tables': [],
                            'images': [],
                            'page_number': page_num + 1
                        }
                        pages_data.append(page_dict)
            except Exception as e2:
                print(f"Fallback error: {e2}")
        
        return pages_data
    
    def _extract_tables(self, page) -> List[str]:
        """Ekstrak tabel dari halaman PDF (implementasi dasar)"""
        # Ini adalah implementasi sederhana. Untuk ekstraksi tabel yang lebih baik,
        # pertimbangkan menggunakan library seperti camelot atau pdfplumber
        tables = []
        text = page.get_text()
        
        # Deteksi tabel sederhana berdasarkan garis atau format teks
        table_patterns = [
            r'(\+[-]+\+[^\+]+\+[-]+\+)',  # Format dengan garis
            r'(\|.*\|)',  # Format dengan pipa
            r'([^\n]+\n[-]+\n[^\n]+)'  # Format dengan garis bawah header
        ]
        
        for pattern in table_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                if len(match) > 0 and isinstance(match, str):
                    tables.append(match.strip())
        
        return tables
    
    def _extract_images(self, page) -> List[Dict]:
        """Ekstrak informasi gambar dari halaman PDF"""
        images = []
        for img in page.get_images():
            images.append({
                'xref': img[0],
                'width': img[2],
                'height': img[3]
            })
        return images
    
    def parse_questions(self, page_data: Dict) -> List[Dict]:
        """Parse pertanyaan dari data halaman"""
        questions = []
        text = page_data['text']
        
        # Pattern untuk mendeteksi soal
        question_pattern = r'(\d+)\.\s*(.*?)(?=\d+\.|$)'
        matches = re.findall(question_pattern, text, re.DOTALL)
        
        for match in matches:
            if len(match) >= 2:
                question_num = match[0].strip()
                question_text = match[1].strip()
                
                # Cari tabel yang mungkin terkait dengan soal ini
                related_tables = self._find_related_tables(question_num, page_data)
                related_images = self._find_related_images(question_num, page_data)
                
                # Ekstrak pilihan jawaban
                choices = self.extract_choices(question_text)
                
                # Bersihkan teks pertanyaan dari pilihan
                clean_question = self.clean_question_text(question_text)
                
                questions.append({
                    'question_number': question_num,
                    'question_text': clean_question,
                    'tables': related_tables,
                    'images': related_images,
                    'choices': choices,
                    'page_number': page_data['page_number']
                })
        
        return questions
    
    def _find_related_tables(self, question_num: str, page_data: Dict) -> List[str]:
        """Temukan tabel yang mungkin terkait dengan soal tertentu"""
        related_tables = []
        text = page_data['text']
        
        # Cari posisi soal dalam teks
        question_pos = text.find(f"{question_num}.")
        if question_pos == -1:
            return related_tables
            
        # Cari tabel yang muncul setelah soal ini
        for table in page_data['tables']:
            table_pos = text.find(table)
            if table_pos > question_pos:
                related_tables.append(table)
        
        return related_tables
    
    def _find_related_images(self, question_num: str, page_data: Dict) -> List[Dict]:
        """Temukan gambar yang mungkin terkait dengan soal tertentu"""
        # Dalam implementasi nyata, ini memerlukan analisis layout PDF
        # Di sini kita hanya mengembalikan semua gambar di halaman yang sama
        return page_data['images']
    
    def extract_choices(self, text: str) -> List[Dict]:
        """Ekstrak pilihan jawaban dari teks"""
        choices = []
        choice_pattern = r'([A-E])\.\s*(.*?)(?=[A-E]\.|$)'
        matches = re.findall(choice_pattern, text, re.DOTALL | re.IGNORECASE)
        
        for match in matches:
            if len(match) >= 2:
                choice_letter = match[0].upper()
                choice_text = match[1].strip()
                if choice_text:
                    choices.append({
                        'letter': choice_letter,
                        'text': choice_text
                    })
        
        # Jika tidak ditemukan dengan pola standar, coba pola alternatif
        if not choices:
            alt_pattern = r'([A-E])\)\s*(.*?)(?=[A-E]\)|$)'
            alt_matches = re.findall(alt_pattern, text, re.DOTALL | re.IGNORECASE)
            for match in alt_matches:
                if len(match) >= 2:
                    choice_letter = match[0].upper()
                    choice_text = match[1].strip()
                    if choice_text:
                        choices.append({
                            'letter': choice_letter,
                            'text': choice_text
                        })
        
        return choices
    
    def clean_question_text(self, text: str) -> str:
        """Bersihkan teks pertanyaan dari pilihan jawaban"""
        # Hapus pilihan jawaban dari teks pertanyaan
        cleaned_text = re.sub(r'([A-E][\.\)]\s*.*?)(?=[A-E][\.\)]|$)', '', text, flags=re.DOTALL | re.IGNORECASE)
        return cleaned_text.strip()
    
    def process_pdf(self, pdf_path: str) -> pd.DataFrame:
        """Proses PDF dan ekstrak semua data pertanyaan"""
        print(f"Memproses PDF: {pdf_path}")
        
        # Ekstrak data dari semua halaman
        pages_data = self.extract_text_from_pdf(pdf_path)
        all_questions = []
        
        for page_data in pages_data:
            print(f"Memproses halaman {page_data['page_number']}...")
            questions = self.parse_questions(page_data)
            all_questions.extend(questions)
        
        # Konversi ke DataFrame
        print(all_questions)
        df = pd.DataFrame(all_questions)
        return df

# Contoh penggunaan
if __name__ == "__main__":
    extractor = PDFQuestionExtractor()
    df = extractor.process_pdf("kumpulan_soal.pdf")
    
    # Cetak hasil untuk soal pertama
    # if not df.empty:

        # print(df)
        # for hasil in df:
        #     # print(hasil)
        #     print(f"Nomor Soal: {hasil['question_number']}")
        #     print(f"Teks Soal: {hasil['question_text']}")

        # first_question = df.iloc[2]
        # print("\nContoh hasil ekstraksi untuk soal pertama:")
        # print(f"Nomor Soal: {first_question['question_number']}")
        # print(f"Teks Soal: {first_question['question_text']}")
        
        # if first_question['tables']:
        #     print("\nTabel terkait:")
        #     for table in first_question['tables']:
        #         print(table)
        
        # if first_question['images']:
        #     print(f"\nGambar terkait: {len(first_question['images'])} gambar ditemukan")
        
        # print("\nPilihan Jawaban:")
        # for choice in first_question['choices']:
        #     print(f"{choice['letter']}. {choice['text']}")