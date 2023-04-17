const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

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
			},
			colors: {
				// TODO: / <alpha-value> ?
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
};

module.exports = config;
