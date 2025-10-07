# Environment Variables Reference

Complete list of environment variables required for the AI Movie Maker platform.

## Core Application

```bash
# Application Settings
APP_NAME="AI Movie Maker"
APP_ENV=development
DEBUG=true
PORT=8000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_movie_maker
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20

# Redis (for Celery/background jobs)
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

## Authentication & Security

```bash
# JWT Authentication
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
ALLOWED_HOSTS=localhost,127.0.0.1

# API Rate Limiting
RATE_LIMIT_PER_MINUTE=60
```

## AI Service Integrations

```bash
# OpenAI API (Script Generation)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=4096

# ElevenLabs API (Text-to-Speech)
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
ELEVENLABS_MODEL=eleven_multilingual_v2

# Stable Diffusion / Image Generation
STABILITY_API_KEY=your-stability-api-key
STABILITY_ENGINE_ID=stable-diffusion-xl-1024-v1-0

# D-ID API (Avatar Video Generation)
DID_API_KEY=your-did-api-key
DID_API_URL=https://api.d-id.com

# Pika API (Video Generation)
PIKA_API_KEY=your-pika-api-key
PIKA_API_URL=https://api.pika.art

# RunwayML API (Video Effects)
RUNWAY_API_KEY=your-runway-api-key
RUNWAY_API_URL=https://api.runwayml.com
```

## Storage & Assets

```bash
# S3-Compatible Storage (AWS S3, MinIO, etc.)
S3_ENDPOINT_URL=https://s3.amazonaws.com
S3_ACCESS_KEY_ID=your-s3-access-key
S3_SECRET_ACCESS_KEY=your-s3-secret-key
S3_BUCKET_NAME=ai-movie-maker-assets
S3_REGION=us-east-1

# Local Storage (fallback)
LOCAL_STORAGE_PATH=/var/data/ai-movie-maker
TEMP_STORAGE_PATH=/tmp/ai-movie-maker
MAX_UPLOAD_SIZE_MB=500
```

## Video Processing

```bash
# FFmpeg Settings
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe
VIDEO_OUTPUT_FORMAT=mp4
VIDEO_CODEC=libx264
AUDIO_CODEC=aac
VIDEO_BITRATE=5000k
AUDIO_BITRATE=192k
FPS=30
```

## Notifications

```bash
# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@aimoviemaker.com

# Webhook Notifications
WEBHOOK_URL=https://your-webhook-endpoint.com/notify
WEBHOOK_SECRET=your-webhook-secret
```

## Monitoring & Logging

```bash
# Sentry (Error Tracking)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production

# Log Level
LOG_LEVEL=INFO
LOG_FORMAT=json

# Prometheus Metrics
ENABLE_METRICS=true
METRICS_PORT=9090
```

## Feature Flags

```bash
# Optional Features
ENABLE_AUTO_CAPTIONS=true
ENABLE_BACKGROUND_MUSIC=true
ENABLE_SCENE_TRANSITIONS=true
ENABLE_AI_UPSCALING=false
MAX_CONCURRENT_RENDERS=5
```

## Sample .env File

Create a `.env` file in your project root with all required variables:

```bash
# Copy this template and fill in your actual values
cp .env.example .env
```

## Security Notes

⚠️ **NEVER commit .env files to version control**

1. Add `.env` to `.gitignore`
2. Use `.env.example` as a template (without secrets)
3. Rotate API keys regularly
4. Use different keys for dev/staging/production
5. Store production secrets in a secure vault (AWS Secrets Manager, HashiCorp Vault, etc.)

## Environment-Specific Overrides

### Development
```bash
APP_ENV=development
DEBUG=true
LOG_LEVEL=DEBUG
```

### Staging
```bash
APP_ENV=staging
DEBUG=false
LOG_LEVEL=INFO
```

### Production
```bash
APP_ENV=production
DEBUG=false
LOG_LEVEL=WARNING
ENABLE_METRICS=true
```
