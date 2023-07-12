const path = require("path");

/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier',
		'plugin:tailwindcss/recommended',
		'plugin:@tanstack/eslint-plugin-query/recommended'
	],
	plugins: ['@typescript-eslint', '@tanstack/query'],
	ignorePatterns: ['*.cjs'],
	overrides: [{
		files: ['*.svelte'], processor: 'svelte-eslint-parser', parserOptions: {
			parser: '@typescript-eslint/parser',
		}
	}],
	// {
	// 	extends: [
	// 		// "plugin:@typescript-eslint/recommended-requiring-type-checking"
	// 	],
	// 	files: ["*.ts", "*.tsx"],
	// 	parserOptions: {
	// 		project: path.join(__dirname, "tsconfig.json"),
	// 	},
	// 	// exclude svelte +page.ts and +page.server.ts files from type-checking
	// 	excludedFiles: ["+page.ts", "+page.server.ts", "+server.ts"],
	// }],
	rules: {
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports",
			},
		],
		"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
		"@typescript-eslint/switch-exhaustiveness-check": "error"
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
};
