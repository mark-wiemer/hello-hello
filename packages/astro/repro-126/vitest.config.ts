/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

/** Stub plugin so Vitest doesn't try to parse MDX as plain JS */
const mdxStub = {
  name: "mdx-stub",
  transform(_code: any, id: any) {
    if (id.endsWith(".mdx")) {
      return { code: "export default {};", map: null };
    }
  },
};

export default getViteConfig({
  plugins: [mdxStub],
  test: {
    exclude: ["./src/e2e/**", "**/node_modules/**", "**/.git/**"],
  },
});
