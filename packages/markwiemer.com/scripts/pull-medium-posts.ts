/**
 * Pulls blog posts from Medium using:
 * - The official Medium API (https://api.medium.com/v1) for authentication
 * - The official Medium RSS feed for post data
 *
 * NOTE: The official Medium API does not support listing or reading posts.
 * This script uses Medium's RSS feed, which is limited to the most recent
 * posts (typically up to 10). For older posts, export your Medium data at
 * https://medium.com/me/export and run this script again with the exported
 * HTML files (not yet implemented).
 *
 * Usage:
 *   MEDIUM_API_KEY=<integration-token> bun run scripts/pull-medium-posts.ts
 *
 * Get an integration token from https://medium.com/me/settings (Security section).
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const MEDIUM_USERNAME = "markwiemer";
const API_BASE = "https://api.medium.com/v1";
const OUTPUT_DIR = join(import.meta.dir, "..", "src", "pages", "blog", "content");

const apiKey = process.env.MEDIUM_API_KEY;
if (!apiKey) {
  console.error("Error: MEDIUM_API_KEY environment variable is not set.");
  console.error(
    "Usage: MEDIUM_API_KEY=<integration-token> bun run scripts/pull-medium-posts.ts",
  );
  console.error("Get an integration token from https://medium.com/me/settings");
  process.exit(1);
}

const authHeaders = {
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};

interface MeResponse {
  data: {
    id: string;
    username: string;
    name: string;
    url: string;
  };
}

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
}

/** Extract the text inside a CDATA section or raw XML element. */
function extractXmlValue(xml: string, tag: string): string {
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i");
  const plainRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();
  const plainMatch = xml.match(plainRegex);
  if (plainMatch) return plainMatch[1].trim();
  return "";
}

/** Parse RSS XML and return a list of items. */
function parseRssItems(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = extractXmlValue(itemXml, "title");
    // The <link> element in RSS 2.0 is not wrapped in CDATA; it's followed by a newline
    const linkMatch = itemXml.match(/<link>([^<]+)<\/link>/i);
    const link = linkMatch ? linkMatch[1].trim() : "";
    const pubDate = extractXmlValue(itemXml, "pubDate");
    // Medium uses content:encoded for the full HTML body
    const content = extractXmlValue(itemXml, "content:encoded");

    if (title && link && pubDate) {
      items.push({ title, link, pubDate, content });
    }
  }

  return items;
}

/** Convert an RSS pubDate string (RFC 822) to YYYY-MM-DD. */
function pubDateToIso(pubDate: string): string {
  const date = new Date(pubDate);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${pubDate}`);
  }
  return date.toISOString().slice(0, 10);
}

/** Convert a Medium article URL to a slug. */
function urlToSlug(url: string): string {
  // url: e.g. "https://markwiemer.medium.com/months-without-music-a-divorce-story-f3cec31c9879"
  const path = new URL(url).pathname;
  // path: e.g. "/months-without-music-a-divorce-story-f3cec31c9879"
  const lastSegment = path.split("/").filter(Boolean).pop() ?? "";
  // Remove the trailing hash (last hyphen-separated segment that looks like a Medium ID)
  const slug = lastSegment.replace(/-[a-f0-9]{12}$/, "");
  return slug;
}

/** Convert basic HTML to markdown text suitable for an MDX body. */
function htmlToMarkdown(html: string): string {
  return (
    html
      // Remove script and style blocks entirely
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      // Block elements: headings
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => `# ${stripTags(c)}\n\n`)
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => `## ${stripTags(c)}\n\n`)
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => `### ${stripTags(c)}\n\n`)
      .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, c) => `#### ${stripTags(c)}\n\n`)
      // Block elements: blockquote
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) =>
        stripTags(c)
          .split("\n")
          .map((l) => `> ${l}`)
          .join("\n") + "\n\n",
      )
      // Block elements: code blocks
      .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, (_, c) => {
        // Decode &amp; last so &amp;lt; becomes &lt; (not <)
        const decoded = c.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
        return `\`\`\`\n${decoded}\n\`\`\`\n\n`;
      })
      // Block elements: paragraphs
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, c) => `${inlineHtmlToMarkdown(c)}\n\n`)
      // Block elements: list items
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, c) => `- ${inlineHtmlToMarkdown(c)}\n`)
      // Block elements: horizontal rule
      .replace(/<hr\s*\/?>/gi, "---\n\n")
      // Remove remaining block-level tags
      .replace(/<\/?(?:ul|ol|div|section|figure|figcaption|header|footer)[^>]*>/gi, "\n")
      // Remaining inline tags
      .replace(/<[^>]+>/g, "")
      // Decode common HTML entities (&amp; last so &amp;lt; becomes &lt;, not <)
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      // Collapse more than 2 consecutive newlines
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/** Convert inline HTML elements to markdown. */
function inlineHtmlToMarkdown(html: string): string {
  return (
    html
      // Remove script and style blocks entirely
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, c) => `**${stripTags(c)}**`)
      .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, c) => `**${stripTags(c)}**`)
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, c) => `*${stripTags(c)}*`)
      .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, c) => `*${stripTags(c)}*`)
      .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, c) => `\`${stripTags(c)}\``)
      .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
        const cleanText = stripTags(text).trim();
        return cleanText ? `[${cleanText}](${href})` : href;
      })
      .replace(/<img[^>]*\/?>/gi, (tag) => {
        const srcMatch = tag.match(/src=["']([^"']*)["']/i);
        const altMatch = tag.match(/alt=["']([^"']*)["']/i);
        const src = srcMatch ? srcMatch[1] : "";
        const alt = altMatch ? altMatch[1] : "";
        return src ? (alt ? `![${alt}](${src})` : `![](${src})`) : "";
      })
      .replace(/<[^>]+>/g, "")
      // Decode common HTML entities (&amp; last so &amp;lt; becomes &lt;, not <)
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
  );
}

/** Strip all HTML tags from a string. */
function stripTags(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
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
  // Step 1: Verify token and get user info from the official Medium API
  console.log("Verifying API token with official Medium API...");
  const meResponse = await fetch(`${API_BASE}/me`, { headers: authHeaders });
  if (!meResponse.ok) {
    const body = await meResponse.text();
    console.error(`Error: Failed to authenticate with Medium API (${meResponse.status}): ${body}`);
    process.exit(1);
  }
  const { data: user } = (await meResponse.json()) as MeResponse;
  console.log(`Authenticated as: ${user.name} (@${user.username})`);

  // Step 2: Fetch posts from Medium's RSS feed
  // NOTE: The official Medium API does not expose a posts-listing endpoint.
  // The RSS feed is the official way to access published posts, limited to ~10 recent posts.
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
