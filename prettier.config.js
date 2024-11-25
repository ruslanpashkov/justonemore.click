/** @type {import("prettier").Config} */
export default {
  plugins: ['@awmottaz/prettier-plugin-void-html'],
  singleQuote: true,
  overrides: [
    {
      files: ['*.html'],
      options: {
        printWidth: 120,
      },
    },
    {
      files: ['*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
