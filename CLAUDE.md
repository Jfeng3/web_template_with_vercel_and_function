# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simple Video Creation Studio - A minimal React + FastAPI application for creating videos with AI.

## Development Commands

### Frontend
```bash
pnpm install
pnpm run dev  # Port 8080
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python run.py  # Port 8000
```

## Architecture

### Simple Structure
- Frontend: Single React component (`src/App.tsx`)
- Backend: Single FastAPI file (`backend/app/main.py`)
- Minimal dependencies, no over-engineering

### Key Files
- `src/App.tsx` - Main React component with 3 features
- `backend/app/main.py` - FastAPI with 5 endpoints
- `backend/run.py` - Simple run script

## Features

1. **Project Management** - Create and list projects
2. **File Upload** - Upload media files
3. **AI Generation** - Generate images/videos with prompts

## API Endpoints

- `POST /projects` - Create project (name parameter)
- `GET /projects` - List all projects
- `POST /upload` - Upload file (multipart form)
- `POST /generate` - Start AI generation (prompt, type)
- `GET /generate/{id}` - Check generation status

## Development Guidelines

1. **Keep it simple** - No over-engineering
2. **Minimal changes** - Only implement what's requested
3. **No complex abstractions** - Direct, straightforward code
4. **In-memory storage** - No complex database setup required