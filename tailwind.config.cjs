const defaultTheme = require('tailwindcss/defaultTheme');
const lightTheme = require('daisyui/src/theming/themes')['[data-theme=autumn]'];
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
          primary: '#20D489',
          secondary: '#E4E6EF',
          accent: '#6610f2',
          neutral: '#181C32',
          'base-100': '#F5F8FA',
          info: '#5710B2',
          success: '#00B2FF',
          warning: '#FFC700',
          error: '#F1416C',
          '.bg-light': {
            'background-color': '#F5F8FA',
          },
        },
        dark: {
          ...darkTheme,
          // accent: '#b45309',
          // neutral: '#3F4254',
          // 'base-100': '#181C32',
          '--rounded-btn': '0.65rem',
          primary: '#bbea69',
          secondary: '#1acc87',
          accent: '#45ce2d',
          neutral: '#2f2730',
          'base-100': '#433d51',
          info: '#80caea',
          success: '#139659',
          warning: '#df9a07',
          error: '#fa665c',
          '.bg-dark': {
            'background-color': '#181C32',
          },
        },
      },
    ],
    darkTheme: 'dark',
  },

  plugins: [require('tailwind-scrollbar')({ nocompatible: true }), require('daisyui')],
};
