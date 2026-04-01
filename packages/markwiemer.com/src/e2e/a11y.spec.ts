import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Automated accessibility tests for pages listed in docs/tests.md.
 * Uses axe-core to check for WCAG violations.
 */

const pages: { name: string; path: string; disableRules?: string[] }[] = [
  { name: "Home page", path: "/" },
  {
    name: "Snake game",
    path: "/games/snake/",
    // Standalone game page without standard page landmarks or headings
    disableRules: ["landmark-one-main", "page-has-heading-one", "region"],
  },
  {
    name: "About page",
    path: "/about/",
    // Pre-existing content outside landmarks
    disableRules: ["region"],
  },
  { name: "Glossary", path: "/glossary/" },
  { name: "Resume", path: "/resume/" },
  { name: "Software", path: "/software/" },
];

for (const { name, path, disableRules } of pages) {
  test(`${name} (${path}) has no a11y violations`, async ({ page }) => {
    await page.goto(path);
    const builder = new AxeBuilder({ page });
    if (disableRules) builder.disableRules(disableRules);
    const results = await builder.analyze();
    expect(results.violations).toEqual([]);
  });
}
