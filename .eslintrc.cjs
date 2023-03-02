module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['svelte3', '@typescript-eslint', 'import', 'simple-import-sort', 'unused-imports'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'plugin:import/typescript',
	],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	rules: {
		// via colinhacks https://gist.github.com/colinhacks/ba70652dc6bdf06bd16ee5dc79a8f506
		// these rules are all dumb
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-empty-interface': 'off',

       '@typescript-eslint/switch-exhaustiveness-check': 'warn',

		// no duplicates
		'no-duplicate-imports': 'off', // use import/no-duplicates instead
		'import/no-duplicates': 'warn', // capable of consolidating imports

		// import sorting
		'sort-imports': 'off', // we use eslint-plugin-import instead
		'simple-import-sort/imports': 'warn',
		'simple-import-sort/exports': 'warn',
		// 'import/newline-after-import': ['warn', { count: 1, considerComments: true }],

		// remove unused imports
		'@typescript-eslint/no-unused-vars': 'off', // not capable of autofix
		'unused-imports/no-unused-imports': 'warn',
	},
	settings: {
		'svelte3/typescript': () => require('typescript'),
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
};
