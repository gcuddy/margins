import mdsvexConfig from './mdsvex.config.js';
import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { preprocessMeltUI } from '@melt-ui/pp';
import sequence from 'svelte-sequential-preprocessor';
import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
};

/** @type {import('@sveltejs/kit').Config}*/
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sequence([
		mdsvex(mdsvexConfig),
		vitePreprocess(),
		preprocessMeltUI(),
	]),

	kit: {
		adapter: vercel({
			runtime: 'edge',
		}),
		alias: {
			$components: 'src/lib/components',
			'$components/*': 'src/lib/components/*',
			$docs: 'src/docs',
			'$docs/*': 'src/docs/*',
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
