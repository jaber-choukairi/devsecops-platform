import json
from typing import List, Dict

class TrivyAnalyzer:
    """Analyse les rapports Trivy JSON et extrait les vulnérabilités critiques"""

    SEVERITY_ORDER = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}

    def analyze(self, report_path: str) -> List[Dict]:
        """Lit le rapport Trivy et retourne les vulnérabilités CRITICAL et HIGH"""
        try:
            with open(report_path, 'r', encoding='utf-8') as f:
                report = json.load(f)
        except FileNotFoundError:
            print(f"   ⚠️  Rapport Trivy non trouvé : {report_path}")
            return self._generate_sample_vulnerabilities()
        except json.JSONDecodeError as e:
            print(f"   ❌ Erreur JSON : {e}")
            return []

        vulnerabilities = []

        # Parcourir les résultats Trivy
        results = report.get('Results', [])
        for result in results:
            target = result.get('Target', 'unknown')
            vulns = result.get('Vulnerabilities', []) or []

            for vuln in vulns:
                severity = vuln.get('Severity', 'UNKNOWN')

                # Ne garder que CRITICAL et HIGH
                if severity not in ['CRITICAL', 'HIGH']:
                    continue

                cvss_score = 0.0
                cvss_data = vuln.get('CVSS', {})
                for source in cvss_data.values():
                    v3_score = source.get('V3Score', 0)
                    if v3_score > cvss_score:
                        cvss_score = v3_score

                vulnerabilities.append({
                    'cve_id': vuln.get('VulnerabilityID', 'UNKNOWN'),
                    'package': vuln.get('PkgName', 'unknown'),
                    'installed_version': vuln.get('InstalledVersion', 'unknown'),
                    'fixed_version': vuln.get('FixedVersion', 'non disponible'),
                    'severity': severity,
                    'cvss_score': cvss_score,
                    'title': vuln.get('Title', 'No title'),
                    'description': vuln.get('Description', 'No description')[:500],
                    'target': target,
                    'recommendation': None,
                    'ticket_id': None
                })

        # Trier par sévérité puis par score CVSS
        vulnerabilities.sort(
            key=lambda x: (self.SEVERITY_ORDER.get(x['severity'], 99), -x['cvss_score'])
        )

        print(f"   📊 Rapport analysé : {len(vulnerabilities)} vulnérabilités CRITICAL/HIGH")
        return vulnerabilities

    def _generate_sample_vulnerabilities(self) -> List[Dict]:
        """Génère des exemples si pas de rapport réel — pour la démo"""
        return [
            {
                'cve_id': 'CVE-2024-21626',
                'package': 'runc',
                'installed_version': '1.1.11',
                'fixed_version': '1.1.12',
                'severity': 'CRITICAL',
                'cvss_score': 8.6,
                'title': 'Container escape vulnerability in runc',
                'description': 'A critical vulnerability in runc allows container escape.',
                'target': 'devsecops-backend:latest',
                'recommendation': None,
                'ticket_id': None
            },
            {
                'cve_id': 'CVE-2024-38816',
                'package': 'spring-webmvc',
                'installed_version': '6.1.10',
                'fixed_version': '6.1.14',
                'severity': 'HIGH',
                'cvss_score': 7.5,
                'title': 'Path traversal in Spring MVC',
                'description': 'Path traversal vulnerability in Spring MVC.',
                'target': 'devsecops-backend:latest',
                'recommendation': None,
                'ticket_id': None
            }
        ]