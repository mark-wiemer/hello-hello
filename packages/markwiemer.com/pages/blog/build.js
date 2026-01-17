import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { remark } from "remark";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkRehype from "remark-rehype";

/**
 * Turn all markdown files in this folder
 * into HTML in the `site` folder
 * using remark, remark-rehype, and rehype-stringify.
 * - Wrap the contents with `template.html`
 * - Have external links safely open in a new tab
 * Ref https://www.npmjs.com/package/remark-html#when-should-i-use-this
 */
async function build() {
  const blogDir = path.dirname(fileURLToPath(import.meta.url));
  const fileNames = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".md") && !(f === "readme.md"));
  const siteDir = path.join(blogDir, "..", "..", "site", "blog");
  console.log(`Building ${fileNames.length} ${fileNames.length === 1 ? "file" : "files"}`);
  const templatePath = path.join(blogDir, "template.html");
  const template = fs.readFileSync(templatePath, "utf8");
  const contentPlaceholder = `<!-- __ARTICLE_CONTENTS__ -->`;
  const titlePlaceholder = `<!-- __ARTICLE_TITLE__ -->`;
  for (const fileName of fileNames) {
    console.log(`Building ${fileName}`);
    const filePath = path.join(blogDir, fileName);
    const mdString = fs.readFileSync(filePath, "utf8");
    // Extract main heading from markdown (first line starting with # )
    const headingMatch = mdString.match(/^#\s+(.+)$/m);
    if (!headingMatch?.[1]) throw new Error(`Couldn't find main heading in "${fileName}"`);
    const mainHeading = headingMatch[1].trim();
    // Replace <title> in template
    const htmlBodyString = await remark()
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeExternalLinks, {
        target: "_blank",
        rel: ["noreferrer"],
        test: (node) => {
          const href = node.properties?.href;
          if (!href) return false;
          const url = new URL(href, "https://markwiemer.com");
          const domain = url.hostname;
          return !["markwiemer.com", "ahkpp.com"].includes(domain);
        },
      })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(mdString);
    const outName = fileName.replace(/\.md$/, ".html").slice("yyyy-mm-dd-".length);
    const outPath = path.join(siteDir, outName);
    const fullHtml = template
      .replace(contentPlaceholder, htmlBodyString)
      .replace(titlePlaceholder, mainHeading);
    fs.writeFileSync(outPath, String(fullHtml));
    console.log(`Wrote ${outName}`);
  }
  console.log(`All blog HTML written to site dir`);
}

build();
