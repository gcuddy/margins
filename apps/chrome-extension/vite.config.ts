import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config.js';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte(), crx({ manifest })],
	server: {
		port: 3000,
	},
});
