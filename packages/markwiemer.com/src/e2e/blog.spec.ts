import { test, expect, type Page } from "@playwright/test";

/** Returns the number of columns in a CSS grid element */
// async function getColumnCount(page: Page, selector: string): Promise<number> {
//   return await page.evaluate((sel) => {
//     const el = document.querySelector(sel);
//     if (!el) return 0;
//     const columns = getComputedStyle(el).gridTemplateColumns;
//     // Computed value is a space-separated list of track sizes, e.g. "100px 100px 100px"
//     return columns.trim().split(/\s+/).length;
//   }, selector);
// }

/**
 * @returns all hrefs to `/blog/*` at the current URL in the `main` element
 */
async function getListedPosts(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const hrefIterator = document
      .querySelectorAll(`main a[href^="/blog/"`)
      .entries()
      .map(([, el]) => el.getAttribute("href"));
    return Array.from(hrefIterator)
      .filter((href) => href !== null)
      .map((href) => href.slice("/blog/".length));
  });
}

test.describe("blog index", () => {
  test("lists all blog posts", async ({ page }) => {
    await page.goto("/blog");

    /** All blog entries in order, oldest first */
    const expectedListedBlogIds = [
      "testing-accessibility-reflow",
      "terrible-website-journey",
      "lets-learn-ai",
      "yesterday-learned-secrets",
      "ai-buzzword-replacement",
      "ai-imposter-syndrome",
      "ai-updates-chatgpt",
      "ai-prompt-engineering",
      "who-am-i",
      "worlds-to-explore",
      "evergreen-ai-guide",
      "ai-updates-autogpt",
      "self-doubt-writings",
      "being-a-person",
      "spiteful-depression-lingers",
      "chatgpt-not-model",
      "duolingo-shameful-lie",
      "chatgpt-plugins-intent",
      "months-without-music",
      "opportunities-obligations-accomplishments",
      "news-helped-anxiety",
      "irons-reflecting-plans",
      "us-strikes-venezuela",
      "killing-renee-good",
      "human-immigrant-rights",
      "2026-pc-build",
      "theyre-killing-us",
      "stay-your-lane",
      "good-guy-gun",
      "crying-over-breakfast",
      "acceptance-rejection-balance",
      "got-dream-job",
      "heart-condition-spoons",
      "bus-concussion-2026",
      "penultimate-health-update",
      "2026-war-in-iran",
      "dr-james-tweddell",
      "both-trump-administrations",
      "genai",
      "im-finally-healthy",
    ].reverse();

    const actualListedBlogIds = await getListedPosts(page);

    expect(actualListedBlogIds).toEqual(expectedListedBlogIds);
  });
});
