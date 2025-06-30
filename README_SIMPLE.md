# Video Creation Studio - Simplified Version

A minimal video creation tool with AI integration.

## Quick Start

### Frontend
```bash
pnpm install
pnpm run dev
```

### Backend
```bash
cd backend
pip install -r requirements_simple.txt
python run_simple.py
```

## Features

- Create projects
- Upload media files
- Generate AI content (images/videos)

## API Endpoints

- `POST /projects` - Create project
- `GET /projects` - List projects
- `POST /upload` - Upload file
- `POST /generate` - Start AI generation
- `GET /generate/{id}` - Check generation status

That's it! Simple and straightforward.