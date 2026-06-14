# 🛡️ Plateforme DevSecOps Intelligente

> **Projet 2026**  
> Détection, Analyse et Aide à la Remédiation des Vulnérabilités dans une Application Cloud-Native avec un Agent IA basé sur RAG

---

## 📌 Présentation

Cette plateforme combine **DevSecOps** et **Intelligence Artificielle** pour automatiser la détection et l'analyse des vulnérabilités de sécurité tout au long du cycle de développement d'une application cloud-native.

L'application web de gestion de tickets d'incidents sert de cas d'usage principal, enrichie par un **agent IA RAG** (Retrieval-Augmented Generation) capable d'analyser les rapports de scan, générer des recommandations de remédiation et créer automatiquement des tickets critiques.

---

## 🏗️ Architecture globale

```
┌─────────────────────────────────────────────────────────────────┐
│                        PIPELINE CI/CD                           │
│    GitHub Actions → SonarQube → Trivy → OWASP ZAP → K8s        │
└─────────────────────────┬───────────────────────────────────────┘
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
 ┌───────────┐     ┌──────────────┐   ┌───────────────┐
 │ Frontend  │     │   Backend    │   │  Agent IA RAG │
 │  React 18 │◄───►│ Spring Boot  │◄──│  LangChain +  │
 │  + Vite   │     │   Java 17    │   │   ChromaDB    │
 └───────────┘     └──────┬───────┘   └───────────────┘
                          │
                   ┌──────▼───────┐
                   │   Supabase   │
                   │  PostgreSQL  │
                   └──────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
   ┌──────────┐    ┌───────────┐    ┌───────────┐
   │Prometheus│    │  Grafana  │    │   Loki    │
   │ Métriques│    │Dashboards │    │   Logs    │
   └──────────┘    └───────────┘    └───────────┘
```

---

## 🧩 Modules du projet

| # | Module | Description | Statut |
|---|--------|-------------|--------|
| 0 | Préparation | Environnement, Git, Docker, structure projet | ✅ Terminé |
| 1 | Application web | CRUD tickets, API REST, dashboard | ✅ Terminé |
| 2 | Frontend | Interface React, connexion API | ✅ Terminé |
| 3 | Dockerisation | Dockerfiles, Nginx, Docker Compose | 🔄 En cours |
| 4 | Pipeline CI/CD | GitHub Actions, build, tests, Docker Hub | 🔜 À venir |
| 5 | DevSecOps | SonarQube, Trivy, OWASP ZAP | 🔜 À venir |
| 6 | Kubernetes | Déploiement cloud-native, Ingress | 🔜 À venir |
| 7 | Monitoring | Prometheus, Grafana, Loki, Alertmanager | 🔜 À venir |
| 8 | Base RAG | ChromaDB, LangChain, docs OWASP/CVE | 🔜 À venir |
| 9 | Agent IA | Analyse auto, création tickets, scoring | 🔜 À venir |

---

## 🛠️ Stack technologique

### Application

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Spring Boot 4 (Java 17) |
| Base de données | Supabase (PostgreSQL hébergé) |
| Auth (phase actuelle) | Basic Auth (`admin/admin`) |
| Auth (phase suivante) | JWT |
| Proxy | Nginx (multi-stage Docker) |

### Infrastructure & DevSecOps

| Outil | Rôle |
|-------|------|
| Docker + Docker Compose | Conteneurisation |
| Kubernetes (Minikube / K3s) | Orchestration |
| GitHub Actions | CI/CD |
| SonarQube | SAST — Analyse statique du code |
| Trivy (Aqua Security) | Scan CVE des images Docker |
| OWASP ZAP | DAST — Tests dynamiques web |

### IA & Observabilité

| Outil | Rôle |
|-------|------|
| LangChain + ChromaDB | Orchestration RAG + base vectorielle |
| Ollama (Mistral / Llama 3) | LLM local |
| Prometheus + Grafana | Métriques et dashboards |
| Loki + Promtail | Centralisation des logs |
| Alertmanager | Routage et gestion des alertes |

