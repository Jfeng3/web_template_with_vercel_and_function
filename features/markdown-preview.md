# Markdown Support with Tiptap Editor

## Overview
Implement rich text editing with Tiptap editor for real-time WYSIWYG markdown experience. Users see formatted text as they type, with markdown shortcuts for quick formatting.

## Core Functionality
- WYSIWYG editing with Tiptap editor
- Markdown shortcuts (e.g., "# " creates heading)
- Support headers, bold, italic, lists, links, code
- Real-time formatting without separate preview
- Export to markdown for storage
- Render stored markdown in note cards

## Technical Implementation

### Dependencies
```bash
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-typography @tiptap/extension-placeholder
```

### Features to Include
- **StarterKit**: Basic formatting (bold, italic, headings, lists)
- **Typography**: Smart quotes, ellipsis, em/en dashes
- **Placeholder**: Helpful placeholder text
- **Markdown shortcuts**: Type "# " for H1, "## " for H2, etc.

### Styling Integration
- Use ocean color palette for editor styling
- Match shadcn design system components
- Consistent with existing UI patterns

## User Experience
1. User types in WYSIWYG editor
2. Markdown shortcuts work instantly ("# " → Heading 1)
3. Visual formatting applied immediately
4. Content saved as markdown to database
5. Note cards render markdown with ReactMarkdown

## Editor Configuration
- Headings (H1-H3)
- Bold and italic text
- Ordered and unordered lists
- Links with preview
- Inline code
- Keyboard shortcuts
- Focus management
- Word count integration