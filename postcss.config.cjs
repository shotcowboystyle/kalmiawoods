const browsersList = require('./browserslist.config.cjs');

// Tailwind v4 uses its Vite plugin as the primary integration.
// PostCSS is only needed for additional transforms.
module.exports = {
	plugins: {
		'postcss-for': {},
		'postcss-random': { round: true, noSeed: true },
		'postcss-import': {},
		'postcss-at-rules-variables': {},
		// 'tailwindcss/nesting': 'postcss-nesting',
		'postcss-preset-env': {
			stage: 2,
			browsers: browsersList,
			features: {
				'custom-properties': {
					strict: false,
					warnings: false,
					preserve: true
				},
				// 'custom-media-queries': true,
				'nesting-rules': false
			}
		},
		// 'postcss-combine-media-query': {},
		// 'postcss-combine-duplicated-selectors': {
		// 	removeDuplicatedProperties: true,
		// 	removeDuplicatedValues: false,
		// },
		autoprefixer: {},
		cssnano: {
			preset: 'default',
			discardComments: { removeAll: true },
			zindex: false,
		},
		'postcss-reporter': {},
	},
};
