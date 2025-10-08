"""
Devonn.AI Backend API - Sandbox Version
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time

app = FastAPI(
    title="Devonn.AI API",
    description="Intelligent AI deployment and automation platform",
    version="1.0.0-sandbox"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class HealthResponse(BaseModel):
    status: str
    timestamp: int
    services: dict

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    project_type: str = "movie"

class Project(BaseModel):
    id: str
    name: str
    description: Optional[str]
    project_type: str
    status: str
    created_at: int

# In-memory storage for sandbox
projects_db = {}

@app.get("/")
async def root():
    return {
        "message": "Welcome to Devonn.AI API - Sandbox Environment",
        "version": "1.0.0-sandbox",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=int(time.time()),
        services={
            "api": "operational",
            "database": "connected",
            "redis": "connected",
            "storage": "available"
        }
    )

@app.post("/api/v1/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    """Create a new project"""
    project_id = f"proj_{int(time.time())}"
    
    new_project = Project(
        id=project_id,
        name=project.name,
        description=project.description,
        project_type=project.project_type,
        status="active",
        created_at=int(time.time())
    )
    
    projects_db[project_id] = new_project
    return new_project

@app.get("/api/v1/projects", response_model=List[Project])
async def list_projects():
    """List all projects"""
    return list(projects_db.values())

@app.get("/api/v1/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    """Get a specific project"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    return projects_db[project_id]

@app.delete("/api/v1/projects/{project_id}")
async def delete_project(project_id: str):
    """Delete a project"""
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    del projects_db[project_id]
    return {"message": "Project deleted successfully"}

@app.get("/api/v1/services/status")
async def service_status():
    """Get status of all integrated services"""
    return {
        "ai_service": {"status": "available", "endpoint": "http://mock-ai-service:8001"},
        "tts_service": {"status": "available", "endpoint": "http://mock-tts-service:8002"},
        "image_gen": {"status": "available", "endpoint": "http://mock-image-gen:8003"},
        "storage": {"status": "available", "type": "MinIO"}
    }
