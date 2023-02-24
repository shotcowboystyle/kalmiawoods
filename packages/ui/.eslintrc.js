module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@kalmiawoods/eslint-config/index.eslintrc.js',
    'plugin:@typescript-eslint/recommended',
    // https://github.com/vuejs/eslint-plugin-vue/blob/44ff0e02cd0fd08b8cd7dee0127dbb5590446323/docs/user-guide/README.md#conflict-with-prettier
    'plugin:vue/vue3-recommended',
  ],
  // https://github.com/vuejs/vue-eslint-parser#parseroptionsparser
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  // rules: {
  //   'prettier/prettier': 'warn',
  // },
};
