# Design System - Clarity & Minimalism

Design principles focused on immediate clarity, readability, and minimalism.

## Core Principles

1. **Immediate Clarity** - Strong contrast and clear visual hierarchy
2. **Readability** - Optimized typography and spacing for scanning
3. **Minimalism** - Only essential elements, no decoration
4. **Strong Contrast** - Text must be instantly readable

## Colors

### High Contrast System
```css
/* Backgrounds */
primary-bg: #fffef9        /* Cream page background */
primary-card: #FFFFFF      /* Pure white cards */

/* Text - Maximum Contrast */
primary-text: #000000      /* Pure black for titles */
primary-secondaryText: #71717A /* Gray for metadata */

/* Accent */
primary-accent: #000000    /* Black for primary actions */

/* UI Elements */
ui-divider: #E5E5EA       /* Light borders */
ui-placeholder: #C7C7CC   /* Placeholder text */
```

## Typography

### Font Stack
```css
font-sans: 'Inter', 'SF Pro Text', -apple-system, system-ui, sans-serif
```

### Text Hierarchy
- **Page Titles**: `text-2xl font-bold text-primary-text`
- **Section Headers**: `text-lg font-semibold text-primary-text`
- **Body Text**: `text-base text-primary-text leading-relaxed`
- **Metadata**: `text-sm text-primary-secondaryText`

## Spacing

### Minimal Scale
```css
4px   /* Tight spacing */
8px   /* Small spacing */
16px  /* Standard spacing */
24px  /* Section spacing */
32px  /* Large spacing */
```

## Components

### Cards
```tsx
<div className="bg-primary-card rounded-2xl shadow-sm border border-ui-divider p-6">
  Content
</div>
```

### Buttons
```tsx
/* Primary */
<button className="bg-primary-accent text-white px-4 py-2 rounded-lg font-medium hover:opacity-90">
  Action
</button>

/* Secondary */
<button className="text-primary-text border border-ui-divider rounded-lg px-4 py-2 hover:bg-primary-bg">
  Action
</button>
```

### Form Elements
```tsx
<input className="w-full px-4 py-3 border border-ui-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-accent" />
<textarea className="w-full px-4 py-3 border border-ui-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-accent resize-none" />
```

## Layout Patterns

### Page Structure
```tsx
/* Header */
<div className="sticky top-0 bg-primary-card border-b border-ui-divider px-8 py-6">
  <h1 className="text-2xl font-bold text-primary-text">Title</h1>
</div>

/* Content */
<div className="px-8 py-8 max-w-6xl mx-auto">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Cards */}
  </div>
</div>
```

## Rules

- **No decorative elements** - Only functional UI
- **Maximum contrast** - Black text on white/cream backgrounds
- **Minimal shadows** - `shadow-sm` only for depth
- **Clean borders** - Light gray dividers only
- **Spacious layout** - Generous whitespace for readability
- **Consistent spacing** - Use 8px grid system 