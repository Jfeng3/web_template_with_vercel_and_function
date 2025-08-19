# Minimal Template - Vite + Vercel Functions

A clean starter template with React frontend and Vercel serverless functions backend. Perfect for rapid prototyping and new project development.

## Quick Start

```bash
# Install dependencies
pnpm install

# Development (single command)
pnpm dev:backend

# Access at: http://localhost:3000
```

## Project Structure

```
├── src/
│   └── pages/Index.tsx          # Main React page
├── api/
│   └── hello.ts                 # Simple API endpoint
├── vite.config.ts               # Vite configuration
├── vercel.json                  # Vercel deployment config
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
└── package.json                 # Dependencies & scripts
```

## Development

### Commands
- `pnpm dev:backend` - Run both frontend & API (port 3000)
- `pnpm dev` - Run frontend only (port 5173)
- `pnpm build` - Build for production
- `pnpm deploy` - Deploy to Vercel

### API Testing
The template includes a simple API endpoint at `/api/hello` that echoes messages back with timestamps.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Vercel Functions (Node.js)
- **Deployment**: Vercel
- **Module System**: ESM with proper Node.js resolution

## Configuration Files Explained

### 1. package.json
```json
{
  "name": "minimal-template",           // Project name
  "version": "1.0.0",                  // Current version
  "type": "module",                    // Use ES modules (import/export)
  "scripts": {
    "dev": "vite",                     // Start Vite dev server (port 5173)
    "dev:backend": "vercel dev --listen 3000 --yes",  // Start Vercel dev with frontend + API
    "build": "vite build",             // Build for production
    "preview": "vite preview",         // Preview production build
    "deploy": "vercel --prod"          // Deploy to Vercel production
  },
  "dependencies": {
    "react": "^18.3.1",               // React framework
    "react-dom": "^18.3.1"           // React DOM renderer
  },
  "devDependencies": {
    "@types/node": "^24.0.10",        // Node.js TypeScript types
    "@types/react": "^18.3.3",        // React TypeScript types
    "@types/react-dom": "^18.3.0",    // React DOM TypeScript types
    "@vercel/node": "^5.3.11",        // Vercel Node.js runtime
    "@vitejs/plugin-react-swc": "^3.5.0",  // Vite React plugin with SWC
    "autoprefixer": "^10.4.20",       // CSS vendor prefixes
    "postcss": "^8.4.47",             // CSS processing
    "tailwindcss": "^3.4.11",         // Tailwind CSS framework
    "typescript": "^5.5.3",           // TypeScript compiler
    "vercel": "^46.0.2",              // Vercel CLI
    "vite": "^5.4.1"                  // Vite build tool
  }
}
```

### 2. tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],                 // Enable dark mode via class toggle
  content: [                          // Files to scan for Tailwind classes
    "./pages/**/*.{ts,tsx}",          // Next.js pages
    "./components/**/*.{ts,tsx}",     // Components folder
    "./app/**/*.{ts,tsx}",            // App router files
    "./src/**/*.{ts,tsx}",            // Source files
  ],
  theme: {
    container: {
      center: true,                   // Center containers
      padding: "2rem",                // Container padding
      screens: {
        "2xl": "1400px",              // Max container width
      },
    },
    extend: {
      colors: {
        // Custom brand colors
        'navy-blue': '#05445E',       // Deep primary for headers
        'blue-grotto': '#189AB4',     // Main primary color
        'blue-green': '#75E6DA',      // Accent color
        'baby-blue': '#D4F1F4',       // Light backgrounds
        
        // CSS variable-based colors for theming
        'primary-bg': 'hsl(var(--background))',
        'primary-card': 'hsl(var(--card))',
        // ... more color definitions
      },
      fontFamily: {
        sans: ['Inter', 'system fonts'], // Primary font stack
      },
      fontSize: {
        // Typography scale with line heights and weights
        '2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }], // Page titles
        'lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }], // Headers
        // ... more sizes
      },
      spacing: {
        // Consistent spacing scale
        '1': '4px',   // Tight spacing
        '2': '8px',   // Small spacing
        '4': '16px',  // Standard spacing
        // ... more spacing values
      },
    },
  },
  plugins: [require('@tailwindcss/typography')], // Typography plugin
} satisfies Config;
```

### 3. postcss.config.js
```javascript
export default {
  plugins: {
    tailwindcss: {},        // Process Tailwind CSS directives
    autoprefixer: {},       // Add vendor prefixes automatically
  },
}
```

### 4. tsconfig.json
```json
{
  "files": [],                        // No files directly compiled by this config
  "references": [                     // Project references for multi-config setup
    { "path": "./tsconfig.app.json" }, // App-specific TypeScript config
    { "path": "./tsconfig.node.json" } // Node.js tools config
  ],
  "compilerOptions": {
    "target": "ES2022",               // Compile to ES2022
    "module": "NodeNext",             // Use Node.js ESM module resolution
    "moduleResolution": "NodeNext",   // Node.js module resolution strategy
    "baseUrl": ".",                   // Base directory for relative imports
    "paths": {
      "@/*": ["./src/*"]              // Path alias for src folder
    },
    "noImplicitAny": false,           // Allow implicit any types
    "noUnusedParameters": false,      // Allow unused parameters
    "skipLibCheck": true,             // Skip type checking of declaration files
    "allowJs": true,                  // Allow JavaScript files
    "noUnusedLocals": false,          // Allow unused local variables
    "strictNullChecks": false,        // Disable strict null checks
    "esModuleInterop": true,          // Enable ES module interop
    "forceConsistentCasingInFileNames": true // Enforce consistent file naming
  }
}
```

### 5. vercel.json
```json
{
  "functions": {
    "api/**/*.ts": {                  // Configure all TypeScript files in api folder
      "runtime": "@vercel/node@3.2.17" // Use specific Node.js runtime version
    }
  }
}
```

### 6. vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",                       // Listen on all interfaces
    port: 8080,                       // Development server port
    proxy: {
      '/api': {                       // Proxy API requests during development
        target: 'http://localhost:3000', // Forward to Vercel dev server
        changeOrigin: true,           // Change origin header
        secure: false,                // Allow self-signed certificates
      },
    },
  },
  plugins: [
    react(),                          // Enable React with SWC compiler
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Alias @ to src folder
    },
  },
});
```

