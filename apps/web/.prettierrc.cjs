/** @type {import("@types/prettier").Options} */

module.exports = {
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss', // MUST come last
  ],
  pluginSearchDirs: false,
  overrides: [
    {
      files: '*.astro',
      semi: true,
      options: {
        parser: 'astro',
        printWidth: 100,
      },
    },
  ],
};
