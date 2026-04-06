/*
Converts all .jpg/.jpeg/.png images in src/assets/ to .webp format,
updates all import references in src/, and deletes the originals.

Usage: bun run optimize-images

Options:
  --dry-run    Show what would happen without making changes
  --max-width  Max pixel width to resize to (default: 1920)
  --quality    WebP quality 1-100 (default: 80)
*/

import sharp from "sharp";
import { readdir, stat, unlink, readFile, writeFile } from "fs/promises";
import { join, extname, relative } from "path";

const assetsDir = new URL("../src/assets/", import.meta.url).pathname;
const srcDir = new URL("../src/", import.meta.url).pathname;

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
/** Max width in pixels */
// Found by looking at flag preceding the number
const maxWidth = Number(args.find((_, i, a) => a[i - 1] === "--max-width")) || 1920;
/** WebP quality */
// Found by looking at flag preceding the number
const quality = Number(args.find((_, i, a) => a[i - 1] === "--quality")) || 80;

/**
 * Extensions to convert from.
 * Each entry starts with a `.`
 * This set must be hardcoded to jpg, jpeg, and png for now.
 */
const convertibleExts = new Set([".jpg", ".jpeg", ".png"]);
/** Extensions of non-image files. Each entry starts with a `.` */
const sourceExts = new Set([".astro", ".mdx", ".md", ".ts", ".js", ".jsx", ".tsx"]);

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

/**
 * Converts the image at the path to a WebP image,
 * or just prints logs if `dryRun` is `true`
 */
async function convertImage(filePath) {
  // Replace the last `.` and everything after it with `.webp`
  const webpPath = filePath.replace(/\.[^.]*$/, ".webp");
  const relPath = relative(assetsDir, filePath);

  // `sharp` is an image handling library
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

  // Delete the old image (OK because it's somewhere else / likely in git history)
  await unlink(filePath);
  return { relPath, oldSize, newSize, saved: oldSize - newSize };
}

async function updateImports() {
  let filesUpdated = 0;
  let importsUpdated = 0;

  for await (const filePath of walk(srcDir)) {
    const ext = extname(filePath).toLowerCase();
    if (!sourceExts.has(ext)) continue;

    const content = await readFile(filePath, "utf-8");
    /**
     * Matches import paths ending in .jpg, .jpeg, or .png (case-insensitive)
     * $1 is the file path before the current extension (e.g. `@/assets/2026-02-03-profile-square`)
     * $2 is the current extension after the dot (e.g. `jpg`)
     */
    const srcRefRegex = /(?<=["'])([^"']*)\.(jpe?g|png)(?=["'])/gi;

    const updated = content.replace(srcRefRegex, "$1.webp");

    if (updated !== content) {
      const relPath = relative(srcDir, filePath);
      const count = (content.match(srcRefRegex) || []).length;
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
  console.log(`Optimizing images...`);
  console.log(`  Max width: ${maxWidth}px | WebP quality: ${quality} | Dry run: ${dryRun}\n`);

  // Step 1: Convert images
  console.log("Converting images to WebP...");
  const results = [];
  for await (const filePath of walk(assetsDir)) {
    const ext = extname(filePath).toLowerCase();
    if (convertibleExts.has(ext)) {
      try {
        results.push(await convertImage(filePath));
      } catch (err) {
        console.error(`  ✗ ${relative(assetsDir, filePath)}: ${err.message}`);
      }
    }
  }

  if (results.length === 0) {
    console.log(`  No ${[...convertibleExts]} images found in ${assetsDir}. Nothing to do.\n`);
    return;
  }

  // Step 2: Update imports
  console.log("\nUpdating import references...");
  const { filesUpdated, importsUpdated } = await updateImports();

  // Summary
  const totalOld = results.reduce((sum, r) => sum + r.oldSize, 0);
  const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
  const totalSaved = totalOld - totalNew;

  console.log(`\n`);
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
    console.log(`\n  Done! Original files deleted.\n`);
  }
}

main();
