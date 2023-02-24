module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['@kalmiawoods/eslint-config/index.eslintrc.js', 'plugin:astro/recommended'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      // rules: {
      //   'import/no-absolute-path': 'off',
      //   // ESLint won't capture ambient declarations in Astro files.
      //   'no-undef': 'off',
      //   'import/extensions': 'off',
      //   'import/no-named-as-default-member': 'off',
      //   'import/no-named-as-default': 'off',
      //   'import/prefer-default-export': 'off',
      //   // 'import/no-unresolved': [2, { ignore: ['@astrojs/image/components'] }],
      //   'import/no-extraneous-dependencies': 'off',
      //   'max-lines': ['error', { max: 160, skipComments: true, skipBlankLines: true }],
      //   'no-unused-vars': ['error', { varsIgnorePattern: 'Props' }],
      // },
      globals: {
        astroHTML: 'readonly',
      },
    },
  ],
};
