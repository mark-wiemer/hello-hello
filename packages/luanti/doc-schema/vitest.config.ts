import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      // should match tsconfig.json
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
