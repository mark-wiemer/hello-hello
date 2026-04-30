// https://docs.astro.build/en/tutorial/5-astro-api/4/
// https://docs.astro.build/en/recipes/rss/

import rss, { pagesGlobToRssItems } from "@astrojs/rss";

// todo this links to `/blog/content/yyyy-mm-dd-post-title`
// we want `/blog/post-title`
// todo exclude unlisted posts
export async function GET(context) {
  return rss({
    title: "Mark Wiemer's blog",
    description: "Helping anyone learn anything 🤓",
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob("./blog/content/*.mdx")),
    customData: `<language>en</language>`,
  });
}
