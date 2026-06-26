# Docker Image Pull Error

Cause:

Image inexistante sur Docker Hub.

Correction:

docker build -t image .
docker push image

Puis :

kubectl rollout restart deployment