/**
 * Pulls blog posts from Medium using the unofficial Medium API
 * (https://rapidapi.com/nishujain199719-vgIfuFHZxVZ/api/medium2)
 * and saves them as .mdx files to src/pages/blog/content/.
 *
 * Usage:
 *   MEDIUM_API_KEY=<your-key> bun run scripts/pull-medium-posts.ts
 *
 * The API key is the RapidAPI key for the Medium API.
 * Set it as the MEDIUM_API_KEY environment variable before running.
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const MEDIUM_USERNAME = "markwiemer";
const API_BASE = "https://medium2.p.rapidapi.com";
const OUTPUT_DIR = join(import.meta.dir, "..", "src", "pages", "blog", "content");

const apiKey = process.env.MEDIUM_API_KEY;
if (!apiKey) {
  console.error("Error: MEDIUM_API_KEY environment variable is not set.");
  console.error("Usage: MEDIUM_API_KEY=<your-key> bun run scripts/pull-medium-posts.ts");
  process.exit(1);
}

const headers = {
  "x-rapidapi-key": apiKey,
  "x-rapidapi-host": "medium2.p.rapidapi.com",
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching ${url}: ${await response.text()}`);
  }
  return response.json() as Promise<T>;
}

interface UserIdResponse {
  id: string;
}

interface UserArticlesResponse {
  associated_articles: string[];
}

interface ArticleInfoResponse {
  id: string;
  title: string;
  /** Epoch milliseconds as a number, or an ISO date string */
  published_at: string | number;
  url: string;
  subtitle?: string;
}

interface ArticleMarkdownResponse {
  markdown: string;
}

/** Convert a Medium article URL to a slug. */
function urlToSlug(url: string): string {
  // url: e.g. "https://markwiemer.medium.com/months-without-music-a-divorce-story-f3cec31c9879"
  // or "https://medium.com/@markwiemer/some-title-abc123"
  const path = new URL(url).pathname;
  // path: e.g. "/months-without-music-a-divorce-story-f3cec31c9879"
  const lastSegment = path.split("/").filter(Boolean).pop() ?? "";
  // Remove the trailing hash (last hyphen-separated segment if it looks like a Medium ID)
  // Medium article IDs are typically 12 hex chars at the end
  const slug = lastSegment.replace(/-[a-f0-9]{12}$/, "");
  return slug;
}

/** Format a date (epoch ms number or ISO string) to YYYY-MM-DD. */
function toDateString(publishedAt: string | number): string {
  const date = new Date(typeof publishedAt === "number" ? publishedAt : parseInt(publishedAt, 10));
  if (isNaN(date.getTime())) {
    // Try parsing as ISO string directly
    const isoDate = new Date(publishedAt);
    if (!isNaN(isoDate.getTime())) {
      return isoDate.toISOString().slice(0, 10);
    }
    throw new Error(`Invalid date: ${publishedAt}`);
  }
  return date.toISOString().slice(0, 10);
}

/** Build the MDX frontmatter block. */
function buildFrontmatter(title: string, date: string, originalUrl: string): string {
  return `---\npostTitle: ${JSON.stringify(title)}\npostDate: ${JSON.stringify(date)}\noriginal: ${JSON.stringify(originalUrl)}\n---\n`;
}

/** Get existing content filenames (without extension) to detect duplicates. */
function getExistingFilenames(): Set<string> {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    return new Set();
  }
  return new Set(
    readdirSync(OUTPUT_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, "")),
  );
}

async function main() {
  console.log(`Fetching articles for Medium user: ${MEDIUM_USERNAME}`);

  // Step 1: Get user ID
  const { id: userId } = await fetchJson<UserIdResponse>(
    `${API_BASE}/user/id_for/${MEDIUM_USERNAME}`,
  );
  console.log(`User ID: ${userId}`);

  // Step 2: Get all article IDs
  const { associated_articles: articleIds } = await fetchJson<UserArticlesResponse>(
    `${API_BASE}/user/${userId}/articles`,
  );
  console.log(`Found ${articleIds.length} articles`);

  const existingFilenames = getExistingFilenames();
  let created = 0;
  let skipped = 0;

  for (const articleId of articleIds) {
    // Step 3: Get article metadata
    let articleInfo: ArticleInfoResponse;
    try {
      articleInfo = await fetchJson<ArticleInfoResponse>(`${API_BASE}/article/${articleId}`);
    } catch (err) {
      console.warn(
        `  Skipping article ${articleId}: failed to fetch metadata (${err instanceof Error ? err.message : String(err)})`,
      );
      skipped++;
      continue;
    }

    const { title, published_at, url } = articleInfo;

    let date: string;
    try {
      date = toDateString(published_at);
    } catch {
      console.warn(`  Skipping article ${articleId}: invalid date "${published_at}"`);
      skipped++;
      continue;
    }

    const slug = urlToSlug(url);
    if (!slug) {
      console.warn(`  Skipping article ${articleId}: could not derive slug from URL "${url}"`);
      skipped++;
      continue;
    }

    const filename = `${date} ${slug}`;

    // Skip if a file with the same date+slug already exists
    if (existingFilenames.has(filename)) {
      console.log(`  Skipping "${filename}" (already exists)`);
      skipped++;
      continue;
    }

    // Step 4: Get article markdown
    let markdown: string;
    try {
      const mdResponse = await fetchJson<ArticleMarkdownResponse>(
        `${API_BASE}/article/${articleId}/markdown`,
      );
      markdown = mdResponse.markdown;
    } catch (err) {
      console.warn(
        `  Skipping article ${articleId}: failed to fetch markdown (${err instanceof Error ? err.message : String(err)})`,
      );
      skipped++;
      continue;
    }

    // Build and write the MDX file
    const frontmatter = buildFrontmatter(title, date, url);
    const note = `{/* Originally posted at ${url} */}\n\n`;
    const content = `${frontmatter}\n${note}${markdown}\n`;

    const outputPath = join(OUTPUT_DIR, `${filename}.mdx`);
    writeFileSync(outputPath, content, "utf-8");
    existingFilenames.add(filename);
    console.log(`  Created: ${filename}.mdx`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
