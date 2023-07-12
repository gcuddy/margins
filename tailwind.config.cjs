const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];


/** @type {import('tailwindcss').Config} */
const config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	darkMode: "class",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1440px",
				"3xl": "1600px",
			},
		},
		colors: {
			...colors,
			gray: colors.slate,
		},
		extend: {
			backgroundColor: {
				skin: {
					"entry-bg": "var(--entry-bg-color)",
				},
				base: "hsl(var(--color-base) / <alpha-value>)",
				elevation: "hsl(var(--color-elevation) / <alpha-value>)",
				"base-hover": "hsl(var(--color-base-hover) / <alpha-value>)",
				"elevation-hover": "hsl(var(--color-elevation-hover) / <alpha-value>)",
			},

			boxShadow: {
				"3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.4)",
			},
			fontFamily: {
				sans: ["InterVar", ...defaultTheme.fontFamily.sans],
				newsreader: ["Newsreader", ...defaultTheme.fontFamily.serif],
				crimson: ["Crimson Text", ...defaultTheme.fontFamily.serif],
				serif: ['Newsreader', 'Baskerville', ...defaultTheme.fontFamily.serif],
			},
			colors: {
				// TODO: / <alpha-value> ?
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)",
				},
				// border: "hsl(var(--color-border) / <alpha-value>)",
				// sidebar: "hsl(var(--color-sidebar) / <alpha-value>)",
				// "sidebar-hover": "hsl(var(--color-sidebar-hover) / <alpha-value>)",
				// content: "hsl(var(--color-content) / <alpha-value>)",
				// muted: "hsl(var(--color-muted) / <alpha-value>)",
				// accent: "hsl(var(--color-accent) / <alpha-value>)",
				// "accent-hover": "hsl(var(--color-accent-hover) / <alpha-value>)",
				// "accent-text": "hsl(var(--color-text-on-accent) / <alpha-value>)",
				// bright: "hsl(var(--color-bright) / <alpha-value>)",
				highlight: {
					yellow: "#ffd700",
					"yellow-dark": "#ecc100",
					pink: "#ff00b8",
				},
			},
			borderRadius: {
				lg: `var(--radius)`,
				md: `calc(var(--radius) - 2px)`,
				sm: "calc(var(--radius) - 4px)",
			},
			transitionDuration: {
				quick: "0.15s",
			},
			transitionProperty: {
				"text-color": "color",
			},
			gridTemplateColumns: {
				overlap: "repeat(auto-fit,  minmax(10px, max-content))",
			},
			keyframes: {
				'flash': {
					from: {
						'background-color': 'hsl(var(--accent))',
						'color': 'hsl(var(--accent-foreground))',
					}
				},
				'scale': {
					// scale to 1.5 then back
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.25)' },
					'100%': { transform: 'scale(1)' },
				}
			},
			animation: {
				'flash': 'flash 4s',
				'scale-1': 'scale 1s ease-in-out',
			},
			screens: {
				'3xl': '1600px',
			}
		},
	},
	// ?
	plugins: [
		require("@tailwindcss/typography"),
		// require("@tailwindcss/forms"),
		require("tailwind-gradient-mask-image"),
		require("tailwind-scrollbar")({ nocompatible: true }),
		require("tailwind-scrollbar-hide"),
		require("tailwindcss-animate"),
		// custom modifiers
		plugin(({ addVariant }) => {
			addVariant("transparency", ['[data-transparency="true"] &']);
			addVariant("elevation", [".elevation &"]);
			addVariant("mobile", [".mobile &"]);
		}),
	],
	future: {
		hoverOnlyWhenSupported: true,
	}
};

module.exports = config;
