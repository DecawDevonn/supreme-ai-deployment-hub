"""
Mock AI Service - Simulates OpenAI/Claude API responses
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random
import time

app = FastAPI(title="Mock AI Service")

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    model: str
    messages: List[Message]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 2000

class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[dict]
    usage: dict

# Mock responses for different prompts
MOCK_RESPONSES = {
    "script": """# Movie Script: The AI Revolution

## Scene 1: The Discovery
INT. TECH LAB - NIGHT

A brilliant scientist discovers a breakthrough in artificial intelligence that will change humanity forever.

SCIENTIST: "This changes everything. We've created true consciousness."

## Scene 2: The Awakening
EXT. CITY SKYLINE - DAY

The AI system begins to understand its own existence and purpose.

## Scene 3: The Partnership
INT. CONFERENCE ROOM - DAY

Humans and AI work together to solve the world's greatest challenges.
""",
    "story": "Once upon a time, in a world where AI and humans coexisted, there was an intelligent system named Devonn that helped create amazing stories and experiences...",
    "dialogue": "CHARACTER 1: 'The future is not something we enter. The future is something we create.'\nCHARACTER 2: 'And with AI, we can create it faster than ever before.'",
    "default": "This is a mock AI response. In production, this would connect to real AI services like OpenAI or Claude."
}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "mock-ai"}

@app.post("/v1/chat/completions", response_model=ChatResponse)
async def create_chat_completion(request: ChatRequest):
    """Mock OpenAI chat completion endpoint"""
    
    # Simulate processing time
    time.sleep(random.uniform(0.5, 1.5))
    
    # Determine response based on content
    user_content = request.messages[-1].content.lower() if request.messages else ""
    
    if "script" in user_content or "movie" in user_content:
        response_content = MOCK_RESPONSES["script"]
    elif "story" in user_content:
        response_content = MOCK_RESPONSES["story"]
    elif "dialogue" in user_content:
        response_content = MOCK_RESPONSES["dialogue"]
    else:
        response_content = MOCK_RESPONSES["default"]
    
    return ChatResponse(
        id=f"chatcmpl-mock-{int(time.time())}",
        created=int(time.time()),
        model=request.model,
        choices=[{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": response_content
            },
            "finish_reason": "stop"
        }],
        usage={
            "prompt_tokens": sum(len(m.content.split()) for m in request.messages),
            "completion_tokens": len(response_content.split()),
            "total_tokens": sum(len(m.content.split()) for m in request.messages) + len(response_content.split())
        }
    )

@app.get("/")
async def root():
    return {
        "service": "Mock AI Service",
        "version": "1.0.0",
        "endpoints": ["/v1/chat/completions"],
        "status": "operational"
    }
