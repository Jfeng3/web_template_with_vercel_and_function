from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Video Creation Studio"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS settings
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080"
    ]
    
    # AI Service API Keys (use environment variables)
    OPENAI_API_KEY: Optional[str] = None
    MIDJOURNEY_API_KEY: Optional[str] = None
    RUNWAY_API_KEY: Optional[str] = None
    ELEVENLABS_API_KEY: Optional[str] = None
    
    # Supabase settings
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # File storage settings
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 100 * 1024 * 1024  # 100MB
    ALLOWED_VIDEO_FORMATS: List[str] = ["mp4", "avi", "mov", "mkv"]
    ALLOWED_IMAGE_FORMATS: List[str] = ["jpg", "jpeg", "png", "gif"]
    
    # AI Generation settings
    MAX_GENERATION_TIME: int = 300  # 5 minutes
    DEFAULT_VIDEO_RESOLUTION: str = "1920x1080"
    DEFAULT_VIDEO_FPS: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()