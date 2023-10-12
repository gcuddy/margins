import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
		}),
	],
	resolve: {
		alias: {
			'.prisma/client/index-browser':
				'./node_modules/.prisma/client/index-browser.js',
		},
	},
};

export default config;