### 7. tsconfig.node.json
```json
{
  "compilerOptions": {
    "target": "ES2022",               // Compile to ES2022
    "lib": ["ES2023"],                // Include ES2023 library
    "module": "ESNext",               // Use latest ES modules
    "skipLibCheck": true,             // Skip declaration file checking

    /* Bundler mode */
    "moduleResolution": "bundler",    // Use bundler resolution
    "allowImportingTsExtensions": true, // Allow .ts imports
    "isolatedModules": true,          // Each file is a separate module
    "moduleDetection": "force",       // Force module detection
    "noEmit": true,                   // Don't emit compiled files

    /* Linting */
    "strict": true,                   // Enable strict type checking
    "noUnusedLocals": false,          // Allow unused local variables
    "noUnusedParameters": false,      // Allow unused parameters
    "noFallthroughCasesInSwitch": true // Prevent switch fallthrough
  },
  "include": ["vite.config.ts"]       // Only include Vite config
}
```

### 8. tsconfig.app.json
```json
{
  "compilerOptions": {
    "target": "ES2020",               // Compile to ES2020 for browsers
    "useDefineForClassFields": true,  // Use define semantics for class fields
    "lib": ["ES2020", "DOM", "DOM.Iterable"], // Include browser APIs
    "module": "ESNext",               // Use latest ES modules
    "skipLibCheck": true,             // Skip declaration file checking

    /* Bundler mode */
    "moduleResolution": "bundler",    // Use bundler resolution
    "allowImportingTsExtensions": true, // Allow .ts imports
    "isolatedModules": true,          // Each file is a separate module
    "moduleDetection": "force",       // Force module detection
    "noEmit": true,                   // Don't emit (Vite handles this)
    "jsx": "react-jsx",               // Use React 17+ JSX transform

    /* Linting */
    "strict": false,                  // Relaxed type checking for rapid development
    "noUnusedLocals": false,          // Allow unused variables
    "noUnusedParameters": false,      // Allow unused parameters
    "noImplicitAny": false,           // Allow implicit any
    "noFallthroughCasesInSwitch": false, // Allow switch fallthrough

    "baseUrl": ".",                   // Base directory
    "paths": {
      "@/*": ["./src/*"]              // Path alias for src folder
    }
  },
  "include": ["src"]                  // Include all src files
}
```

### 9. eslint.config.js
```javascript
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },              // Ignore dist folder
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended], // Base configs
    files: ["**/*.{ts,tsx}"],         // Target TypeScript files
    languageOptions: {
      ecmaVersion: 2020,              // ECMAScript version
      globals: globals.browser,       // Browser global variables
    },
    plugins: {
      "react-hooks": reactHooks,      // React Hooks rules
      "react-refresh": reactRefresh,  // React Refresh rules
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // React Hooks best practices
      "react-refresh/only-export-components": [ // Fast Refresh optimization
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off", // Allow unused variables
    },
  }
);
```

## Configuration Files Summary

- ✅ **TypeScript**: Multi-config setup for app and tooling
- ✅ **Vite**: React + SWC + API proxy
- ✅ **Vercel**: Serverless functions configuration
- ✅ **Tailwind**: Custom design system + utilities
- ✅ **PostCSS**: CSS processing pipeline
- ✅ **ESLint**: TypeScript + React linting rules

## Features

- 🚀 **Fast builds** - Minimal dependencies
- 🔧 **Ready to extend** - Add features as needed
- 📱 **Responsive** - Tailwind CSS included
- 🌐 **Full-stack** - Frontend + API in one repo
- 🚢 **Deploy ready** - Vercel configuration included

## Deployment

```bash
pnpm deploy
```

Vercel automatically:
1. Builds React frontend → Static CDN
2. Compiles TypeScript API → Serverless functions
3. Serves everything from one domain

## Extending the Template

### Add New API Endpoints
Create new files in `/api` folder:
```typescript
// api/users.ts
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.json({ users: [] });
}
```

### Add New Pages
Create new components in `/src/pages`:
```typescript
// src/pages/About.tsx
export default function About() {
  return <div>About Page</div>;
}
```

### Add Dependencies
```bash
# Add UI library
pnpm add @radix-ui/react-dialog

# Add database
pnpm add @supabase/supabase-js

# Add state management
pnpm add zustand
```

## Environment Variables

Create `.env.local` for local development:
```env
# Add your environment variables here
API_KEY=your-api-key
DATABASE_URL=your-database-url
```

---

**Ready to build something amazing!** 🚀

This template gives you a solid foundation with modern tooling and best practices built-in.