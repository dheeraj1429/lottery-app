# chmod +x apply-all.sh

kubectl apply -f=config-map.yaml
kubectl apply -f=lottery-server.yaml
kubectl apply -f=lottery-dashboard-client.yaml