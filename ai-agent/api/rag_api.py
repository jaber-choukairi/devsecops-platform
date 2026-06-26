from fastapi import FastAPI
from pydantic import BaseModel

from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_ollama import ChatOllama

app = FastAPI()

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = Chroma(
    persist_directory="../rag/chroma_db",
    embedding_function=embeddings
)

import os

llm = ChatOllama(
    model="mistral",
    base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
)


class Question(BaseModel):
    question: str


@app.post("/ask")
def ask(data: Question):

    docs = db.similarity_search(data.question, k=3)

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    prompt = f"""
Tu es un expert DevSecOps.

CONTEXTE:
{context}

QUESTION:
{data.question}
"""

    response = llm.invoke(prompt)

    return {
        "question": data.question,
        "answer": response.content
    }