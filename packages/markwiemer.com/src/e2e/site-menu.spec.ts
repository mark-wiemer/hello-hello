import { test, expect } from "@playwright/test";

test.describe("site navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("names the navigation landmark and exposes the toggle relationship", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Toggle site navigation" });
    const navigation = page.getByRole("navigation", { name: "Site navigation" });

    await expect(toggle).toHaveAttribute("aria-controls", "siteMenu");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(navigation).toHaveCount(1);
    await expect(page.locator("#siteMenu")).toHaveAttribute("inert", "");
    await expect(page.locator("#siteMenu")).not.toHaveAttribute("aria-expanded");
  });

  test("opens and closes with the keyboard while keeping expanded state in sync", async ({
    page,
  }) => {
    const toggle = page.getByRole("button", { name: "Toggle site navigation" });
    const menu = page.locator("#siteMenu");

    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(menu).not.toHaveAttribute("inert");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "About" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(toggle).toBeFocused();

    await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveAttribute("inert", "");
  });

  test("provides a visible focus indicator and a 44px navigation toggle target", async ({
    page,
  }) => {
    const toggle = page.getByRole("button", { name: "Toggle site navigation" });

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();
    await expect
      .poll(() => toggle.evaluate((button) => getComputedStyle(button).outlineStyle))
      .toBe("solid");

    const size = await toggle.evaluate((button) => {
      const bounds = button.getBoundingClientRect();
      return { width: bounds.width, height: bounds.height };
    });
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
  });

  test("scales the menu glyph to the larger toggle", async ({ page }) => {
    const glyph = page.getByRole("button", { name: "Toggle site navigation" }).locator("svg");
    const size = await glyph.evaluate((svg) => {
      const bounds = svg.getBoundingClientRect();
      return { width: bounds.width, height: bounds.height };
    });

    expect(size.width).toBeGreaterThanOrEqual(24);
    expect(size.height).toBeGreaterThanOrEqual(24);
  });
});
