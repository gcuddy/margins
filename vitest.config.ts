import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => ({
	plugins: [svelte()],
	resolve: {
		conditions: mode === 'test' ? ['browser'] : [],
	},
	test: {
		coverage: {
			provider: 'v8',
		},
		testTimeout: 500000,
	},
}));
