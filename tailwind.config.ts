import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				// High Contrast System from design_guidance.md
				'primary-bg': '#fffef9',        // Cream page background
				'primary-card': '#FFFFFF',      // Pure white cards
				'primary-text': '#000000',      // Pure black for titles
				'primary-secondaryText': '#71717A', // Gray for metadata
				'primary-accent': '#000000',    // Black for primary actions
				'ui-divider': '#E5E5EA',       // Light borders
				'ui-placeholder': '#C7C7CC',   // Placeholder text
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
				'lg': '0.5rem',
				'2xl': '1rem',
			},
			boxShadow: {
				'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
			},
		},
	},
	plugins: [],
} satisfies Config;