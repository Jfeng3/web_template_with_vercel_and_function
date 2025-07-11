# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Daily Notes Writer - A minimal React application for content creators to write and manage daily notes.

# Development Instructions

Implement minimal changes, don't over engineer

## Development Commands

### Frontend
```bash
pnpm install
pnpm run dev  # Port 5173
```

## Architecture

### Simple Structure
- Frontend: React with TypeScript
- Database: Supabase (PostgreSQL) with Drizzle ORM
- API: Client-side database connection
- Minimal dependencies, no over-engineering

### Data Flow
Frontend React components call client-side API functions that directly query Supabase database and transform the data back to the UI. The app uses pessimistic updates - it waits for database confirmation then updates local React state, but it doesn't listen for external database changes in real-time.

### State Management
Uses Zustand for global state management instead of React useState hooks. The global store (`src/stores/notesStore.ts`) manages all application state including notes data, UI state, and user interactions. Components access state directly through Zustand hooks, eliminating prop drilling.

### Key Files
- `src/pages/Index.tsx` - Main notes interface
- `src/api/notes.ts` - Database operations
- `src/stores/notesStore.ts` - Global state management with Zustand
- `src/db/schema.ts` - Database schema
- `src/lib/db.ts` - Database connection

## Features

1. **Note Management** - Create, edit, and organize notes
2. **Two-Stage Workflow** - Draft and Ready to Post columns
3. **Weekly Tags** - Focus tags for each week
4. **Word Count Tracking** - Max 300 words per note

## Development Guidelines

1. **Keep it simple** - No over-engineering
2. **Minimal changes** - Only implement what's requested
3. **No complex abstractions** - Direct, straightforward code