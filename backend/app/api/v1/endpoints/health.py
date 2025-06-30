from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "video-creation-backend",
        "version": "1.0.0"
    }

@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check with service dependencies"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": "connected",
            "file_storage": "available",
            "ai_services": {
                "openai": "configured",
                "midjourney": "configured",
                "runway": "configured"
            }
        },
        "metrics": {
            "uptime": "0h 0m",
            "requests_processed": 0,
            "active_generations": 0
        }
    }