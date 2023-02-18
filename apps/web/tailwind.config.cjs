/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}',
    './node_modules/@kalmiawoods/ui/dist/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}',
  ],
  presets: [
    require('tailwindcss/defaultConfig'),
    require('@kalmiawoods/tailwind-config/tailwind.config'),
  ],
};
