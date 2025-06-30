from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ProjectStatus(str, Enum):
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ARCHIVED = "archived"

class AIGenerationType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    TEXT = "text"

class AIProvider(str, Enum):
    MIDJOURNEY = "midjourney"
    OPENAI = "openai"
    RUNWAY = "runway"
    ELEVENLABS = "elevenlabs"
    VEO3 = "veo3"

# Project schemas
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    resolution: str = Field(default="1920x1080")
    fps: int = Field(default=30, ge=1, le=120)

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[ProjectStatus] = None
    resolution: Optional[str] = None
    fps: Optional[int] = Field(None, ge=1, le=120)

class Project(ProjectBase):
    id: int
    status: ProjectStatus
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Video/Media schemas
class MediaBase(BaseModel):
    filename: str
    file_type: str
    file_size: int
    duration: Optional[float] = None

class MediaCreate(MediaBase):
    project_id: int

class Media(MediaBase):
    id: int
    project_id: int
    file_path: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# AI Generation schemas
class AIGenerationRequest(BaseModel):
    type: AIGenerationType
    provider: AIProvider
    prompt: str = Field(..., min_length=1, max_length=2000)
    parameters: Optional[Dict[str, Any]] = Field(default_factory=dict)
    project_id: Optional[int] = None

class AIGenerationResponse(BaseModel):
    id: str
    type: AIGenerationType
    provider: AIProvider
    status: str
    result_url: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime
    estimated_completion: Optional[datetime] = None

# Video processing schemas
class VideoProcessingRequest(BaseModel):
    media_ids: List[int]
    operations: List[Dict[str, Any]]
    output_format: str = Field(default="mp4")
    quality: str = Field(default="high")

class VideoProcessingResponse(BaseModel):
    task_id: str
    status: str
    progress: float = Field(default=0.0, ge=0.0, le=100.0)
    result_url: Optional[str] = None
    estimated_completion: Optional[datetime] = None

# Timeline/Clip schemas
class TimelineClip(BaseModel):
    id: Optional[int] = None
    media_id: int
    start_time: float = Field(ge=0)
    end_time: float = Field(gt=0)
    track: int = Field(ge=0)
    position: float = Field(ge=0)
    effects: Optional[List[Dict[str, Any]]] = Field(default_factory=list)

class Timeline(BaseModel):
    project_id: int
    clips: List[TimelineClip]
    total_duration: float = Field(ge=0)

# Error response schemas
class ErrorResponse(BaseModel):
    error: str
    message: str
    details: Optional[Dict[str, Any]] = None