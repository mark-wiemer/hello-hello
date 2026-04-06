/**
 * Pulls published blog posts from Medium and saves them as .mdx files.
 *
 * ## How Medium access works
 *
 * The official Medium API (https://github.com/Medium/medium-api-docs) is
 * write-only for posts — there is no endpoint to list or read your own
 * published articles. It does expose one read endpoint: GET /v1/me, which
 * returns basic profile info and is used here to verify the API token.
 *
 * To actually retrieve post content, this script uses Medium's public RSS
 * feed (https://medium.com/feed/@<username>). The RSS feed is the official,
 * documented way to read published posts. Its main limitation is that it
 * only returns the most recent ~10 posts. For a full archive, export your
 * Medium data at https://medium.com/me/export.
 *
 * ## Authentication
 *
 * Medium uses "integration tokens" for API access (not OAuth).
 * Generate one at https://medium.com/me/settings (Security section).
 * Pass it as the MEDIUM_API_KEY environment variable.
 *
 * ## Output
 *
 * Creates .mdx files in src/pages/blog/content/ with the filename pattern
 * "YYYY-MM-DD slug.mdx" and frontmatter matching existing posts:
 *   postTitle, postDate, original
 *
 * Already-existing files are skipped so the script is safe to re-run.
 *
 * ## Usage
 *
 *   MEDIUM_API_KEY=<integration-token> bun run scripts/pull-medium-posts.ts
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

// ─── Configuration ────────────────────────────────────────────────────────────

const MEDIUM_USERNAME = "markwiemer";
// Official Medium API base URL. Docs: https://github.com/Medium/medium-api-docs
const API_BASE = "https://api.medium.com/v1";
// Where to write the generated .mdx files (relative to this script's directory)
const OUTPUT_DIR = join(import.meta.dir, "..", "src", "pages", "blog", "content");

// ─── Startup: validate API key ────────────────────────────────────────────────

const apiKey = process.env.MEDIUM_API_KEY;
if (!apiKey) {
  console.error("Error: MEDIUM_API_KEY environment variable is not set.");
  console.error(
    "Get an integration token from https://medium.com/me/settings (Security section),",
  );
  console.error(
    "then run: MEDIUM_API_KEY=<token> bun run scripts/pull-medium-posts.ts",
  );
  process.exit(1);
}

// ─── Types ────────────────────────────────────────────────────────────────────

/** Response shape for GET /v1/me. Docs: https://github.com/Medium/medium-api-docs#getting-the-authenticated-users-details */
interface MeResponse {
  data: {
    id: string;
    username: string;
    name: string;
    url: string;
  };
}

/** A single post entry parsed from the RSS feed. */
interface RssItem {
  title: string;
  /** Full Medium article URL, e.g. https://markwiemer.medium.com/slug-name-abc123def456 */
  link: string;
  /** RFC 822 date string, e.g. "Tue, 15 Jun 2021 12:00:00 GMT" */
  pubDate: string;
  /** Full HTML body of the post, from the <content:encoded> RSS element */
  content: string;
}

// ─── RSS parsing ──────────────────────────────────────────────────────────────

/**
 * Extract the text inside an XML element, handling both CDATA sections and
 * plain text. RSS feeds use CDATA to avoid escaping HTML content.
 *
 * RSS 2.0 spec: https://www.rssboard.org/rss-specification
 */
function extractXmlValue(xml: string, tag: string): string {
  // Try CDATA first: <tag><![CDATA[...]]></tag>
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // Fall back to plain text: <tag>...</tag>
  const plainRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const plainMatch = xml.match(plainRegex);
  if (plainMatch) return plainMatch[1].trim();

  return "";
}

/**
 * Parse all <item> entries from an RSS 2.0 XML string.
 *
 * Medium's RSS feed uses the standard RSS 2.0 <item> structure plus the
 * <content:encoded> extension (https://www.rssboard.org/rss-profile#namespace-elements-content-encoded)
 * for the full HTML body of each post.
 */
