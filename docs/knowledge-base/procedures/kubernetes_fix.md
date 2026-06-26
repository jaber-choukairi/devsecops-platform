# Kubernetes CrashLoopBackOff

Diagnostic:

kubectl logs POD

Causes possibles:

- Variables d'environnement absentes
- Base de données inaccessible
- Erreur Spring Boot

Correction:

kubectl describe pod POD
kubectl logs POD