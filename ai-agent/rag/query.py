from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)

while True:

    question = input("\nQuestion : ")

    docs = db.similarity_search(question, k=3)

    print("\nDocuments trouvés :\n")

    for doc in docs:
        print(doc.page_content)
        print("\n-------------------\n")