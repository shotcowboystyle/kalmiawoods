const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
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
          '.bg-dark': {
            'background-color': darkTheme['base-100'],
          },
        },
      },
    ],
    // darkTheme: 'forest',
    darkTheme: 'dark',
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('daisyui'),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.container': {
          margin: 'auto',
          maxWidth: '1760px',
          paddingLeft: '24px',
          paddingRight: '24px',
        },
      });
    }),
  ],
  variants: {
    fluidType: ['responsive'],
  },
};
