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

### Key Files
- `src/pages/Index.tsx` - Main notes interface
- `src/api/notes.ts` - Database operations
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