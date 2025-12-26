
# Model Control Panel (MCP) API

A unified FastAPI gateway for AI model services.

## Features

- **Centralized API Key Management**: Secure storage and retrieval
- **Authentication**: JWT-based authentication
- **Model Proxies**:
  - OpenAI Chat Completions
  - Hugging Face Text Generation
  - Eleven Labs Text-to-Speech
  - Vector Database Search

## Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mcp-api

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn src.main:app --reload
```

### Environment Variables

Configure the following environment variables:

```
JWT_SECRET=your-secure-jwt-secret
ENCRYPTION_KEY=your-secure-encryption-key
KEYS_FILE=path/to/keys.json
```

You can also directly set API keys as environment variables:

```
OPENAI_API_KEY=your-openai-key
HUGGINGFACE_API_KEY=your-huggingface-key
ELEVENLABS_API_KEY=your-elevenlabs-key
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Usage Examples

### Chat Completion

```bash
curl -X POST "http://localhost:8000/proxy/openai/chat" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is the capital of France?", "model":"gpt-4o-mini"}'
```

### Text to Speech

```bash
curl -X POST "http://localhost:8000/proxy/elevenlabs/tts" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world", "voice_id":"EXAVITQu4vr4xnSDxMaL"}'
```

## Key Management API

Add or update an API key:

```bash
curl -X PUT "http://localhost:8000/admin/keys/OPENAI_API_KEY" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"your-openai-key", "service":"OPENAI_API_KEY"}'
```

List available keys:

```bash
curl -X GET "http://localhost:8000/admin/keys" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## Security Notes

- In production, use proper secret management (AWS Secrets Manager, HashiCorp Vault, etc.)
- **Never commit secrets or credentials to the repository**
- Rotate the JWT and encryption keys regularly
- Set up proper CORS restrictions for production environments
- Enable and monitor secret scanning (see [SECURITY.md](SECURITY.md))

### For Contributors

Before making your first commit:

1. Install Gitleaks: `brew install gitleaks` (or see [CONTRIBUTING.md](CONTRIBUTING.md))
2. Pre-commit hooks are automatically installed via `npm install`
3. See our [Secret Scanning Setup Guide](docs/runbooks/secret_scanning_setup.md)

For more security information:
- [SECURITY.md](SECURITY.md) - Security policies and reporting
- [Secret Scanning Setup](docs/runbooks/secret_scanning_setup.md) - Automated secret detection
- [Credential Leak Response](docs/runbooks/credential_leak_migration.md) - Emergency procedures

## License

[Insert your license information here]
