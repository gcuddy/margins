import { sveltekit } from "@sveltejs/kit/vite"

/** @type {import('vite').UserConfig} */
const config = {
  // envDir: '../..',
  plugins: [sveltekit({})],
  // resolve: {
  // 	preserveSymLinks: true,
  // },
  //   server: {
  //     fs: {
  //       allow: [".."],
  //     },
  //   },
}

export default config
