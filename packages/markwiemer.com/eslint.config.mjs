import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import packageJson from "eslint-plugin-package-json";

const globalIgnore = ["**/dodge-the-creeps/**", "**/.astro/**"];

export default defineConfig([
  globalIgnores(globalIgnore),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  packageJson.configs.recommended,
]);
