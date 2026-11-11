import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages: { name: string; path: string; disableRules?: string[] }[] = [
  { name: "Home page", path: "/" },
  {
    name: "Snake game",
    path: "/games/snake/",
    // Standalone game page without standard page landmarks or headings
    disableRules: ["landmark-one-main", "page-has-heading-one", "region"],
  },
  { name: "About page", path: "/blog/who-am-i/" },
  { name: "Glossary", path: "/glossary/" },
  { name: "Miscellaneous", path: "/misc/" },
  { name: "Todo app", path: "/todo/" },
  { name: "Resume", path: "/resume/" },
  { name: "Software", path: "/software/" },
];

for (const { name, path, disableRules } of pages) {
  test(`${name} (${path}) has no a11y violations`, async ({ page }) => {
    await page.goto(path);
    const builder = new AxeBuilder({ page });
    if (disableRules) builder.disableRules(disableRules);
    const results = await builder.analyze();
    expect(results.violations).toEqual([]);
  });
}

test("global button styles show keyboard focus and disabled state", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const focusButton = document.createElement("button");
    focusButton.id = "global-button-focus-test";
    focusButton.textContent = "Focus test";
    document.body.prepend(focusButton);

    const disabledButton = document.createElement("button");
    disabledButton.id = "global-button-disabled-test";
    disabledButton.disabled = true;
    disabledButton.textContent = "Disabled test";
    document.body.append(disabledButton);
  });

  await page.keyboard.press("Tab");
  const focusStyles = await page.locator("#global-button-focus-test").evaluate((button) => {
    const styles = getComputedStyle(button);
    return {
      focusVisible: button.matches(":focus-visible"),
      outlineStyle: styles.outlineStyle,
      outlineWidth: styles.outlineWidth,
      outlineOffset: styles.outlineOffset,
    };
  });
  expect(focusStyles).toEqual({
    focusVisible: true,
    outlineStyle: "solid",
    outlineWidth: "3px",
    outlineOffset: "2px",
  });

  await expect(page.locator("#global-button-disabled-test")).toHaveCSS("cursor", "not-allowed");
  await expect(page.locator("#global-button-disabled-test")).toHaveCSS("opacity", "0.6");
});
