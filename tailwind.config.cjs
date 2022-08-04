const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

/** @type {import('tailwindcss').Config} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	// darkMode: 'class',
	theme: {
		colors: {
			...colors,
			gray: colors.stone
		},
		extend: {
			fontFamily: {
				sans: [...defaultTheme.fontFamily.sans]
			},
			colors: {
				light: colors.neutral[50],
				dark: colors.neutral[800],
				primary: colors.amber,
				'gray-350': 'rgb(188,188,188)',
				'gray-750': '#333',
				'gray-850': 'rgb(30,30,30)'
			},
			transitionDuration: {
				quick: '0.15s'
			}
		}
	},
	// ?
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp')
	]
};

module.exports = config;
