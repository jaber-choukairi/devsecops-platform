import json
import os
from dotenv import load_dotenv
from trivy_analyzer import TrivyAnalyzer
from rag_query import RAGQuery
from ticket_creator import TicketCreator
from score_calculator import ScoreCalculator

load_dotenv()

class DevSecOpsAgent:
    """Agent IA DevSecOps — analyse, recommande et crée des tickets automatiquement"""

    def __init__(self):
        self.trivy_analyzer = TrivyAnalyzer()
        self.rag_query = RAGQuery()
        self.ticket_creator = TicketCreator()
        self.score_calculator = ScoreCalculator()

    def run(self, trivy_report_path: str) -> dict:
        """
        Scénario complet :
        1. Lire rapport Trivy
        2. Extraire CVE CRITICAL/HIGH
        3. Interroger RAG pour chaque CVE
        4. Créer tickets automatiquement
        5. Calculer score de sécurité
        """
        print("=" * 60)
        print("🤖 DevSecOps AI Agent — Démarrage de l'analyse")
        print("=" * 60)

        # Étape 1 — Analyser le rapport Trivy
        print("\n📋 Étape 1 : Analyse du rapport Trivy...")
        vulnerabilities = self.trivy_analyzer.analyze(trivy_report_path)
        print(f"   → {len(vulnerabilities)} vulnérabilités CRITICAL/HIGH trouvées")

        if not vulnerabilities:
            print("   ✅ Aucune vulnérabilité critique détectée !")
            return {"score": 100, "vulnerabilities": [], "tickets_created": 0}

        # Étape 2 — Pour chaque vulnérabilité, interroger le RAG
        print("\n🔍 Étape 2 : Interrogation du RAG pour chaque CVE...")
        results = []
        tickets_created = 0

        for vuln in vulnerabilities:
            print(f"\n   🔎 Analyse de {vuln['cve_id']} ({vuln['severity']})...")

            # Interroger le RAG
            recommendation = self.rag_query.query(
                cve_id=vuln['cve_id'],
                description=vuln['description'],
                package=vuln['package']
            )
            vuln['recommendation'] = recommendation
            print(f"   → Recommandation générée")

            # Étape 3 — Créer un ticket
            print(f"   🎫 Création du ticket pour {vuln['cve_id']}...")
            ticket = self.ticket_creator.create_ticket(vuln)
            if ticket:
                vuln['ticket_id'] = ticket.get('id')
                tickets_created += 1
                print(f"   ✅ Ticket créé : {ticket.get('id')}")
            else:
                print(f"   ⚠️  Échec création ticket")

            results.append(vuln)

        # Étape 4 — Calculer le score de sécurité
        print("\n📊 Étape 4 : Calcul du score de sécurité...")
        score = self.score_calculator.calculate(vulnerabilities)
        print(f"   → Score de sécurité : {score}/100")

        # Résumé final
        summary = {
            "score": score,
            "total_vulnerabilities": len(vulnerabilities),
            "critical_count": sum(1 for v in vulnerabilities if v['severity'] == 'CRITICAL'),
            "high_count": sum(1 for v in vulnerabilities if v['severity'] == 'HIGH'),
            "tickets_created": tickets_created,
            "vulnerabilities": results
        }

        print("\n" + "=" * 60)
        print(f"✅ Analyse terminée !")
        print(f"   Score sécurité : {score}/100")
        print(f"   Vulnérabilités : {len(vulnerabilities)}")
        print(f"   Tickets créés  : {tickets_created}")
        print("=" * 60)

        return summary


if __name__ == "__main__":
    agent = DevSecOpsAgent()
    report_path = os.getenv("TRIVY_REPORT_PATH", "../reports/trivy-report.json")
    result = agent.run(report_path)
    print("\n📄 Résultat JSON :")
    print(json.dumps(result, indent=2, ensure_ascii=False))