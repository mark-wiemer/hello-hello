import { test, expect } from "@playwright/test";

/**
 * Userspace links that should always redirect somewhere useful.
 * Reference: docs/tests.md
 */

const userspaceLinks = [
  "/games",
  "/games/index.html",
  "/games/dodge-the-creeps",
  "/games/dodge-the-creeps/index.html",
  "/games/racetrack-tycoon",
  "/games/racetrack-tycoon/index.html",
  "/games/snake",
  "/games/snake/index.html",
];

for (const link of userspaceLinks) {
  test(`${link} loads successfully`, async ({ page }) => {
    const response = await page.goto(link);
    expect(response?.ok()).toBe(true);
  });
}
