/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:svelte/recommended',
		// 'plugin:tailwindcss/recommended',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'import',
		'simple-import-sort',
		'unused-imports',
	],
	rules: {
		'import/order': 0, // turn off in favor of eslint-plugin-simple-import-sort
		'import/no-duplicates': 2,
		'import/first': 2,
		'import/newline-after-import': 2,
        'import/no-default-export': 2,
        'prefer-template': 'error',


		/**
		 * eslint-plugin-simple-import-sort @see https://github.com/lydell/eslint-plugin-simple-import-sort
		 */
		'sort-imports': 0, // we use eslint-plugin-import instead
		'simple-import-sort/imports': 2,
		'simple-import-sort/exports': 2,

		'no-console': 'warn',
		'@typescript-eslint/consistent-type-imports': [
			'warn',
			{
				prefer: 'type-imports',
				fixStyle: 'inline-type-imports',
			},
		],
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		'@typescript-eslint/switch-exhaustiveness-check': 'error',
		'@typescript-eslint/array-type': ['error', { default: 'generic' }],
		'@typescript-eslint/consistent-type-definitions': ['error', "type"],
        // TODO: eventually enable this, but for now it's too much work. However, highly encourage annotating functions with return types.
		// '@typescript-eslint/explicit-function-return-type': 1,
		'@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/ban-types': 'error',
		'@typescript-eslint/ban-ts-comment': [
			'error',
			{
				'ts-expect-error': 'allow-with-description',
			},
		],
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'typeParameter',
				format: ['PascalCase'],
				custom: { regex: '^T[A-Z]', match: true },
			},
		],

		'svelte/no-target-blank': 'error',
		'svelte/no-immutable-reactive-statements': 'error',
		'svelte/no-trailing-spaces': 'error',
		'svelte/prefer-style-directive': 'error',
		'svelte/no-reactive-literals': 'error',
		'svelte/no-useless-mustaches': 'error',
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 'latest',
		extraFileExtensions: ['.svelte'],
		// project: './tsconfig.json',
		project: true,
		tsconfigRootDir: __dirname,
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
		node: true,
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	],
};
