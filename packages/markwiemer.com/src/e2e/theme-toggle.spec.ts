import { test, expect, type Page } from "@playwright/test";

const themeAttr = "data-theme";
const system = "system";
const light = "light";
const dark = "dark";
const label = (theme: string) => `Theme: ${theme[0].toUpperCase()}${theme.slice(1)}`;

/** Opens the nav and returns the theme toggle button */
async function openNavAndGetThemeToggle(page: Page) {
  await page.locator("#toggleMenu").click();
  const toggle = page.locator("#themeToggle");
  await expect(toggle).toBeVisible();
  return toggle;
}

test.describe("theme toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("theme toggle is not inside nav landmark", async ({ page }) => {
    const toggle = page.locator("nav #themeToggle");
    await expect(toggle).toHaveCount(0);
  });

  test("navigation disclosure exposes and updates its expanded state", async ({ page }) => {
    const menuButton = page.getByRole("button", { name: "Menu" });
    const navigation = page.getByRole("navigation", { name: "Site" });

    await expect(menuButton).toHaveAttribute("aria-controls", "siteMenu");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(navigation).toBeHidden();

    await menuButton.focus();
    await page.keyboard.press("Enter");
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(navigation).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(navigation).toBeHidden();
  });

  test("defaults to system theme", async ({ page }) => {
    const toggle = await openNavAndGetThemeToggle(page);
    await expect(toggle).toHaveText(label(system));
    await expect(page.locator("html")).not.toHaveAttribute(themeAttr);
  });

  test(`cycles through ${system} → ${light} → ${dark} → ${system}`, async ({ page }) => {
    const toggle = await openNavAndGetThemeToggle(page);

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
    const toggle = await openNavAndGetThemeToggle(page);
    await toggle.click();
    await expect(toggle).toHaveText(label(light));

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute(themeAttr, light);

    const toggleAfterReload = await openNavAndGetThemeToggle(page);
    await expect(toggleAfterReload).toHaveText(label(light));
  });

  test("clearing localStorage resets to system theme", async ({ page }) => {
    const toggle = await openNavAndGetThemeToggle(page);
    await toggle.click();
    await expect(toggle).toHaveText(label(light));

    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expect(page.locator("html")).not.toHaveAttribute(themeAttr);
    const toggleAfterClear = await openNavAndGetThemeToggle(page);
    await expect(toggleAfterClear).toHaveText(label(system));
  });

  test("light theme applies correct colors", async ({ page }) => {
    const toggle = await openNavAndGetThemeToggle(page);
    await toggle.click();
    await expect(toggle).toHaveText(label(light));

    const body = page.locator("body");
    const siteMenu = page.locator("#siteMenu");
    const link = page.locator("a[href]").first();

    await expect.soft(body).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect.soft(body).toHaveCSS("color", "rgb(0, 0, 0)");
    await expect.soft(siteMenu).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect.soft(link).toHaveCSS("color", "rgb(9, 115, 131)");
  });

  test("dark theme applies correct colors", async ({ page }) => {
    const toggle = await openNavAndGetThemeToggle(page);
    await toggle.click();
    await toggle.click();
    await expect(toggle).toHaveText(label(dark));

    const body = page.locator("body");
    const siteMenu = page.locator("#siteMenu");
    const link = page.locator("a[href]").first();

    await expect.soft(body).toHaveCSS("background-color", "rgb(0, 0, 0)");
    await expect.soft(body).toHaveCSS("color", "rgb(220, 220, 220)");
    await expect.soft(siteMenu).toHaveCSS("background-color", "rgb(0, 0, 0)");
    await expect.soft(link).toHaveCSS("color", "rgb(0, 162, 174)");
  });
});
