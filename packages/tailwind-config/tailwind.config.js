const defaultTheme = require('tailwindcss/defaultTheme');
const lightTheme = require('daisyui/src/colors/themes')['[data-theme=garden]'];
const darkTheme = require('daisyui/src/colors/themes')['[data-theme=forest]'];

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        text: 'text 5s ease infinite',
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
      fontFamily: {
        sans: ['InterVariable', 'Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
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
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('daisyui')],
};
