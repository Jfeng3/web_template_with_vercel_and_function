# Fix Duplicate Speech Recording

## Overview
Fix the issue where speech input is sometimes recorded and written twice when using the microphone feature.

## Core Functionality
- Prevent duplicate speech recognition results from being added to the text editor
- Ensure final transcripts are only processed once
- Handle edge cases where recognition events fire multiple times

## User Flow
1. User clicks microphone button to start recording
2. Speech is captured and transcribed in real-time
3. When speech ends, text is added to editor only once
4. No duplicate text appears in the editor