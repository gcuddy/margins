import { defineWorkspace } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineWorkspace([
	{
		plugins: [svelte()],
		// resolve: {
		//     conditions: mode === 'test' ? ['browser'] : [],
		// },
		test: {
			globals: true,
			name: '@margins/ui',
			include: ['packages/ui/components/**/*.{test,spec}.[jt]s?(x)'],
			environment: 'happy-dom',
			setupFiles: ['packages/ui/test-setup.ts'],
			server: {
				deps: {
					inline: ['bits-ui'],
				},
			},
		},
	},
	{
		test: {
			globals: true,
			name: '@margins/parser',
			include: ['packages/parser/lib/**/*.{test,spec}.[jt]s?(x)'],
			environment: 'happy-dom',
			// setupFiles: ['packages/ui/test-setup.ts'],
			// server: {
			// 	deps: {
			// 		inline: ['bits-ui'],
			// 	},
			// },
		},
	},
]);
