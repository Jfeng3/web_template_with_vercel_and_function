# Shadcn Design System

This document outlines the design system implementation using shadcn/ui components for the Daily Notes Writer application.

## Setup

### Installation
```bash
npx shadcn-ui@latest init
```

### Configuration
- Components are installed in `src/components/ui/`
- Tailwind CSS for styling
- CSS variables for theming
- Radix UI primitives as foundation

## Core Components

### Typography
- **Text**: Use `cn()` utility for consistent text styling
- **Headings**: h1, h2, h3 with proper hierarchy
- **Body Text**: Regular paragraph text with proper line height

### Form Elements
- **Input**: Text inputs with focus states
- **Textarea**: Multi-line text inputs with auto-resize
- **Button**: Primary, secondary, and ghost variants
- **Label**: Associated form labels

### Layout Components
- **Card**: Container for note items and content sections
- **Separator**: Visual dividers between sections
- **Badge**: Status indicators and tags with multiple variants:
  - `default`: Blue Grotto (#189AB4) - Primary tags
  - `secondary`: Blue Green (#75E6DA) - Informational badges
  - `subtle`: Baby Blue (#D4F1F4) - Less prominent indicators
  - `strong`: Navy Blue (#05445E) - High emphasis badges

### Interactive Components
- **Dialog**: Modal overlays for note editing
- **Dropdown Menu**: Context menus and actions
- **Tabs**: Navigation between Draft and Ready to Post
- **Scroll Area**: Scrollable content areas

## Design Tokens

### Colors

#### Primary Palette
- **Navy Blue** (#05445E): Deep primary color for headers and important actions
- **Blue Grotto** (#189AB4): Main primary color for buttons and interactive elements
- **Blue Green** (#75E6DA): Accent color for highlights and secondary actions
- **Baby Blue** (#D4F1F4): Light background tints and subtle elements

#### System Colors
- **Secondary**: Gray tones
- **Muted**: Subtle backgrounds
- **Destructive**: Error states

### Spacing
- **Base unit**: 4px (rem/4)
- **Component spacing**: 8px, 16px, 24px
- **Layout spacing**: 32px, 48px, 64px

### Typography Scale
- **xs**: 12px
- **sm**: 14px
- **base**: 16px
- **lg**: 18px
- **xl**: 20px

## Component Usage

### Note Card
```tsx
<Card className="p-4 mb-4">
  <CardHeader>
    <CardTitle>Note Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Note content...</p>
  </CardContent>
</Card>
```

### Form Input
```tsx
<div className="space-y-2">
  <Label htmlFor="note">Note Content</Label>
  <Textarea
    id="note"
    placeholder="Write your note..."
    className="min-h-[120px]"
  />
</div>
```

### Action Button
```tsx
<Button variant="default" size="sm">
  Save Note
</Button>
```

### Badge Examples
```tsx
<Badge variant="default">productivity</Badge>  // Blue Grotto
<Badge variant="secondary">3 notes</Badge>     // Blue Green
<Badge variant="subtle">draft</Badge>          // Baby Blue
<Badge variant="strong">featured</Badge>       // Navy Blue
```

## Responsive Design

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Mobile-First Approach
- Start with mobile layout
- Progressive enhancement for larger screens
- Touch-friendly interaction areas

## Accessibility

### ARIA Labels
- Proper labeling for screen readers
- Role attributes for interactive elements
- Focus management for keyboard navigation

### Color Contrast
- WCAG AA compliance
- High contrast mode support
- Meaningful color usage beyond visual indication

## Theming

### CSS Variables
```css
:root {
  --background: 0 0% 100%;
  --foreground: 201 83% 20%; /* Navy Blue */
  --primary: 191 74% 40%; /* Blue Grotto */
  --primary-foreground: 0 0% 100%; /* white for contrast */
  --secondary: 175 59% 86%; /* Baby Blue */
  --accent: 176 62% 68%; /* Blue Green */
}
```

### Dark Mode
- Automatic dark mode detection
- Manual theme toggle option
- Consistent component appearance

## Animation

### Transitions
- Smooth hover states
- Focus ring animations
- Loading states

### Motion Principles
- Subtle and purposeful
- Respect user preferences
- Performance optimized

## Best Practices

1. **Consistent Spacing**: Use design tokens for all spacing
2. **Component Composition**: Build complex UIs from simple components
3. **Accessibility First**: Consider all users in component design
4. **Performance**: Optimize for loading and interaction speed
5. **Maintainability**: Keep component API simple and predictable

## Implementation Guidelines

### Component Structure
- Keep components focused and single-purpose
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error boundaries

### Styling Approach
- Use Tailwind utility classes
- Leverage CSS variables for theming
- Avoid custom CSS when possible
- Use `cn()` utility for conditional classes

### Testing
- Unit tests for component behavior
- Accessibility testing
- Visual regression testing
- Cross-browser compatibility