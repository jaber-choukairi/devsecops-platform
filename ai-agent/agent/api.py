import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from main import DevSecOpsAgent
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="DevSecOps AI Agent API",
    description="Agent IA pour l'analyse de vulnérabilités et la création de tickets",
    version="1.0.0"
)

# CORS pour React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = DevSecOpsAgent()
last_result = None   # Cache du dernier résultat

class AnalyzeRequest(BaseModel):
    report_path: Optional[str] = None

@app.get("/")
def root():
    return {"status": "ok", "message": "DevSecOps AI Agent API"}

@app.get("/health")
def health():
    return {"status": "healthy", "agent": "ready"}

@app.post("/agent/analyze")
def analyze(request: AnalyzeRequest = None):
    """Déclenche l'analyse complète : Trivy → RAG → Tickets → Score"""
    global last_result

    report_path = None
    if request and request.report_path:
        report_path = request.report_path
    else:
        report_path = os.getenv("TRIVY_REPORT_PATH", "../reports/trivy-report.json")

    try:
        result = agent.run(report_path)
        last_result = result
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agent/last-result")
def get_last_result():
    """Retourne le dernier résultat d'analyse"""
    if not last_result:
        return {"message": "Aucune analyse effectuée", "score": None}
    return last_result

@app.get("/agent/score")
def get_score():
    """Retourne uniquement le score de sécurité"""
    if not last_result:
        return {"score": None, "message": "Lance d'abord une analyse"}
    return {
        "score": last_result.get("score"),
        "total_vulnerabilities": last_result.get("total_vulnerabilities", 0),
        "critical_count": last_result.get("critical_count", 0),
        "high_count": last_result.get("high_count", 0)
    }

@app.get("/agent/vulnerabilities")
def get_vulnerabilities():
    """Retourne la liste des vulnérabilités avec recommandations"""
    if not last_result:
        return []
    return last_result.get("vulnerabilities", [])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api=app", host="0.0.0.0", port=8001, reload=True)