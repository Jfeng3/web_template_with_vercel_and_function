# Left Sidebar Feature

## Overview
Minimal sidebar with three sections: note filters, tags, and activity heatmap.

## Sections

### 1. Note Filters
- **Drafts**: Show draft notes
- **Ready**: Show ready-to-post notes

### 2. All Tags
- List of all tags used
- Click to filter notes by tag
- Show count per tag

### 3. Activity Heatmap
- GitHub-style contribution graph
- Shows days with completed posts
- Visual progress tracking

## Layout
```
┌─────────────┬──────────────────┐
│   SIDEBAR   │   MAIN CONTENT   │
│             │                  │
│ Activity    │   Note Cards     │
│ [heatmap]   │                  │
│             │                  │
│ ○ Drafts    │                  │
│ ○ Ready     │                  │
│             │                  │
│ Tags        │                  │
│ #tag1 (3)   │                  │
│ #tag2 (5)   │                  │
└─────────────┴──────────────────┘
```