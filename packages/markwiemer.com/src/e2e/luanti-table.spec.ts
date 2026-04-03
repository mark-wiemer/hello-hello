import { test, expect } from "@playwright/test";

test.describe("luanti people table", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/software/luanti");
  });

  test("table is centered on the page @headed", async ({ page }) => {
    const tableDistanceFromCenter = await page.evaluate(() => {
      const table = document.querySelector("table");
      if (!table) return false;
      const tableRect = table.getBoundingClientRect();
      const docWidth = document.documentElement.scrollWidth;
      const tableCenter = tableRect.left + tableRect.width / 2;
      return Math.abs(tableCenter - docWidth / 2);
    });
    expect(tableDistanceFromCenter).toBeLessThan(2);
  });

  test("table cells have a border", async ({ page }) => {
    const borderWidth = await page.evaluate(() => {
      const cell = document.querySelector("th, td");
      if (!cell) return 0;
      return parseFloat(getComputedStyle(cell).borderTopWidth);
    });
    expect(borderWidth).toBeGreaterThan(0);
  });

  test("table cells have padding", async ({ page }) => {
    const padding = await page.evaluate(() => {
      const cell = document.querySelector("th, td");
      if (!cell) return 0;
      return parseFloat(getComputedStyle(cell).paddingLeft);
    });
    expect(padding).toBeGreaterThan(0);
  });
});
