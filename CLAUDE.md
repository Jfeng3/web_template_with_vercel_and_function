# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI Video Creation Studio - a monorepo containing a React frontend and FastAPI backend for creating videos with AI assistance from multiple providers (Midjourney, Veo3, OpenAI, Runway, ElevenLabs).

## Development Commands

### Frontend (React/Vite)
```bash
pnpm install          # Install dependencies  
pnpm run dev          # Dev server on port 8080
pnpm run build        # Production build
pnpm run lint         # ESLint checking
```

### Backend (FastAPI)
```bash
cd backend
python -m venv venv && source venv/bin/activate  # Setup virtual env
pip install -r requirements.txt                  # Install dependencies
python run.py                                    # Dev server on port 8000
```

### Development Workflow
Run both servers simultaneously:
- Frontend: http://localhost:8080 
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Architecture

### Monorepo Structure
- `src/` - React frontend with TypeScript
- `backend/` - FastAPI backend with Python
- Communication via REST API with CORS enabled

### Frontend Architecture
- **React 18** with **Vite** build tool
- **shadcn/ui** components (Radix UI primitives) + Tailwind CSS
- **TanStack Query** for server state management
- **React Router v6** for routing
- **React Hook Form + Zod** for form validation

Key Components:
- `VideoEditor` - Main editing interface orchestrator
- `Timeline` - Video timeline with tracks and clips
- `ChatSidebar` - AI assistant interface
- `PropertiesPanel` - Clip properties editor

### Backend Architecture
- **FastAPI** with **Pydantic v2** validation
- **Async/await** pattern throughout
- **Background tasks** for AI generation processing
- **Multi-provider AI integration** with unified interface

API Structure:
- `/api/v1/projects` - Project CRUD operations
- `/api/v1/videos` - Media upload/processing/timeline
- `/api/v1/ai` - AI generation endpoints
- `/health` - Health checks

### AI Integration Pattern
The `AIService` class provides unified access to multiple AI providers:
- **Midjourney** - Image generation
- **Veo3** - Video generation  
- **OpenAI** - Image/text generation
- **Runway ML** - Video effects
- **ElevenLabs** - Voice synthesis

Each provider has:
- Async background processing
- Estimated completion times
- Prompt templates
- Connection testing

## Data Flow

### Project Workflow
1. Create project → Backend stores metadata
2. Upload media → File processing and storage
3. Timeline editing → Clip arrangement and effects
4. AI generation → Queue-based async processing
5. Export/render → Video processing pipeline

### AI Generation Flow
1. User submits prompt + provider selection
2. Backend queues generation request
3. Background task processes with AI provider
4. Status polling until completion
5. Result URL provided for download

## Configuration

### Environment Setup
Backend requires `.env` file with:
```env
OPENAI_API_KEY=your_key_here
MIDJOURNEY_API_KEY=your_key_here
RUNWAY_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
ALLOWED_HOSTS=["http://localhost:8080"]
```

### CORS Configuration
Backend is pre-configured for local development with frontend on port 8080.

## Key Architectural Decisions

1. **Package Manager**: Project uses **pnpm** (not npm/yarn)
2. **Import Strategy**: Backend uses absolute imports (`from app.models`)
3. **State Management**: Local React state + TanStack Query for server state
4. **AI Processing**: Queue-based background tasks for long-running operations
5. **File Organization**: Timeline-based video editing with track/clip structure

## Development Notes

### Frontend Development
- Uses **shadcn/ui** component system with Tailwind
- Path aliases configured (`@/components`)
- Mock data for UI development (check for hardcoded clips/messages)
- Dark mode support built-in

### Backend Development
- Run script handles Python path setup automatically
- Mock databases used (replace with real DB for production)
- Background task simulation (reduce wait times for demo)
- Comprehensive error handling and validation

### Testing Approach
- Frontend: React Testing Library planned
- Backend: pytest with async support
- API endpoints have comprehensive error handling

## Common Development Tasks

When adding new AI providers:
1. Update `AIProvider` enum in `schemas.py`
2. Add provider config in `ai_service.py`
3. Implement provider-specific logic
4. Add prompt templates

When adding new video operations:
1. Define schemas in `models/schemas.py`
2. Add endpoint in `api/v1/endpoints/videos.py`
3. Implement processing logic
4. Update frontend components

When modifying timeline functionality:
1. Update Timeline component and schemas
2. Ensure clip validation in backend
3. Test with multiple media types
4. Consider timeline performance with many clips