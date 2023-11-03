module.exports = {
	'**/*.(js|ts|tsx|md|mdx|vue|astro|cjs|mjs)': [
		'prettier --write --ignore-unknown --cache',
		'eslint --quiet --fix --cache',
		// "vitest related"
	],
};
