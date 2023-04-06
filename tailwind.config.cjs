const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

delete colors["lightBlue"];
delete colors["warmGray"];
delete colors["trueGray"];
delete colors["coolGray"];
delete colors["blueGray"];

function withOpacity(variable, fallbackColor) {
	return ({ opacityValue }) => {
		let fallbackColorValue = "";
		if (fallbackColor) {
			fallbackColorValue = `, var(${fallbackColor})`;
		}
		if (opacityValue === undefined) {
			return `hsl(var(${variable}${fallbackColorValue}))`;
		}
		return `hsl(var(${variable}${fallbackColorValue}) / ${opacityValue})`;
	};
}

/** @type {import('tailwindcss').Config} */
const config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	darkMode: "class",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: 0,
				sm: "1.5rem",
			},
			screens: {
				"2xl": "1440px",
			},
		},
		colors: {
			...colors,
			gray: colors.slate,
			highlight: {
				yellow: "#ffd700",
				"yellow-dark": "#ecc100",
				pink: "#ff00b8",
			},
			themes: {
				synthwave: {
					base: "#2d1b69",
					text: "#f9f7fd",
				},
			},
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
				light: colors.stone[50],
				dark: colors.stone[800],
				primary: colors.amber,
				secondary: colors.lime,
				border: "hsl(var(--color-border) / <alpha-value>)",
				sidebar: "hsl(var(--color-sidebar) / <alpha-value>)",
				"sidebar-hover": "hsl(var(--color-sidebar-hover) / <alpha-value>)",
				content: "hsl(var(--color-content) / <alpha-value>)",
				muted: "hsl(var(--color-muted) / <alpha-value>)",
				accent: "hsl(var(--color-accent) / <alpha-value>)",
				"accent-hover": "hsl(var(--color-accent-hover) / <alpha-value>)",
				"accent-text": "hsl(var(--color-text-on-accent) / <alpha-value>)",
				bright: "hsl(var(--color-bright) / <alpha-value>)",
				// 'dimmer': 'hsl(var(--color-dimmer) / <alpha-value>)',
				// 'gray-350': 'rgb(188,188,188)',
				// 'gray-700': '#333',
				// 'gray-850': 'rgb(30,30,30)'
			},
			// keyframes: {
			// 	// "fade-in-bg": {
			// 	// 	"0%": {
			// 	// 		"--tw-bg-opacity": "0",
			// 	// 	},
			// 	// 	"10%": {
			// 	// 		"--tw-bg-opacity": "0.1",
			// 	// 	},
			// 	// 	"20%": {
			// 	// 		"--tw-bg-opacity": "0.2",
			// 	// 	},
			// 	// 	"30%": {
			// 	// 		"--tw-bg-opacity": "0.3",
			// 	// 	},
			// 	// 	"40%": {
			// 	// 		"--tw-bg-opacity": "0.4",
			// 	// 	},
			// 	// 	"50%": {
			// 	// 		"--tw-bg-opacity": "0.5",
			// 	// 	},
			// 	// 	"60%": {
			// 	// 		"--tw-bg-opacity": "0.6",
			// 	// 	},
			// 	// 	"70%": {
			// 	// 		"--tw-bg-opacity": "0.7",
			// 	// 	},
			// 	// 	"80%": {
			// 	// 		"--tw-bg-opacity": "0.8",
			// 	// 	},
			// 	// 	"90%": {
			// 	// 		"--tw-bg-opacity": "0.9",
			// 	// 	},
			// 	// 	"100%": {
			// 	// 		"--tw-bg-opacity": "1",
			// 	// 	},
			// 	// },
			// 	// pulse: {
			// 	// 	"0%, 100%": {
			// 	// 		opacity: "1",
			// 	// 	},
			// 	// 	"50%": {
			// 	// 		opacity: ".5",
			// 	// 	},
			// 	// },
			// 	// "fly-in": {
			// 	// 	"0%": {
			// 	// 		opacity: 0,
			// 	// 		transform: "translateY(-10px)",
			// 	// 	},
			// 	// 	"100%": {
			// 	// 		opacity: 1,
			// 	// 		transform: "translateY(0)",
			// 	// 	},
			// 	// },
			// 	// shake: {
			// 	// 	"10%, 90%": {
			// 	// 		transform: "translate3d(-2px, 0, 0)",
			// 	// 	},
			// 	// 	"20%, 80%": {
			// 	// 		transform: "translate3d(2px, 0, 0)",
			// 	// 	},
			// 	// 	"30%, 50%, 70%": {
			// 	// 		transform: "translate3d(-4px, 0, 0)",
			// 	// 	},
			// 	// 	"40%, 60%": {
			// 	// 		transform: "translate3d(4px, 0, 0)",
			// 	// 	},
			// 	// },
			// },
			// animation: {
			// 	"fade-in-bg": "fade-in-bg 0.1s ease-in-out",
			// 	"saturate-pulse": "saturate-pulse 0.5s ease-in-out",
			// 	"fly-in": "fly-in 1s ease-out",
			// 	"fast-fly-in": "fly-in 0.5s ease-out",
			// 	pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			// 	shake: "shake 0.8s cubic-bezier(.36,.07,.19,.97)",
			// },
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
