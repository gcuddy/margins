/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: [
		'plugin:playwright/playwright-test',
		'plugin:prettier/recommended',
		'plugin:svelte/recommended',
	],
	// plugins: ['unused-imports'],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ['./apps/*/tsconfig.json', './packages/*/tsconfig.json'],
		extraFileExtensions: ['.svelte'], // This is a required setting in `@typescript-eslint/parser` v4.24.0.
	},
	parser: '@typescript-eslint/parser',
	rules: {
		'playwright/no-page-pause': 'error',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
			},
		],
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
			rules: {
				// these cause issues with svelte rn
				'@typescript-eslint/no-unsafe-assignment': 0,
				'@typescript-eslint/no-unsafe-call': 0,
				'no-console': 1,
				'no-undef': 0,
			},
		},
		{
			files: ['*.ts', '*.tsx'],
			extends: ['plugin:@typescript-eslint/recommended'],
			plugins: ['@typescript-eslint'],
			parser: '@typescript-eslint/parser',
			rules: {
				'@typescript-eslint/consistent-type-imports': [
					'error',
					{
						prefer: 'type-imports',
						// TODO: enable this once prettier supports it
						// fixStyle: "inline-type-imports",
						fixStyle: 'separate-type-imports',
						disallowTypeAnnotations: false,
					},
				],
			},
			overrides: [
				{
					files: ['**/e2e/**/*.{tsx,ts}'],
					rules: {
						'@typescript-eslint/no-unused-vars': 'off',
						'no-undef': 'off',
					},
				},
			],
		},
		{
			files: ['**/e2e/**/*.{js,jsx}'],
			rules: {
				'@typescript-eslint/no-unused-vars': 'off',
				'no-undef': 'off',
			},
		},
	],
};
