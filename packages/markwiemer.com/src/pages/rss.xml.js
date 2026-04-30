// https://docs.astro.build/en/tutorial/5-astro-api/4/

import rss, { pagesGlobToRssItems } from "@astrojs/rss";

// todo this links to /blog/content/yyyy-mm-dd-post-title.mdx
// we want /blog/post-title
export async function GET(context) {
  return rss({
    title: "Mark Wiemer's blog",
    description: "Helping anyone learn anything 🤓",
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob("./blog/content/*.mdx")),
    customData: `<language>en</language>`,
  });
}
