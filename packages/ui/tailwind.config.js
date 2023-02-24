/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,vue}'],
  presets: [require('tailwindcss/defaultConfig'), require('@kalmiawoods/tailwind-config/tailwind.config')],
};
