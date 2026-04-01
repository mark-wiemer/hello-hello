// reference Vitest types for better IDE support of `test` prop
/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  // https://vitest.dev/config/
  test: {
    exclude: ["./src/e2e/**", "**/node_modules/**", "**/.git/**"],
  },
});
