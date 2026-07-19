const { defineConfig, globalIgnores } = require("eslint/config");
const n = require("eslint-plugin-n");

// console.log(require("eslint-plugin-n"));

module.exports = defineConfig(
  {
    extends: [n.configs["flat/recommended-script"]],
  },
)