/** @type {import("prettier").Config} */
module.exports = {
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  printWidth: 120,
  semi: true,
  singleQuote: true,
  jsxBracketSameLine: true,
  bracketSameLine: true,
  plugins: [require.resolve('prettier-plugin-astro')],
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
