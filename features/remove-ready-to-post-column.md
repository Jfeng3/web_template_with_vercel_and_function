# Remove Ready to Post Column

## 1. Overview
Simplify the workflow by removing the "Ready to Post" column and keeping only the "Draft" column for all notes.

## 2. Core Functionality
- Remove ready_to_post status from database schema
- Update UI to show single Draft column
- Migrate existing ready_to_post notes to draft status
- Remove drag-and-drop between columns

## 3. User Flow
1. User creates notes directly in Draft column
2. All notes remain in Draft until deleted
3. Simplified single-column view for better focus