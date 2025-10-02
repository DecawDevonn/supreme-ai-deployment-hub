import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Database, Lock, Zap, Code, GitBranch, Boxes, Server, Shield } from "lucide-react";

export default function BackendArchitecture() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Lovable Backend Clone Architecture
        </h1>
        <p className="text-muted-foreground text-lg">
          Production-ready FastAPI backend with Supabase Auth, pgvector RAG, and distributed task processing
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Overview
          </CardTitle>
          <CardDescription>
            Complete backend scaffold for AI-powered applications with vector search and authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Boxes className="h-4 w-4" />
                Core Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">FastAPI</Badge>
                <Badge variant="secondary">PostgreSQL</Badge>
                <Badge variant="secondary">pgvector</Badge>
                <Badge variant="secondary">Supabase Auth</Badge>
                <Badge variant="secondary">OpenAI Embeddings</Badge>
                <Badge variant="secondary">Celery</Badge>
                <Badge variant="secondary">Redis</Badge>
                <Badge variant="secondary">SQLAlchemy</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Key Features
              </h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• JWT/JWKS authentication with Supabase</li>
                <li>• Vector embeddings for semantic search</li>
                <li>• Async task processing with Celery</li>
                <li>• RAG (Retrieval Augmented Generation)</li>
                <li>• Docker containerization</li>
                <li>• CI/CD with GitHub Actions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="code">Code Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Project Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="text-sm">
{`lovable-backend-clone/
├─ .github/
│  └─ workflows/
│     └─ ci-cd.yml              # GitHub Actions CI/CD
├─ alembic/
│  ├─ env.py                    # Alembic config
│  └─ versions/
│     └─ 0001_create_tables.py  # Initial migration
├─ app/
│  ├─ __init__.py
│  ├─ main.py                   # FastAPI app entry
│  ├─ db.py                     # SQLAlchemy setup
│  ├─ models.py                 # ORM models
│  ├─ schemas.py                # Pydantic schemas
│  ├─ auth.py                   # JWT verification
│  ├─ routes/
│  │  ├─ ingest.py              # Document ingestion
│  │  └─ query.py               # RAG query endpoint
│  └─ tasks.py                  # Celery task definitions
├─ worker/
│  └─ celery_worker.py          # Celery worker config
├─ Dockerfile                   # Container definition
├─ docker-compose.yml           # Local dev setup
├─ requirements.txt             # Python dependencies
├─ .env.example                 # Environment template
└─ README.md`}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">1. Document Ingestion Flow</h4>
                  <div className="text-sm text-muted-foreground">
                    Client → FastAPI /api/ingest → Celery Task → OpenAI Embeddings → PostgreSQL (docs + doc_embeddings)
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">2. Query/RAG Flow</h4>
                  <div className="text-sm text-muted-foreground">
                    Client → FastAPI /api/query → OpenAI Embeddings (query) → pgvector cosine similarity → Top-K docs → LLM context → Response
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">3. Authentication Flow</h4>
                  <div className="text-sm text-muted-foreground">
                    Client (Supabase.auth) → JWT token → FastAPI middleware → JWKS verification → Protected endpoint
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Supabase JWT/JWKS Authentication
              </CardTitle>
              <CardDescription>
                Production-ready authentication with JWT verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-semibold mb-2">Environment Variables</h4>
                <pre className="text-xs overflow-x-auto">
{`# Supabase Configuration
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_ANON_KEY=anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key

# JWT Verification (choose one method)
SUPABASE_JWT_SECRET=your_jwt_secret              # Legacy HS256
SUPABASE_JWKS_URL=https://.../.well-known/jwks.json  # Modern RS256`}
                </pre>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Key Security Features</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span><strong>JWKS Support:</strong> Automatic public key rotation via Supabase JWKS endpoint</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Token Caching:</strong> JWKS keys cached for 5 minutes to reduce network calls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Signature Verification:</strong> RS256 public key cryptographic verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Expiration Checks:</strong> Automatic token expiry validation</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-semibold mb-2">Usage in FastAPI Endpoints</h4>
                <pre className="text-xs overflow-x-auto">
{`from fastapi import Depends, Header
from app.auth import verify_jwt

def get_user(authorization: str = Header(None)):
    token = authorization.split(" ")[1] if authorization else None
    return verify_jwt(token)

@router.post("/api/ingest")
def ingest(payload: dict, user=Depends(get_user)):
    user_id = user.get("sub")  # Supabase user ID
    # Protected endpoint logic here...`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                PostgreSQL + pgvector Schema
              </CardTitle>
              <CardDescription>
                Vector embeddings for semantic search and RAG
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-semibold mb-2">Database Tables</h4>
                <pre className="text-xs overflow-x-auto">
{`-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table
CREATE TABLE docs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,  -- References auth.users
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Embeddings table with vector column
CREATE TABLE doc_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_id UUID REFERENCES docs(id) ON DELETE CASCADE,
    embedding vector(1536),  -- OpenAI text-embedding-3-small dimension
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Vector similarity index (IVFFlat)
CREATE INDEX idx_doc_embeddings_embedding 
ON doc_embeddings 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);`}
                </pre>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Vector Search Query</h4>
                <div className="rounded-lg bg-muted p-4">
                  <pre className="text-xs overflow-x-auto">
{`-- Find top-K most similar documents using cosine distance
SELECT d.id, d.content, d.metadata
FROM doc_embeddings e
JOIN docs d ON d.id = e.doc_id
ORDER BY e.embedding <-> :query_embedding  -- <-> is cosine distance
LIMIT 5;`}
                  </pre>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Index Types Comparison</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold text-sm mb-2">IVFFlat (Current)</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Good for &lt;1M vectors</li>
                      <li>• Faster build time</li>
                      <li>• 95%+ recall</li>
                      <li>• Lower memory usage</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-semibold text-sm mb-2">HNSW (Alternative)</h5>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Better for &gt;1M vectors</li>
                      <li>• Slower build, faster query</li>
                      <li>• 99%+ recall</li>
                      <li>• Higher memory usage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Deployment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Quick Start (Docker Compose)</h4>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`# 1. Copy environment file
cp .env.example .env

# 2. Start all services
docker-compose up --build

# 3. Run migrations
docker-compose exec web alembic upgrade head

# Services:
# - FastAPI: http://localhost:8000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379`}
                  </pre>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Production Deployment</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• <strong>Render:</strong> Docker deploy with managed Postgres + Redis</li>
                    <li>• <strong>Fly.io:</strong> Global edge deployment with volumes</li>
                    <li>• <strong>AWS ECS:</strong> Container orchestration with RDS + ElastiCache</li>
                    <li>• <strong>Railway:</strong> One-click Docker deploy</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-semibold mb-2">GitHub Actions CI/CD Pipeline</h4>
                <pre className="text-xs overflow-x-auto">
{`name: CI-CD
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t \${{ secrets.REGISTRY }}/backend:latest .
      
      - name: Push to registry
        run: docker push \${{ secrets.REGISTRY }}/backend:latest
      
      - name: Deploy to production
        run: |
          # Add your deployment commands here
          # e.g., kubectl apply, aws ecs update-service, etc.`}
                </pre>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Production Hardening Checklist</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Connection pooling (PgBouncer)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Rate limiting on endpoints</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Secrets management (Vault/AWS)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Observability (Sentry/Prometheus)</span>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Row-level security (RLS)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>API key rotation policy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Backup and disaster recovery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span>Load testing and capacity planning</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complete Code Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="ingest" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="ingest">Ingest</TabsTrigger>
                  <TabsTrigger value="query">Query</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="models">Models</TabsTrigger>
                </TabsList>

                <TabsContent value="ingest">
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <pre className="text-xs">
{`# app/routes/ingest.py
from fastapi import APIRouter, Depends, Header
from app.auth import verify_jwt
from pydantic import BaseModel
from worker.celery_worker import ingest_document_task

router = APIRouter()

class IngestPayload(BaseModel):
    text: str
    metadata: dict = {}

def get_user_from_auth(authorization: str = Header(None)):
    token = authorization.split(" ")[1] if authorization else None
    return verify_jwt(token)

@router.post("/ingest")
def ingest(payload: IngestPayload, user=Depends(get_user_from_auth)):
    """
    Queue document for embedding generation and storage.
    Returns task_id for status tracking.
    """
    job = ingest_document_task.delay(
        payload.text, 
        payload.metadata, 
        user.get("sub") or user.get("user_id")
    )
    return {"status": "queued", "task_id": job.id}`}
                    </pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="query">
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <pre className="text-xs">
{`# app/routes/query.py
from fastapi import APIRouter, Depends, Header
from app.auth import verify_jwt
from app.db import SessionLocal
from sqlalchemy import text
import openai
import os

router = APIRouter()
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
K = 5

def get_user_from_auth(authorization: str = Header(None)):
    token = authorization.split(" ")[1] if authorization else None
    return verify_jwt(token)

@router.post("/query")
def query(payload: dict, user=Depends(get_user_from_auth)):
    """
    RAG query endpoint: embed query, retrieve similar docs, generate answer
    """
    query_text = payload.get("q")
    if not query_text:
        return {"error": "missing q"}
    
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    # 1. Embed the query
    emb = openai.Embedding.create(model=EMBEDDING_MODEL, input=query_text)
    query_emb = emb["data"][0]["embedding"]
    
    # 2. Vector similarity search
    db = SessionLocal()
    try:
        sql = text("""
            SELECT d.id, d.content, d.metadata
            FROM doc_embeddings e
            JOIN docs d ON d.id = e.doc_id
            ORDER BY e.embedding <-> :query_embedding
            LIMIT :k
        """)
        rows = db.execute(sql, {"query_embedding": query_emb, "k": K}).fetchall()
        docs = [{"id": r["id"], "content": r["content"]} for r in rows]
    finally:
        db.close()
    
    # 3. Generate LLM response with context
    context = "\\n\\n---\\n\\n".join([d["content"] for d in docs])
    user_prompt = f"Context:\\n{context}\\n\\nQuestion: {query_text}"
    
    resp = openai.ChatCompletion.create(
        model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": "Answer using provided context."},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=512,
        temperature=0.0
    )
    
    return {
        "answer": resp["choices"][0]["message"]["content"],
        "sources": docs
    }`}
                    </pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="tasks">
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <pre className="text-xs">
{`# app/tasks.py
import os
from openai import OpenAI
from sqlalchemy import text
from .db import SessionLocal
import json

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")

client = OpenAI(api_key=OPENAI_API_KEY)

def ingest_document_sync(text_content: str, metadata: dict, user_id: str = None):
    """
    Background task: Create document, generate embedding, store in DB
    """
    # 1. Insert document
    db = SessionLocal()
    try:
        res = db.execute(
            text("INSERT INTO docs (user_id, content, metadata) VALUES (:uid, :content, :meta) RETURNING id"),
            {"uid": user_id, "content": text_content, "meta": json.dumps(metadata)}
        )
        doc_id = res.fetchone()[0]
        db.commit()
    finally:
        db.close()
    
    # 2. Generate embedding via OpenAI
    import openai
    openai.api_key = OPENAI_API_KEY
    emb = openai.Embedding.create(model=EMBEDDING_MODEL, input=text_content)
    embedding_vector = emb["data"][0]["embedding"]
    
    # 3. Store embedding
    db = SessionLocal()
    try:
        db.execute(
            text("INSERT INTO doc_embeddings (doc_id, embedding) VALUES (:doc_id, :embedding)"),
            {"doc_id": doc_id, "embedding": embedding_vector}
        )
        db.commit()
    finally:
        db.close()
    
    return {"doc_id": str(doc_id)}

# worker/celery_worker.py
from celery import Celery
import os

CELERY_BROKER = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
celery_app = Celery('tasks', broker=CELERY_BROKER)

@celery_app.task(name="ingest_document_task")
def ingest_document_task(text, metadata, user_id):
    from app.tasks import ingest_document_sync
    return ingest_document_sync(text, metadata, user_id)`}
                    </pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="models">
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <pre className="text-xs">
{`# app/models.py
from sqlalchemy import Column, String, Text, JSON, TIMESTAMP, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from pgvector.sqlalchemy import Vector
from .db import Base

class Doc(Base):
    """Document storage with metadata"""
    __tablename__ = "docs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=True)  # Link to Supabase auth.users
    content = Column(Text, nullable=False)
    metadata = Column(JSON, default={})
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

class DocEmbedding(Base):
    """Vector embeddings for semantic search"""
    __tablename__ = "doc_embeddings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doc_id = Column(UUID(as_uuid=True), ForeignKey("docs.id", ondelete="CASCADE"))
    embedding = Column(Vector(1536))  # OpenAI text-embedding-3-small dimension
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
    doc = relationship("Doc", backref="embeds")

# app/db.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()`}
                    </pre>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Next Steps & Deliverables</CardTitle>
          <CardDescription>Choose what you'd like to implement next</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-semibold mb-1">1. Full Git Repo</div>
              <div className="text-xs text-muted-foreground">Complete project structure ready to clone and deploy</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-semibold mb-1">2. React Frontend</div>
              <div className="text-xs text-muted-foreground">Supabase client auth + API integration examples</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-semibold mb-1">3. Kubernetes Setup</div>
              <div className="text-xs text-muted-foreground">Manifests, Helm chart, Terraform for EKS deployment</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-semibold mb-1">4. LangChain Integration</div>
              <div className="text-xs text-muted-foreground">Full RAG orchestration with Document loaders & memory</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-semibold mb-1">5. Production Migration</div>
              <div className="text-xs text-muted-foreground">Alembic with vector(1536) + HNSW index setup</div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col items-start">
              <div className="font-semibold mb-1">6. Testing Suite</div>
              <div className="text-xs text-muted-foreground">Unit + integration tests with pytest coverage</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
