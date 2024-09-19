import adapter from "@sveltejs/adapter-node"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { preprocessMeltUI } from "@melt-ui/pp"
import sequence from "svelte-sequential-preprocessor"
import { mdsvex } from "mdsvex"

/** @type {import('@sveltejs/kit').Config}*/
const config = {
  extensions: [".svelte", ".md"],
  preprocess: sequence([
    vitePreprocess(),
    mdsvex({
      extension: ".md",
    }),
    preprocessMeltUI(),
  ]),
  kit: {
    adapter: adapter({}),
    alias: {
      "$components/*": "src/lib/components/*",
      "$lib/*": "src/lib/*",
    },
    env: {
      dir: "../..",
    },
  },
  compilerOptions: {},
  vitePlugin: {
    inspector: true,
  },
}
export default config
