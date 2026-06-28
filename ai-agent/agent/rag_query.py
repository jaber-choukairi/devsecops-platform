import os
import requests
from dotenv import load_dotenv

load_dotenv()

class RAGQuery:
    """Interroge la base RAG (ChromaDB + Ollama) pour obtenir des recommandations"""

    def __init__(self):
        self.ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "mistral")
        self.chroma_path = os.getenv("CHROMA_PATH", "../rag/chroma_db")
        self._init_chroma()

    def _init_chroma(self):
        """Initialise le client ChromaDB"""
        try:
            import chromadb
            self.chroma_client = chromadb.PersistentClient(path=self.chroma_path)
            self.collection = self.chroma_client.get_or_create_collection(
                name="security_docs",
                metadata={"hnsw:space": "cosine"}
            )
            print(f"   ✅ ChromaDB connecté — {self.collection.count()} documents indexés")
        except Exception as e:
            print(f"   ⚠️  ChromaDB non disponible : {e}")
            self.collection = None

    def query(self, cve_id: str, description: str, package: str) -> str:
        """Interroge le RAG et génère une recommandation"""

        # Étape 1 — Chercher dans ChromaDB
        context = self._search_chroma(cve_id, description)

        # Étape 2 — Générer avec Ollama
        recommendation = self._generate_with_ollama(
            cve_id=cve_id,
            description=description,
            package=package,
            context=context
        )

        return recommendation

    def _search_chroma(self, cve_id: str, description: str) -> str:
        """Recherche sémantique dans ChromaDB"""
        if not self.collection or self.collection.count() == 0:
            return ""

        try:
            results = self.collection.query(
                query_texts=[f"{cve_id} {description}"],
                n_results=3
            )
            documents = results.get('documents', [[]])[0]
            return "\n".join(documents)
        except Exception as e:
            print(f"   ⚠️  Erreur ChromaDB query : {e}")
            return ""

    def _generate_with_ollama(self, cve_id: str, description: str,
                               package: str, context: str) -> str:
        """Génère une recommandation avec Ollama"""

        prompt = f"""Tu es un expert en cybersécurité DevSecOps.

Vulnérabilité détectée :
- CVE : {cve_id}
- Package affecté : {package}
- Description : {description}

{f"Contexte documentaire : {context}" if context else ""}

Génère une recommandation de remédiation claire et concise en français.
Inclus :
1. Explication simple de la vulnérabilité
2. Impact potentiel
3. Action corrective précise (mise à jour, configuration, patch)
4. Priorité (immédiate/haute/normale)

Réponse en 3-4 phrases maximum."""

        try:
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"temperature": 0.3, "num_predict": 300}
                },
                timeout=60
            )
            if response.status_code == 200:
                return response.json().get('response', '').strip()
            else:
                return self._fallback_recommendation(cve_id, package)
        except Exception as e:
            print(f"   ⚠️  Ollama non disponible : {e}")
            return self._fallback_recommendation(cve_id, package)

    def _fallback_recommendation(self, cve_id: str, package: str) -> str:
        """Recommandation de secours si Ollama n'est pas disponible"""
        return (f"Vulnérabilité {cve_id} détectée dans {package}. "
                f"Action requise : mettre à jour vers la version corrigée immédiatement. "
                f"Consulter https://nvd.nist.gov/vuln/detail/{cve_id} pour les détails.")