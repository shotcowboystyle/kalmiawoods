/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}', './node_modules/@kalmiawoods/ui/dist/**/*.{js,ts,vue}'],
  presets: [require('tailwindcss/defaultConfig'), require('@kalmiawoods/tailwind-config/tailwind.config')],
};
