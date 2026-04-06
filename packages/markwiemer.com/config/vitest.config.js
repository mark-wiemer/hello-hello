// reference Vitest types for better IDE support of `test` prop
/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

/** Stub plugin so Vitest doesn't try to parse MDX as plain JS */
const mdxStub = {
  name: "mdx-stub",
  transform(_code, id) {
    if (id.endsWith(".mdx")) {
      return { code: "export default {};", map: null };
    }
  },
};

export default getViteConfig({
  plugins: [mdxStub],
  // https://vitest.dev/config/
  test: {
    exclude: ["./src/e2e/**", "**/node_modules/**", "**/.git/**"],
  },
});
