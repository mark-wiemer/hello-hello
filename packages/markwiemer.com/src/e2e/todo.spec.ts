import { expect, test, type Page } from "@playwright/test";

const storageKey = "markwiemer.todo.tasks.v1";
const sandboxStorageKey = "markwiemer.todo.sandbox.tasks.v1";
const sandboxDateSessionKey = "markwiemer.todo.sandbox.date.v1";

async function createTask(
  page: Page,
  title: string,
  interval = "1",
  unit = "days",
): Promise<void> {
  await page.getByRole("button", { name: "New task" }).click();
  await page.getByLabel("Title", { exact: true }).fill(title);
  await page.getByLabel("Number of intervals").fill(interval);
  await page.getByLabel("Recurrence unit").selectOption(unit);
  await page.getByRole("button", { name: "Save task" }).click();
}

test.describe("todo app", () => {
  test.describe.configure({ timeout: 10000 });

  test("shows a user manual before the parent link with the glossary last", async ({ page }) => {
    const manual = page.locator("#todo-manual");
    const glossary = manual.locator("#todo-glossary");

    await expect(manual).not.toHaveAttribute("open", "");
    expect(
      await manual.evaluate((element) => element.nextElementSibling?.tagName === "HR"),
    ).toBe(true);

    await manual.locator(":scope > summary").click();
    await expect(manual.getByRole("heading", { name: "Tasks and recurrence" })).toBeVisible();
    await expect(manual.getByRole("heading", { name: "Organizing tasks" })).toBeVisible();
    await expect(manual.getByRole("heading", { name: "Sandbox testing" })).toBeVisible();
    await expect(glossary).toHaveCount(1);
    expect(
      await manual.evaluate((element) => element.lastElementChild?.id === "todo-glossary"),
    ).toBe(true);

    await expect(glossary).not.toHaveAttribute("open", "");
    await expect(glossary.locator("dd").first()).toBeHidden();

    await glossary.locator("summary").click();
    await expect(glossary.locator("dt")).toHaveText([
      "Complete",
      "Hidden",
      "Recurrence",
      "Ready",
      "Snooze",
      "Task",
      "Title",
    ]);
    const definitions = await glossary.locator("dd").allTextContents();
    expect(definitions.map((definition) => definition.replace(/\s+/g, " ").trim())).toEqual([
      "Check the box near a task title to mark it complete. This hides the task until it's ready again, based on its recurrence.",
      "A hidden task is not shown by default, but can be viewed by opening the hidden tasks section.",
      "Once a task is complete, hide it for this long. Can be set between 1-99 days, weeks, or months.",
      "A task is ready when it's due today and not yet complete.",
      "Hide a task until tomorrow morning.",
      "Item with a title and recurrence.",
      "The name of a task, in plain text.",
    ]);
  });

  test("links back to miscellaneous widgets from the page footer", async ({ page }) => {
    const parentLink = page.getByRole("link", { name: "Miscellaneous - markwiemer.com" });

    await expect(parentLink).toHaveAttribute("href", "/misc");
    expect(
      await parentLink.evaluate((link) => {
        const paragraph = link.parentElement;
        return paragraph?.parentElement?.lastElementChild === paragraph;
      }),
    ).toBe(true);
  });

  test("shows a loading animation that reserves the empty-state height", async ({
    browser,
  }) => {
    const loadingContext = await browser.newContext({ javaScriptEnabled: false });
    const loadingPage = await loadingContext.newPage();
    await loadingPage.goto("/todo/");
    const loadingIndicator = loadingPage.locator("#todo-active-empty");
    await expect(loadingIndicator).toBeVisible();
    await expect(loadingIndicator).toHaveAttribute("aria-busy", "true");
    const animationName = await loadingPage
      .locator(".todo-loading-indicator span")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName);
    expect(animationName).toBe("todo-loading-pulse");
    const loadingHeight = await loadingIndicator.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    await loadingContext.close();

    const appContext = await browser.newContext();
    await appContext.addInitScript((key) => {
      localStorage.setItem(
        key,
        JSON.stringify([
          {
            id: "hidden-task",
            title: "Hidden task",
            recurrence: { interval: 1, unit: "days" },
            position: 0,
            hiddenUntil: "2099-01-01T00:00:00.000Z",
            hiddenReason: "completed",
          },
        ]),
      );
    }, storageKey);
    const appPage = await appContext.newPage();
    await appPage.goto("/todo/");
    const emptyMessage = appPage.locator("#todo-active-empty");
    await expect(emptyMessage).toHaveText("No tasks are ready right now.");
    const emptyMessageHeight = await emptyMessage.evaluate(
      (element) => element.getBoundingClientRect().height,
    );

    expect(loadingHeight).toBe(emptyMessageHeight);
    await appContext.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date("2026-01-31T12:00:00") });
    await page.goto("/todo/");
  });

  test("creates, edits, persists, and deletes tasks", async ({ page }) => {
    await createTask(page, "Write report", "2", "weeks");
    await expect(page.locator("#todo-active-table tbody tr")).toContainText(
      "Every 2 weeks",
    );

    await page.getByRole("button", { name: "Edit task: Write report" }).click();
    await expect(page.getByRole("heading", { name: "Edit task" })).toBeVisible();
    await page.getByLabel("Title", { exact: true }).fill("Review report");
    await page.getByRole("button", { name: "Save task" }).click();
    await expect(page.locator("#todo-active-table tbody tr")).toContainText("Review report");
    await page.reload();
    await expect(page.locator("#todo-active-table tbody tr")).toContainText("Review report");

    await page.getByRole("button", { name: "Delete task: Review report" }).click();
    await page.getByRole("button", { name: "Delete task", exact: true }).click();
    await expect(page.locator("#todo-active-table tbody tr")).toHaveCount(0);
    await expect
      .poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey))
      .toBe("[]");
  });

  test("recurrence interval controls are accessible and match the workout stepper size", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "New task" }).click();
    const interval = page.getByLabel("Number of intervals");
    const increase = page.getByRole("button", { name: "Increase recurrence interval" });
    const decrease = page.getByRole("button", { name: "Decrease recurrence interval" });

    await expect(interval).toHaveValue("1");
    await expect(decrease).toBeDisabled();
    await expect(decrease).toHaveCSS("cursor", "not-allowed");
    await increase.click();
    await expect(interval).toHaveValue("2");
    await decrease.click();
    await expect(interval).toHaveValue("1");

    for (const button of [increase, decrease]) {
      const size = await button.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return { width: bounds.width, height: bounds.height };
      });
      expect(size.width).toBeGreaterThanOrEqual(44);
      expect(size.height).toBeGreaterThanOrEqual(44);
    }
  });

  test("shows a visible drop marker before the row where a task will land", async ({ page }) => {
    await createTask(page, "First task");
    await createTask(page, "Second task");

    const hasDropMarker = await page.evaluate(() => {
      const rows = [...document.querySelectorAll<HTMLTableRowElement>(
        "#todo-active-table tbody tr[data-task-id]",
      )];
      const sourceRow = rows[1];
      const targetRow = rows[0];
      if (!sourceRow || !targetRow) throw new Error("Expected two task rows.");

      const dataTransfer = new DataTransfer();
      sourceRow.dispatchEvent(
        new DragEvent("dragstart", { bubbles: true, dataTransfer }),
      );
      const targetBounds = targetRow.getBoundingClientRect();
      targetRow.dispatchEvent(
        new DragEvent("dragover", {
          bubbles: true,
          dataTransfer,
          clientY: targetBounds.top + 1,
        }),
      );
      const markerShown = targetRow.classList.contains("todo-row--drop-before");

      targetRow.dispatchEvent(
        new DragEvent("drop", {
          bubbles: true,
          dataTransfer,
          clientY: targetBounds.top + 1,
        }),
      );
      return markerShown;
    });

    expect(hasDropMarker).toBe(true);
    await expect(page.locator("#todo-active-table tbody tr").first()).toContainText(
      "Second task",
    );
  });

  test("completion hides a monthly task until the 28th after a late-month date", async ({
    page,
  }) => {
    await createTask(page, "Monthly report", "1", "months");
    await page.getByLabel("Complete task: Monthly report").click();
    await expect(page.locator("#todo-active-table tbody tr")).toHaveCount(0);
    await expect(page.locator("#todo-active-empty")).toHaveText("No tasks are ready right now.");

    const dueDate = await page.evaluate((key) => {
      const savedTasks = JSON.parse(localStorage.getItem(key) ?? "[]") as Array<{
        hiddenUntil: string;
      }>;
      const date = new Date(savedTasks[0].hiddenUntil);
      return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate(), hour: date.getHours() };
    }, storageKey);
    expect(dueDate).toEqual({ year: 2026, month: 1, day: 28, hour: 12 });

    await page.getByRole("button", { name: "Show hidden tasks" }).click();
    const completedRow = page.locator("#todo-hidden-table tbody tr");
    await expect(completedRow).toContainText("Completed");
    await expect(completedRow).toHaveCSS("background-color", "rgb(220, 238, 255)");
    await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
    await expect(completedRow).toHaveCSS("background-color", "rgb(25, 53, 80)");
  });

  test("marks a completed task incomplete and restores it to the active list", async ({
    page,
  }) => {
    await createTask(page, "Review notes");
    await page.getByLabel("Complete task: Review notes").click();
    await page.getByRole("button", { name: "Show hidden tasks" }).click();
    const completedRow = page.locator("#todo-hidden-table tbody tr");
    await expect(completedRow).toContainText("Completed");

    await page.getByRole("button", { name: "Mark task incomplete: Review notes" }).click();
    await expect(page.locator("#todo-active-table tbody tr")).toContainText("Review notes");
    await expect(page.locator("#todo-hidden-table tbody tr")).toHaveCount(0);
    await expect
      .poll(() =>
        page.evaluate((key) => {
          const tasks = JSON.parse(localStorage.getItem(key) ?? "[]") as Array<{
            hiddenUntil: string | null;
            hiddenReason: string | null;
          }>;
          return tasks[0];
        }, storageKey),
      )
      .toMatchObject({ hiddenUntil: null, hiddenReason: null });
  });

  test("simulates days in an isolated sandbox and restores the sandbox across reloads", async ({
    page,
  }) => {
    await createTask(page, "Live daily");
    await page.getByRole("button", { name: "Enter sandbox mode" }).click();
    await expect(page.locator("#todo-active-table tbody tr")).toHaveCount(0);
    await createTask(page, "Sandbox daily");
    await page.getByLabel("Complete task: Sandbox daily").click();
    await expect(page.locator("#todo-active-table tbody tr")).toHaveCount(0);

    const storedTasks = await page.evaluate(
      ({ liveKey, sandboxKey }) => {
        const sandboxTask = (
          JSON.parse(localStorage.getItem(sandboxKey) ?? "[]") as Array<{
            title: string;
            hiddenUntil: string | null;
          }>
        )[0];
        const hiddenUntil = sandboxTask?.hiddenUntil
          ? new Date(sandboxTask.hiddenUntil)
          : null;
        return {
          live: JSON.parse(localStorage.getItem(liveKey) ?? "[]") as Array<{
            title: string;
            hiddenUntil: string | null;
          }>,
          sandbox: {
            title: sandboxTask?.title,
            dueDate: hiddenUntil
              ? {
                  year: hiddenUntil.getFullYear(),
                  month: hiddenUntil.getMonth(),
                  day: hiddenUntil.getDate(),
                  hour: hiddenUntil.getHours(),
                }
              : null,
          },
        };
      },
      { liveKey: storageKey, sandboxKey: sandboxStorageKey },
    );
    expect(storedTasks.live).toMatchObject([{ title: "Live daily", hiddenUntil: null }]);
    expect(storedTasks.sandbox).toEqual({
      title: "Sandbox daily",
      dueDate: { year: 2026, month: 1, day: 1, hour: 12 },
    });

    await page.reload();
    await expect(page.locator("#todo-sandbox-date")).toContainText("Sandbox date:");
    const restoredDate = await page.evaluate((key) => {
      const date = new Date(sessionStorage.getItem(key) ?? "");
      return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
    }, sandboxDateSessionKey);
    expect(restoredDate).toEqual({ year: 2026, month: 0, day: 31 });
    await page.getByRole("button", { name: "Show hidden tasks" }).click();
    await expect(page.locator("#todo-hidden-table tbody tr")).toContainText("Sandbox daily");
    await page.getByRole("button", { name: "Simulate next day" }).click();
    await expect(page.locator("#todo-active-table tbody tr")).toContainText("Sandbox daily");
    const advancedDate = await page.evaluate((key) => {
      const date = new Date(sessionStorage.getItem(key) ?? "");
      return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
    }, sandboxDateSessionKey);
    expect(advancedDate).toEqual({ year: 2026, month: 1, day: 1 });

    await page.getByRole("button", { name: "Exit sandbox mode" }).click();
    await expect(page.locator("#todo-active-table tbody tr")).toContainText("Live daily");
    await expect(page.locator("#todo-active-table tbody tr")).not.toContainText("Sandbox daily");
  });

  test("resets the sandbox date and marks every sandbox task incomplete", async ({
    page,
  }) => {
    await createTask(page, "Live task", "1", "weeks");
    const resetButton = page.getByRole("button", { name: "Reset sandbox" });
    await expect(resetButton).toBeHidden();
    await page.getByRole("button", { name: "Enter sandbox mode" }).click();
    await expect(resetButton).toBeVisible();

    await createTask(page, "Sandbox completed", "1", "weeks");
    await createTask(page, "Sandbox snoozed", "1", "days");
    await page.getByLabel("Complete task: Sandbox completed").click();
    await page.getByRole("button", { name: "Snooze until tomorrow: Sandbox snoozed" }).click();
    await expect(page.locator("#todo-active-table tbody tr")).toHaveCount(0);

    await page.getByRole("button", { name: "Simulate next day" }).click();
    await page.getByRole("button", { name: "Snooze until tomorrow: Sandbox snoozed" }).click();
    await expect(page.locator("#todo-active-table tbody tr")).toHaveCount(0);
    await resetButton.click();

    await expect(page.locator("#todo-active-table tbody tr")).toHaveCount(2);
    await expect(page.getByLabel("Complete task: Sandbox completed")).not.toBeChecked();
    await expect(page.getByLabel("Complete task: Sandbox snoozed")).not.toBeChecked();
    await expect(page.locator("#todo-hidden-table tbody tr")).toHaveCount(0);

    const resetState = await page.evaluate(
      ({ liveKey, sandboxKey, dateKey }) => ({
        liveTasks: JSON.parse(localStorage.getItem(liveKey) ?? "[]") as Array<{
          title: string;
          hiddenUntil: string | null;
        }>,
        sandboxTasks: (
          JSON.parse(localStorage.getItem(sandboxKey) ?? "[]") as Array<{
            title: string;
            hiddenUntil: string | null;
            hiddenReason: string | null;
          }>
        ).map(({ title, hiddenUntil, hiddenReason }) => ({
          title,
          hiddenUntil,
          hiddenReason,
        })),
        sandboxDate: new Date(sessionStorage.getItem(dateKey) ?? ""),
      }),
      {
        liveKey: storageKey,
        sandboxKey: sandboxStorageKey,
        dateKey: sandboxDateSessionKey,
      },
    );
    expect(resetState.liveTasks).toMatchObject([
      { title: "Live task", hiddenUntil: null, hiddenReason: null },
    ]);
    expect(resetState.sandboxTasks).toEqual([
      { title: "Sandbox completed", hiddenUntil: null, hiddenReason: null },
      { title: "Sandbox snoozed", hiddenUntil: null, hiddenReason: null },
    ]);
    expect(resetState.sandboxDate.getFullYear()).toBe(2026);
    expect(resetState.sandboxDate.getMonth()).toBe(0);
    expect(resetState.sandboxDate.getDate()).toBe(31);
    await expect(page.locator("#todo-status")).toContainText("Sandbox reset");

    await page.getByRole("button", { name: "Exit sandbox mode" }).click();
    await expect(resetButton).toBeHidden();
    await expect(page.locator("#todo-active-table tbody tr")).toHaveCount(1);
    await expect(page.getByLabel("Complete task: Live task")).not.toBeChecked();
  });

  test("snoozes until tomorrow and exposes accessible multi-select reordering", async ({
    page,
  }) => {
    await createTask(page, "First task");
    await createTask(page, "Second task");
    await createTask(page, "Third task");

    await page.getByLabel("Select task: Second task").check();
    await page.getByLabel("Select task: Third task").check();
    await expect(page.getByRole("button", { name: "Move up" })).toBeVisible();
    await page.getByRole("button", { name: "Move up" }).click();
    await expect(page.locator("#todo-active-table tbody tr").nth(0)).toContainText("Second task");
    await expect(page.locator("#todo-active-table tbody tr").nth(1)).toContainText("Third task");

    await page.getByRole("button", { name: "Snooze until tomorrow: First task" }).click();
    await expect(page.locator("#todo-active-table tbody tr")).toHaveCount(2);
    const snoozedTask = await page.evaluate(
      (key) => {
        const hiddenTasks = JSON.parse(localStorage.getItem(key) ?? "[]") as Array<{
          title: string;
          hiddenUntil: string | null;
          hiddenReason: string | null;
        }>;
        const task = hiddenTasks.find((item) => item.title === "First task");
        const dueDate = task?.hiddenUntil ? new Date(task.hiddenUntil) : null;
        return {
          reason: task?.hiddenReason,
          year: dueDate?.getFullYear(),
          month: dueDate?.getMonth(),
          day: dueDate?.getDate(),
          hour: dueDate?.getHours(),
        };
      },
      storageKey,
    );
    expect(snoozedTask).toEqual({
      reason: "snoozed",
      year: 2026,
      month: 1,
      day: 1,
      hour: 0,
    });

    await page.clock.runFor(13 * 60 * 60 * 1000);
    await expect(page.locator("#todo-active-table tbody tr")).toHaveCount(3);

    const firstTask = page.locator("#todo-active-table tbody tr").filter({ hasText: "First task" });
    const secondTask = page
      .locator("#todo-active-table tbody tr")
      .filter({ hasText: "Second task" });
    await firstTask.dragTo(secondTask, { targetPosition: { x: 4, y: 2 } });
    await expect(page.locator("#todo-active-table tbody tr").nth(0)).toContainText("First task");
  });
});
