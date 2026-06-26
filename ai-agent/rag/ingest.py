from pathlib import Path

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

DATA_PATH = Path("../../docs/knowledge-base").resolve()

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

documents = []

for file in DATA_PATH.rglob("*.md"):
    print(f"Chargement : {file}")
    loader = TextLoader(str(file), encoding="utf-8")
    documents.extend(loader.load())

print(f"Documents chargés : {len(documents)}")

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

chunks = splitter.split_documents(documents)

print(f"Chunks créés : {len(chunks)}")

db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

db.add_documents(chunks)

print(f"{len(chunks)} chunks indexés avec succès.")