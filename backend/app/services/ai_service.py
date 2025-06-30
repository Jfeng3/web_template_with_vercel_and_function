import asyncio
import httpx
from typing import Dict, List, Any, Optional
from app.models.schemas import AIGenerationType, AIProvider, AIGenerationRequest, AIGenerationResponse
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class AIService:
    """Service for handling AI generation requests"""
    
    def __init__(self):
        self.provider_configs = {
            AIProvider.OPENAI: {
                "api_key": settings.OPENAI_API_KEY,
                "base_url": "https://api.openai.com/v1",
                "supported_types": [AIGenerationType.IMAGE, AIGenerationType.TEXT]
            },
            AIProvider.MIDJOURNEY: {
                "api_key": settings.MIDJOURNEY_API_KEY,
                "base_url": "https://api.midjourney.com/v1",
                "supported_types": [AIGenerationType.IMAGE]
            },
            AIProvider.RUNWAY: {
                "api_key": settings.RUNWAY_API_KEY,
                "base_url": "https://api.runway.com/v1",
                "supported_types": [AIGenerationType.VIDEO, AIGenerationType.IMAGE]
            },
            AIProvider.ELEVENLABS: {
                "api_key": settings.ELEVENLABS_API_KEY,
                "base_url": "https://api.elevenlabs.io/v1",
                "supported_types": [AIGenerationType.AUDIO]
            },
            AIProvider.VEO3: {
                "api_key": None,  # VEO3 configuration would go here
                "base_url": "https://api.veo3.com/v1",
                "supported_types": [AIGenerationType.VIDEO]
            }
        }
    
    def is_provider_available(self, provider: AIProvider) -> bool:
        """Check if a provider is available and configured"""
        return self.is_provider_configured(provider)
    
    def is_provider_configured(self, provider: AIProvider) -> bool:
        """Check if a provider is properly configured"""
        config = self.provider_configs.get(provider)
        if not config:
            return False
        
        # For now, just check if API key exists (except for VEO3 which might use different auth)
        if provider == AIProvider.VEO3:
            return True  # Mock as available for demo
        
        return config.get("api_key") is not None
    
    def get_supported_types(self, provider: AIProvider) -> List[str]:
        """Get supported generation types for a provider"""
        config = self.provider_configs.get(provider, {})
        return [t.value for t in config.get("supported_types", [])]
    
    def estimate_completion_time(self, generation_type: AIGenerationType, provider: AIProvider) -> int:
        """Estimate completion time in seconds"""
        base_times = {
            AIGenerationType.IMAGE: 30,
            AIGenerationType.VIDEO: 180,
            AIGenerationType.AUDIO: 60,
            AIGenerationType.TEXT: 10
        }
        
        provider_multipliers = {
            AIProvider.OPENAI: 1.0,
            AIProvider.MIDJOURNEY: 1.5,
            AIProvider.RUNWAY: 2.0,
            AIProvider.ELEVENLABS: 1.2,
            AIProvider.VEO3: 3.0
        }
        
        base_time = base_times.get(generation_type, 60)
        multiplier = provider_multipliers.get(provider, 1.0)
        
        return int(base_time * multiplier)
    
    async def process_generation(
        self,
        generation_id: str,
        request: AIGenerationRequest,
        generations_db: Dict[str, AIGenerationResponse]
    ):
        """Process an AI generation request in the background"""
        try:
            # Update status to processing
            if generation_id in generations_db:
                generations_db[generation_id].status = "processing"
            
            # Simulate AI generation process
            await self._simulate_ai_generation(request)
            
            # Mock result URL - in real implementation, this would be the actual generated content
            result_url = f"https://storage.example.com/generated/{generation_id}.{self._get_file_extension(request.type)}"
            
            # Update with success
            if generation_id in generations_db:
                generations_db[generation_id].status = "completed"
                generations_db[generation_id].result_url = result_url
            
            logger.info(f"Generation {generation_id} completed successfully")
            
        except Exception as e:
            # Update with error
            if generation_id in generations_db:
                generations_db[generation_id].status = "failed"
                generations_db[generation_id].error_message = str(e)
            
            logger.error(f"Generation {generation_id} failed: {str(e)}")
    
    async def _simulate_ai_generation(self, request: AIGenerationRequest):
        """Simulate AI generation process"""
        # Simulate processing time based on type and provider
        wait_time = self.estimate_completion_time(request.type, request.provider)
        
        # For demo purposes, reduce wait time significantly
        demo_wait_time = min(wait_time / 10, 5)  # Max 5 seconds for demo
        
        await asyncio.sleep(demo_wait_time)
        
        # Simulate potential failure (10% chance)
        import random
        if random.random() < 0.1:
            raise Exception("Simulated AI generation failure")
    
    def _get_file_extension(self, generation_type: AIGenerationType) -> str:
        """Get appropriate file extension for generation type"""
        extensions = {
            AIGenerationType.IMAGE: "png",
            AIGenerationType.VIDEO: "mp4",
            AIGenerationType.AUDIO: "mp3",
            AIGenerationType.TEXT: "txt"
        }
        return extensions.get(generation_type, "bin")
    
    def test_provider_connection(self, provider: AIProvider) -> bool:
        """Test connection to a specific provider"""
        # Mock implementation - in real scenario, make actual API calls
        if not self.is_provider_configured(provider):
            return False
        
        # Simulate connection test
        return True
    
    def get_prompt_templates(self, provider: AIProvider) -> List[Dict[str, Any]]:
        """Get prompt templates for a specific provider"""
        templates = {
            AIProvider.MIDJOURNEY: [
                {
                    "name": "Photorealistic Portrait",
                    "prompt": "photorealistic portrait of {subject}, professional lighting, 8k resolution --ar 16:9 --v 6",
                    "parameters": {"aspect_ratio": "16:9", "version": "6"}
                },
                {
                    "name": "Cinematic Scene",
                    "prompt": "cinematic {scene_description}, dramatic lighting, film grain, shot on ARRI Alexa --ar 21:9 --v 6",
                    "parameters": {"aspect_ratio": "21:9", "version": "6"}
                }
            ],
            AIProvider.OPENAI: [
                {
                    "name": "Simple Description",
                    "prompt": "A {style} image of {subject} in {setting}",
                    "parameters": {"size": "1024x1024", "quality": "hd"}
                }
            ],
            AIProvider.RUNWAY: [
                {
                    "name": "Text to Video",
                    "prompt": "{action_description}, cinematic quality, 4K resolution",
                    "parameters": {"duration": 4, "resolution": "1280x768"}
                }
            ],
            AIProvider.ELEVENLABS: [
                {
                    "name": "Narrator Voice",
                    "prompt": "{text_to_speak}",
                    "parameters": {"voice": "narrator", "stability": 0.7, "clarity": 0.8}
                }
            ],
            AIProvider.VEO3: [
                {
                    "name": "High Quality Video",
                    "prompt": "{video_description}, high quality, realistic motion",
                    "parameters": {"resolution": "1920x1080", "fps": 30, "duration": 5}
                }
            ]
        }
        
        return templates.get(provider, [])