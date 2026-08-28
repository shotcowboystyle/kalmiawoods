// @ts-check

import js from '@eslint/js';
// import markdown from '@eslint/markdown';
import configPrettier from 'eslint-config-prettier';
import pluginAstro from 'eslint-plugin-astro';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import parserVue from 'vue-eslint-parser';

export default defineConfig(
	{
		ignores: [
			'**/node_modules/**',
			'**/dist/**',
			'.astro/**',
			'postcss.config.cjs',
			'.pnp',
			'.pnp.js',
			'**/coverage/**',
			'**/test-results/**',
			'**/playwright-report/**',
			'playwright/.cache/**',
			'**/.DS_Store',
			'**/*.pem',
			'**/npm-debug.log*',
			'**/yarn-debug.log*',
			'**/yarn-error.log*',
			'**/.pnpm-debug.log*',
			'**/.env*.local',
			'**/.vercel/**',
			'**/*.tsbuildinfo',
			'**/next-env.d.ts',
			'**/public/sw.js',
			'**/public/animation/**',
			'**/public/fonts/**',
			'**/public/geojson/**',
			'**/.vscode/**',
			'lefthook.yml',
			'pnpm-lock.yaml',
			'cspell.json',
			'.cspellcache',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs['flat/recommended'],
	...pluginAstro.configs.recommended,
	// ...markdown.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
				...globals.es2022,
				__BUILD_ID__: 'readonly',
			},
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ varsIgnorePattern: 'Props', ignoreRestSiblings: true },
			],
		},
	},
	{
		files: ['**/*.vue'],
		languageOptions: {
			parser: parserVue,
			parserOptions: {
				parser: '@typescript-eslint/parser',
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
	},
	configPrettier,
);
