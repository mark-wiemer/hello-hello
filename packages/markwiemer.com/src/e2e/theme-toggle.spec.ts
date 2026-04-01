import { test, expect, type Page } from "@playwright/test";

const themeAttr = "data-theme";
const system = "system";
const light = "light";
const dark = "dark";
const label = (theme: string) => `Theme: ${theme[0].toUpperCase()}${theme.slice(1)}`;

/** Opens the nav and returns the theme toggle button */
async function openNavAndGetToggle(page: Page) {
  await page.click("#openNav");
  const toggle = page.locator("#themeToggle");
  await expect(toggle).toBeVisible();
  return toggle;
}

test.describe("theme toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("defaults to system theme", async ({ page }) => {
    const toggle = await openNavAndGetToggle(page);
    await expect(toggle).toHaveText(label(system));
    await expect(page.locator("html")).not.toHaveAttribute(themeAttr);
  });

  test(`cycles through ${system} → ${light} → ${dark} → ${system}`, async ({ page }) => {
    const toggle = await openNavAndGetToggle(page);

    await toggle.click();
    await expect(toggle).toHaveText(label(light));
    await expect(page.locator("html")).toHaveAttribute(themeAttr, light);

    await toggle.click();
    await expect(toggle).toHaveText(label(dark));
    await expect(page.locator("html")).toHaveAttribute(themeAttr, dark);

    await toggle.click();
    await expect(toggle).toHaveText(label(system));
    await expect(page.locator("html")).not.toHaveAttribute(themeAttr);
  });

  test("persists theme across page loads", async ({ page }) => {
    const toggle = await openNavAndGetToggle(page);
    await toggle.click();
    await expect(toggle).toHaveText(label(light));

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute(themeAttr, light);

    const toggleAfterReload = await openNavAndGetToggle(page);
    await expect(toggleAfterReload).toHaveText(label(light));
  });

  test("clearing localStorage resets to system theme", async ({ page }) => {
    const toggle = await openNavAndGetToggle(page);
    await toggle.click();
    await expect(toggle).toHaveText(label(light));

    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expect(page.locator("html")).not.toHaveAttribute(themeAttr);
    const toggleAfterClear = await openNavAndGetToggle(page);
    await expect(toggleAfterClear).toHaveText(label(system));
  });

  test("light theme applies correct colors", async ({ page }) => {
    const toggle = await openNavAndGetToggle(page);
    await toggle.click();
    await expect(toggle).toHaveText(label(light));

    const body = page.locator("body");
    const nav = page.locator("nav");
    const link = page.locator("a[href]").first();

    await expect.soft(body).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect.soft(body).toHaveCSS("color", "rgb(0, 0, 0)");
    await expect.soft(nav).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect.soft(link).toHaveCSS("color", "rgb(9, 115, 131)");
  });

  test("dark theme applies correct colors", async ({ page }) => {
    const toggle = await openNavAndGetToggle(page);
    await toggle.click();
    await toggle.click();
    await expect(toggle).toHaveText(label(dark));

    const body = page.locator("body");
    const nav = page.locator("nav");
    const link = page.locator("a[href]").first();

    await expect.soft(body).toHaveCSS("background-color", "rgb(0, 0, 0)");
    await expect.soft(body).toHaveCSS("color", "rgb(220, 220, 220)");
    await expect.soft(nav).toHaveCSS("background-color", "rgb(0, 0, 0)");
    await expect.soft(link).toHaveCSS("color", "rgb(0, 162, 174)");
  });
});