function parseRssItems(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractXmlValue(itemXml, "title");

    // <link> in RSS 2.0 is not CDATA-wrapped; it's a plain URL followed by whitespace.
    // Medium article URLs look like: https://markwiemer.medium.com/slug-name-abc123def456
    const linkMatch = itemXml.match(/<link>([^<]+)<\/link>/i);
    const link = linkMatch ? linkMatch[1].trim() : "";

    const pubDate = extractXmlValue(itemXml, "pubDate");

    // <content:encoded> holds the full HTML body. Medium uses this RSS extension
    // to provide the complete post content beyond the <description> summary.
    const content = extractXmlValue(itemXml, "content:encoded");

    if (title && link && pubDate) {
      items.push({ title, link, pubDate, content });
    }
  }

  return items;
}

/**
 * Convert an RSS pubDate (RFC 822 format) to a YYYY-MM-DD string.
 * RFC 822 examples: "Tue, 15 Jun 2021 12:00:00 GMT"
 */
function pubDateToIso(pubDate: string): string {
  const date = new Date(pubDate);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${pubDate}`);
  }
  return date.toISOString().slice(0, 10);
}

/**
 * Convert a Medium article URL to its slug (the human-readable part).
 *
 * Medium article URLs end with a 12-character hex hash that identifies the
 * post internally, e.g.:
 *   https://markwiemer.medium.com/months-without-music-f3cec31c9879
 *                                  ^^^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^
 *                                  human-readable slug  Medium hash (stripped)
 *
 * We strip the hash suffix so the filename matches the post title slug.
 */
function urlToSlug(url: string): string {
  const path = new URL(url).pathname;
  // Get the last path segment (everything after the last "/")
  const lastSegment = path.split("/").filter(Boolean).pop() ?? "";
  // Remove the trailing "-<12hexchars>" Medium post ID suffix
  return lastSegment.replace(/-[a-f0-9]{12}$/, "");
}

// ─── HTML → Markdown conversion ───────────────────────────────────────────────

/**
 * Strip all HTML tags from a string, removing <script> and <style> blocks
 * entirely to avoid leaking their text content.
 */
function stripTags(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/**
 * Convert inline HTML elements (bold, italic, links, images, code) to their
 * Markdown equivalents. Handles HTML entity decoding as well.
 *
 * Entities are decoded with &amp; last so that a literal "&amp;lt;" becomes
 * "&lt;" (the entity text) rather than "<" (the character).
 */
function inlineHtmlToMarkdown(html: string): string {
  return (
    html
      // Drop any embedded scripts or styles
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      // Inline formatting
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, c) => `**${stripTags(c)}**`)
      .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, c) => `**${stripTags(c)}**`)
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, c) => `*${stripTags(c)}*`)
      .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, c) => `*${stripTags(c)}*`)
      .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => `\`${stripTags(c)}\``)
      // Links: [text](href)
      .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
        const cleanText = stripTags(text).trim();
        return cleanText ? `[${cleanText}](${href})` : href;
      })
      // Images: ![alt](src)
      .replace(/<img[^>]*\/?>/gi, (tag) => {
        const srcMatch = tag.match(/src=["']([^"']*)["']/i);
        const altMatch = tag.match(/alt=["']([^"']*)["']/i);
        const src = srcMatch ? srcMatch[1] : "";
        const alt = altMatch ? altMatch[1] : "";
        return src ? (alt ? `![${alt}](${src})` : `![](${src})`) : "";
      })
      // Remove any remaining HTML tags
      .replace(/<[^>]+>/g, "")
      // Decode HTML entities (&amp; decoded last — see function doc)
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
  );
}

/**
 * Convert a Medium post's full HTML body to Markdown suitable for .mdx files.
 *
 * Medium posts contain standard HTML block elements (headings, paragraphs,
 * blockquotes, lists, code blocks). This function converts them to their
 * Markdown equivalents and delegates inline formatting to inlineHtmlToMarkdown.
 */
