const defaultTheme = require('tailwindcss/defaultTheme');
const lightTheme = require('daisyui/src/theming/themes')['[data-theme=garden]'];
const darkTheme = require('daisyui/src/theming/themes')['[data-theme=forest]'];

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    //
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],

  darkMode: 'class',

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
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        body: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
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
      transitionProperty: {
        width: 'width',
      },
      textDecoration: ['active'],
      // minWidth: {
      //   kanban: '28rem',
      // },
    },
  },

  safelist: [
    // In Markdown (README…)
    'justify-evenly',
    'overflow-hidden',
    'rounded-md',

    // From the Hugo Dashboard
    'w-64',
    'w-1/2',
    'rounded-l-lg',
    'rounded-r-lg',
    'bg-gray-200',
    'grid-cols-4',
    'grid-cols-7',
    'h-6',
    'leading-6',
    'h-9',
    'leading-9',
    'shadow-lg',
    'bg-opacity-50',
    'dark:bg-opacity-80',

    // For Astro one
    'grid',

    // For Daisy UI
    'checkbox',
  ],

  daisyui: {
    themes: [
      {
        light: {
          ...lightTheme,
          '.bg-light': {
            'background-color': lightTheme['base-100'],
          },
        },
        dark: {
          ...darkTheme,
          accent: '#b45309',
          neutral: '#191D24',
          'base-100': '#2A303C',
          '--rounded-btn': '0.5rem',
          '.bg-dark': {
            'background-color': darkTheme['base-100'],
          },
        },
      },
    ],
    darkTheme: 'dark',
  },

  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('daisyui'),
  ],
};
