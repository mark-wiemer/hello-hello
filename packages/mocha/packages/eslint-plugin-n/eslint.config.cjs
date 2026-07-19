const { defineConfig, globalIgnores } = require("eslint/config");
const { default: n } = require("eslint-plugin-n");

module.exports = defineConfig(
  {
    extends: [n.configs["flat/recommended-script"]],
  },
)