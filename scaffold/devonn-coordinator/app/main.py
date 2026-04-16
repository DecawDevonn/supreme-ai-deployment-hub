from fastapi import FastAPI
from app.api import health, orchestrate

app = FastAPI(title="Devonn Coordinator")

app.include_router(health.router, prefix="/api/v1")
app.include_router(orchestrate.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"status": "Devonn Coordinator running"}
