"""
Mock TTS Service - Simulates ElevenLabs text-to-speech API
"""
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
import random
import time
import base64

app = FastAPI(title="Mock TTS Service")

class TTSRequest(BaseModel):
    text: str
    voice_id: Optional[str] = "default"
    model_id: Optional[str] = "eleven_multilingual_v2"
    voice_settings: Optional[dict] = None

# Mock audio data (base64 encoded silent WAV)
MOCK_AUDIO = base64.b64decode(
    "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQAAAAA="
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "mock-tts"}

@app.post("/v1/text-to-speech")
async def text_to_speech(request: TTSRequest):
    """Mock ElevenLabs text-to-speech endpoint"""
    
    if not request.text:
        raise HTTPException(status_code=400, detail="Text is required")
    
    # Simulate processing time based on text length
    processing_time = min(len(request.text) * 0.01, 3.0)
    time.sleep(processing_time)
    
    # Return mock audio data
    return Response(
        content=MOCK_AUDIO,
        media_type="audio/wav",
        headers={
            "Content-Disposition": f"attachment; filename=speech_{int(time.time())}.wav"
        }
    )

@app.get("/v1/voices")
async def list_voices():
    """List available voices"""
    return {
        "voices": [
            {"voice_id": "default", "name": "Default Voice"},
            {"voice_id": "professional", "name": "Professional Voice"},
            {"voice_id": "casual", "name": "Casual Voice"},
            {"voice_id": "narrator", "name": "Narrator Voice"}
        ]
    }

@app.post("/v1/text-to-speech/{voice_id}")
async def text_to_speech_with_voice(voice_id: str, request: TTSRequest):
    """Mock text-to-speech with specific voice"""
    request.voice_id = voice_id
    return await text_to_speech(request)

@app.get("/")
async def root():
    return {
        "service": "Mock TTS Service",
        "version": "1.0.0",
        "endpoints": ["/v1/text-to-speech", "/v1/voices"],
        "status": "operational"
    }
