import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

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

test("Todo workflow states have no a11y violations and preserve dialog focus", async ({ page }) => {
  await page.goto("/todo/");
  await expectNoA11yViolations(page);

  const menuButton = page.getByRole("button", { name: "Menu" });
  await menuButton.focus();
  await page.keyboard.press("Enter");
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expectNoA11yViolations(page);
  await page.keyboard.press("Enter");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");

  const newTaskButton = page.getByRole("button", { name: "New task" });
  await newTaskButton.click();
  const taskDialog = page.getByRole("dialog", { name: "New task" });
  const titleInput = page.getByLabel("Title", { exact: true });
  await expect(taskDialog).toBeVisible();
  await expect(titleInput).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Number of intervals")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(titleInput).toBeFocused();
  await expectNoA11yViolations(page);
  await page.keyboard.press("Escape");
  await expect(taskDialog).toBeHidden();
  await expect(newTaskButton).toBeFocused();

  await newTaskButton.click();
  const closeTaskButton = page.getByRole("button", { name: "Close task dialog" });
  await expect(closeTaskButton).toHaveText("Close");
  await expectNoA11yViolations(page);
  await closeTaskButton.focus();
  await page.keyboard.press("Enter");
  await expect(taskDialog).toBeHidden();
  await expect(newTaskButton).toBeFocused();

  await newTaskButton.click();
  await titleInput.fill("Accessible task");
  await page.getByRole("button", { name: "Save task" }).click();
  await page.getByLabel("Complete task: Accessible task").click();
  await newTaskButton.click();
  await titleInput.fill("Snoozed task");
  await page.getByRole("button", { name: "Save task" }).click();
  await page.getByRole("button", { name: "Snooze until tomorrow: Snoozed task" }).click();
  await page.getByRole("button", { name: /Show hidden tasks/ }).click();
  await expectNoA11yViolations(page);

  await page.getByRole("button", { name: "Mark incomplete: Accessible task" }).click();
  await page.getByRole("button", { name: "Delete task: Accessible task" }).click();
  const deleteDialog = page.getByRole("dialog", { name: "Delete task?" });
  await expect(page.getByRole("button", { name: "Cancel" })).toBeFocused();
  await expectNoA11yViolations(page);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Delete task", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(deleteDialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Delete task: Accessible task" })).toBeFocused();

  await page.locator("#todo-import-file").setInputFiles({
    name: "empty-tasks.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({ format: "markwiemer.todo.tasks", version: 1, tasks: [] }),
    ),
  });
  const importDialog = page.getByRole("dialog", { name: "Import tasks?" });
  await expect(importDialog).toBeVisible();
  await expectNoA11yViolations(page);
  await page.keyboard.press("Escape");
  await expect(importDialog).toBeHidden();

  await page.getByRole("button", { name: "Enter sandbox mode" }).click();
  await expectNoA11yViolations(page);
});
