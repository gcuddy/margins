const base = require('@margins/config/tailwind-preset');
/** @type {import('tailwindcss').Config} */
export default {
	...base,
	content: [...base.content, './src/**/*.{html,js,svelte,ts}'],
	darkMode: 'media',
};
