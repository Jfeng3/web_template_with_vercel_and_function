import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				// Custom Color Palette
				'navy-blue': '#05445E',         // Deep primary for headers
				'blue-grotto': '#189AB4',       // Main primary color
				'blue-green': '#75E6DA',        // Accent color
				'baby-blue': '#D4F1F4',         // Light backgrounds
				
				// High Contrast System from design_guidance.md
				'primary-bg': '#fffef9',        // Cream page background
				'primary-card': '#FFFFFF',      // Pure white cards
				'primary-text': '#05445E',      // Navy Blue for titles
				'primary-secondaryText': '#71717A', // Gray for metadata
				'primary-accent': '#189AB4',    // Blue Grotto for primary actions
				'ui-divider': '#E5E5EA',       // Light borders
				'ui-placeholder': '#C7C7CC',   // Placeholder text
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			fontFamily: {
				sans: ['Inter', 'SF Pro Text', '-apple-system', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				// Text hierarchy from design_guidance.md
				'2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }], // Page titles
				'lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }], // Section headers
				'base': ['1rem', { lineHeight: '1.5rem' }], // Body text
				'sm': ['0.875rem', { lineHeight: '1.25rem' }], // Metadata
			},
			spacing: {
				// Minimal scale from design_guidance.md
				'1': '4px',   // Tight spacing
				'2': '8px',   // Small spacing
				'4': '16px',  // Standard spacing
				'6': '24px',  // Section spacing
				'8': '32px',  // Large spacing
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			boxShadow: {
				'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
} satisfies Config;