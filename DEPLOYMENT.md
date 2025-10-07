# Deployment Guide - AI Movie Maker

Comprehensive deployment instructions for local development, Docker, and Kubernetes environments.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Docker Deployment](#docker-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [Production Considerations](#production-considerations)

---

## Local Development Setup

### Prerequisites

- Python 3.11+
- Node.js 18+ (for frontend)
- PostgreSQL 15+
- Redis 7+
- FFmpeg 6+

### Step 1: Clone Repository

```bash
git clone https://github.com/wesship/supreme-ai-deployment-hub.git
cd supreme-ai-deployment-hub
```

### Step 2: Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn src.main:app --reload --port 8000
```

### Step 3: Frontend Setup (Optional)

```bash
cd frontend
npm install

# Start development server
npm run dev
```

### Step 4: Start Background Workers

```bash
# In a separate terminal
celery -A src.workers.celery_app worker --loglevel=info
```

### Step 5: Verify Installation

Visit:
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

---

## Docker Deployment

### Prerequisites

- Docker 24+
- Docker Compose 2.0+

### Quick Start

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ai_movie_maker
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: .
    command: uvicorn src.main:app --host 0.0.0.0 --port 8000
    environment:
      - DATABASE_URL=postgresql://admin:${DB_PASSWORD}@postgres:5432/ai_movie_maker
      - REDIS_URL=redis://redis:6379/0
    env_file:
      - .env
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis
    volumes:
      - ./assets:/app/assets
      - ./logs:/app/logs

  celery-worker:
    build: .
    command: celery -A src.workers.celery_app worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql://admin:${DB_PASSWORD}@postgres:5432/ai_movie_maker
      - REDIS_URL=redis://redis:6379/0
    env_file:
      - .env
    depends_on:
      - postgres
      - redis
    volumes:
      - ./assets:/app/assets

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl/certs:ro
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Custom Dockerfile

```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create necessary directories
RUN mkdir -p /app/assets /app/logs

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### NGINX Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    client_max_body_size 500M;

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        alias /app/static;
    }
}
```

---

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (GKE, EKS, AKS, or local with Minikube)
- kubectl configured
- Helm 3+ (optional)

### Step 1: Create Namespace

```bash
kubectl create namespace ai-movie-maker
```

### Step 2: Create Secrets

```bash
kubectl create secret generic ai-movie-secrets \
  --from-literal=database-url='postgresql://user:pass@postgres:5432/db' \
  --from-literal=openai-api-key='sk-...' \
  --from-literal=elevenlabs-api-key='...' \
  --from-literal=jwt-secret='...' \
  -n ai-movie-maker
```

### Step 3: Deploy PostgreSQL

```yaml
# postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: ai-movie-maker
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_DB
          value: ai_movie_maker
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: ai-movie-secrets
              key: database-password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: ai-movie-maker
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

### Step 4: Deploy Backend

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: ai-movie-maker
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/ai-movie-maker:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ai-movie-secrets
              key: database-url
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: ai-movie-secrets
              key: openai-api-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "2000m"
---
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: ai-movie-maker
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

### Step 5: Deploy Celery Workers

```yaml
# celery-worker-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: celery-worker
  namespace: ai-movie-maker
spec:
  replicas: 5
  selector:
    matchLabels:
      app: celery-worker
  template:
    metadata:
      labels:
        app: celery-worker
    spec:
      containers:
      - name: celery-worker
        image: your-registry/ai-movie-maker:latest
        command: ["celery", "-A", "src.workers.celery_app", "worker", "--loglevel=info"]
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ai-movie-secrets
              key: database-url
        - name: REDIS_URL
          value: redis://redis:6379/0
        resources:
          requests:
            memory: "1Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "4000m"
```

### Step 6: Apply All Resources

```bash
kubectl apply -f postgres-deployment.yaml
kubectl apply -f redis-deployment.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f celery-worker-deployment.yaml
kubectl apply -f ingress.yaml
```

### Step 7: Verify Deployment

```bash
kubectl get pods -n ai-movie-maker
kubectl logs -f deployment/backend -n ai-movie-maker
```

---

## Production Considerations

### SSL/TLS Configuration

Use cert-manager for automatic certificate provisioning:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

### Monitoring

Deploy Prometheus + Grafana:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
```

### Autoscaling

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: ai-movie-maker
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Backup Strategy

```bash
# Automated database backups
kubectl create cronjob postgres-backup \
  --image=postgres:15 \
  --schedule="0 2 * * *" \
  --restart=OnFailure \
  -- pg_dump -h postgres -U admin ai_movie_maker > /backups/backup-$(date +%Y%m%d).sql
```

### Health Checks

Add to your FastAPI app:

```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
```

---

## Troubleshooting

### Common Issues

1. **Database connection errors**: Check DATABASE_URL and network policies
2. **FFmpeg not found**: Ensure FFmpeg is installed in Docker image
3. **Out of memory**: Increase memory limits for video processing
4. **Slow render times**: Scale Celery workers horizontally

### Debug Commands

```bash
# Check pod logs
kubectl logs -f <pod-name> -n ai-movie-maker

# Execute command in pod
kubectl exec -it <pod-name> -n ai-movie-maker -- /bin/bash

# Check resource usage
kubectl top pods -n ai-movie-maker
```
