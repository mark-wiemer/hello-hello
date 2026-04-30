// https://docs.astro.build/en/tutorial/5-astro-api/4/

import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export async function GET(context) {
  return rss({
    title: "Mark Wiemer's blog",
    description: "Helping anyone learn anything 🤓",
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob("./blog/content/*.mdx")),
    customData: `<language>en</language>`,
  });
}
