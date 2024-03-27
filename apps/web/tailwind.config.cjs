const base = require('@margins/config/tailwind-preset');
/** @type {import('tailwindcss').Config} */
module.exports = {
	...base,
	// darkMode: ['class', '[data-mode="dark"]'],
	content: [
		...base.content,
		'../../packages/ui/**/*.{svelte,html,js,ts,jsx,tsx,mdx}',
		'./src/**/*.{html,js,svelte,ts}',
	],
};
