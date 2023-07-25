// import adapter from '@sveltejs/adapter-auto';
// import node from '@sveltejs/adapter-node';
import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import { preprocessMeltUI } from '@melt-ui/pp'
import sequence from 'svelte-sequential-preprocessor'

// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sequence([
		preprocess({
			postcss: true
		}),
		mdsvex({
			extensions: ['md']
		}),
        preprocessMeltUI()
	]),
	kit: {
		adapter: vercel({
			runtime: 'edge'
			// split: true,
			// runtime: "nodejs18.x",
		}),
		alias: {
			$components: 'src/lib/components',
			'$components/*': 'src/lib/components/*'
		}
	},
	compilerOptions: {},
	shadcn: {
		componentPath: './src/lib/components/ui'
	}
};
export default config;
