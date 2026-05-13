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

// RE build warnings:
// `optimizeDeps.esbuildOptions` option was specified by "astro:dev-toolbar" plugin.
// `resolve.alias` contains an alias with `customResolver` option.
// https://github.com/mark-wiemer/hello-hello/issues/126
export default getViteConfig({
  plugins: [mdxStub],
  // https://vitest.dev/config/
  test: {
    exclude: ["./src/e2e/**", "**/node_modules/**", "**/.git/**"],
  },
});
