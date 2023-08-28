/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:svelte/recommended',
		// 'plugin:tailwindcss/recommended',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	rules: {
		'no-console': 'warn',
		'@typescript-eslint/consistent-type-imports': [
			'warn',
			{
				prefer: 'type-imports',
				fixStyle: 'inline-type-imports'
			}
		],
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_'
			}
		],
		'@typescript-eslint/switch-exhaustiveness-check': 'error',
		'@typescript-eslint/array-type': 'error',

		'svelte/no-target-blank': 'error',
		'svelte/no-immutable-reactive-statements': 'error',
		'svelte/no-trailing-spaces': 'error',
		'svelte/prefer-style-directive': 'error',
		'svelte/no-reactive-literals': 'error',
		'svelte/no-useless-mustaches': 'error'
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 'latest',
		extraFileExtensions: ['.svelte'],
		project: './tsconfig.json'
	},
	ignorePatterns: ['*.cjs'],
	// overrides: [
	// 	{
	// 		files: ['*.svelte'],
	// 		processor: 'svelte-eslint-parser',
	// 		parserOptions: {
	// 			parser: '@typescript-eslint/parser'
	// 		}
	// 	}
	// ],
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
