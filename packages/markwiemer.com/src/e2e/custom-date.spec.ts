import { test, expect, type Page } from "@playwright/test";

function getTimes(page: Page) {
  return page.locator("time.custom-date");
}

/** Opens the nav and returns the theme toggle button */
async function openNavAndGetDateToggle(page: Page) {
  await page.locator("#toggleMenu").click();
  const toggle = page.locator("#datetimeFormatToggle");
  await expect(toggle).toBeVisible();
  return toggle;
}

const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
const datetimePrefix = "Dates: ";
const system = "System";
const iso = "ISO";
const systemLabel = datetimePrefix + system;
const isoLabel = datetimePrefix + iso;

test.describe("CustomDate component", () => {
  test("blog list renders dates in <time> elements", async ({ page }) => {
    await page.goto("/blog/");
    const times = getTimes(page);
    await expect(times.first()).toBeVisible();
    const count = await times.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Each <time> element should have a valid datetime attribute
    for (let i = 0; i < count; i++) {
      const datetime = await times.nth(i).getAttribute("datetime");
      expect.soft(datetime).toMatch(isoRegex);
    }
  });

  test("blog post detail page renders dates in <time> elements", async ({ page }) => {
    await page.goto("/blog/testing-accessibility-reflow/");
    const times = getTimes(page);
    await expect(times.first()).toBeVisible();
    const datetime = await times.first().getAttribute("datetime");
    expect(datetime).toMatch(isoRegex);
  });

  test("dates are formatted using locale by default (not ISO)", async ({ page }) => {
    await page.goto("/blog/");
    const firstDate = getTimes(page).first();
    await expect(firstDate).toBeVisible();
    const text = await firstDate.textContent();
    expect(text).not.toMatch(isoRegex);
  });
});

test.describe("Datetimes toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog/");
    await page.evaluate(() => localStorage.removeItem("dateFormat"));
  });

  test(`toggle button is present and defaults to ${systemLabel}`, async ({ page }) => {
    const toggle = await openNavAndGetDateToggle(page);
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveText(systemLabel);
  });

  test("clicking toggle switches to ISO format", async ({ page }) => {
    const toggle = await openNavAndGetDateToggle(page);

    // Click to switch to ISO
    await toggle.click();
    await expect(toggle).toHaveText(isoLabel);

    // All dates should now be in ISO format
    const times = getTimes(page);
    const count = await times.count();
    for (let i = 0; i < count; i++) {
      const text = await times.nth(i).textContent();
      expect.soft(text).toMatch(isoRegex);
    }
  });

  test("clicking toggle twice returns to System format", async ({ page }) => {
    const toggle = await openNavAndGetDateToggle(page);

    // Click to ISO
    await toggle.click();
    await expect(toggle).toHaveText(isoLabel);

    // Click back to System
    await toggle.click();
    await expect(toggle).toHaveText(systemLabel);

    // Dates should not be in ISO format
    const firstDate = getTimes(page).first();
    const text = await firstDate.textContent();
    expect(text).not.toMatch(isoRegex);
  });

  test("ISO preference persists across page navigations", async ({ page }) => {
    let toggle = await openNavAndGetDateToggle(page);

    // Switch to ISO
    await toggle.click();
    await expect(toggle).toHaveText(isoLabel);

    // Navigate to a blog post
    await page.goto("/blog/testing-accessibility-reflow/");
    toggle = await openNavAndGetDateToggle(page);
    await expect(toggle).toHaveText(isoLabel);

    // Dates on the blog post should be ISO
    const times = getTimes(page);
    const count = await times.count();
    for (let i = 0; i < count; i++) {
      const text = await times.nth(i).textContent();
      expect.soft(text).toMatch(isoRegex);
    }
  });

  test("ISO format on blog post detail page", async ({ page }) => {
    // Set ISO preference before navigating
    await page.evaluate(() => localStorage.setItem("dateFormat", "iso"));

    await page.goto("/blog/testing-accessibility-reflow/");
    const firstDate = getTimes(page).first();
    await expect(firstDate).toBeVisible();
    const text = await firstDate.textContent();
    expect(text).toMatch(isoRegex);
  });

  test("localStorage is cleared when switching back to System", async ({ page }) => {
    const toggle = await openNavAndGetDateToggle(page);

    // Switch to ISO
    await toggle.click();
    let stored = await page.evaluate(() => localStorage.getItem("dateFormat"));
    expect(stored).toBe("iso");

    // Switch back to System
    await toggle.click();
    stored = await page.evaluate(() => localStorage.getItem("dateFormat"));
    expect(stored).toBeNull();
  });

  test("home page also shows dates with toggle support", async ({ page }) => {
    await page.goto("/");
    const times = getTimes(page);
    const count = await times.count();
    if (count === 0) return; // Home page may not have dates

    // Set ISO and reload
    await page.evaluate(() => localStorage.setItem("dateFormat", "iso"));
    await page.reload();
    for (let i = 0; i < count; i++) {
      const text = await times.nth(i).textContent();
      expect.soft(text).toMatch(isoRegex);
    }
  });
});
