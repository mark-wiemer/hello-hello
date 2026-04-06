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

  test("page has no horizontal scrollbar @headed", async ({ page }) => {
    const viewportWidths = [320, 1920];

    // Add random widths between 320 and 1920
    for (let i = 0; i < 15; i++) {
      viewportWidths.push(Math.floor(Math.random() * (1920 - 320) + 320));
    }

    for (const width of viewportWidths) {
      await page.setViewportSize({ width, height: 1080 });
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect.soft(hasHorizontalScroll, `${width}`).toBe(false);
    }

    /*
    We can confirm this test works by adding this rule to see it fail:
    body {
      @media (max-width: 480px) {
        width: 2000px;
      }
    }
    */
  });
});
