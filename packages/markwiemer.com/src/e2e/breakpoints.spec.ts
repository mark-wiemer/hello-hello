import { test, expect, type Page } from "@playwright/test";

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

test.describe("modern app chart", () => {
  const expectColumnTuple = async (page: Page, width: number, expected: [number, number]) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/software");
    const columnsTop = await getColumnCount(page, ".top-grid");
    const columnsBottom = await getColumnCount(page, ".bottom-grid");
    expect([columnsTop, columnsBottom]).toEqual([1, 1]);
  };

  test.describe("[320-640] px", () => {
    for (const width of [320, 480, 640]) {
      test(`at ${width}px`, async ({ page }) => {
        await expectColumnTuple(page, width, [1, 1]);
      });
    }
  });

  test.describe("(640-1280] px", () => {});

  test("has 2 columns at 900px (medium)", async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto("/software");
    const columns = await getColumnCount(page, ".top-grid");
    expect(columns).toBe(2);
  });

  test("top half has 4 columns at 1440px (wide)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/software");
    const columns = await getColumnCount(page, ".top-grid");
    expect(columns).toBe(4);
  });

  test("bottom half has 3 columns at 1440px (wide)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/software");
    const columns = await getColumnCount(page, ".bottom-grid");
    expect(columns).toBe(3);
  });
});
