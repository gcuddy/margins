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
			gray: colors.stone,
		},
		extend: {
			fontFamily: {
				sans: [...defaultTheme.fontFamily.sans],
			},
			colors: {
				light: colors.stone[50],
				dark: colors.stone[800],
				primary: colors.amber,
				secondary: colors.lime,
				// 'gray-350': 'rgb(188,188,188)',
				// 'gray-700': '#333',
				// 'gray-850': 'rgb(30,30,30)'
			},
			keyframes: {
				'fade-in-bg': {
					'0%': {
						'--tw-bg-opacity': '0',
					},
					'10%': {
						'--tw-bg-opacity': '0.1',
					},
					'20%': {
						'--tw-bg-opacity': '0.2',
					},
					'30%': {
						'--tw-bg-opacity': '0.3',
					},
					'40%': {
						'--tw-bg-opacity': '0.4',
					},
					'50%': {
						'--tw-bg-opacity': '0.5',
					},
					'60%': {
						'--tw-bg-opacity': '0.6',
					},
					'70%': {
						'--tw-bg-opacity': '0.7',
					},
					'80%': {
						'--tw-bg-opacity': '0.8',
					},
					'90%': {
						'--tw-bg-opacity': '0.9',
					},
					'100%': {
						'--tw-bg-opacity': '1',
					},
				},
				'saturate-pulse': {
					'0%': {
						filter: 'saturate(1)',
					},
					'50%': {
						filter: 'saturate(1.25)',
					},
					'100%': {
						filter: 'saturate(1)',
					},
				},
			},
			animation: {
				'fade-in-bg': 'fade-in-bg 0.1s ease-in-out',
				'saturate-pulse': 'saturate-pulse 0.5s ease-in-out',
			},
			transitionDuration: {
				quick: '0.15s',
			},
			gridTemplateColumns: {
				overlap: 'repeat(auto-fit,  minmax(10px, max-content))',
			},
		},
	},
	// ?
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
		require('tailwind-gradient-mask-image'),
	],
};

module.exports = config;
