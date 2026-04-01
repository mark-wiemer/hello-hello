import { test, expect } from "@playwright/test";

/**
 * External links should open in a new tab.
 * Reference: docs/tests.md
 */

const pagesToCheck = ["/", "/software"];

for (const path of pagesToCheck) {
  test(`external links on ${path} open in a new tab`, async ({ page }) => {
    await page.goto(path);

    const externalLinks = page.locator("a[target='_blank']");
    const count = await externalLinks.count();

    // Each page should have at least one external link
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      const rel = await link.getAttribute("rel");
      expect(rel).toContain("noopener");
      expect(rel).toContain("noreferrer");
    }
  });
}
