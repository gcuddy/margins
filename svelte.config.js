// import adapter from '@sveltejs/adapter-auto';
// import node from '@sveltejs/adapter-node';
import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

import { mdsvex } from "mdsvex"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
    }),
    mdsvex({
      extensions: ["md"]
    })
  ],

  kit: {
    adapter: vercel({
      // runtime: 'edge'
      runtime: "nodejs16.x"
    }),
  },
};

export default config;
