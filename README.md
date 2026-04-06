
# Model Control Panel
> **Part of the [Devonn Autonomous Ecosystem](docs/ECOSYSTEM.md)** — 9 repos, 2 live services, fully automated.

 (MCP) API

A unified FastAPI gateway for AI model services.

## Features

- **Centralized API Key Management**: Secure storage and retrieval
- **Authentication**: JWT-based authentication
- **Model Proxies**:
  - OpenAI Chat Completions
  - Hugging Face Text Generation
  - Eleven Labs Text-to-Speech
  - Vector Database Search

## One-Command Deployment (Devonn.ai Auto-Healer Mesh)

This repo is the primary entry point for the full Devonn.ai autonomous mesh. A single script starts the Hermes orchestrator, the MCP API, and the React dashboard — auto-detecting their locations.

**Step 1** — Create `.env`:

```bash
cp .env.example .env
```

**Step 2** — Edit `.env` and set at minimum:

| Variable | Required | Default |
|---|---|---|
| `GITHUB_TOKEN` | Yes | — |
| `OPENAI_API_KEY` | Yes | — |
| `ORGANIZATION` | No | `wesship` |
| `WORKSPACE_DIR` | No | `~/DevonnAI_AutoHealer` |
| `CLONE_PROTOCOL` | No | `https` |

**Step 3** — Run:

```bash
bash run_all.sh
```

The script auto-detects and starts:
- **Hermes orchestrator** (`run_devonn_ai.py`) — polls the Central Orchestrator and dispatches AI agents
- **MCP API** — from `src/main.py` or `command_center/app.py`, served on port 8000
- **React dashboard** — from `command_center/frontend` or `frontend`

Logs: `hermes.log`, `mcp_api.log`, `<frontend_path>/react_dashboard.log`

---

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
- Rotate the JWT and encryption keys regularly
- Set up proper CORS restrictions for production environments

## License

[Insert your license information here]
