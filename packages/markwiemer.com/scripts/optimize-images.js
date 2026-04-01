/**
 * Converts all .jpg/.jpeg/.png images in src/assets/ to .webp format,
 * updates all import references in src/, and deletes the originals.
 *
 * Usage: bun run optimize-images
 *
 * Options:
 *   --dry-run    Show what would happen without making changes
 *   --max-width  Max pixel width to resize to (default: 1920)
 *   --quality    WebP quality 1-100 (default: 80)
 */

import sharp from "sharp";
import { readdir, stat, unlink, readFile, writeFile } from "fs/promises";
import { join, extname, relative } from "path";

const ASSETS_DIR = new URL("../src/assets/", import.meta.url).pathname;
const SRC_DIR = new URL("../src/", import.meta.url).pathname;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const maxWidth = Number(args.find((_, i, a) => a[i - 1] === "--max-width")) || 1920;
const quality = Number(args.find((_, i, a) => a[i - 1] === "--quality")) || 80;

const CONVERTIBLE_EXTS = new Set([".jpg", ".jpeg", ".png"]);
const SOURCE_EXTS = new Set([".astro", ".mdx", ".md", ".ts", ".js", ".jsx", ".tsx"]);

/** Recursively yield all file paths under a directory */
async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function convertImage(filePath) {
  const webpPath = filePath.replace(/\.(jpe?g|png)$/i, ".webp");
  const relPath = relative(ASSETS_DIR, filePath);

  const image = sharp(filePath);
  const metadata = await image.metadata();

  let pipeline = image;
  const resized = metadata.width > maxWidth;
  if (resized) {
    pipeline = pipeline.resize(maxWidth);
  }

  if (dryRun) {
    const { size: oldSize } = await stat(filePath);
    const resizeNote = resized ? ` (resize ${metadata.width}→${maxWidth}px)` : "";
    console.log(`  [dry-run] Would convert: ${relPath}${resizeNote} (${formatSize(oldSize)})`);
    return { relPath, oldSize, newSize: 0, saved: 0 };
  }

  await pipeline.webp({ quality }).toFile(webpPath);

  const { size: oldSize } = await stat(filePath);
  const { size: newSize } = await stat(webpPath);
  const savings = ((1 - newSize / oldSize) * 100).toFixed(1);
  const resizeNote = resized ? ` (resized ${metadata.width}→${maxWidth}px)` : "";

  console.log(
    `  ✓ ${relPath} → .webp${resizeNote}: ${formatSize(oldSize)} → ${formatSize(newSize)} (${savings}% smaller)`,
  );

  await unlink(filePath);
  return { relPath, oldSize, newSize, saved: oldSize - newSize };
}

async function updateImports() {
  let filesUpdated = 0;
  let importsUpdated = 0;

  for await (const filePath of walk(SRC_DIR)) {
    const ext = extname(filePath).toLowerCase();
    if (!SOURCE_EXTS.has(ext)) continue;

    const content = await readFile(filePath, "utf-8");
    // Match import paths ending in .jpg, .jpeg, or .png (case-insensitive)
    const updated = content.replace(/(?<=["'])([^"']*)\.(jpe?g|png)(?=["'])/gi, "$1.webp");

    if (updated !== content) {
      const relPath = relative(SRC_DIR, filePath);
      const count = (content.match(/(?<=["'])([^"']*)\.(jpe?g|png)(?=["'])/gi) || []).length;
      if (dryRun) {
        console.log(`  [dry-run] Would update ${count} import(s) in: ${relPath}`);
      } else {
        await writeFile(filePath, updated, "utf-8");
        console.log(`  ✓ Updated ${count} import(s) in: ${relPath}`);
      }
      filesUpdated++;
      importsUpdated += count;
    }
  }

  return { filesUpdated, importsUpdated };
}

async function main() {
  console.log(`\nImage Optimization Script`);
  console.log(`  Max width: ${maxWidth}px | WebP quality: ${quality} | Dry run: ${dryRun}\n`);

  // Step 1: Convert images
  console.log("Converting images to WebP...");
  const results = [];
  for await (const filePath of walk(ASSETS_DIR)) {
    const ext = extname(filePath).toLowerCase();
    if (CONVERTIBLE_EXTS.has(ext)) {
      try {
        results.push(await convertImage(filePath));
      } catch (err) {
        console.error(`  ✗ ${relative(ASSETS_DIR, filePath)}: ${err.message}`);
      }
    }
  }

  if (results.length === 0) {
    console.log("  No .jpg/.jpeg/.png images found in src/assets/. Nothing to do.\n");
    return;
  }

  // Step 2: Update imports
  console.log("\nUpdating import references...");
  const { filesUpdated, importsUpdated } = await updateImports();

  // Summary
  const totalOld = results.reduce((sum, r) => sum + r.oldSize, 0);
  const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
  const totalSaved = totalOld - totalNew;

  console.log(`\n--- Summary ---`);
  console.log(`  Images converted: ${results.length}`);
  if (!dryRun) {
    console.log(
      `  Size: ${formatSize(totalOld)} → ${formatSize(totalNew)} (saved ${formatSize(totalSaved)})`,
    );
  }
  console.log(`  Source files updated: ${filesUpdated} (${importsUpdated} imports)`);
  if (dryRun) {
    console.log(`\n  This was a dry run. Re-run without --dry-run to apply changes.\n`);
  } else {
    console.log(`\n  Done! Original files deleted. WebP files are not tracked by LFS.\n`);
  }
}

main();