---

## 📁 Structure du projet

```
devsecops-platform/
├── backend/                    # Spring Boot (Java 17)
│   ├── src/
│   │   └── main/
│   │       ├── java/com/devsecops/
│   │       │   ├── controller/     # REST Controllers
│   │       │   ├── service/        # Business logic
│   │       │   ├── repository/     # JPA Repositories
│   │       │   ├── model/          # Entités JPA
│   │       │   └── dto/            # Data Transfer Objects
│   │       └── resources/
│   │           └── application.properties
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/         # Composants réutilisables
│   │   ├── pages/              # Pages principales
│   │   ├── services/           # Appels API (Axios)
│   │   └── App.jsx
│   ├── Dockerfile
│   └── vite.config.js
│
├── nginx/                      # Reverse proxy
│   └── nginx.conf
│
├── k8s/                        # Manifests Kubernetes (Phase 6)
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   └── ingress.yaml
│
├── ci/                         # Pipelines CI/CD (Phase 4-5)
│   └── .github/workflows/
│       ├── build.yml
│       └── devsecops.yml
│
├── monitoring/                 # Config Prometheus/Grafana (Phase 7)
│   ├── prometheus.yml
│   └── grafana/
│
├── ai-agent/                   # Agent IA RAG (Phase 8-9)
│   ├── knowledge-base/
│   │   ├── owasp-top10.md
│   │   ├── trivy-reports/
│   │   └── sonarqube-reports/
│   ├── agent.py
│   └── rag_config.py
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Lancement rapide

### Prérequis

- Docker Desktop installé et lancé
- Java 17+
- Node.js 18+
- Compte Supabase (base de données cloud gratuite)

### 1. Cloner le projet

```bash
git clone https://github.com/<ton-username>/devsecops-platform.git
cd devsecops-platform
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine :

```env
# Supabase
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_DB_URL=jdbc:postgresql://db.xxxxxxxxxxxx.supabase.co:5432/postgres
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=ton_mot_de_passe
```

### 3. Lancer avec Docker Compose

```bash
docker compose up -d
```

L'application sera disponible sur :

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |

### Identifiants par défaut (phase actuelle)

```
Username : admin
Password : admin
```

---

## 📡 API REST — Endpoints principaux

### Tickets

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/tickets` | Liste tous les tickets |
| `GET` | `/api/tickets/{id}` | Détail d'un ticket |
| `POST` | `/api/tickets` | Créer un ticket |
| `PUT` | `/api/tickets/{id}` | Modifier un ticket |
| `DELETE` | `/api/tickets/{id}` | Supprimer un ticket |
| `GET` | `/api/tickets/statut/{statut}` | Filtrer par statut |
| `GET` | `/api/tickets/priorite/{priorite}` | Filtrer par priorité |
| `GET` | `/api/tickets/search?keyword=xxx` | Recherche par mot-clé |

### Valeurs acceptées

**Priorité :** `FAIBLE` · `MOYEN` · `ELEVE` · `CRITIQUE`

**Statut :** `OUVERT` · `EN_COURS` · `RESOLU` · `FERME`

**Catégorie :** `CVE` · `OWASP` · `INFRASTRUCTURE` · `CODE_QUALITY` · `NETWORK`

---

## 🔄 Pipeline CI/CD DevSecOps (Phase 4-5)

```
Push GitHub
    │
    ▼
Build & Tests unitaires (JUnit)
    │
    ▼
Analyse qualité code → SonarQube
    │   └── Note < B ou bug critique → ❌ BLOQUÉ
    ▼
Scan image Docker → Trivy
    │   └── Vulnérabilité CRITICAL/HIGH → ❌ BLOQUÉ
    ▼
Test sécurité web → OWASP ZAP
    │   └── Alerte HIGH/CRITICAL → ❌ BLOQUÉ
    ▼
Build image Docker + push Docker Hub
    │
    ▼
