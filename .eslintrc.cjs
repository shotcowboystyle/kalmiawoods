/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
	root: true,
	ignorePatterns: ['node_modules', 'dist'],
	env: {
		node: true,
		es2022: true,
		browser: true,
	},
	reportUnusedDisableDirectives: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 'latest',
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:markdown/recommended',
	],
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{ varsIgnorePattern: 'Props', ignoreRestSiblings: true },
		],
	},
	overrides: [
		{
			parser: 'vue-eslint-parser',
			parserOptions: {
				ecmaVersion: 'latest',
				parser: '@typescript-eslint/parser',
				sourceType: 'module',
			},
			files: ['**/*.vue'],
			plugins: ['vue', '@typescript-eslint'],
			extends: ['plugin:vue/vue3-recommended', '@vue/typescript/recommended', 'prettier'],
			// rules: {
			// 	'vue/valid-attribute-name': 'off',
			// 	'vue/no-export-in-script-setup': 'off',
			// 	'vue/no-dupe-keys': 'off',
			// 	'vue/no-v-for-template-key': 'off',
			// 	'vue/no-v-for-template-key-on-child': 'error',
			// 	'vue/max-attributes-per-line': ['error', {
			// 		'singleline': {
			// 			'max': 3
			// 		},
			// 		'multiline': {
			// 			'max': 1
			// 		}
			// 	}],
			// 	'vue/html-indent': ['error', 'tab']
			// },
		},
		{
			files: ['*.astro'],
			parser: 'astro-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
				extraFileExtensions: ['.astro'],
				sourceType: 'module',
			},
			extends: ['plugin:astro/recommended', 'plugin:astro/jsx-a11y-recommended'],
			rules: {
				'astro/jsx-a11y/no-redundant-roles': [
					'error',
					{
						ul: ['list'],
					},
				],
			},
		},
	],
};
