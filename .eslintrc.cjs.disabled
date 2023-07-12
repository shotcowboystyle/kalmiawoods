/** @type {import("@types/eslint").Linter.Config} */
// Extracted from `webdev-configs` (https://github.com/JulianCataldo/web-garden/tree/develop/configs)

module.exports = {
  root: true,

  settings: {
    /* This loads <rootdir>/tsconfig.json to eslint */
    'import/resolver': {
      typescript: { project: ['./tsconfig.json'] }
    }
  },

  env: {
    browser: true,
    node: true
  },

  // extends: ['@kalmiawoods/eslint-config/index.eslintrc.js', 'plugin:astro/recommended'],
  overrides: [
    /* — TS — */
    {
      files: ['*.ts', '*.mts', '*.cts'],
      extends: ['@kalmiawoods/eslint-config/index.eslintrc.js'],
      parserOptions: {
        project: ['./tsconfig.json'] /* Specify it only for TypeScript files */,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
      // rules: {
      //   'tsdoc/syntax': 'warn',
      //   '@typescript-eslint/no-unused-vars': [
      //     'error',
      //     { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      //   ],
      //   '@typescript-eslint/no-non-null-assertion': 'off',
      //   'max-lines': ['warn', { max: 250, skipComments: true, skipBlankLines: true }],
      //   'react/jsx-filename-extension': 'off',
      //   'import/prefer-default-export': 'off',
      //   'import/extensions': 'off',
      // },
    },

    /* — JS — */
    {
      files: [
        // TODO: fix "Parsing error: The keyword 'import' is reserved" in `*.mjs`
        '*.js',
        '*.mjs',
        '*.cjs'
      ],
      // parserOptions: {
      //   ecmaVersion: 'latest',
      //   sourceType: 'module',
      // },
      extends: ['airbnb-base', 'eslint:recommended', 'prettier'],
      rules: {
        'import/prefer-default-export': 'off'
      }
    },

    /* Vue */
    {
      files: ['*.vue'],
      extends: [
        //
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        'prettier'
      ],
      parser: 'vue-eslint-parser',
      parserOptions: {
        /* Prevents "unresolved" when using "paths" */
        project: ['./tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module'
        // parser: '@typescript-eslint/parser',
        // extraFileExtensions: ['.vue'],
      },
      rules: {
        'import/no-absolute-path': 'off',
        /* ESLint won't capture ambient declarations in Astro files. */
        'no-undef': 'off',
        'import/extensions': 'off',
        'import/no-named-as-default-member': 'off',
        'import/no-named-as-default': 'off',
        'import/prefer-default-export': 'off',
        // 'import/no-unresolved': [
        //   2,
        //   {
        //     ignore: [
        //       //
        //       '@astrojs/image/components',
        //     ],
        //   },
        // ],
        'import/no-extraneous-dependencies': 'off',
        'max-lines': [
          'error',
          { max: 250, skipComments: true, skipBlankLines: true }
        ],
        'no-unused-vars': ['error', { varsIgnorePattern: 'Props' }]
      }
      // globals: {
      //   /* Fix for un-found Astro namespace */
      //   astroHTML: 'readonly',
      // },
    },

    /* Astro */
    {
      files: ['*.astro'],
      extends: [
        //
        'plugin:astro/recommended',
        'prettier'
      ],
      parser: 'astro-eslint-parser',
      parserOptions: {
        /* Prevents "unresolved" when using "paths" */
        // project: ['./tsconfig.json'],
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      },
      // rules: {
      //   'import/no-absolute-path': 'off',
      //   /* ESLint won't capture ambient declarations in Astro files. */
      //   'no-undef': 'off',
      //   'import/extensions': 'off',
      //   'import/no-named-as-default-member': 'off',
      //   'import/no-named-as-default': 'off',
      //   'import/prefer-default-export': 'off',
      //   'import/no-unresolved': [
      //     2,
      //     {
      //       ignore: [
      //         //
      //         '@astrojs/image/components',
      //       ],
      //     },
      //   ],
      //   'import/no-extraneous-dependencies': 'off',
      //   'max-lines': ['error', { max: 250, skipComments: true, skipBlankLines: true }],
      //   'no-unused-vars': ['error', { varsIgnorePattern: 'Props' }],
      // },
      globals: {
        /* Fix for un-found Astro namespace */
        astroHTML: 'readonly'
      }
    }
  ]
}
