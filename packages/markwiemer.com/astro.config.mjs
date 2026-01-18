// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  vite: {
    plugins: [
      {
        name: "full-reload-public-styles",
        apply: "serve",
        handleHotUpdate({ file, server }) {
          // public/ assets are served as-is and aren't in Vite's module graph,
          // so changes may not trigger HMR/reload by default.
          if (file.endsWith("/public/styles.css")) {
            server.ws.send({ type: "full-reload", path: "*" });
          }
        },
      },
    ],
  },
});
