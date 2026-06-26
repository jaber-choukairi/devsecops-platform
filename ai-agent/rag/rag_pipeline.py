from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_ollama import ChatOllama

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

llm = ChatOllama(model="mistral")

while True:

    question = input("\nQuestion : ")

    docs = db.similarity_search(question, k=3)

    context = "\n\n".join(
        [doc.page_content for doc in docs]
    )

    prompt = f"""
Tu es un expert DevSecOps.

Réponds uniquement à partir du contexte suivant.

CONTEXTE :
{context}

QUESTION :
{question}
"""

    response = llm.invoke(prompt)

    print("\nRéponse :\n")
    print(response.content)