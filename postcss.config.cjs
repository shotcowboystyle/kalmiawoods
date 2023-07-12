module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('cssnano')({
      preset: ['default', { discardComments: { removeAll: true } }],
      plugins: [require('autoprefixer')],
    }),
    // require('autoprefixer'),
  ],
};
