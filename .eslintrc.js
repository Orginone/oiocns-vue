module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-unused-vars": "error",
  },
  extends: [
    "plugin:vue/vue3-essential",
    "plugin:vue/vue3-recommended",
    "plugin:vue/vue3-strongly-recommended",
    "./.eslintrc-auto-import.json",
  ],
};
