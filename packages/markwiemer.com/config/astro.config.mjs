// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { resolve, sep } from "node:path";

const publicDirPath = `${resolve(process.cwd(), `src${sep}public`)}${sep}`;

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  publicDir: "./src/public",
  redirects: {
    "/ahkpp": "https://ahkpp.com",
    "/luanti": "/software/luanti",
    "/about": "/blog/who-am-i",
  },
  vite: {
    plugins: [
      {
        name: "full-reload-public-styles",
        apply: "serve",
        handleHotUpdate({ file, server }) {
          // public/ assets are served as-is and aren't in Vite's module graph,
          // so changes may not trigger HMR/reload by default.
          const normalizedFilePath = resolve(file);
          if (normalizedFilePath.startsWith(publicDirPath)) {
            server.ws.send({ type: "full-reload", path: "*" });
          }
        },
      },
    ],
  },
});