function htmlToMarkdown(html: string): string {
  return (
    html
      // Drop embedded scripts and styles entirely
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      // Headings
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => `# ${stripTags(c)}\n\n`)
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => `## ${stripTags(c)}\n\n`)
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => `### ${stripTags(c)}\n\n`)
      .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, c) => `#### ${stripTags(c)}\n\n`)
      // Blockquotes: each line gets a "> " prefix
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) =>
        stripTags(c)
          .split("\n")
          .map((l) => `> ${l}`)
          .join("\n") + "\n\n",
      )
      // Fenced code blocks. Decode entities with &amp; last (see inlineHtmlToMarkdown).
      .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, c) => {
        const decoded = c.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
        return `\`\`\`\n${decoded}\n\`\`\`\n\n`;
      })
      // Paragraphs
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, c) => `${inlineHtmlToMarkdown(c)}\n\n`)
      // List items
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, c) => `- ${inlineHtmlToMarkdown(c)}\n`)
      // Horizontal rules
      .replace(/<hr\s*\/?>/gi, "---\n\n")
      // Discard remaining block-level wrapper tags (add a blank line in their place)
      .replace(/<\/?(?:ul|ol|div|section|figure|figcaption|header|footer)[^>]*>/gi, "\n")
      // Remove any other remaining tags
      .replace(/<[^>]+>/g, "")
      // Decode HTML entities (&amp; decoded last — see inlineHtmlToMarkdown)
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      // Collapse runs of 3+ newlines into two (one blank line between paragraphs)
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

// ─── File helpers ─────────────────────────────────────────────────────────────

/**
 * Build the MDX frontmatter block using the fields expected by the blog layout.
 * See existing posts in src/pages/blog/content/ for the expected format.
 */
function buildFrontmatter(title: string, date: string, originalUrl: string): string {
  return `---\npostTitle: ${JSON.stringify(title)}\npostDate: ${JSON.stringify(date)}\noriginal: ${JSON.stringify(originalUrl)}\n---\n`;
}

/**
 * Return the set of existing .mdx filenames (without extension) so we can skip
 * posts that have already been downloaded.
 */
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

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const authHeaders = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Step 1: Verify the token using the official Medium API.
  // GET /v1/me returns the authenticated user's profile.
  // Docs: https://github.com/Medium/medium-api-docs#getting-the-authenticated-users-details
  console.log("Verifying API token with official Medium API...");
  const meResponse = await fetch(`${API_BASE}/me`, { headers: authHeaders });
  if (!meResponse.ok) {
    const body = await meResponse.text();
    console.error(
      `Error: Failed to authenticate with Medium API (${meResponse.status}): ${body}`,
    );
    process.exit(1);
  }
  const { data: user } = (await meResponse.json()) as MeResponse;
  console.log(`Authenticated as: ${user.name} (@${user.username})`);

  // Step 2: Fetch posts from the RSS feed.
  // The Medium API has no endpoint to list or read posts — the RSS feed is the
  // official alternative. It returns the most recent ~10 published posts.
  // Feed URL format: https://medium.com/feed/@<username>
  const rssUrl = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
  console.log(`Fetching RSS feed: ${rssUrl}`);
  const rssResponse = await fetch(rssUrl);
  if (!rssResponse.ok) {
    console.error(`Error: Failed to fetch RSS feed (${rssResponse.status})`);
    process.exit(1);
  }
  const rssXml = await rssResponse.text();
  const items = parseRssItems(rssXml);
  console.log(`Found ${items.length} posts in RSS feed`);

  // Step 3: Write each post as an .mdx file (skip if it already exists).
  const existingFilenames = getExistingFilenames();
  let created = 0;
  let skipped = 0;

  for (const item of items) {
    const { title, link, pubDate, content } = item;

    let date: string;
    try {
      date = pubDateToIso(pubDate);
    } catch {
      console.warn(`  Skipping "${title}": invalid date "${pubDate}"`);
      skipped++;
      continue;
    }

    const slug = urlToSlug(link);
    if (!slug) {
      console.warn(`  Skipping "${title}": could not derive slug from URL "${link}"`);
      skipped++;
      continue;
    }

    // Filename format matches existing posts: "YYYY-MM-DD slug"
    const filename = `${date} ${slug}`;

    if (existingFilenames.has(filename)) {
      console.log(`  Skipping "${filename}" (already exists)`);
      skipped++;
      continue;
    }

    const frontmatter = buildFrontmatter(title, date, link);
    const markdown = htmlToMarkdown(content);
    const fileContent = `${frontmatter}\n${markdown}\n`;

    const outputPath = join(OUTPUT_DIR, `${filename}.mdx`);
    writeFileSync(outputPath, fileContent, "utf-8");
    existingFilenames.add(filename);
    console.log(`  Created: ${filename}.mdx`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  if (items.length > 0) {
    console.log(
      "\nNote: The RSS feed returns only the most recent posts (~10). For older posts,",
    );
    console.log("export your Medium data at https://medium.com/me/export");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
