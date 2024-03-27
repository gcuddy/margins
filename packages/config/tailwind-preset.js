const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./pages/**/*.{html,js,svelte,ts}',
		'./modules/**/*.{html,js,svelte,ts}',
		'./components/**/*.{html,js,svelte,ts}',
		'../../packages/ui/**/*.{html,js,svelte,ts,jsx,tsx}',
	],
	darkMode: ['selector', '[data-mode="dark"]', '[data-theme="dark"]'],

	future: {
		hoverOnlyWhenSupported: true,
		respectDefaultRingColorOpacity: true,
	},

	// ?
	plugins: [
		require('@tailwindcss/typography'),
		// require("@tailwindcss/forms"),
		require('tailwind-gradient-mask-image'),
		require('tailwind-scrollbar')({ nocompatible: true }),
		require('tailwind-scrollbar-hide'),
		require('tailwindcss-animate'),
		require('@tailwindcss/container-queries'),
		// custom modifiers
		plugin(({ addVariant, matchUtilities, theme }) => {
			addVariant('transparency', ['[data-transparency="true"] &']);
			addVariant('hocus', ['&:hover', '&:focus']);
			addVariant('elevation', ['.elevation &']);
			addVariant('mobile', ['.mobile &']);
			// Square utility
			matchUtilities(
				{
					square: (value) => ({
						height: value,
						width: value,
					}),
				},
				{ values: theme('spacing') },
			);
		}),
	],
	theme: {
		colors: {
			...colors,
			gray: colors.slate,
		},
		container: {
			center: true,
			// padding: "2rem",
			screens: {
				'2xl': '1440px',
				'3xl': '1600px',
			},
		},
		extend: {
			animation: {
				flash: 'flash 4s',
				marquee: 'marquee 30s linear infinite',
				marquee2: 'marquee2 30s linear infinite',
				'scale-1': 'scale 1s ease-in-out',
			},

			backgroundColor: {
				base: 'hsl(var(--color-base) / <alpha-value>)',
				'base-hover': 'hsl(var(--color-base-hover) / <alpha-value>)',
				elevation: 'hsl(var(--color-elevation) / <alpha-value>)',
				'elevation-hover': 'hsl(var(--color-elevation-hover) / <alpha-value>)',
				skin: {
					'entry-bg': 'var(--entry-bg-color)',
				},
			},
			borderRadius: {
				lg: `var(--radius)`,
				md: `calc(var(--radius) - 2px)`,
				sm: 'calc(var(--radius) - 4px)',
			},
			boxShadow: {
				'3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.4)',
				subtle:
					'rgba(0, 0, 0, 0.02) 0px 4px 4px -1px, rgba(0, 0, 0, 0.06) 0px 1px 1px 0px',
			},
			colors: {
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
				},
				attention: {
					DEFAULT: 'hsl(var(--attention) / <alpha-value>)',
					foreground: 'hsl(var(--attention-foreground) / <alpha-value>)',
				},
				background: 'hsl(var(--background) / <alpha-value>)',
				border: 'hsl(var(--border) / <alpha-value>)',
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
				},
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				glass: 'hsl(var(--glass) / <alpha-value>)',
				highlight: {
					pink: '#ff00b8',
					yellow: '#ffd700',
					'yellow-dark': '#ecc100',
				},
				input: 'hsl(var(--input) / <alpha-value>)',
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
				},

				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
					hover: 'hsl(var(--primary-hover) / <alpha-value>)',
				},

				ring: 'hsl(var(--ring) / <alpha-value>)',

				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
				},
			},
			fontFamily: {
				crimson: ['Crimson Text', ...defaultTheme.fontFamily.serif],
				newsreader: ['Newsreader', ...defaultTheme.fontFamily.serif],
				sans: ['InterVar', ...defaultTheme.fontFamily.sans],
				serif: ['Newsreader', 'Baskerville', ...defaultTheme.fontFamily.serif],
			},
			gridTemplateColumns: {
				overlap: 'repeat(auto-fit,  minmax(10px, max-content))',
			},
			keyframes: {
				flash: {
					from: {
						'background-color': 'hsl(var(--accent))',
						color: 'hsl(var(--accent-foreground))',
					},
				},
				marquee: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-100%)' },
				},
				marquee2: {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0%)' },
				},
				scale: {
					// scale to 1.5 then back
					'0%': { transform: 'scale(1)' },
					'100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.25)' },
				},
			},
			screens: {
				'3xl': '1600px',
			},
			transitionDuration: {
				quick: '0.15s',
			},
			transitionProperty: {
				'text-color': 'color',
			},
		},
		supports: {
			cq: 'container-type: inline-size',
			ncq: 'not(container-type: inline-size)',
		},
	},
};

module.exports = config;
