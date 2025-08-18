from pydantic import BaseModel, Field
from typing import List, Dict

class SoalPilihanGanda(BaseModel):
    tipe_soal: str = "pilihan_ganda"
    pertanyaan: str
    pilihan: Dict[str, str]
    jawaban_benar: str = Field(..., pattern="^(A|B|C|D)$")
    tingkat_kesulitan: str = Field(..., pattern="^(mudah|sedang|sulit)$")

class DaftarSoal(BaseModel):
    soal: List[SoalPilihanGanda]
