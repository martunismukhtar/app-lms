from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import PGVector
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
import psycopg2
import uuid

from dotenv import load_dotenv

load_dotenv()

# 1. Load PDF
def load_pdf(pdf_path: str):
    loader = PyPDFLoader(file_path=pdf_path)
    return loader.load()

# 2. Parallelized Chunking
def chunk_documents_parallel(documents, chunk_size=1000, chunk_overlap=30, separator="\n", max_workers=4):
    """
    Splits a list of documents into chunks using a CharacterTextSplitter.
    
    Each document is split into chunks in parallel using a ThreadPoolExecutor.
    
    Parameters
    ----------
    documents : List[str]
        List of documents to split.
    chunk_size : int, optional
        The size of the chunks. Defaults to 1000.
    chunk_overlap : int, optional
        The overlap between chunks. Defaults to 30.
    separator : str, optional
        The separator to use when splitting. Defaults to "\n".
    max_workers : int, optional
        The number of workers to use in the ThreadPoolExecutor. Defaults to 4.
    
    Returns
    -------
    chunks : List[str]
        List of chunks.
    """
    text_splitter = CharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separator=separator
    )
    
    chunks = []
    def split_doc(doc):
        return text_splitter.split_documents([doc])
    
    max_workers = os.cpu_count() or max_workers
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(split_doc, doc) for doc in documents]
        for future in as_completed(futures):
            chunks.extend(future.result())
    return chunks

# 3. Store ke langchain_postgres PGVector
def store_documents_to_pgvector(docs: list, batch_size: int = 100, collection_name: str = "documents"):
    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
    connection_string = os.getenv("LANGCHAIN_POSTGRES_CONNECTION_STRING")

    total = len(docs)
    print(f"[store] Total chunks: {total}")

    for i in range(0, total, batch_size):
        batch_docs = docs[i:i + batch_size]
        print(f"[store] Processing batch {i} to {i + len(batch_docs) - 1}")
        PGVector.from_documents(
            documents=batch_docs,
            embedding=embeddings,
            connection_string=connection_string,
            collection_name=collection_name
        )

# 4. Update dokumen jika ada yang sudah pernah dimasukkan sebelumnya
def update_documents_pgvector(docs_baru, collection_name="documents"):
    connection_string = os.getenv("LANGCHAIN_POSTGRES_CONNECTION_STRING")
    embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")

    sumber_baru = list({doc.metadata.get("source") for doc in docs_baru if "source" in doc.metadata})
    # Koneksi manual ke PostgreSQL
    with psycopg2.connect(
        dbname=os.getenv("PG_DBNAME"),
        user=os.getenv("PG_USER"),
        password=os.getenv("PG_PASSWORD"),
        host=os.getenv("PG_HOST"),
    ) as conn:
        with conn.cursor() as cur:
            for source in sumber_baru:
                print(f"[update] Menghapus dokumen dengan source: {source}")

                # Hapus vektor berdasarkan metadata 'source'
                cur.execute("""
                    DELETE FROM langchain_pg_embedding
                    WHERE cmetadata->>'source' = %s
                      AND collection_id = (
                        SELECT uuid FROM langchain_pg_collection WHERE name = %s
                      )
                """, (source, collection_name))
                conn.commit()
        print(f"[update] Selesai menghapus dokumen lama")

    # Simpan dokumen baru
    PGVector.from_documents(
        documents=docs_baru,
        embedding=embeddings,
        connection_string=connection_string,
        collection_name=collection_name
    )

# 5. Proses lengkap dari PDF
def process_pdf_parallel_batch(pdf_path: str, mapel: str="default", semester: str="default", kelas: int=1, org:str="default"):
    documents = load_pdf(pdf_path)
    chunks = chunk_documents_parallel(documents)
    # Tambahkan metadata topik
    for chunk in chunks:
        if not chunk.metadata:
            chunk.metadata = {}
        chunk.metadata["mapel"] = mapel
        chunk.metadata["semester"] = semester
        chunk.metadata["kelas"] = kelas
        chunk.metadata["organization"] = org
        
        chunk.metadata = sanitize_metadata(chunk.metadata)
    store_documents_to_pgvector(chunks)
    return len(chunks)


def sanitize_metadata(metadata: dict) -> dict:
    def convert(value):
        if isinstance(value, uuid.UUID):
            return str(value)
        elif isinstance(value, dict):
            return {k: convert(v) for k, v in value.items()}
        elif isinstance(value, list):
            return [convert(v) for v in value]
        else:
            return value
    return convert(metadata)