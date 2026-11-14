import { readFile } from "node:fs/promises";
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

  test("orders the page from its heading through the sandbox and manual", async ({ page }) => {
    const orderIsCorrect = await page.evaluate(() => {
      const selectors = [
        "#main-content > h1",
        "#todo-description",
        "#todo-active-table",
        "#todo-new-task",
        "#todo-toggle-hidden",
        "#todo-hidden-content",
        "#todo-backup-panel",
        "#todo-sandbox-panel",
        "#todo-manual",
      ];
      const elements = selectors.map((selector) => document.querySelector(selector));
      if (elements.some((element) => element === null)) return false;

      for (let index = 1; index < elements.length; index++) {
        const previous = elements[index - 1];
        const current = elements[index];
        if (
          !previous ||
          !current ||
          !(previous.compareDocumentPosition(current) & Node.DOCUMENT_POSITION_FOLLOWING)
        ) {
          return false;
        }
      }

      return true;
    });

    expect(orderIsCorrect).toBe(true);
    await expect(page.getByRole("heading", { name: "Tasks", exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Activity log" })).toHaveCount(0);
  });

  test("logs task updates with console.debug", async ({ page }) => {
    const debugMessages: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "debug") debugMessages.push(message.text());
    });

    await createTask(page, "Activity test");
    await expect
      .poll(() => debugMessages)
      .toContain('[todo] Added "Activity test".');
  });

  test("exports regular tasks as a portable JSON backup", async ({ page }) => {
    await createTask(page, "Regular task");
    await page.getByRole("button", { name: "Enter sandbox mode" }).click();
    await createTask(page, "Sandbox task");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export tasks" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^todo-tasks-\d{4}-\d{2}-\d{2}\.json$/);

    const path = await download.path();
    if (!path) throw new Error("Expected the task backup to download to a file.");
    const backup: unknown = JSON.parse(await readFile(path, "utf8"));
    expect(backup).toMatchObject({
      format: "markwiemer.todo.tasks",
      version: 1,
      tasks: [{ title: "Regular task" }],
    });
    expect((backup as { tasks: Array<{ title: string }> }).tasks).toHaveLength(1);
  });

  test("imports a backup only after confirming replacement", async ({ page }) => {
    await createTask(page, "Current task");
    const backup = {
      format: "markwiemer.todo.tasks",
      version: 1,
      tasks: [
        {
          id: "imported-active",
          title: "Imported active",
          recurrence: { interval: 2, unit: "weeks" },
          position: 0,
          hiddenUntil: null,
          hiddenReason: null,
        },
        {
          id: "imported-hidden",
          title: "Imported hidden",
          recurrence: { interval: 1, unit: "days" },
          position: 1,
          hiddenUntil: "2099-01-01T00:00:00.000Z",
          hiddenReason: "completed",
        },
      ],
    };

    await page.locator("#todo-import-file").setInputFiles({
      name: "todo-backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(backup)),
    });
    const importDialog = page.getByRole("dialog", { name: "Import tasks?" });
    await expect(importDialog).toContainText("replace your current regular tasks");
    await importDialog.getByRole("button", { name: "Replace tasks" }).click();

    await expect(page.locator("#todo-active-table tbody tr")).toContainText("Imported active");
    await expect(page.locator("#todo-active-table tbody tr")).not.toContainText("Current task");
    await page.getByRole("button", { name: /Show hidden tasks/ }).click();
    await expect(page.locator("#todo-hidden-table tbody tr")).toContainText("Imported hidden");
    await expect(page.locator("#todo-backup-status")).toContainText("Imported 2 regular tasks");
  });

  test("places backup actions on separate lines and styles the file picker globally", async ({
    page,
  }) => {
    const exportButton = page.getByRole("button", { name: "Export tasks" });
    const importLabel = page.locator("#todo-backup-panel label");
    const filePicker = page.locator("#todo-import-file");
    const geometry = await Promise.all([
      exportButton.evaluate((element) => element.getBoundingClientRect().top),
      importLabel.evaluate((element) => element.getBoundingClientRect().top),
    ]);
    const filePickerStyle = await filePicker.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        fontSize: style.fontSize,
        minHeight: style.minHeight,
        borderTopStyle: style.borderTopStyle,
        color: style.color,
      };
    });
    const exportButtonStyle = await exportButton.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        minHeight: style.minHeight,
        borderTopStyle: style.borderTopStyle,
        borderRadius: style.borderRadius,
      };
    });

    expect(geometry[0]).toBeLessThan(geometry[1]);
    expect(filePickerStyle).toMatchObject({
      fontSize: "18px",
      minHeight: "44px",
      borderTopStyle: "solid",
      color: "rgb(0, 0, 0)",
    });
    expect(exportButtonStyle).toEqual({
      minHeight: "44px",
      borderTopStyle: "solid",
      borderRadius: "4px",
    });
  });

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

  test("hides the ready tasks table when no tasks are ready", async ({ page }) => {
    const table = page.locator("#todo-active-table");
    await expect(table).toBeHidden();

    await createTask(page, "Ready task");
    await expect(table).toBeVisible();

    await page.getByRole("button", { name: "Snooze until tomorrow: Ready task" }).click();
    await expect(table).toBeHidden();
  });

  test("shows the hidden tasks button only while hidden tasks exist", async ({ page }) => {
    const toggle = page.locator("#todo-toggle-hidden");
    const section = page.locator("#todo-hidden-section");
    const hiddenTable = page.locator("#todo-hidden-table");
    await expect(section).toBeHidden();
    await expect(toggle).toBeHidden();
    await expect(hiddenTable).toBeHidden();

    await createTask(page, "Hidden task");
    await page.getByRole("button", { name: "Snooze until tomorrow: Hidden task" }).click();
    await expect(section).toBeVisible();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveText("Show hidden tasks");
    const stylesMatch = await page.evaluate(() => {
      const toggleStyles = getComputedStyle(document.querySelector("#todo-toggle-hidden")!);
      const newTaskStyles = getComputedStyle(document.querySelector("#todo-new-task")!);
      return (
        toggleStyles.borderTopWidth === newTaskStyles.borderTopWidth &&
        toggleStyles.borderTopStyle === newTaskStyles.borderTopStyle &&
        toggleStyles.paddingLeft === newTaskStyles.paddingLeft &&
        toggleStyles.textDecorationLine === newTaskStyles.textDecorationLine
      );
    });
    expect(stylesMatch).toBe(true);

    await toggle.click();
    await expect(hiddenTable).toBeVisible();
    await page.getByRole("button", { name: "Unsnooze task: Hidden task" }).click();
    await expect(section).toBeHidden();
    await expect(toggle).toBeHidden();
    await expect(page.locator("#todo-hidden-content")).toBeHidden();
    await expect(hiddenTable).toBeHidden();
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

  test("closes the task dialog with mouse and keyboard controls", async ({ page }) => {
    const newTaskButton = page.getByRole("button", { name: "New task" });
    const taskDialog = page.getByRole("dialog", { name: "New task" });
    const closeButton = page.getByRole("button", { name: "Close task dialog" });

    await newTaskButton.click();
    await closeButton.click();
    await expect(taskDialog).toBeHidden();
    await expect(newTaskButton).toBeFocused();

    await newTaskButton.click();
    await closeButton.focus();
    await page.keyboard.press("Enter");
    await expect(taskDialog).toBeHidden();
    await expect(newTaskButton).toBeFocused();
  });

  test("keeps task actions on one row and provides keyboard reorder controls", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await createTask(page, "Task actions");
    await createTask(page, "W".repeat(60), "99", "months");

    const table = page.locator("#todo-active-table");
    const row = table.locator("tbody tr").first();
    const buttons = row.locator(".task-actions button");
    const tableGeometry = await table.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return { left: bounds.left, right: bounds.right, width: bounds.width };
    });
    const columnWidths = await table.locator("tbody tr").first().locator("td").evaluateAll((cells) =>
      cells.slice(0, 2).map((cell) => cell.getBoundingClientRect().width),
    );
    const buttonTops = await buttons.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().top),
    );
    const scrollGeometry = await page
      .locator("section[aria-label='Ready tasks'] > .table-scroll")
      .evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          viewportWidth: window.innerWidth,
          left: bounds.left,
          right: bounds.right,
          width: bounds.width,
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
        };
      });

    await expect(page.getByRole("columnheader", { name: "Select" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Move up:/ })).toHaveCount(2);
    await expect(page.getByRole("button", { name: /Move down:/ })).toHaveCount(2);
    await expect(page.getByRole("columnheader", { name: "Reorder" })).toHaveCount(1);
    await expect(page.getByRole("columnheader", { name: "Complete" })).toHaveCount(1);
    expect(columnWidths[0]).toBeGreaterThanOrEqual(88);
    expect(columnWidths[1]).toBeLessThan(60);
    expect(new Set(buttonTops.map(Math.round)).size).toBe(1);
    expect(scrollGeometry.left).toBeGreaterThanOrEqual(8);
    expect(scrollGeometry.viewportWidth - scrollGeometry.right).toBeGreaterThanOrEqual(8);
    expect(Math.abs(scrollGeometry.left - (scrollGeometry.viewportWidth - scrollGeometry.right)))
      .toBeLessThan(1);
    expect(tableGeometry.width).toBeLessThan(scrollGeometry.width);
    expect(
      Math.abs(tableGeometry.left - (scrollGeometry.viewportWidth - tableGeometry.right)),
    ).toBeLessThan(1);
    expect(scrollGeometry.width).toBeGreaterThan(scrollGeometry.viewportWidth - 30);
    expect(scrollGeometry.scrollWidth).toBeLessThanOrEqual(scrollGeometry.clientWidth);
  });

  test("centers the drag handle vertically in its table cell", async ({ page }) => {
    await createTask(page, "Tall task row");
    const firstCell = page.locator("#todo-active-table tbody tr").first().locator("td").first();
    await page.addStyleTag({
      content: "#todo-active-table tbody tr:first-child > td { height: 7rem; }",
    });

    const alignment = await firstCell.evaluate((cell) => {
      const cellBounds = cell.getBoundingClientRect();
      const handle = cell.querySelector<HTMLElement>(".drag-handle");
      if (!handle) throw new Error("Expected the task row to have a drag handle.");
      const handleBounds = handle.getBoundingClientRect();
      return {
        centerOffset: Math.abs(
          cellBounds.top +
            cellBounds.height / 2 -
            (handleBounds.top + handleBounds.height / 2),
        ),
        cellAlignment: getComputedStyle(cell).verticalAlign,
        handleDisplay: getComputedStyle(handle).display,
        handleTransform: getComputedStyle(handle).transform,
      };
    });

    expect(alignment).toEqual({
      centerOffset: expect.any(Number),
      cellAlignment: "middle",
      handleDisplay: "block",
      handleTransform: "matrix(1, 0, 0, 1, 0, 3)",
    });
    expect(alignment.centerOffset).toBe(3);
  });

  test("keeps the page menu clickable above the table after scrolling", async ({ page }) => {
    await createTask(page, "Task below the menu");
    await page.evaluate(() => {
      const table = document.querySelector("#todo-active-table");
      if (!table) throw new Error("Expected the active tasks table.");
      window.scrollTo(0, table.getBoundingClientRect().top + window.scrollY + 36);
    });

    await page.locator("#toggleMenu").click();
    await expect(page.locator("#toggleMenu")).toHaveAttribute("aria-expanded", "true");
  });

  test("reorders tasks with keyboard-accessible move controls and preserves focus", async ({
    page,
  }) => {
    await createTask(page, "First task");
    await createTask(page, "Second task");
    const activeRows = page.locator("#todo-active-table tbody tr");
    const firstMoveUp = page.getByRole("button", { name: "Move up: First task" });
    const secondMoveUp = page.getByRole("button", { name: "Move up: Second task" });
    const secondMoveDown = page.getByRole("button", { name: "Move down: Second task" });

    await expect(firstMoveUp).toBeDisabled();
    await expect(secondMoveDown).toBeDisabled();
    for (const button of [firstMoveUp, secondMoveUp, secondMoveDown]) {
      const size = await button.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        return { width: bounds.width, height: bounds.height };
      });
      expect(size.width).toBeGreaterThanOrEqual(44);
      expect(size.height).toBeGreaterThanOrEqual(44);
    }

    await secondMoveUp.focus();
    await page.keyboard.press("Enter");

    await expect(activeRows.first()).toContainText("Second task");
    await expect(page.getByRole("button", { name: "Move down: Second task" })).toBeFocused();
    await expect(page.locator("#todo-status")).toContainText("Task order updated");
    await expect
      .poll(() =>
        page.evaluate((key) => {
          const tasks = JSON.parse(localStorage.getItem(key) ?? "[]") as Array<{
            title: string;
            position: number;
          }>;
          return tasks.sort((a, b) => a.position - b.position).map((task) => task.title);
        }, storageKey),
      )
      .toEqual(["Second task", "First task"]);
  });

  test("labels the task form controls and recurrence group", async ({ page }) => {
    await page.getByRole("button", { name: "New task" }).click();
    const dialog = page.getByRole("dialog", { name: "New task" });

    await expect(dialog.getByLabel("Title")).toHaveAttribute("required", "");
    await expect(dialog.getByLabel("Number of intervals")).toHaveAttribute("min", "1");
    await expect(dialog.getByLabel("Number of intervals")).toHaveAttribute("max", "99");
    await expect(dialog.getByLabel("Recurrence unit")).toHaveCount(1);
    await expect(dialog.getByRole("group", { name: "Adjust recurrence interval" })).toHaveCount(1);
    await expect(dialog.locator("fieldset > legend")).toHaveText("Recurrence");
    await expect(page.locator("#todo-title")).toHaveAttribute("aria-describedby", "todo-title-help");
  });

  test("explains invalid recurrence intervals with selectable, announced text", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "New task" }).click();
    await page.getByLabel("Title").fill("Task");
    const interval = page.getByLabel("Number of intervals");
    const error = page.locator("#todo-interval-error");

    await interval.fill("100");
    await page.getByRole("button", { name: "Save task" }).click();

    await expect(error).toHaveText("Enter a whole number from 1 to 99.");
    await expect(interval).toBeFocused();
    await expect(interval).toHaveAttribute("aria-invalid", "true");
    await expect(interval).toHaveAttribute("aria-describedby", "todo-interval-error");
    await expect(interval).toHaveAccessibleDescription("Enter a whole number from 1 to 99.");
    await error.selectText();
    expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(
      "Enter a whole number from 1 to 99.",
    );

    await interval.fill("99");
    await expect(error).toBeHidden();
    await expect(interval).not.toHaveAttribute("aria-invalid", "true");
  });

  test("styles the title input and dropdown and reveals the counter halfway full", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.getByRole("button", { name: "New task" }).click();
    const title = page.getByLabel("Title", { exact: true });
    const counter = page.locator("#todo-title-character-count");
    const recurrenceUnit = page.getByLabel("Recurrence unit");
    const longTitle = "a".repeat(30);

    await expect(title).toHaveCSS("min-height", "44px");
    await expect(title).toHaveCSS("border-radius", "4px");
    await expect(counter).toBeHidden();
    await title.fill("a".repeat(29));
    await expect(counter).toBeHidden();
    await title.fill(longTitle);
    await expect(counter).toBeVisible();
    await expect(counter).toHaveText("30 / 60");
    await expect(recurrenceUnit).toHaveCSS("min-height", "44px");
    await expect(recurrenceUnit).toHaveCSS("border-radius", "4px");
    await expect(page.locator("body")).toHaveJSProperty("scrollWidth", 320);

    await page.getByRole("button", { name: "Save task" }).click();
    await page.getByRole("button", { name: `Edit task: ${longTitle}` }).click();
    await expect(counter).toBeVisible();
    await expect(counter).toHaveText("30 / 60");
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
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hour: date.getHours(),
        systemDate: date.toLocaleDateString(),
      };
    }, storageKey);
    expect(dueDate).toMatchObject({ year: 2026, month: 1, day: 28, hour: 0 });

    await page.getByRole("button", { name: "Show hidden tasks" }).click();
    const completedRow = page.locator("#todo-hidden-table tbody tr");
    const showsAgain = completedRow.locator("td").nth(2);
    await expect(completedRow).toContainText("Completed");
    await expect(showsAgain).toHaveText(dueDate.systemDate);
    await expect(completedRow).toHaveCSS("background-color", "rgb(220, 238, 255)");
    await page.getByRole("button", { name: "Menu" }).click();
    const dateFormatToggle = page.locator("#datetimeFormatToggle");
    await dateFormatToggle.click();
    await expect(dateFormatToggle).toContainText("ISO");
    await expect(showsAgain).toHaveText("2026-02-28");
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

    await page.getByRole("button", { name: "Mark incomplete: Review notes" }).click();
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

  test("unsnoozes a hidden task and restores it to the active list", async ({ page }) => {
    await createTask(page, "Snoozed notes");
    await page.getByRole("button", { name: "Snooze until tomorrow: Snoozed notes" }).click();
    await page.getByRole("button", { name: "Show hidden tasks" }).click();
    await expect(page.locator("#todo-hidden-table tbody tr")).toContainText("Snoozed");

    await page.getByRole("button", { name: "Unsnooze task: Snoozed notes" }).click();
    await expect(page.locator("#todo-active-table tbody tr")).toContainText("Snoozed notes");
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
    const sandboxNotice = page.locator("#todo-sandbox-notice");
    await expect(sandboxNotice).toBeHidden();
    await page.getByRole("button", { name: "Enter sandbox mode" }).click();
    await expect(sandboxNotice).toContainText("In sandbox mode");
    await expect(sandboxNotice).toHaveCSS("background-color", "rgb(220, 238, 255)");
    await expect(
      sandboxNotice.getByRole("button", { name: "Exit sandbox mode" }),
    ).toBeVisible();
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
      dueDate: { year: 2026, month: 1, day: 1, hour: 0 },
    });

    await page.reload();
    await expect(sandboxNotice).toBeVisible();
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

    await sandboxNotice.getByRole("button", { name: "Exit sandbox mode" }).click();
    await expect(sandboxNotice).toBeHidden();
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
    const sandboxPanelToggle = page.locator("#todo-sandbox-toggle");
    await expect(sandboxPanelToggle).toBeVisible();
    await expect(sandboxPanelToggle).toHaveText("Exit sandbox mode");
    await expect(page.locator("#todo-sandbox-panel")).toHaveCSS("border-top-style", "none");
    const buttonsMatchStandardStyle = await page.evaluate(() => {
      const standardButton = getComputedStyle(document.querySelector("#todo-new-task")!);
      const properties = [
        "borderTopWidth",
        "borderTopStyle",
        "borderRadius",
        "backgroundColor",
        "paddingTop",
        "paddingRight",
        "minHeight",
      ] as const;
      return [...document.querySelectorAll("#todo-sandbox-panel .sandbox-controls button")].every(
        (button) => {
          const buttonStyles = getComputedStyle(button);
          return properties.every((property) => buttonStyles[property] === standardButton[property]);
        },
      );
    });
    expect(buttonsMatchStandardStyle).toBe(true);

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

    await page.locator("#todo-sandbox-toggle").click();
    await expect(resetButton).toBeHidden();
    await expect(page.locator("#todo-active-table tbody tr")).toHaveCount(1);
    await expect(page.getByLabel("Complete task: Live task")).not.toBeChecked();
  });

  test("snoozes tasks until tomorrow", async ({ page }) => {
    await createTask(page, "First task");
    await createTask(page, "Second task");
    await createTask(page, "Third task");

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
