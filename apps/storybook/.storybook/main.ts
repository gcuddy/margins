import type { StorybookConfig } from '@storybook/sveltekit';

import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
	return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
	stories: [
		'../src/**/*.mdx',
		'../src/**/*.stories.@(js|jsx|mjs|ts|tsx|svelte)',
		'../../../packages/ui/components/**/*.stories.@(js|jsx|ts|tsx|svelte)',
		'../../../packages/ui/components/**/*.stories.@(js|jsx|ts|tsx|svelte)',
		'../../../packages/ui/components/**/*.stories.mdx', // legacy SB6 stories
		'../../../packages/ui/**/*.docs.mdx',
	],
	addons: [
		getAbsolutePath('@storybook/addon-links'),
		getAbsolutePath('@storybook/addon-essentials'),
		getAbsolutePath('@chromatic-com/storybook'),
		getAbsolutePath('@storybook/addon-interactions'),
		getAbsolutePath('@storybook/addon-themes'),
		'@storybook/addon-docs',
		'@storybook/addon-svelte-csf',
	],
	framework: {
		name: getAbsolutePath('@storybook/sveltekit'),
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
};
export default config;