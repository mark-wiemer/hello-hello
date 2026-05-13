// @ts-check
import { defineConfig } from "astro/config";
import { resolve, sep } from "node:path";
import process from "node:process";

const publicDirPath = `${resolve(process.cwd(), `src${sep}public`)}${sep}`;

// https://astro.build/config
export default defineConfig({
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
