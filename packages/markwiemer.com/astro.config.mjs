// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create thumbnail generation integration
const thumbnailIntegration = {
  name: "generate-thumbnails",
  hooks: {
    "astro:build:before": async () => {
      await generateThumbnails();
    },
  },
};

async function generateThumbnails() {
  const assetsDir = path.join(__dirname, "src/assets");
  console.log("[generate-thumbnails] Generating thumbnails...");

  // Find all jpg/png files and create thumbnails if they don't exist
  const files = fs.readdirSync(assetsDir);
  let count = 0;

  for (const file of files) {
    // Skip subdirectories, already-generated thumbnails, and non-image files
    if (!/\.(jpg|jpeg|png)$/i.test(file) || file.includes("-thumb")) {
      continue;
    }

    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);

    // Skip if it's a directory
    if (stats.isDirectory()) {
      continue;
    }

    const thumbName = file.replace(/\.(\w+)$/, "-thumb.$1");
    const thumbPath = path.join(assetsDir, "thumbnails", thumbName);

    // Skip if thumbnail already exists
    if (fs.existsSync(thumbPath)) {
      continue;
    }

    try {
      await sharp(filePath)
        .resize(300, 300, { fit: "inside", position: "center" })
        .jpeg({ quality: 70, progressive: true })
        .toFile(thumbPath);

      console.log(`[generate-thumbnails] ✓ Created ${thumbName}`);
      count++;
    } catch (error) {
      console.error(`[generate-thumbnails] ✗ Failed to create thumbnail for ${file}:`, error);
    }
  }

  if (count > 0) {
    console.log(`[generate-thumbnails] ✅ Complete (${count} new thumbnails created).`);
  }
}

// Generate thumbnails on startup
await generateThumbnails();

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), thumbnailIntegration],
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
