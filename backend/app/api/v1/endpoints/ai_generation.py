from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from typing import List, Dict, Any
from app.models.schemas import AIGenerationRequest, AIGenerationResponse, AIGenerationType, AIProvider
from app.services.ai_service import AIService
from app.core.config import settings
import uuid
from datetime import datetime, timedelta

router = APIRouter()

# Mock database for AI generations
generations_db = {}
ai_service = AIService()

@router.post("/generate", response_model=AIGenerationResponse, status_code=status.HTTP_201_CREATED)
async def create_ai_generation(
    request: AIGenerationRequest,
    background_tasks: BackgroundTasks
):
    """Create a new AI generation request"""
    
    # Validate provider availability
    if not ai_service.is_provider_available(request.provider):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Provider {request.provider} is not configured or available"
        )
    
    # Generate unique ID for this request
    generation_id = str(uuid.uuid4())
    
    # Estimate completion time based on type and provider
    estimated_time = ai_service.estimate_completion_time(request.type, request.provider)
    estimated_completion = datetime.utcnow() + timedelta(seconds=estimated_time)
    
    # Create generation response
    generation = AIGenerationResponse(
        id=generation_id,
        type=request.type,
        provider=request.provider,
        status="queued",
        result_url=None,
        error_message=None,
        created_at=datetime.utcnow(),
        estimated_completion=estimated_completion
    )
    
    generations_db[generation_id] = generation
    
    # Start background processing
    background_tasks.add_task(
        ai_service.process_generation,
        generation_id,
        request,
        generations_db
    )
    
    return generation

@router.get("/generate/{generation_id}", response_model=AIGenerationResponse)
async def get_generation_status(generation_id: str):
    """Get the status of an AI generation request"""
    if generation_id not in generations_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found"
        )
    
    return generations_db[generation_id]

@router.get("/generate", response_model=List[AIGenerationResponse])
async def list_generations(
    project_id: int = None,
    status_filter: str = None,
    limit: int = 50
):
    """List AI generations with optional filters"""
    generations = list(generations_db.values())
    
    # Apply filters
    if status_filter:
        generations = [g for g in generations if g.status == status_filter]
    
    # Sort by creation time (newest first) and limit
    generations.sort(key=lambda x: x.created_at, reverse=True)
    return generations[:limit]

@router.delete("/generate/{generation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_generation(generation_id: str):
    """Cancel an AI generation request"""
    if generation_id not in generations_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found"
        )
    
    generation = generations_db[generation_id]
    
    if generation.status in ["completed", "failed", "cancelled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel generation with status: {generation.status}"
        )
    
    # Update status to cancelled
    generation.status = "cancelled"
    generations_db[generation_id] = generation
    
    return None

@router.post("/providers/{provider}/test")
async def test_provider_connection(provider: AIProvider):
    """Test connection to an AI provider"""
    try:
        is_available = ai_service.test_provider_connection(provider)
        
        if is_available:
            return {
                "provider": provider,
                "status": "connected",
                "message": f"Successfully connected to {provider}"
            }
        else:
            return {
                "provider": provider,
                "status": "failed",
                "message": f"Failed to connect to {provider}"
            }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error testing {provider}: {str(e)}"
        )

@router.get("/providers")
async def list_providers():
    """List all available AI providers and their status"""
    providers_status = {}
    
    for provider in AIProvider:
        providers_status[provider.value] = {
            "available": ai_service.is_provider_available(provider),
            "configured": ai_service.is_provider_configured(provider),
            "supported_types": ai_service.get_supported_types(provider)
        }
    
    return providers_status

@router.post("/batch-generate", response_model=List[AIGenerationResponse])
async def create_batch_generation(
    requests: List[AIGenerationRequest],
    background_tasks: BackgroundTasks
):
    """Create multiple AI generation requests at once"""
    if len(requests) > 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 10 requests allowed per batch"
        )
    
    generations = []
    
    for request in requests:
        # Validate provider availability
        if not ai_service.is_provider_available(request.provider):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Provider {request.provider} is not configured or available"
            )
        
        generation_id = str(uuid.uuid4())
        estimated_time = ai_service.estimate_completion_time(request.type, request.provider)
        estimated_completion = datetime.utcnow() + timedelta(seconds=estimated_time)
        
        generation = AIGenerationResponse(
            id=generation_id,
            type=request.type,
            provider=request.provider,
            status="queued",
            result_url=None,
            error_message=None,
            created_at=datetime.utcnow(),
            estimated_completion=estimated_completion
        )
        
        generations_db[generation_id] = generation
        generations.append(generation)
        
        # Start background processing
        background_tasks.add_task(
            ai_service.process_generation,
            generation_id,
            request,
            generations_db
        )
    
    return generations

@router.get("/templates/{provider}")
async def get_provider_templates(provider: AIProvider):
    """Get prompt templates for a specific provider"""
    templates = ai_service.get_prompt_templates(provider)
    return {
        "provider": provider,
        "templates": templates
    }