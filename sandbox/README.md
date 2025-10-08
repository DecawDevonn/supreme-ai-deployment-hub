# 🚀 Devonn.AI Sandbox Environment

Complete local development sandbox for the Devonn.AI platform with mock AI services, database, storage, and background job processing.

## 📦 What's Included

- **PostgreSQL** - Primary database
- **Redis** - Caching and job queue
- **MinIO** - S3-compatible object storage
- **Mock AI Service** - Simulates OpenAI/Claude responses
- **Mock TTS Service** - Simulates ElevenLabs text-to-speech
- **Mock Image Gen** - Simulates Stable Diffusion image generation
- **Backend API** - FastAPI application
- **Celery Worker** - Background job processing
- **Nginx** - Reverse proxy and load balancer

## 🎯 Quick Start

### Prerequisites

- Docker (20.10+)
- Docker Compose (2.0+)
- 8GB+ RAM recommended

### Launch Sandbox

```bash
cd sandbox
docker-compose up --build
```

### Access Services

- **Frontend/API**: http://localhost
- **Backend API Direct**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **MinIO Console**: http://localhost:9001 (user: `devonn_minio`, pass: `devonn_minio_password`)
- **PostgreSQL**: localhost:5432 (user: `devonn`, pass: `devonn_dev_password`, db: `devonn_ai`)
- **Redis**: localhost:6379

### Stop Sandbox

```bash
docker-compose down
```

### Clean All Data

```bash
docker-compose down -v
```

## 🧪 Mock Services

### Mock AI Service (Port 8001)

Simulates OpenAI/Claude API:

```bash
curl -X POST http://localhost:8001/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Generate a movie script"}]
  }'
```

### Mock TTS Service (Port 8002)

Simulates ElevenLabs text-to-speech:

```bash
curl -X POST http://localhost:8002/v1/text-to-speech \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello from Devonn.AI",
    "voice_id": "default"
  }'
```

### Mock Image Gen (Port 8003)

Simulates Stable Diffusion:

```bash
curl -X POST http://localhost:8003/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic AI hub",
    "width": 1024,
    "height": 1024
  }'
```

## 🔧 Configuration

### Environment Variables

All services use environment variables defined in `docker-compose.yml`. To customize:

1. Copy `.env.example` to `.env`
2. Modify values as needed
3. Restart services

### Database Initialization

The `init-db/` directory contains SQL scripts that run on first startup:

- `01_schema.sql` - Database schema
- `02_seed.sql` - Sample data

### Nginx Configuration

Modify `configs/nginx.conf` to customize routing, SSL, or rate limiting.

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f celery-worker
```

### Database Access

```bash
docker exec -it devonn-postgres psql -U devonn -d devonn_ai
```

### Redis CLI

```bash
docker exec -it devonn-redis redis-cli
```

## 🧹 Maintenance

### Rebuild Single Service

```bash
docker-compose up -d --no-deps --build backend
```

### Reset Database

```bash
docker-compose down -v postgres
docker-compose up -d postgres
```

### Update Images

```bash
docker-compose pull
docker-compose up -d
```

## 🐛 Troubleshooting

### Port Conflicts

If ports are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "8080:8000"  # Change 8000 to 8080
```

### Memory Issues

Increase Docker memory allocation to at least 8GB in Docker Desktop settings.

### Services Not Starting

Check health status:

```bash
docker-compose ps
```

View detailed logs:

```bash
docker-compose logs <service-name>
```

## 🚀 Production Deployment

**⚠️ WARNING**: This sandbox is for development only. For production:

1. Use strong passwords and secrets
2. Enable SSL/TLS
3. Configure proper backups
4. Use managed services (RDS, ElastiCache, S3)
5. Implement monitoring and alerting
6. Follow the main DEPLOYMENT.md and SECURITY_CHECKLIST.md

## 📚 Additional Resources

- [Environment Variables Reference](../docs/ENV_VARS.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Security Checklist](../SECURITY_CHECKLIST.md)
- [E2E Encryption](../docs/E2E_ENCRYPTION.md)

## 🤝 Contributing

This sandbox is part of the Devonn.AI platform. For issues or improvements, please open an issue in the main repository.

---

**Devonn.AI** - Intelligence Beyond Boundaries  
Founded by Wesley Little | Wesship8 & Arising Atlantis | Est. 2020, Dubai
