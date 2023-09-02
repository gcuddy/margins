// Influenced by: https://github.com/cpojer/eslint-config/
/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:import/errors',
		'plugin:import/typescript',
		'plugin:svelte/recommended',
		// 'plugin:tailwindcss/recommended',
		// 'prettier',
	],
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'import',
		'simple-import-sort',
		// 'unused-imports',
		'sort-destructure-keys',
		'sort-keys-fix',
		'typescript-sort-keys',
		'unicorn',
	],
	rules: {
		'@typescript-eslint/array-type': [
			'error',
			{
				default: 'generic',
			},
		],
		'@typescript-eslint/ban-ts-comment': [
			'error',
			{
				'ts-expect-error': 'allow-with-description',
			},
		],
		'@typescript-eslint/ban-types': 'error',
		'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{ fixStyle: 'inline-type-imports' },
		],
		'@typescript-eslint/no-dynamic-delete': 0,
		'@typescript-eslint/naming-convention': [
			'error',
			{
				custom: {
					match: true,
					regex: '^T[A-Z]',
				},
				format: ['PascalCase'],
				selector: 'typeParameter',
			},
		],
        // these 2 rules cause huge performance issues for us rn
        '@typescript-eslint/no-misused-promises': 0,
        '@typescript-eslint/no-floating-promises': 0,
        // ^^
		'@typescript-eslint/no-namespace': 0,
		'@typescript-eslint/no-non-null-assertion': 0,
		'@typescript-eslint/no-throw-literal': 0,
		'@typescript-eslint/no-unused-vars': 0,
		'@typescript-eslint/prefer-ts-expect-error': 'error',
		'array-bracket-spacing': [2, 'never'],
		'arrow-parens': [2, 'always'],
		'arrow-spacing': 2,
		'brace-style': [
			2,
			'1tbs',
			{
				allowSingleLine: true,
			},
		],
		curly: 2,
		'eol-last': 2,
		// `import/default` and `import/namespace` are slow.
		'import/default': 0,
		'import/named': 0,
		'import/namespace': 0,
		'import/no-duplicates': 2,
		'import/no-extraneous-dependencies': 2,
		'import/no-named-as-default-member': 0,
		'import/no-namespace': 0,
		'import/no-unresolved': 0,
		'import/order': 0,
		'no-console': 2,
		'no-const-assign': 2,
		'no-extra-parens': [2, 'functions'],
		'no-irregular-whitespace': 2,
		'no-mixed-spaces-and-tabs': 0,
		'no-throw-literal': 0,
		'no-unused-expressions': 2,
		'no-unused-labels': 2,
		'no-unused-vars': 0,
		'no-var': 2,
		'object-curly-spacing': 0,
		'object-shorthand': 2,
		'prefer-arrow-callback': [2, { allowNamedFunctions: true }],
		'prefer-const': 2,
		'prefer-template': 'error',
		'simple-import-sort/exports': 2,
		'simple-import-sort/imports': 2,
		'sort-imports': 0,
		'sort-destructure-keys/sort-destructure-keys': 2,
		'sort-keys-fix/sort-keys-fix': 2,
		'space-before-blocks': 2,
		'space-before-function-paren': [
			2,
			{ anonymous: 'never', asyncArrow: 'always', named: 'never' },
		],
		'svelte/no-immutable-reactive-statements': 'error',
		'svelte/no-reactive-literals': 'error',
		'svelte/no-target-blank': 'error',
		'svelte/no-trailing-spaces': 'error',
		'svelte/no-useless-mustaches': 'error',
		'svelte/prefer-style-directive': 'error',
		'typescript-sort-keys/interface': 2,
		'typescript-sort-keys/string-enum': 2,
		'unicorn/better-regex': 2,
		'unicorn/catch-error-name': 2,
		'unicorn/consistent-function-scoping': 2,
		'unicorn/no-abusive-eslint-disable': 2,
		'unicorn/no-hex-escape': 2,
		'unicorn/no-typeof-undefined': 2,
		'unicorn/no-useless-promise-resolve-reject': 2,
		'unicorn/no-useless-spread': 2,
		'unicorn/numeric-separators-style': 2,
		'unicorn/prefer-array-flat-map': 2,
		'unicorn/prefer-array-index-of': 2,
		'unicorn/prefer-array-some': 2,
		'unicorn/prefer-at': 2,
		'unicorn/prefer-dom-node-append': 2,
		'unicorn/prefer-native-coercion-functions': 2,
		'unicorn/prefer-node-protocol': 2,
		'unicorn/prefer-number-properties': 2,
		'unicorn/prefer-optional-catch-binding': 2,
		'unicorn/prefer-set-size': 2,
		'unicorn/prefer-string-replace-all': 2,
		'unicorn/prefer-string-slice': 2,
		'unicorn/prefer-ternary': 2,
		'unicorn/prefer-top-level-await': 2,
		'unicorn/text-encoding-identifier-case': 2,

		// 'unused-imports/no-unused-imports': 'error',
		// 'unused-imports/no-unused-vars': ['warn', {
		//     args: 'after-used',
		//     argsIgnorePattern: '^_',
		//     vars: 'all',
		//     varsIgnorePattern: '^_'
		// }]
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
		es2021: true,
		node: true,
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
