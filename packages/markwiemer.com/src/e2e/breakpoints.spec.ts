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

    const columnsTop = await getColumnCount(page, ".top-grid");
    const columnsBottom = await getColumnCount(page, ".bottom-grid");
    expect.soft([columnsTop, columnsBottom], `${width}`).toEqual(expected);
  };

  const propertyBasedTest = async (
    page: Page,
    min: number,
    max: number,
    expected: [number, number],
  ) => {
    await page.goto("/software");
    const viewportWidths = [min, Math.floor((max + min) / 2), max];
    for (let i = 0; i < 15; i++) {
      viewportWidths.push(Math.floor(Math.random() * (max - min) + min));
    }

    for (const width of viewportWidths) {
      await expectColumnTuple(page, width, expected);
    }
  };

  const propertyBasedTestFactory = (min: number, max: number, expected: [number, number]) =>
    test(`[${min}-${max}] px`, async ({ page }) =>
      await propertyBasedTest(page, min, max, expected));

  propertyBasedTestFactory(320, 640, [1, 1]);
  propertyBasedTestFactory(641, 1280, [2, 2]);
  propertyBasedTestFactory(1281, 9999, [4, 3]);
});
