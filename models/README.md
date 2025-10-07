# Models & Asset Management - AI Movie Maker

Comprehensive guide for managing AI models, media assets, storage strategies, and best practices.

## Table of Contents

1. [Asset Types](#asset-types)
2. [Storage Architecture](#storage-architecture)
3. [AI Model Management](#ai-model-management)
4. [File Processing Pipeline](#file-processing-pipeline)
5. [Storage Best Practices](#storage-best-practices)

---

## Asset Types

### 1. **Input Assets**

User-uploaded or generated content used as movie sources.

| Asset Type | Format | Max Size | Storage Location |
|------------|--------|----------|------------------|
| Images | JPG, PNG, WEBP | 50 MB | S3: `/uploads/images/` |
| Audio | MP3, WAV, AAC | 100 MB | S3: `/uploads/audio/` |
| Video | MP4, MOV, AVI | 500 MB | S3: `/uploads/video/` |
| Scripts | TXT, JSON | 1 MB | Database + S3 |

**Database Schema:**

```python
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    asset_type = Column(String)  # image, audio, video, script
    filename = Column(String)
    s3_key = Column(String)  # S3 object key
    size_bytes = Column(Integer)
    metadata = Column(JSONB)  # resolution, duration, etc.
    created_at = Column(DateTime)
```

### 2. **Generated Assets**

AI-generated content created during movie production.

| Asset Type | Source | Format | Retention |
|------------|--------|--------|-----------|
| Images | Stable Diffusion, D-ID | PNG | 30 days |
| Voiceovers | ElevenLabs | MP3 | 30 days |
| Video Clips | Pika, RunwayML | MP4 | 7 days |
| Scripts | OpenAI GPT | JSON | Permanent |

### 3. **Output Assets**

Final rendered movies ready for download.

| Asset Type | Format | Quality | Storage |
|------------|--------|---------|---------|
| Final Movie | MP4 | 1080p, 4K | S3 + CDN |
| Thumbnails | JPG | 1280x720 | S3 |
| Subtitles | SRT, VTT | N/A | S3 |

---

## Storage Architecture

### S3 Bucket Structure

```
ai-movie-maker-assets/
├── uploads/
│   ├── images/{user_id}/{asset_id}.jpg
│   ├── audio/{user_id}/{asset_id}.mp3
│   └── video/{user_id}/{asset_id}.mp4
├── generated/
│   ├── images/{movie_id}/{scene_id}.png
│   ├── audio/{movie_id}/{scene_id}.mp3
│   └── video/{movie_id}/{scene_id}.mp4
├── renders/
│   ├── {movie_id}/final.mp4
│   └── {movie_id}/thumbnail.jpg
└── temp/
    └── {job_id}/  # Auto-deleted after 24 hours
```

### Storage Strategy

```python
from enum import Enum

class StorageClass(Enum):
    HOT = "STANDARD"          # Frequently accessed (uploads, renders)
    WARM = "STANDARD_IA"      # Occasionally accessed (generated assets)
    COLD = "GLACIER"          # Archive (old projects)

class AssetManager:
    def __init__(self, s3_client):
        self.s3 = s3_client
        self.bucket = "ai-movie-maker-assets"
    
    async def upload_asset(self, file_path: str, s3_key: str, storage_class: StorageClass):
        """Upload asset with appropriate storage class"""
        with open(file_path, 'rb') as f:
            self.s3.put_object(
                Bucket=self.bucket,
                Key=s3_key,
                Body=f,
                StorageClass=storage_class.value,
                ServerSideEncryption='AES256'
            )
    
    async def generate_presigned_url(self, s3_key: str, expiration: int = 3600):
        """Generate signed URL for secure downloads"""
        return self.s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket, 'Key': s3_key},
            ExpiresIn=expiration
        )
```

### Lifecycle Policies

```json
{
  "Rules": [
    {
      "Id": "TransitionGeneratedAssets",
      "Status": "Enabled",
      "Prefix": "generated/",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ]
    },
    {
      "Id": "DeleteTempFiles",
      "Status": "Enabled",
      "Prefix": "temp/",
      "Expiration": {
        "Days": 1
      }
    }
  ]
}
```

---

## AI Model Management

### 1. **OpenAI Models (Script Generation)**

**Configuration:**
```python
from openai import AsyncOpenAI

class ScriptGenerator:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = "gpt-4"  # or gpt-4-turbo
        
    async def generate_script(self, prompt: str, style: str = "dramatic"):
        """Generate movie script from prompt"""
        system_prompt = f"""
        You are a professional screenwriter. Generate a compelling movie script
        in a {style} style. Structure the script with clear scenes, dialogue,
        and visual descriptions.
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4096
        )
        
        return response.choices[0].message.content
```

**Cost Optimization:**
- Cache common prompts and responses
- Use streaming for long scripts
- Implement prompt length validation
- Use `gpt-4o-mini` for simple tasks

### 2. **ElevenLabs (Text-to-Speech)**

**Configuration:**
```python
from elevenlabs import AsyncElevenLabs

class VoiceGenerator:
    def __init__(self, api_key: str):
        self.client = AsyncElevenLabs(api_key=api_key)
        self.voice_id = "21m00Tcm4TlvDq8ikWAM"  # Rachel voice
        self.model = "eleven_multilingual_v2"
    
    async def generate_voiceover(self, text: str, output_path: str):
        """Generate voiceover from text"""
        audio = await self.client.generate(
            text=text,
            voice=self.voice_id,
            model=self.model
        )
        
        with open(output_path, 'wb') as f:
            for chunk in audio:
                f.write(chunk)
```

**Voice Selection:**
| Voice ID | Name | Language | Style |
|----------|------|----------|-------|
| 21m00Tcm4TlvDq8ikWAM | Rachel | English | Narrative |
| 29vD33N1CtxCmqQRPOHJ | Drew | English | Professional |
| EXAVITQu4vr4xnSDxMaL | Bella | English | Conversational |

### 3. **Stable Diffusion (Image Generation)**

**Configuration:**
```python
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation

class ImageGenerator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.engine = "stable-diffusion-xl-1024-v1-0"
    
    async def generate_scene_image(self, prompt: str, negative_prompt: str = ""):
        """Generate image for movie scene"""
        # Configuration
        steps = 50
        cfg_scale = 7.0
        width = 1024
        height = 576  # 16:9 aspect ratio
        
        # API call to Stability AI
        # ... implementation
```

**Prompt Engineering Best Practices:**
```python
def create_scene_prompt(scene_description: str, style: str = "cinematic") -> str:
    """Create optimized prompt for scene generation"""
    base_prompt = f"{scene_description}, {style} lighting, highly detailed, 4k"
    negative_prompt = "blurry, low quality, distorted, text, watermark"
    
    return base_prompt, negative_prompt
```

### 4. **Video Generation Models**

**D-ID (Talking Head Videos):**
```python
import aiohttp

class TalkingHeadGenerator:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.d-id.com"
    
    async def create_talking_head(self, image_url: str, audio_url: str):
        """Create talking head video from image + audio"""
        async with aiohttp.ClientSession() as session:
            headers = {"Authorization": f"Basic {self.api_key}"}
            payload = {
                "source_url": image_url,
                "script": {
                    "type": "audio",
                    "audio_url": audio_url
                }
            }
            
            async with session.post(
                f"{self.base_url}/talks",
                json=payload,
                headers=headers
            ) as response:
                return await response.json()
```

---

## File Processing Pipeline

### Video Assembly Workflow

```python
import ffmpeg
from pathlib import Path

class VideoAssembler:
    def __init__(self, output_dir: str):
        self.output_dir = Path(output_dir)
    
    async def assemble_movie(
        self,
        scenes: list[dict],
        output_filename: str,
        resolution: str = "1920x1080"
    ):
        """
        Assemble movie from scene assets
        
        Args:
            scenes: List of scene dictionaries with 'image', 'audio', 'duration'
            output_filename: Output video filename
            resolution: Video resolution (default 1920x1080)
        """
        temp_clips = []
        
        # Step 1: Create video clip for each scene
        for i, scene in enumerate(scenes):
            clip_path = self.output_dir / f"scene_{i}.mp4"
            
            # Combine image + audio into video clip
            (
                ffmpeg
                .input(scene['image'], loop=1, t=scene['duration'])
                .input(scene['audio'])
                .output(
                    str(clip_path),
                    vcodec='libx264',
                    acodec='aac',
                    r=30,
                    pix_fmt='yuv420p',
                    shortest=None
                )
                .overwrite_output()
                .run(quiet=True)
            )
            
            temp_clips.append(clip_path)
        
        # Step 2: Concatenate all clips
        concat_list = self.output_dir / "concat.txt"
        with open(concat_list, 'w') as f:
            for clip in temp_clips:
                f.write(f"file '{clip}'\n")
        
        output_path = self.output_dir / output_filename
        
        (
            ffmpeg
            .input(str(concat_list), format='concat', safe=0)
            .output(
                str(output_path),
                vcodec='libx264',
                crf=23,
                preset='medium',
                acodec='aac',
                audio_bitrate='192k'
            )
            .overwrite_output()
            .run(quiet=True)
        )
        
        # Step 3: Cleanup temp files
        for clip in temp_clips:
            clip.unlink()
        concat_list.unlink()
        
        return output_path
```

### Video Quality Settings

```python
from enum import Enum

class VideoQuality(Enum):
    LOW = {
        "resolution": "854x480",
        "bitrate": "1000k",
        "crf": 28
    }
    MEDIUM = {
        "resolution": "1280x720",
        "bitrate": "2500k",
        "crf": 23
    }
    HIGH = {
        "resolution": "1920x1080",
        "bitrate": "5000k",
        "crf": 20
    }
    ULTRA = {
        "resolution": "3840x2160",
        "bitrate": "15000k",
        "crf": 18
    }
```

---

## Storage Best Practices

### 1. **Cost Optimization**

```python
class StorageOptimizer:
    async def cleanup_old_assets(self, days: int = 30):
        """Delete assets older than specified days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        old_assets = await db.query(Asset).filter(
            Asset.created_at < cutoff_date,
            Asset.asset_type.in_(['generated_image', 'generated_audio'])
        ).all()
        
        for asset in old_assets:
            # Delete from S3
            s3_client.delete_object(Bucket=BUCKET, Key=asset.s3_key)
            # Delete from database
            await db.delete(asset)
        
        await db.commit()
    
    async def compress_old_renders(self, days: int = 90):
        """Compress old render files to save storage"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        old_renders = await db.query(Asset).filter(
            Asset.created_at < cutoff_date,
            Asset.asset_type == 'final_render'
        ).all()
        
        for render in old_renders:
            # Re-encode with higher compression
            # Move to cheaper storage class (GLACIER)
            pass
```

### 2. **Access Patterns**

```python
from functools import lru_cache

class AssetCache:
    @lru_cache(maxsize=1000)
    async def get_asset_url(self, asset_id: str) -> str:
        """Cache frequently accessed asset URLs"""
        asset = await db.query(Asset).filter(Asset.id == asset_id).first()
        return await asset_manager.generate_presigned_url(asset.s3_key)
```

### 3. **Monitoring**

```python
import prometheus_client

# Metrics
storage_usage = prometheus_client.Gauge(
    'storage_bytes_used',
    'Total storage usage in bytes',
    ['asset_type']
)

upload_size = prometheus_client.Histogram(
    'upload_size_bytes',
    'Distribution of upload sizes'
)

def track_storage_metrics():
    """Track storage usage across asset types"""
    for asset_type in ['image', 'audio', 'video', 'render']:
        total_size = db.query(
            func.sum(Asset.size_bytes)
        ).filter(
            Asset.asset_type == asset_type
        ).scalar()
        
        storage_usage.labels(asset_type=asset_type).set(total_size or 0)
```

---

## Model Update Strategy

### Version Management

```python
class ModelVersion(Base):
    __tablename__ = "model_versions"
    
    id = Column(String, primary_key=True)
    model_name = Column(String)  # openai, elevenlabs, stable-diffusion
    version = Column(String)
    released_at = Column(DateTime)
    is_active = Column(Boolean, default=False)
    performance_metrics = Column(JSONB)

# Example: Switch to new model version
async def update_model_version(model_name: str, new_version: str):
    """Switch to new AI model version"""
    # Deactivate old version
    await db.query(ModelVersion).filter(
        ModelVersion.model_name == model_name,
        ModelVersion.is_active == True
    ).update({"is_active": False})
    
    # Activate new version
    new_model = ModelVersion(
        model_name=model_name,
        version=new_version,
        released_at=datetime.utcnow(),
        is_active=True
    )
    db.add(new_model)
    await db.commit()
```

---

## Troubleshooting

### Common Issues

1. **Out of storage space**
   - Run cleanup job: `python scripts/cleanup_assets.py --days 30`
   - Check S3 lifecycle policies are active

2. **Slow video rendering**
   - Increase Celery worker resources
   - Use GPU instances for FFmpeg
   - Reduce video quality settings

3. **AI model timeouts**
   - Implement retry logic with exponential backoff
   - Use async/await for concurrent requests
   - Cache common prompts and responses

---

**Last Updated**: 2025-01-07  
**Maintainer**: DevOps Team
