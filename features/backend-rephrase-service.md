# Backend Rephrase Service

## Overview
Create backend services for text rephrasing. Separate OpenAI API service handles AI communication, while dedicated rephrase service manages rephrasing logic. Moves frontend AI logic to backend for better separation of concerns.

## Core Functionality
- OpenAI API service: Manages all OpenAI API interactions
- Rephrase service: Handles rephrasing requests and responses
- API endpoints for frontend to consume rephrase functionality
- Removes direct OpenAI calls from TextEditor component

## User Flow
1. User clicks rephrase in TextEditor
2. Frontend calls backend rephrase endpoint
3. Rephrase service processes request via OpenAI service
4. Response returned to frontend for display