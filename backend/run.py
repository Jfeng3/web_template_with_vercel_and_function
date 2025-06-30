#!/usr/bin/env python3
"""
Run script for the FastAPI backend server.
Usage: python run.py
"""

import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    import uvicorn
    from app.main import app
except ImportError as e:
    print(f"Import error: {e}")
    print("Please make sure you have installed all dependencies:")
    print("pip install -r requirements.txt")
    sys.exit(1)

if __name__ == "__main__":
    print("Starting AI Video Creation Studio Backend...")
    print("API Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )