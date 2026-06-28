from typing import List, Dict

class ScoreCalculator:
    """Calcule un score de sécurité entre 0 et 100"""

    def calculate(self, vulnerabilities: List[Dict]) -> int:
        if not vulnerabilities:
            return 100

        # Pénalités par sévérité
        PENALTIES = {
            'CRITICAL': 25,
            'HIGH': 10,
            'MEDIUM': 3,
            'LOW': 1
        }

        total_penalty = 0
        for vuln in vulnerabilities:
            severity = vuln.get('severity', 'LOW')
            total_penalty += PENALTIES.get(severity, 1)

        score = max(0, 100 - total_penalty)
        return score