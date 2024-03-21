import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { preprocessMeltUI } from '@melt-ui/pp';
import sequence from 'svelte-sequential-preprocessor';

/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
	kit: {
		adapter: vercel({
			runtime: 'edge',
		}),
		alias: {
			$components: 'src/lib/components',
			'$components/*': 'src/lib/components/*',
		},
		serviceWorker: {
			register: false,
		},
	},
	compilerOptions: {},
	shadcn: {
		componentPath: './src/lib/components/ui',
	},
	vitePlugin: {
		inspector: true,
	},
};
export default config;