Déploiement Kubernetes ✅
```

---

## 🤖 Agent IA DevSecOps (Phase 8-9)

**Scénario d'exécution :**

```
Trivy détecte CVE-2024-XXXX CRITICAL
        │
        ▼
Agent lit le rapport JSON
        │
        ▼
Recherche sémantique dans ChromaDB
(docs OWASP + fiches CVE + procédures internes)
        │
        ▼
LLM (Mistral/Llama3) génère une recommandation
        │
        ▼
Ticket CRITIQUE créé automatiquement dans l'app
        │
        ▼
Dashboard mis à jour avec la recommandation
```

**Capacités de l'agent :**

| Entrée | Traitement | Sortie |
|--------|------------|--------|
| Rapport Trivy JSON | Extraction CVE + score CVSS | Liste vulnérabilités classées |
| Rapport SonarQube | Analyse failles qualité | Synthèse + priorités |
| Alertes Prometheus | Détection pattern d'attaque | Rapport d'incident |
| CVE + RAG | Génération LLM | Recommandation en langage naturel |
| Vulnérabilité HIGH/CRITICAL | Automatisation | Ticket créé + assigné |
| Tous rapports combinés | Scoring global | Score de sécurité 0-100 |

---

## 📊 Monitoring (Phase 7)

| Outil | URL (local) | Rôle |
|-------|-------------|------|
| Grafana | http://localhost:3000 | Dashboards visualisation |
| Prometheus | http://localhost:9090 | Collecte métriques |
| Loki | http://localhost:3100 | Centralisation logs |

**Alertes configurées :**
- Backend indisponible
- Taux d'erreurs HTTP 500 > 1%
- CPU > 80%
- Tentatives de connexion suspectes (brute force)
- Latence API élevée

---

## 📋 Exigences non fonctionnelles

| Exigence | Critère cible |
|----------|---------------|
| Pipeline CI/CD | Durée totale < 10 minutes |
| Disponibilité | Uptime > 99% en phase de démo |
| Temps de réponse IA | Recommandation générée < 30 secondes |
| Pertinence RAG | Taux de pertinence > 80% sur jeu de test |
| Sécurité | Aucune vulnérabilité CRITICAL non traitée en production |
| Portabilité | Déploiement complet < 1 heure depuis le repo Git |

---

## 🗺️ Roadmap — Sprints

| Sprint | Semaines | Objectif | Statut |
|--------|----------|----------|--------|
| Sprint 0 | 1-2 | Environnement + Git + Docker | ✅ |
| Sprint 1 | 3-5 | Backend API REST tickets | ✅ |
| Sprint 2 | 6-8 | Frontend React + BDD | ✅ |
| Sprint 3 | 9-10 | Dockerisation complète | 🔄 |
| Sprint 4 | 11-12 | Pipeline CI/CD de base | 🔜 |
| Sprint 5 | 13-14 | Intégration DevSecOps | 🔜 |
| Sprint 6 | 15-16 | Déploiement Kubernetes | 🔜 |
| Sprint 7 | 17-18 | Monitoring & alerting | 🔜 |
| Sprint 8 | 19-21 | Module RAG | 🔜 |
| Sprint 9 | 22-24 | Agent IA + validation + rapport | 🔜 |

---

## 📚 Références

### Documentation officielle
- [Kubernetes](https://kubernetes.io/docs)
- [Trivy — Aqua Security](https://aquasecurity.github.io/trivy)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [LangChain](https://python.langchain.com)
- [Prometheus](https://prometheus.io/docs)
- [Supabase](https://supabase.com/docs)

### Standards de sécurité
- OWASP Top 10 2021
- CIS Benchmark
- NIST Cybersecurity Framework
- ISO/IEC 27001

---

## 👤 Auteur

**Jaberrrr**  
Étudiant en Cloud Security & DevSecOps — Tunisie  
PFE 2024-2025

---

> *Ce projet est réalisé dans un cadre académique. Toute reproduction à des fins commerciales est soumise à autorisation.*