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
		'sort-keys-fix',
		'typescript-sort-keys',
	],
	rules: {
        '@typescript-eslint/array-type': ['error', {
            default: 'generic'
        }],
        '@typescript-eslint/ban-ts-comment': ['error', {
            'ts-expect-error': 'allow-with-description'
        }],
        '@typescript-eslint/ban-types': 'error',
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/consistent-type-imports': ['warn', {
            fixStyle: 'inline-type-imports',
            prefer: 'type-imports'
        }],
        '@typescript-eslint/naming-convention': ['error', {
            custom: {
                match: true,
                regex: '^T[A-Z]'
            },
            format: ['PascalCase'],
            selector: 'typeParameter'
        }],
        '@typescript-eslint/no-throw-literal': 0,
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        'import/first': 2,
        'import/newline-after-import': 2,
        'import/no-default-export': 2,
        // turn off in favor of eslint-plugin-simple-import-sort
        'import/no-duplicates': 2,
        'import/order': 0,
        'no-console': 'warn',
        'no-throw-literal': 0,
        "no-unused-vars": 0,
        'prefer-template': 'error',
        'simple-import-sort/exports': 2,
        // we use eslint-plugin-import instead
        'simple-import-sort/imports': 2,
        'sort-imports': 0,
        'sort-keys-fix/sort-keys-fix': 2,
        'svelte/no-immutable-reactive-statements': 'error',
        'svelte/no-reactive-literals': 'error',
        'svelte/no-target-blank': 'error',
        'svelte/no-trailing-spaces': 'error',
        'svelte/no-useless-mustaches': 'error',
        'svelte/prefer-style-directive': 'error',
        'typescript-sort-keys/interface': 2,
        'typescript-sort-keys/string-enum': 2,
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': ['warn', {
            args: 'after-used',
            argsIgnorePattern: '^_',
            vars: 'all',
            varsIgnorePattern: '^_'
        }]
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
		{
			files: ['src/routes/**/+page*.ts'],
			rules: {
				'@typescript-eslint/unbound-method': 'off',
			},
		},
	],
};
