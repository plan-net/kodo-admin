import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: '#080808',
  			foreground: '#ffffff',
  			card: {
  				DEFAULT: '#080808',
				background: '#101012',
  				foreground: '#ffffff',
  				hover: '#161B28',
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: '#3B82F6',
  				foreground: '#ffffff'
  			},
  			secondary: {
  				DEFAULT: '#1F2937',
  				foreground: '#9CA3AF'
  			},
  			muted: {
  				DEFAULT: '#374151',
  				foreground: '#9CA3AF'
  			},
  			accent: {
  				DEFAULT: '#1F2937',
  				foreground: '#ffffff'
  			},
  			destructive: {
  				DEFAULT: '#EF4444',
  				foreground: '#ffffff'
  			},
  			border: '#1F2937',
  			input: '#1F2937',
  			ring: '#1F2937',
  			chart: {
  				'1': '#3B82F6',
  				'2': '#10B981',
  				'3': '#F59E0B',
  				'4': '#EF4444',
  				'5': '#8B5CF6'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
