module.exports = {
  env: {
    es2022: true,
  },
  extends: ['turbo', 'prettier', 'eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // '@typescript-eslint/no-explicit-any': 0,
  },
};
