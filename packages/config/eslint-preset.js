/** @type {import("eslint").Linter.Config} */
// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/strict",
    // "plugin:import/errors",
    // "plugin:import/typescript",
    "plugin:svelte/recommended",
  ],
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
      rules: {
        // these cause issues with svelte rn
        "@typescript-eslint/no-unsafe-assignment": 0,
        "@typescript-eslint/no-unsafe-call": 0,
        "no-console": 1,
        "no-undef": 0,
      },
    },
    {
      extends: ["plugin:@typescript-eslint/recommended"],
      files: ["*.ts", "*.tsx"],
      overrides: [
        {
          files: ["**/e2e/**/*.{tsx,ts}"],
          rules: {
            // sorry ma
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "no-undef": "off",
          },
        },
      ],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            disallowTypeAnnotations: false,

            // TODO: enable this once prettier supports it
            // fixStyle: "inline-type-imports",
            fixStyle: "separate-type-imports",
            prefer: "type-imports",
          },
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
    {
      extends: ["plugin:playwright/recommended"],
      files: ["**/e2e/**/*.{js,jsx}"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "no-undef": "off",
      },
    },
    //   extends: ["plugin:vitest/recommended"],
    //   files: ["**/*.{test,spec}.[jt]s?(x)"],
    //   plugins: ["vitest"],
    // },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    extraFileExtensions: [".svelte"],
    project: ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
    // eslint-disable-next-line no-undef
    tsconfigRootDir: __dirname, // This is a required setting in `@typescript-eslint/parser` v4.24.0.
  },
  plugins: [
    "@typescript-eslint",
    // "import",
    // 'sort-destructure-keys',
    // 'sort-keys-fix',
    // 'typescript-sort-keys',
    // "unicorn",
    // "unused-imports",
  ],
  rules: {
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": "allow-with-description",
      },
    ],
    // "@typescript-eslint/ban-types": "error",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { fixStyle: "inline-type-imports" },
    ],
    "@typescript-eslint/no-dynamic-delete": 0,
    // For our purposes, don't mind this.
    "@typescript-eslint/no-explicit-any": 0,

    "@typescript-eslint/no-floating-promises": 0,
    // '@typescript-eslint/naming-convention': [
    // 	'error',
    // 	{
    // 		custom: {
    // 			match: true,
    // 			regex: '^T[A-Z]',
    // 		},
    // 		format: ['PascalCase'],
    // 		selector: 'typeParameter',
    // 	},
    // ],
    // these 2 rules cause huge performance issues for us rn
    "@typescript-eslint/no-misused-promises": 0,
    // ^^
    "@typescript-eslint/no-namespace": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-throw-literal": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/prefer-ts-expect-error": "error",
    "array-bracket-spacing": [2, "never"],
    // 'arrow-parens': [2, 'always'],
    "arrow-spacing": 2,
    "brace-style": [
      2,
      "1tbs",
      {
        allowSingleLine: true,
      },
    ],
    "eol-last": 2,
    // `import/default` and `import/namespace` are slow.
    // "import/default": 0,
    // "import/named": 0,
    // "import/namespace": 0,
    // "import/no-duplicates": 2,
    // "import/no-extraneous-dependencies": 1,
    // "import/no-named-as-default-member": 0,
    // "import/no-namespace": 0,
    // "import/no-unresolved": 0,
    // "import/order": 0,
    "no-console": 0,
    "no-const-assign": 2,
    "no-extra-parens": [2, "functions"],
    "no-irregular-whitespace": 2,
    "no-mixed-spaces-and-tabs": 0,
    "no-throw-literal": 0,
    "no-unused-expressions": 0,
    "no-unused-labels": 2,
    "no-unused-vars": 0,
    "no-var": 2,
    "object-curly-spacing": 0,
    "object-shorthand": 2,
    "prefer-arrow-callback": [2, { allowNamedFunctions: true }],
    "prefer-const": 0,
    "require-yield": 0,
    // 'sort-destructure-keys/sort-destructure-keys': 2,
    // 'sort-keys-fix/sort-keys-fix': 2,
    "space-before-blocks": 2,
    "space-before-function-paren": 0,
    "svelte/no-at-html-tags": 0,
    "svelte/no-immutable-reactive-statements": "error",
    "svelte/no-reactive-literals": "error",
    "svelte/no-target-blank": "error",
    "svelte/no-trailing-spaces": "error",
    "svelte/no-useless-mustaches": "error",
    "svelte/prefer-style-directive": "error",
    // 'typescript-sort-keys/interface': 2,
    // 'typescript-sort-keys/string-enum': 2,
    // "unicorn/better-regex": 2,
    // "unicorn/catch-error-name": 0,
    // "unicorn/consistent-function-scoping": 2,
    // "unicorn/no-abusive-eslint-disable": 2,
    // "unicorn/no-hex-escape": 2,
    // "unicorn/no-typeof-undefined": 2,
    // "unicorn/no-useless-promise-resolve-reject": 2,
    // "unicorn/no-useless-spread": 2,
    // "unicorn/numeric-separators-style": 2,
    // "unicorn/prefer-array-flat-map": 2,
    // "unicorn/prefer-array-index-of": 2,
    // "unicorn/prefer-array-some": 2,
    // "unicorn/prefer-at": 2,
    // "unicorn/prefer-dom-node-append": 0,
    // "unicorn/prefer-native-coercion-functions": 2,
    // "unicorn/prefer-node-protocol": 2,
    // "unicorn/prefer-number-properties": 2,
    // "unicorn/prefer-optional-catch-binding": 2,
    // "unicorn/prefer-set-size": 2,
    // "unicorn/prefer-string-replace-all": 2,
    // "unicorn/prefer-string-slice": 2,
    // "unicorn/prefer-top-level-await": 2,
    // "unicorn/text-encoding-identifier-case": 2,
    // "unused-imports/no-unused-imports": 2,
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
}
