from supabase import create_client, Client
from app.core.config import settings
from typing import Optional

class DatabaseService:
    """Minimal Supabase database service"""
    
    def __init__(self):
        self.client: Optional[Client] = None
        
    def connect(self) -> Client:
        """Create Supabase client connection"""
        if not self.client and settings.SUPABASE_URL and settings.SUPABASE_KEY:
            self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        return self.client
    
    def get_client(self) -> Client:
        """Get existing client or create new one"""
        if not self.client:
            return self.connect()
        return self.client

# Global database service instance
db_service = DatabaseService()