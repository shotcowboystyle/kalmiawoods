/** @type {import("prettier").Config} */
module.exports = {
  // i am just using the standard config, change if you need something else
  // ...require('prettier-config-standard'),
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
  semi: true,
  singleQuote: true,
  jsxBracketSameLine: true,
  bracketSameLine: true,
  // pluginSearchDirs: [__dirname],
  plugins: [require.resolve('prettier-plugin-astro')],
  // plugins: ['./node_modules/prettier-plugin-astro'],
  // plugins: [
  //   'prettier-plugin-astro'
  //   // 'prettier-plugin-tailwindcss' // MUST come last
  // ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    },
    {
      files: '*.vue',
      vueIndentScriptAndStyle: true
    }
  ]
}
