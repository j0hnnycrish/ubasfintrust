import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Core semantic tokens
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--brand-red-600))',
					foreground: 'hsl(var(--brand-red-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--brand-red-700))',
					foreground: 'hsl(var(--brand-red-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--brand-red-700))',
					foreground: 'hsl(var(--brand-red-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--brand-red-500))',
					foreground: 'hsl(var(--brand-red-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--background))',
					foreground: 'hsl(var(--foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Red scale (monochrome brand system)
				brand: {
					50: 'hsl(var(--brand-red-50))',
					100: 'hsl(var(--brand-red-100))',
					200: 'hsl(var(--brand-red-200))',
					300: 'hsl(var(--brand-red-300))',
					400: 'hsl(var(--brand-red-400))',
					500: 'hsl(var(--brand-red-500))',
					600: 'hsl(var(--brand-red-600))',
					700: 'hsl(var(--brand-red-700))',
					800: 'hsl(var(--brand-red-800))',
					900: 'hsl(var(--brand-red-900))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-banking': 'var(--gradient-banking)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-accent': 'var(--gradient-accent)'
			},
			boxShadow: {
				'banking': 'var(--shadow-banking)',
				'card-banking': 'var(--shadow-card)',
				'elegant': 'var(--shadow-elegant)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
