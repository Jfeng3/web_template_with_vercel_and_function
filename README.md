# Daily Notes Writer

A minimal React application for content creators to write and manage daily notes with AI assistance.

## Overview

Daily Notes Writer helps content creators capture, refine, and organize their thoughts through:
- **Two-stage workflow**: Draft → Ready to Post
- **AI-powered assistance**: Rephrasing, feedback, and phrase suggestions  
- **Voice transcription**: Convert speech to text
- **Weekly focus tags**: Organize notes by weekly themes
- **300-word limit**: Keep notes concise and focused

## Quick Start

### Option 1: Single Command (Recommended)
```bash
pnpm install
pnpm dev:backend
```
Access your app at: **http://localhost:3000**

### Option 2: Separate Processes
```bash
# Terminal 1: Backend
pnpm dev:backend

# Terminal 2: Frontend  
pnpm dev
```
Access your app at: **http://localhost:8080**

## Development Environment

### How It Works

Your webapp has **two parts** working together:

1. **Frontend (React App)**: User interface in `src/` folder
2. **Backend (API Functions)**: Server logic in `api/` folder

### CLI Commands

| Command | What It Does | Port |
|---------|--------------|------|
| `pnpm dev:backend` | Runs both frontend & backend together | 3000 |
| `pnpm dev` | Runs frontend only with proxy | 8080 |
| `pnpm build` | Builds frontend for production | - |
| `pnpm deploy` | Deploys to Vercel | - |

### Request Flow

**Single Process (Port 3000):**
```
Browser → http://localhost:3000 → Vercel Dev Server
                                      ↓
                    Frontend (React) OR API Function
```

**Separate Processes:**
```
Browser → http://localhost:8080 → Vite Dev Server
                                      ↓
        Frontend (React) OR Proxy to port 3000
                                      ↓
                              Vercel Functions
```

### File Compilation

- **Frontend** (`src/*.tsx`): Vite compiles → Browser
- **Backend** (`api/*.ts`): Vercel compiles → Node.js

### API Requests Example
```javascript
// In React component
fetch('/api/rephrase', {
  method: 'POST', 
  body: JSON.stringify({ content: 'text to rephrase' })
})
```

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | React + Vite + TypeScript | User interface |
| Backend | Vercel Functions + Node.js | API endpoints |
| Database | Supabase (PostgreSQL) | Data storage |
| AI | OpenAI GPT-4 | Text processing |
| Styling | Tailwind CSS + shadcn/ui | UI components |
| State | Zustand | Global state management |
| Deployment | Vercel | Hosting platform |

## Features

- ✅ **Note Management** - Create, edit, organize notes
- ✅ **AI Rephrasing** - Improve text with conversational tone
- ✅ **Voice Transcription** - Speech-to-text conversion
- ✅ **AI Feedback** - Get writing suggestions and scores
- ✅ **Phrase Bank** - Smart phrase improvement suggestions
- ✅ **Weekly Tags** - Focus themes for organization
- ✅ **Two-stage Workflow** - Draft and Ready to Post columns
- ✅ **Word Count Tracking** - 300-word limit enforcement

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/rephrase` | POST | Rephrase text with AI |
| `/api/critic` | POST | Get writing feedback |
| `/api/phrase-bank` | POST | Get phrase suggestions |
| `/api/transcribe` | POST | Convert audio to text |

## Environment Setup

Create `.env.local` file:
```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
```bash
# Generate database schema
pnpm db:generate

# Push schema to Supabase
pnpm db:push

# Open database studio
pnpm db:studio
```

## Architecture

### Module System
- **ESM**: Uses `"type": "module"` in package.json
- **Node.js Resolution**: TypeScript configured with `"moduleResolution": "NodeNext"`
- **Import Extensions**: API files use `.js` extensions for Node.js compatibility

### State Management
- **Zustand Store**: `src/stores/notesStore.ts` manages all application state
- **Pessimistic Updates**: Waits for database confirmation before UI updates
- **No Real-time**: Doesn't listen for external database changes

### Data Flow
```
React Components → API Functions → Supabase Database → UI Updates
```

## Development Guidelines

1. **Keep it simple** - Minimal changes, no over-engineering
2. **300-word limit** - Enforce concise content
3. **Two-stage workflow** - Draft → Ready to Post
4. **AI enhancement** - Improve but preserve user voice
5. **Weekly focus** - Use tags for organization

## Deployment

```bash
# Deploy to production
pnpm deploy
```

**What happens:**
1. Vercel builds React frontend → Static files on CDN
2. Vercel compiles TypeScript API functions → Serverless functions  
3. Everything served from one domain: `yourapp.vercel.app`

## Troubleshooting

### Common Issues

**Module not found errors:**
- API functions need `.js` extensions in imports
- Frontend files don't need extensions (bundled by Vite)

**Port conflicts:**
- Use `pnpm dev:backend` for single process
- Or run separate processes on different ports

**Build failures:**
- Check TypeScript compilation: `pnpm build`
- Verify environment variables are set

### Development Tips

- Use `pnpm dev:backend` for simplest setup
- API functions run in Node.js, need proper ESM imports
- Frontend uses Vite bundling, more flexible imports
- Check `ai_docs/discussions/` for detailed technical notes

That's it! Simple, focused, and ready for content creation.