/** @type {import("stylelint").Config} */
export default {
  ignoreFiles: ['node_modules/', 'output/'],
  plugins: ['stylelint-prettier'],
  extends: [
    'stylelint-prettier/recommended',
    'stylelint-config-recommended',
    'stylelint-config-clean-order',
  ],
};
