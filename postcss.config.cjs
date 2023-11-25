const browsersList = require('./browserslist.config.cjs');

module.exports = {
	plugins: {
		'postcss-for': {},
		'postcss-random': { round: true, noSeed: true },
		'postcss-import': {},
		'postcss-at-rules-variables': {},
		'tailwindcss/nesting': 'postcss-nesting',
		tailwindcss: {},
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
