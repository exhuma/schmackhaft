module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["prettier", "plugin:jsdoc/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": "off",
    "no-unused-vars": "warn",
    "sort-imports": "error",
    "no-unused-vars": "off",
    "jsdoc/require-returns-type": "off",
    "jsdoc/require-param-type": "off",
  },
};
