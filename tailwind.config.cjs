/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx,css,vue}'],

	// darkMode: 'class',
	darkMode: ['class', "[data-theme='dark']"],

	theme: {
		extend: {
			animation: {
				text: 'text 5s ease infinite',
			},
			fontFamily: {
				sans: [
					'InterVariable',
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'system-ui',
				],
				body: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'system-ui'],
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
	},
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['[data-theme=autumn]'],
				},
				dark: {
					...require('daisyui/src/theming/themes')['[data-theme=forest]'],
					'--rounded-btn': '0.65rem',
				},
			},
		],
		// darkTheme: 'dark',
		darkTheme: false,
	},

	plugins: [
		require('daisyui'),
		require('tailwindcss/plugin')(({ addUtilities }) => {
			addUtilities({
				'.container': {
					marginLeft: 'auto',
					marginRight: 'auto',
					maxWidth: '1760px',
				},
			});
		}),
	],
};
