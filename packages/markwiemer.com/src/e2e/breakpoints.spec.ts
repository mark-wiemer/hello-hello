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
    expect([columnsTop, columnsBottom]).toEqual(expected);
  };

  test.describe("[320-640] px", () => {
    // todo use property-based testing
    for (const width of [320, 480, 640]) {
      test(`at ${width}px`, async ({ page }) => {
        await expectColumnTuple(page, width, [1, 1]);
      });
    }
  });

  test.describe("(640-1280] px", () => {
    for (const width of [641, 960, 1280]) {
      test(`at ${width}px`, async ({ page }) => {
        await expectColumnTuple(page, width, [2, 2]);
      });
    }
  });

  test.describe("(1280, inf) px", () => {
    for (const width of [1281, 1920, 9999]) {
      test(`at ${width}px`, async ({ page }) => {
        await expectColumnTuple(page, width, [4, 3]);
      });
    }
  });
});
