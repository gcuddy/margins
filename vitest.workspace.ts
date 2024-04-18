import { defineWorkspace } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineWorkspace([
	{
		plugins: [svelte()],
		// resolve: {
		//     conditions: mode === 'test' ? ['browser'] : [],
		// },
		test: {
			environment: 'happy-dom',
			globals: true,
			include: ['packages/ui/components/**/*.{test,spec}.[jt]s?(x)'],
			name: '@margins/ui',
			server: {
				deps: {
					inline: ['bits-ui'],
				},
			},
			setupFiles: ['packages/ui/test-setup.ts'],
		},
	},
	{
		test: {
			environment: 'happy-dom',
			globals: true,
			include: ['packages/parser/**/*.{test,spec}.[jt]s?(x)'],
			name: '@margins/parser',
			// setupFiles: ['packages/ui/test-setup.ts'],
			// server: {
			// 	deps: {
			// 		inline: ['bits-ui'],
			// 	},
			// },
		},
	},
]);
