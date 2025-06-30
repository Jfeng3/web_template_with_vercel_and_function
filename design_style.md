# Design System - Clarity & Minimalism

Design principles focused on immediate clarity, readability, and minimalism.

## Core Principles

1. **Immediate Clarity** - Strong contrast and clear visual hierarchy
2. **Readability** - Optimized typography and spacing for scanning
3. **Minimalism** - Only essential elements, no decoration
4. **Strong Contrast** - Text must be instantly readable

## Icons

### Default Icon Library
```bash
npm install @heroicons/react
```

**Heroicons** is our default icon library for consistency and comprehensive coverage.

### Icon Sizing
```tsx
/* Standard sizes */
w-3 h-3   /* 12px - Inline text icons */
w-4 h-4   /* 16px - Button icons */
w-5 h-5   /* 20px - Status indicators */
w-6 h-6   /* 24px - Section headers */
w-8 h-8   /* 32px - Large indicators */
```

### Icon Colors
```tsx
/* Status Colors */
text-green-600    /* Success states */
text-yellow-600   /* Warning/Pending states */
text-red-600      /* Error states */
text-gray-400     /* Disabled/Neutral states */
text-blue-600     /* Information/Active states */

/* Interactive Colors */
text-primary-accent         /* Primary actions */
text-primary-secondaryText  /* Secondary content */
hover:text-primary-accent   /* Hover states */
```

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

## Dark Mode

### Dark Mode Colors
```css
/* Backgrounds */
dark-primary-bg: #111827     /* Dark page background */
dark-primary-card: #1F2937   /* Dark cards */
dark-secondary-card: #374151 /* Darker sections/inputs */
dark-input-bg: #4B5563      /* Input backgrounds */

/* Text - High Contrast */
dark-primary-text: #FFFFFF   /* White for titles */
dark-secondary-text: #9CA3AF /* Light gray for metadata */
dark-placeholder: #6B7280    /* Placeholder text */
dark-hover-text: #D1D5DB     /* Hover text states */

/* Accent */
dark-primary-accent: #2563EB /* Blue for primary actions */
dark-accent-hover: #3B82F6   /* Blue hover state */

/* UI Elements */
dark-divider: #374151        /* Dark borders */
dark-input-border: #4B5563   /* Input borders */
```

### Dark Mode Components

#### Cards
```tsx
<div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6">
  Content
</div>
```

#### Buttons
```tsx
/* Primary */
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors">
  Action
</button>

/* Secondary */
<button className="text-gray-400 hover:text-gray-300 transition-colors">
  Action
</button>
```

#### Form Elements
```tsx
<input className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-white" />
```

#### Interactive Elements
```tsx
/* Hover states */
<div className="hover:bg-gray-800 cursor-pointer transition-colors">
  Content
</div>

/* Selection states */
<div className={`w-5 h-5 rounded border-2 transition-colors ${
  isSelected 
    ? 'bg-blue-600 border-blue-600' 
    : 'border-gray-600'
}`}>
  {isSelected && <Check size={12} className="text-white" />}
</div>
```

#### Toast Notifications
```tsx
<div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
  <span className="text-sm font-medium">Success message</span>
</div>
```

### Dark Mode Rules

- **Enhanced shadows** - Use `shadow-2xl` for depth in dark environments
- **Blue accents** - Primary actions use blue (#2563EB) instead of black
- **Smooth transitions** - All interactive elements use `transition-colors`
- **Layered grays** - Multiple gray levels for hierarchy (900 → 800 → 700 → 600)
- **High contrast text** - White text on dark backgrounds for readability
- **Subtle borders** - Dark gray borders for definition without harshness

## Rules

- **No decorative elements** - Only functional UI
- **Maximum contrast** - Black text on white/cream backgrounds
- **Minimal shadows** - `shadow-sm` only for depth
- **Clean borders** - Light gray dividers only
- **Spacious layout** - Generous whitespace for readability
- **Consistent spacing** - Use 8px grid system 