// import adapter from '@sveltejs/adapter-auto';
// import node from '@sveltejs/adapter-node';
import vercel from "@sveltejs/adapter-vercel"
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: vercel(),
		methodOverride: {
			allowed: ['PATCH', 'PUT', 'DELETE']
		}
	}
};

export default config;
