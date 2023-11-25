const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx,css,vue}'],

	darkMode: 'class',
	// darkMode: ['class', "[data-theme='dark']"],

	theme: {
		extend: {
			animation: {
				text: 'text 5s ease infinite',
			},
			fontFamily: {
				body: ['"DM Sans Variable"', 'sans-serif'],
				display: ['"PP Woodland"', 'system-ui', ...defaultTheme.fontFamily.serif],
			},
			keyframes: {
				text: {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center',
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center',
					},
				},
			},
		},
		fluidTypeSettings: {

		},
		fluidType: {
			settings: {
				fontSizeMin: 1.125,
				fontSizeMax: 1.25,
				ratioMin: 1.125,
				ratioMax: 1.2,
				screenMin: 20,
				screenMax: 96,
				unit: 'rem',
				prefix: ''
			},
			values: {
				'xs': [-2, 1.6],
				'sm': [-1, 1.6],
				'base': [0, 1.6],
				'lg': [1, 1.6],
				'xl': [2, 1.2],
				'2xl': [3, 1.2],
				'3xl': [4, 1.2],
				'4xl': [5, 1.1],
				'5xl': [6, 1.1],
				'6xl': [7, 1.1],
				'7xl': [8, 1],
				'8xl': [9, 1],
				'9xl': [10, 1],
			}
		},

		screens: {
			'sm': '480px',
			// => @media (min-width: 576px) { ... }

			'md': '1140px',
			// => @media (min-width: 1140px) { ... }

			'lg': '1440px',
			// => @media (min-width: 1440px) { ... }

			'xl': '1920px',
			// => @media (min-width: 1440px) { ... }
		},
	},

	corePlugins: {
		container: false,
		fontSize: false,
	},

	daisyui: {
		themes: [
			{
				light: {
					// ...require('daisyui/src/theming/themes')['[data-theme=autumn]'],
					'base-100': '#e3dcc9',
					'--bc': '#003b54',
					primary: '#d1f6dfff',
					secondary: '#28d466ff',
					accent: '#28d466ff',
					neutral: '#003b54ff',
					info: '#73e2e5ff',
					success: '#28d466ff',
					warning: '#ffffff',
					error: '#ffffff',
				},
				dark: {
					// ...require('daisyui/src/theming/themes')['[data-theme=forest]'],
					'base-100': '#21313C',
					// 'base-content': '#e3dcc9',
					'--bc': '#003b54',
					primary: '#d1f6dfff',
					secondary: '#28d466ff',
					accent: '#28d466ff',
					neutral: '#001e0eff',
					info: '#73e2e5ff',
					success: '#28d466ff',
					warning: '#86681D',
					error: '#CF4A22',
					'--rounded-btn': '0.65rem',
				},
			},
		],
		// darkTheme: 'dark',
		darkTheme: false,
	},

	plugins: [
		require('tailwindcss-fluid-type'),
		require('daisyui'),
		require('tailwindcss/plugin')(({ addUtilities }) => {
			addUtilities({
				'.container': {
					paddingLeft: '4.1666666667%',
					paddingRight: '4.1666666667%',
				},
				'.container-narrow': {
					paddingLeft: '8.3333333333%',
					paddingRight: '8.3333333333%',
				},
			});
		}),
	],
};
