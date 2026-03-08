import { test, expect } from "@playwright/test";

/**
 * Responsive layout tests for breakpoints.
 * Reference: docs/tests.md
 */

/** Returns the number of columns in a CSS grid element */
async function getColumnCount(
  page: import("@playwright/test").Page,
  selector: string,
): Promise<number> {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return 0;
    const columns = getComputedStyle(el).gridTemplateColumns;
    // Computed value is a space-separated list of track sizes, e.g. "100px 100px 100px"
    return columns.trim().split(/\s+/).length;
  }, selector);
}

test.describe("320-640px (thin)", () => {
  test.use({ viewport: { width: 500, height: 800 } });

  test("modern app chart has 1 column", async ({ page }) => {
    await page.goto("/software");
    const columns = await getColumnCount(page, ".top-grid");
    expect(columns).toBe(1);
  });

  test("header images are displayed in a row", async ({ page }) => {
    await page.goto("/");
    const flexDirection = await page.evaluate(() => {
      const el = document.querySelector("div.headerImages");
      return el ? getComputedStyle(el).flexDirection : null;
    });
    expect(flexDirection).toBe("row");
  });
});

test.describe("640-1280px (medium)", () => {
  test.use({ viewport: { width: 900, height: 800 } });

  test("modern app chart has 2 columns", async ({ page }) => {
    await page.goto("/software");
    const columns = await getColumnCount(page, ".top-grid");
    expect(columns).toBe(2);
  });
});

test.describe("1280px+ (wide)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("modern app chart top section has 4 columns", async ({ page }) => {
    await page.goto("/software");
    const columns = await getColumnCount(page, ".top-grid");
    expect(columns).toBe(4);
  });

  test("modern app chart bottom section has 3 columns", async ({ page }) => {
    await page.goto("/software");
    const columns = await getColumnCount(page, ".bottom-grid");
    expect(columns).toBe(3);
  });
});
