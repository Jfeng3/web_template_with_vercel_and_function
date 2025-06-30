from fastapi import APIRouter
from app.api.v1.endpoints import videos, ai_generation, projects, health

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(videos.router, prefix="/videos", tags=["videos"])
api_router.include_router(ai_generation.router, prefix="/ai", tags=["ai-generation"])