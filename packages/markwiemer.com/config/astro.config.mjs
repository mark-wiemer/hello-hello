// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import { resolve, sep } from "node:path";
import process from "node:process";

const publicDirPath = `${resolve(process.cwd(), `src${sep}public`)}${sep}`;

// https://astro.build/config
export default defineConfig({
  integrations: [mdx()],
  publicDir: "./src/public",
  // Never change these; these are user-facing links
  // Don't add more `/s/___` entries, use `/___` from now on. `/___` is cleaner and conflicts are very unlikely.
  redirects: {
    "/about": "/blog/who-am-i",
    "/ai-instructions": "https://github.com/mark-wiemer/hello-hello/blob/main/packages/markwiemer.com/docs/guidelines.md",
    "/ahkpp": "https://ahkpp.com",
    "/blog/war-in-iran": "/blog/2026-war-in-iran",
    "/luanti": "/software/luanti",
    "/s/about": "/blog/who-am-i",
    "/s/luanti": "/software/luanti",
    "/s/mocha": "/software/mocha",
    "/s/mocha12": "/software/mocha/v12",
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
