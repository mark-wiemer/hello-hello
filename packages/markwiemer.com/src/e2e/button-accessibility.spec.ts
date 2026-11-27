import { test, expect } from "@playwright/test";

test.describe("shared button accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/");
  });

  test("menu and settings buttons have 44px targets", async ({ page }) => {
    const menuButton = page.locator("#toggleMenu");
    const menuBounds = await menuButton.boundingBox();
    expect(menuBounds?.width).toBeGreaterThanOrEqual(44);
    expect(menuBounds?.height).toBeGreaterThanOrEqual(44);

    await menuButton.click();
    for (const id of ["#themeToggle", "#datetimeFormatToggle"]) {
      const bounds = await page.locator(id).boundingBox();
      expect(bounds?.width).toBeGreaterThanOrEqual(44);
      expect(bounds?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("menu button has a visible keyboard focus indicator", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const menuButton = page.locator("#toggleMenu");
    await expect(menuButton).toBeFocused();
    await expect(menuButton).toHaveCSS("outline-style", "solid");
    await expect(menuButton).toHaveCSS("outline-width", "3px");
    await expect(menuButton).toHaveCSS("outline-offset", "2px");
    await expect(menuButton).toHaveCSS("outline-color", "rgb(9, 115, 131)");
  });
});
