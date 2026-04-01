import { test, expect } from "@playwright/test";

test(`external links on home page open in a new tab`, async ({ page }) => {
  await page.goto("/");
  const externalLinks = page.locator('a[href^="https://"]');
  const count = await externalLinks.count();
  expect(count).toBeGreaterThan(0);
  const goodExternalLinks = page.locator(
    'a[href^="https://"][target="_blank"][rel~="noopener"][rel~="noreferrer"]',
  );
  const goodExternalLinksCount = await goodExternalLinks.count();
  expect.soft(goodExternalLinksCount).toBe(count);
  if (goodExternalLinksCount === count) return;
  // Document failure details
  const evalToHref = (links: (SVGElement | HTMLElement)[]): string[] => links.map(mapToHref);
  const mapToHref = (link: SVGElement | HTMLElement): string => (link as HTMLAnchorElement).href;
  const allHrefs = await externalLinks.evaluateAll(evalToHref);
  const goodHrefs = await goodExternalLinks.evaluateAll(evalToHref);
  const badHrefs = allHrefs.filter((href) => !goodHrefs.includes(href));
  expect(goodExternalLinksCount, `Bad external links: [${badHrefs.join(", ")}]`).toBe(count);
});
