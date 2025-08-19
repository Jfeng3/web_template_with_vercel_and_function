# Minimal Template - Vite + Vercel Functions

A clean starter template with React frontend and Vercel serverless functions backend. Perfect for rapid prototyping and new project development.

## Quick Start

```bash
# Install dependencies
pnpm install

# Development (single command)
pnpm dev:backend

# Access at: http://localhost:3000
```

## Project Structure

```
├── src/
│   └── pages/Index.tsx          # Main React page
├── api/
│   └── hello.ts                 # Simple API endpoint
├── vite.config.ts               # Vite configuration
├── vercel.json                  # Vercel deployment config
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
└── package.json                 # Dependencies & scripts
```

## Development

### Commands
- `pnpm dev:backend` - Run both frontend & API (port 3000)
- `pnpm dev` - Run frontend only (port 5173)
- `pnpm build` - Build for production
- `pnpm deploy` - Deploy to Vercel

### API Testing
The template includes a simple API endpoint at `/api/hello` that echoes messages back with timestamps.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Vercel Functions (Node.js)
- **Deployment**: Vercel
- **Module System**: ESM with proper Node.js resolution

## Configuration Files Included

- ✅ **TypeScript**: Configured for Node.js ESM
- ✅ **Vite**: React + SWC + Tailwind
- ✅ **Vercel**: Functions + deployment
- ✅ **Tailwind**: CSS framework setup
- ✅ **PostCSS**: CSS processing

## Features

- 🚀 **Fast builds** - Minimal dependencies
- 🔧 **Ready to extend** - Add features as needed
- 📱 **Responsive** - Tailwind CSS included
- 🌐 **Full-stack** - Frontend + API in one repo
- 🚢 **Deploy ready** - Vercel configuration included

## Deployment

```bash
pnpm deploy
```

Vercel automatically:
1. Builds React frontend → Static CDN
2. Compiles TypeScript API → Serverless functions
3. Serves everything from one domain

## Extending the Template

### Add New API Endpoints
Create new files in `/api` folder:
```typescript
// api/users.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ users: [] });
}
```

### Add New Pages
Create new components in `/src/pages`:
```typescript
// src/pages/About.tsx
export default function About() {
  return <div>About Page</div>;
}
```

### Add Dependencies
```bash
# Add UI library
pnpm add @radix-ui/react-dialog

# Add database
pnpm add @supabase/supabase-js

# Add state management
pnpm add zustand
```

## Environment Variables

Create `.env.local` for local development:
```env
# Add your environment variables here
API_KEY=your-api-key
DATABASE_URL=your-database-url
```

---

**Ready to build something amazing!** 🚀

This template gives you a solid foundation with modern tooling and best practices built-in.