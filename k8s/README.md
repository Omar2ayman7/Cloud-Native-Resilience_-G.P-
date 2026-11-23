# FreshCart Kubernetes v2 — no Ingress

This configuration intentionally does **not** use Ingress.

It matches the last working Docker Compose browser addresses:

- Frontend: `http://localhost:4200`
- API Gateway: `http://localhost:3000`

The Angular build already calls `http://localhost:3000/api/v1/`, so exposing the Gateway on local port 3000 avoids changing or rebuilding the frontend.

## Architecture

Browser:
- `localhost:4200` -> port-forward -> `frontend:4000`
- `localhost:3000` -> port-forward -> `api-gateway:3000`

Inside Kubernetes:
- Gateway -> `http://auth-service:3001`
- Gateway -> `http://product-service:3002`
- Gateway -> `http://cart-service:3003`
- Gateway -> `http://order-service:3004`
- Gateway -> `http://payment-service:3005`

The five backend microservices are `ClusterIP` services and are not exposed directly to Windows.

## Docker Hub images

- `omaraymane/freshcart-auth:latest`
- `omaraymane/freshcart-product:latest`
- `omaraymane/freshcart-cart:latest`
- `omaraymane/freshcart-order:latest`
- `omaraymane/freshcart-payment:latest`
- `omaraymane/freshcart-gateway:modified`
- `omaraymane/freshcart-frontend:latest`

## File layout

Each application image has one YAML containing both its Deployment and Service:

- `auth.yaml`
- `product.yaml`
- `cart.yaml`
- `order.yaml`
- `payment.yaml`
- `gateway.yaml`
- `frontend.yaml`

Additional files:

- `namespace.yaml`
- `configmap.yaml`
- `secrets.yaml`
- `hpa.yaml`
- `resource-quota.yaml`
- `limit-range.yaml`

## Before applying

### 1. Make sure Minikube is running

```powershell
minikube start
kubectl get nodes
```

### 2. HPA needs Metrics Server

```powershell
minikube addons enable metrics-server
```

No Ingress addon is required for this configuration.

### 3. Edit `configmap.yaml`

Replace:

```text
https://YOUR_PROJECT_REF.supabase.co
```

with the same `SUPABASE_URL` used by your working Docker Compose backend.

Keep these exactly as they are:

```text
FRONTEND_ORIGIN=http://localhost:4200
GATEWAY_PUBLIC_URL=http://localhost:3000
```

They match the browser addresses used by this setup.

### 4. Edit `secrets.yaml`

Replace:

```text
REPLACE_WITH_YOUR_JWT_SECRET
REPLACE_WITH_YOUR_SUPABASE_SERVICE_ROLE_KEY
```

Use the same JWT secret that worked with Docker Compose.

Do not commit a real `secrets.yaml` to a public Git repository.

## Apply everything

From the project root:

```powershell
.\k8s\apply-all.ps1
```

Or manually:

```powershell
kubectl apply -f .\k8s\namespace.yaml
kubectl apply -f .\k8s\configmap.yaml
kubectl apply -f .\k8s\secrets.yaml
kubectl apply -f .\k8s\auth.yaml
kubectl apply -f .\k8s\product.yaml
kubectl apply -f .\k8s\cart.yaml
kubectl apply -f .\k8s\order.yaml
kubectl apply -f .\k8s\payment.yaml
kubectl apply -f .\k8s\gateway.yaml
kubectl apply -f .\k8s\frontend.yaml
kubectl apply -f .\k8s\limit-range.yaml
kubectl apply -f .\k8s\resource-quota.yaml
kubectl apply -f .\k8s\hpa.yaml
```

## Verify Pods and routing

```powershell
kubectl get pods -n freshcart
kubectl get services -n freshcart
kubectl get endpoints -n freshcart
```

All seven application services should have endpoints.

Useful checks:

```powershell
kubectl logs deployment/gateway-deployment -n freshcart --tail=100
kubectl logs deployment/payment-deployment -n freshcart --tail=100
kubectl top pods -n freshcart
kubectl get hpa -n freshcart
```

## Open the site

Run:

```powershell
.\k8s\start-local-access.ps1
```

This opens two PowerShell windows:

```text
localhost:4200 -> frontend Service port 4000
localhost:3000 -> API Gateway Service port 3000
```

Keep both windows open.

Then browse to:

```text
http://localhost:4200
```

Test the complete flow:

```text
Login/Register
-> Products
-> Product Details
-> Cart
-> Checkout
-> Mock Payment
-> All Orders
```

## Why this fixes the previous routing issue

The browser cannot resolve Kubernetes names such as `product-service` or `api-gateway`. Only Pods inside the cluster can.

Therefore:

- The **browser** uses `localhost:4200` and `localhost:3000`.
- The **API Gateway Pod** uses Kubernetes DNS names such as `product-service:3002`.

This is the same separation that worked in Docker Compose, adapted to Kubernetes.

## Self-healing test

Get Pods:

```powershell
kubectl get pods -n freshcart
```

Delete one, for example an Auth Pod:

```powershell
kubectl delete pod <AUTH-POD-NAME> -n freshcart
```

Then watch Kubernetes recreate it:

```powershell
kubectl get pods -n freshcart -w
```

## Remove this Kubernetes deployment

```powershell
kubectl delete namespace freshcart
```
