# Security Checklist - AI Movie Maker Platform

Comprehensive security guidelines for secret management, authentication, authorization, and secure operations.

## Table of Contents

1. [Secret Management](#secret-management)
2. [Authentication & Authorization](#authentication--authorization)
3. [API Security](#api-security)
4. [Data Protection](#data-protection)
5. [Infrastructure Security](#infrastructure-security)
6. [Monitoring & Incident Response](#monitoring--incident-response)

---

## Secret Management

### ✅ Environment Variables

- [ ] Never commit `.env` files to version control
- [ ] Use `.env.example` as a template (without actual secrets)
- [ ] Store production secrets in secure vault (AWS Secrets Manager, HashiCorp Vault, etc.)
- [ ] Use different API keys for dev/staging/production environments
- [ ] Implement secret rotation every 90 days minimum

### ✅ API Key Security

**OpenAI API Keys:**
```bash
# ✅ DO: Store in environment variables
OPENAI_API_KEY=sk-...

# ❌ DON'T: Hardcode in source code
openai.api_key = "sk-..." # NEVER DO THIS
```

**Key Rotation Process:**
1. Generate new API key
2. Update in secret manager
3. Deploy updated configuration
4. Verify new key works
5. Revoke old key after 24-48 hours

### ✅ Database Credentials

```python
# ✅ DO: Use environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# ✅ DO: Use connection pooling with SSL
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    connect_args={"sslmode": "require"}
)

# ❌ DON'T: Store credentials in code
# db_password = "mypassword123" # NEVER DO THIS
```

### ✅ JWT Secrets

```python
# Generate strong JWT secret
import secrets
jwt_secret = secrets.token_urlsafe(64)

# Rotate JWT secrets periodically
# Implement key versioning for seamless rotation
```

---

## Authentication & Authorization

### ✅ User Authentication

**Implementation:**
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

**Best Practices:**
- [ ] Implement token expiration (15-30 minutes for access tokens)
- [ ] Use refresh tokens (7-30 days expiration)
- [ ] Implement token blacklisting for logout
- [ ] Add IP address validation (optional)
- [ ] Enable MFA for admin accounts

### ✅ Role-Based Access Control (RBAC)

```python
from enum import Enum
from functools import wraps

class UserRole(Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

def require_role(required_role: UserRole):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user, **kwargs):
            if current_user.role != required_role:
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

# Usage
@app.post("/admin/users")
@require_role(UserRole.ADMIN)
async def create_user(current_user: User = Depends(get_current_user)):
    # Admin-only endpoint
    pass
```

**RBAC Rules:**
- [ ] Implement least privilege principle
- [ ] Separate read/write permissions
- [ ] Admin actions require additional verification
- [ ] Regular audit of user roles and permissions

---

## API Security

### ✅ Rate Limiting

```python
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter

@app.on_event("startup")
async def startup():
    await FastAPILimiter.init(redis_client)

@app.post("/movies/")
@limiter.limit("10/minute")
async def create_movie(request: Request):
    # Limited to 10 requests per minute
    pass
```

**Rate Limit Strategy:**
- [ ] 60 requests/minute for authenticated users
- [ ] 10 requests/minute for unauthenticated
- [ ] 5 requests/minute for expensive operations (render, AI generation)
- [ ] Implement exponential backoff for repeated violations

### ✅ Input Validation

```python
from pydantic import BaseModel, validator, Field

class MovieRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    script: str = Field(..., max_length=50000)
    
    @validator('title')
    def validate_title(cls, v):
        # Prevent SQL injection, XSS
        if any(char in v for char in ['<', '>', '"', "'"]):
            raise ValueError("Invalid characters in title")
        return v.strip()
```

**Validation Checklist:**
- [ ] Validate all user inputs with Pydantic
- [ ] Sanitize HTML/special characters
- [ ] Limit file upload sizes (500MB max)
- [ ] Validate file types (whitelist only)
- [ ] Check for malicious file signatures

### ✅ CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://yourdomain.com",
        "https://app.yourdomain.com"
    ],  # ❌ NEVER use ["*"] in production
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### ✅ SQL Injection Prevention

```python
# ✅ DO: Use parameterized queries
user = db.query(User).filter(User.email == email).first()

# ❌ DON'T: Use string concatenation
# query = f"SELECT * FROM users WHERE email = '{email}'" # NEVER DO THIS
```

---

## Data Protection

### ✅ Encryption at Rest

```python
from cryptography.fernet import Fernet

# Encrypt sensitive data before storing
key = Fernet.generate_key()
cipher = Fernet(key)

encrypted_data = cipher.encrypt(sensitive_data.encode())
# Store encrypted_data in database

# Decrypt when needed
decrypted_data = cipher.decrypt(encrypted_data).decode()
```

**Encryption Strategy:**
- [ ] Encrypt API credentials in database
- [ ] Encrypt user payment information
- [ ] Use TLS 1.3 for data in transit
- [ ] Encrypt backup files
- [ ] Implement key management system (KMS)

### ✅ PII Protection

```python
from typing import Optional

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    
    class Config:
        # Exclude sensitive fields from API responses
        fields = {'password': {'exclude': True}}
```

**PII Handling:**
- [ ] Never log passwords, API keys, or credit card numbers
- [ ] Mask sensitive data in logs (e.g., `email: j***@example.com`)
- [ ] Implement data retention policies (delete old data)
- [ ] GDPR compliance: user data export/deletion endpoints

### ✅ Secure File Storage

```python
import hashlib
import uuid

def secure_filename(filename: str) -> str:
    # Generate unique filename to prevent overwriting
    ext = filename.split('.')[-1]
    unique_id = uuid.uuid4().hex
    return f"{unique_id}.{ext}"

# Store with restricted permissions
os.chmod(file_path, 0o600)  # Read/write for owner only
```

**File Storage Rules:**
- [ ] Scan uploaded files for malware (ClamAV)
- [ ] Use signed URLs for temporary access
- [ ] Implement access logs for file downloads
- [ ] Regular cleanup of temporary files

---

## Infrastructure Security

### ✅ Container Security

```dockerfile
# Use non-root user
FROM python:3.11-slim
RUN useradd -m -u 1000 appuser
USER appuser

# Minimal image (reduce attack surface)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*
```

**Container Best Practices:**
- [ ] Scan images for vulnerabilities (Trivy, Clair)
- [ ] Use specific image tags (not `latest`)
- [ ] Run containers as non-root user
- [ ] Implement resource limits (CPU, memory)
- [ ] Regular image updates and patching

### ✅ Network Security

```yaml
# Kubernetes Network Policies
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-policy
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: nginx
    ports:
    - protocol: TCP
      port: 8000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
```

**Network Checklist:**
- [ ] Use private networks for internal services
- [ ] Implement network segmentation
- [ ] Enable firewall rules (allowlist only)
- [ ] Use VPN for remote access
- [ ] Regular security audits and penetration testing

---

## Monitoring & Incident Response

### ✅ Logging

```python
import logging
from pythonjsonlogger import jsonlogger

# Structured logging
logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
handler.setFormatter(formatter)
logger.addHandler(handler)

# Log security events
logger.info("User login", extra={
    "user_id": user.id,
    "ip_address": request.client.host,
    "timestamp": datetime.utcnow().isoformat()
})
```

**Log All Security Events:**
- [ ] Failed login attempts (after 3 attempts, alert)
- [ ] Permission denied errors
- [ ] API key usage and rotation
- [ ] File access and modifications
- [ ] Database queries (without sensitive data)

### ✅ Alerting

```python
import sentry_sdk

sentry_sdk.init(
    dsn=SENTRY_DSN,
    environment=APP_ENV,
    traces_sample_rate=0.1
)

# Alert on critical errors
try:
    # Critical operation
    pass
except Exception as e:
    sentry_sdk.capture_exception(e)
    logger.error(f"Critical error: {e}")
```

**Alert Rules:**
- [ ] 5+ failed login attempts from same IP
- [ ] Unauthorized API access attempts
- [ ] Unusual data access patterns
- [ ] High error rates (>5% of requests)
- [ ] Resource exhaustion (CPU >90%, Memory >95%)

### ✅ Incident Response Plan

**Response Steps:**
1. **Detect**: Automated alerts trigger incident
2. **Contain**: Isolate affected systems
3. **Investigate**: Review logs, identify root cause
4. **Remediate**: Patch vulnerability, rotate secrets
5. **Recovery**: Restore services, verify security
6. **Post-mortem**: Document incident, improve processes

**Emergency Contacts:**
- [ ] Maintain on-call rotation
- [ ] Document escalation procedures
- [ ] Regular incident response drills
- [ ] Security incident communication plan

---

## Compliance Checklist

### ✅ General Security

- [ ] All secrets stored securely (no hardcoding)
- [ ] API keys rotated every 90 days
- [ ] TLS 1.3 for all external connections
- [ ] Input validation on all endpoints
- [ ] Rate limiting enabled
- [ ] RBAC implemented correctly
- [ ] Logs do not contain sensitive data
- [ ] Regular security audits scheduled

### ✅ Data Privacy

- [ ] GDPR compliance (data export/deletion)
- [ ] Privacy policy published
- [ ] User consent for data collection
- [ ] Data retention policies enforced
- [ ] Encryption at rest and in transit

### ✅ Operations

- [ ] Incident response plan documented
- [ ] On-call rotation established
- [ ] Regular backups tested
- [ ] Disaster recovery plan in place
- [ ] Dependency vulnerability scanning enabled

---

## Security Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CWE Top 25**: https://cwe.mitre.org/top25/
- **NIST Cybersecurity Framework**: https://www.nist.gov/cyberframework
- **PCI DSS Compliance**: https://www.pcisecuritystandards.org/

---

**Last Updated**: 2025-01-07  
**Review Frequency**: Quarterly  
**Next Review Date**: 2025-04-07
