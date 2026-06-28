import os
import re
import requests
from typing import Dict, Optional
from dotenv import load_dotenv

load_dotenv()

class TicketCreator:
    """Crée automatiquement des tickets dans l'application Spring Boot"""

    SEVERITY_TO_PRIORITY = {
        'CRITICAL': 'CRITIQUE',
        'HIGH': 'ELEVE',
        'MEDIUM': 'MOYEN',
        'LOW': 'FAIBLE'
    }

    def __init__(self):
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:8080/api")
        self.username = os.getenv("BACKEND_USERNAME", "admin")
        self.password = os.getenv("BACKEND_PASSWORD", "admin")
        self.session = requests.Session()
        self.session.auth = (self.username, self.password)
        self.session.headers.update({'Content-Type': 'application/json'})

    def _clean_text(self, text: str) -> str:
        """Supprime les emojis et caractères spéciaux problématiques"""
        emoji_pattern = re.compile("["
            u"\U0001F600-\U0001F64F"
            u"\U0001F300-\U0001F5FF"
            u"\U0001F680-\U0001F9FF"
            u"\U00002600-\U000027BF"
            "]+", flags=re.UNICODE)
        text = emoji_pattern.sub('', text)
        text = text.replace('\x00', '').strip()
        return text

    def create_ticket(self, vulnerability: Dict) -> Optional[Dict]:
        """Crée un ticket pour une vulnérabilité détectée"""
        cve_id = vulnerability.get('cve_id', 'UNKNOWN')
        severity = vulnerability.get('severity', 'HIGH')
        package = vulnerability.get('package', 'unknown')
        fixed_version = vulnerability.get('fixed_version', 'non disponible')
        recommendation = vulnerability.get('recommendation', '')
        cvss_score = vulnerability.get('cvss_score', 0)
        priority = self.SEVERITY_TO_PRIORITY.get(severity, 'MOYEN')

        description = (
            f"Vulnerabilite detectee automatiquement par l'agent IA DevSecOps.\n\n"
            f"CVE : {cve_id}\n"
            f"Package : {package}\n"
            f"Version installee : {vulnerability.get('installed_version', 'unknown')}\n"
            f"Version corrigee : {fixed_version}\n"
            f"Score CVSS : {cvss_score}/10\n"
            f"Severite : {severity}\n\n"
            f"Recommandation : {recommendation[:500]}"
        )

        ticket_data = {
            "title": f"[{severity}] {cve_id} - {package}"[:190],
            "description": self._clean_text(description)[:1900],
            "category": "CVE",
            "priority": priority
        }

        try:
            response = self.session.post(
                f"{self.backend_url}/tickets",
                json=ticket_data,
                timeout=30
            )
            if response.status_code in [200, 201]:
                ticket = response.json()
                print(f"   Ticket cree : {ticket.get('id')} - [{priority}] {cve_id}")
                return ticket
            else:
                print(f"   Erreur creation ticket : {response.status_code} - {response.text}")
                return None
        except requests.exceptions.ConnectionError:
            print(f"   Backend inaccessible - ticket non cree pour {cve_id}")
            return None
        except Exception as e:
            print(f"   Erreur inattendue : {e}")
            return None

    def test_connection(self) -> bool:
        """Vérifie que l'API backend est accessible"""
        try:
            response = self.session.get(
                f"{self.backend_url}/tickets",
                timeout=5
            )
            return response.status_code == 200
        except:
            return False