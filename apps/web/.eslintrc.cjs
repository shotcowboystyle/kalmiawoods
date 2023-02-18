module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: ['kalmiawoods', 'plugin:astro/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {},
    },
  ],
};
