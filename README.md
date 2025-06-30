# Video Creation Studio

A simple video creation tool with AI integration.

## Quick Start

### Frontend
```bash
pnpm install
pnpm run dev
```
Open http://localhost:8080

### Backend
```bash
cd backend
pip install -r requirements.txt
python run.py
```
API available at http://localhost:8000

## Features

- ✅ Create and manage projects
- ✅ Upload media files
- ✅ Generate AI content (images/videos)

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: FastAPI, Python
- Database: Supabase (optional)

## API Endpoints

- `POST /projects` - Create project
- `GET /projects` - List projects
- `POST /upload` - Upload file
- `POST /generate` - Start AI generation
- `GET /generate/{id}` - Check generation status

## Environment Setup

Create `backend/.env` file:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

That's it! Simple and straightforward.