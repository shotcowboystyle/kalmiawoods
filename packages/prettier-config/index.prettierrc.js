/** @type {import('prettier').Config} */
module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
  semi: true,
  singleQuote: true,
  jsxBracketSameLine: true,
  bracketSameLine: true,

  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss', // MUST come last
  ],

  overrides: [
    {
      files: '*.astro',
      semi: true,
      options: {
        parser: 'astro',
        printWidth: 100,
      },
    },
    {
      files: '*.vue',
      vueIndentScriptAndStyle: true,
    },
  ],
};
