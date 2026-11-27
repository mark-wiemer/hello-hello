import {
  getCompletionDueDate,
  getNextLocalDay,
  getSnoozeDueDate,
} from "../utils/todo";
import {
  loadTasks,
  parseTaskExport,
  readSandboxDate,
  readSandboxMode,
  saveTasksToStorage,
  sandboxStorageKey,
  serializeTaskExport,
  storageKey,
  storeSandboxDate,
  storeSandboxMode,
} from "./todo/storage";
import { createTodoDialogs } from "./todo/dialogs";
import { createTodoReordering } from "./todo/reordering";
import { createTodoTableRenderer } from "./todo/tables";
import type { TodoTask } from "./todo/types";

function getRequiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Todo page is missing ${selector}.`);
  }
  return element;
}

const activeTable = getRequiredElement<HTMLTableElement>("#todo-active-table");
const hiddenTable = getRequiredElement<HTMLTableElement>("#todo-hidden-table");
const activeTableRegion = getRequiredElement<HTMLDivElement>("#todo-active-region");
const belowTableContent = getRequiredElement<HTMLDivElement>("#todo-below-table");
const belowTableFooter = getRequiredElement<HTMLDivElement>("#todo-below-table-footer");
const hiddenTasksSection = getRequiredElement<HTMLElement>("#todo-hidden-section");
const newTaskButton = getRequiredElement<HTMLButtonElement>("#todo-new-task");
const taskDialog = getRequiredElement<HTMLDialogElement>("#todo-task-dialog");
const taskForm = getRequiredElement<HTMLFormElement>("#todo-task-form");
const taskDialogHeading = getRequiredElement<HTMLHeadingElement>("#todo-task-dialog-heading");
const titleInput = getRequiredElement<HTMLInputElement>("#todo-title");
const intervalInput = getRequiredElement<HTMLInputElement>("#todo-interval");
const intervalError = getRequiredElement<HTMLParagraphElement>("#todo-interval-error");
const unitInput = getRequiredElement<HTMLSelectElement>("#todo-unit");
const formError = getRequiredElement<HTMLParagraphElement>("#todo-form-error");
const cancelTaskButton = getRequiredElement<HTMLButtonElement>("#todo-cancel-task");
const closeTaskButton = getRequiredElement<HTMLButtonElement>("#todo-close-task");
const toggleHiddenButton = getRequiredElement<HTMLButtonElement>("#todo-toggle-hidden");
const hiddenContent = getRequiredElement<HTMLDivElement>("#todo-hidden-content");
const activeEmptyMessage = getRequiredElement<HTMLParagraphElement>("#todo-active-empty");
const loadingIndicator = getRequiredElement<HTMLSpanElement>(".todo-loading-indicator");
const statusMessage = getRequiredElement<HTMLParagraphElement>("#todo-status");
const deleteDialog = getRequiredElement<HTMLDialogElement>("#todo-delete-dialog");
const deleteMessage = getRequiredElement<HTMLParagraphElement>("#todo-delete-message");
const cancelDeleteButton = getRequiredElement<HTMLButtonElement>("#todo-cancel-delete");
const confirmDeleteButton = getRequiredElement<HTMLButtonElement>("#todo-confirm-delete");
const sandboxToggleButton = getRequiredElement<HTMLButtonElement>("#todo-sandbox-toggle");
const sandboxNotice = getRequiredElement<HTMLParagraphElement>("#todo-sandbox-notice");
const sandboxExitButton = getRequiredElement<HTMLButtonElement>("#todo-sandbox-exit");
const simulateNextDayButton = getRequiredElement<HTMLButtonElement>("#todo-simulate-next-day");
const sandboxResetButton = getRequiredElement<HTMLButtonElement>("#todo-sandbox-reset");
const sandboxDateMessage = getRequiredElement<HTMLParagraphElement>("#todo-sandbox-date");
const exportTasksButton = getRequiredElement<HTMLButtonElement>("#todo-export-tasks");
const importFileInput = getRequiredElement<HTMLInputElement>("#todo-import-file");
const backupStatus = getRequiredElement<HTMLParagraphElement>("#todo-backup-status");
const importDialog = getRequiredElement<HTMLDialogElement>("#todo-import-dialog");
const importMessage = getRequiredElement<HTMLParagraphElement>("#todo-import-message");
const cancelImportButton = getRequiredElement<HTMLButtonElement>("#todo-cancel-import");
const confirmImportButton = getRequiredElement<HTMLButtonElement>("#todo-confirm-import");

let hiddenTasksShown = false;
let visibilityTimer: number | undefined;
let pendingImportTasks: TodoTask[] | null = null;
let initialRenderComplete = false;
let loadingIndicatorTimer: number | undefined;

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatLocalDate(date: Date): string {
  if (localStorage.getItem("dateFormat") === "iso") {
    return [
      date.getFullYear().toString().padStart(4, "0"),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }
  return date.toLocaleDateString();
}

function formatTaskCount(count: number): string {
  return `${count} task${count === 1 ? "" : "s"}`;
}

const initialSandboxMode = readSandboxMode();
let sandboxModeEnabled = initialSandboxMode.enabled;
const initialSandboxDate = sandboxModeEnabled ? readSandboxDate() : null;
let sandboxNow = initialSandboxDate?.date ?? null;
const initialTaskLoad = loadTasks(getCurrentStorageKey());
let tasks = initialTaskLoad.tasks;
const startupErrors = [
  initialSandboxMode.error,
  initialSandboxDate?.error ?? null,
  initialTaskLoad.error,
].filter((error): error is string => error !== null);
const dialogs = createTodoDialogs(
  {
    taskDialog,
    taskForm,
    taskDialogHeading,
    titleInput,
    intervalInput,
    intervalError,
    unitInput,
    formError,
    cancelTaskButton,
    closeTaskButton,
    deleteDialog,
    deleteMessage,
    cancelDeleteButton,
    confirmDeleteButton,
    focusAfterDelete: newTaskButton,
  },
  {
    onSaveTask(taskId, title, recurrence) {
      if (taskId) {
        tasks = tasks.map((task) =>
          task.id === taskId ? { ...task, title, recurrence } : task,
        );
        saveTasks(`Updated "${title}".`);
      } else {
        tasks.push({
          id: crypto.randomUUID(),
          title,
          recurrence,
          position: tasks.length,
          hiddenUntil: null,
          hiddenReason: null,
        });
        saveTasks(`Added "${title}".`);
      }
    },
    onDeleteTask(taskId) {
      const deletedTask = tasks.find((task) => task.id === taskId);
      tasks = tasks.filter((task) => task.id !== taskId);
      saveTasks(deletedTask ? `Deleted "${deletedTask.title}".` : "Task deleted.");
    },
  },
);
function getCurrentStorageKey(): string {
  return sandboxModeEnabled ? sandboxStorageKey : storageKey;
}

function getCurrentDate(): Date {
  return sandboxModeEnabled && sandboxNow ? new Date(sandboxNow) : new Date();
}

function updateStatusMessage(
  element: HTMLParagraphElement,
  message: string,
  isError: boolean,
): void {
  element.textContent = message;
  element.setAttribute("role", isError ? "alert" : "status");
  element.setAttribute("aria-live", isError ? "assertive" : "polite");
  console.debug(`[todo] ${message}`);
}

function setStatus(message: string, isError = false): void {
  updateStatusMessage(statusMessage, message, isError);
}

function setBackupStatus(message: string, isError = false): void {
  updateStatusMessage(backupStatus, message, isError);
}

function exportRegularTasks(): void {
  const taskLoadResult = loadTasks(storageKey);
  if (taskLoadResult.error) {
    setBackupStatus(taskLoadResult.error, true);
    return;
  }

  const backup = new Blob([serializeTaskExport(taskLoadResult.tasks)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(backup);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `todo-tasks-${new Date().toISOString().slice(0, 10)}.json`;
  downloadLink.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  setBackupStatus(`Exported ${formatTaskCount(taskLoadResult.tasks.length)}.`);
}

async function prepareTaskImport(): Promise<void> {
  const file = importFileInput.files?.[0];
  if (!file) return;

  try {
    const importResult = parseTaskExport(await file.text());
    if (importResult.error) {
      setBackupStatus(importResult.error, true);
      return;
    }

    pendingImportTasks = importResult.tasks;
    const taskCount = pendingImportTasks.length;
    importMessage.textContent = `This file contains ${formatTaskCount(taskCount)} and will replace your current tasks.`;
    importDialog.showModal();
  } catch (error) {
    console.error("[todo] Could not read selected task backup.", error);
    setBackupStatus("The selected file could not be read.", true);
  } finally {
    importFileInput.value = "";
  }
}

function confirmTaskImport(): void {
  if (!pendingImportTasks) {
    setBackupStatus("Choose a valid task backup before importing.", true);
    return;
  }

  const importedTasks = pendingImportTasks.map((task, position) => ({
    ...task,
    position,
  }));
  const saveError = saveTasksToStorage(storageKey, importedTasks);
  if (saveError) {
    setBackupStatus(saveError, true);
    return;
  }

  pendingImportTasks = null;
  importDialog.close();
  if (sandboxModeEnabled) {
    setBackupStatus(
      `Imported ${formatTaskCount(importedTasks.length)}. Exit sandbox mode to view them.`,
    );
    return;
  }

  tasks = importedTasks;
  const expiryResult = expireReadyTasks(false);
  render();
  if (expiryResult.error) {
    setBackupStatus(
      `Imported ${importedTasks.length} tasks, but a due task could not be updated.`,
      true,
    );
  } else {
    setBackupStatus(`Imported ${formatTaskCount(importedTasks.length)}.`);
  }
}

function updateSandboxControls(): void {
  sandboxNotice.hidden = !sandboxModeEnabled;
  sandboxToggleButton.textContent = sandboxModeEnabled
    ? "Exit sandbox mode"
    : "Enter sandbox mode";
  sandboxToggleButton.setAttribute("aria-pressed", String(sandboxModeEnabled));
  simulateNextDayButton.hidden = !sandboxModeEnabled;
  sandboxResetButton.hidden = !sandboxModeEnabled;
  sandboxDateMessage.hidden = !sandboxModeEnabled;
  sandboxDateMessage.textContent = sandboxModeEnabled
    ? `Sandbox date: ${dateTimeFormat.format(getCurrentDate())}`
    : "";
}

function sortedTasks(): TodoTask[] {
  return [...tasks].sort((a, b) => a.position - b.position);
}

function isTaskVisible(task: TodoTask, now = getCurrentDate()): boolean {
  return task.hiddenUntil === null || Date.parse(task.hiddenUntil) <= now.getTime();
}

const todoReordering = createTodoReordering({
  table: activeTable,
  getTasks: sortedTasks,
  isTaskVisible,
  onReordered(nextTasks) {
    tasks = nextTasks;
    saveTasks("Task order updated.");
  },
});

const renderTodoTables = createTodoTableRenderer({
  activeTable,
  hiddenTable,
  onComplete: completeTask,
  onMoveTask: moveTask,
  onSnooze: snoozeTask,
  onUnsnooze: unsnoozeTask,
  onMarkIncomplete: markTaskIncomplete,
  onEdit: dialogs.openTask,
  onDelete: dialogs.openDelete,
  formatDueDate: (date) => formatLocalDate(new Date(date)),
});

function moveTask(task: TodoTask, direction: "up" | "down"): void {
  if (!todoReordering.moveTask(task.id, direction)) return;

  const taskControls = activeTable.querySelectorAll<HTMLButtonElement>(".reorder-button");
  const preferredControl = [...taskControls].find(
    (button) =>
      button.dataset.taskId === task.id && button.dataset.moveDirection === direction,
  );
  const alternateControl = [...taskControls].find(
    (button) =>
      button.dataset.taskId === task.id &&
      button.dataset.moveDirection !== direction &&
      !button.disabled,
  );
  (preferredControl && !preferredControl.disabled ? preferredControl : alternateControl)?.focus();
}

function saveTasks(message: string): void {
  tasks = tasks.map((task, position) => ({ ...task, position }));
  const saveError = saveTasksToStorage(getCurrentStorageKey(), tasks);

  render();
  if (saveError) {
    setStatus(saveError, true);
  } else {
    setStatus(message);
  }
}

function render(): void {
  initialRenderComplete = true;
  if (loadingIndicatorTimer !== undefined) {
    window.clearTimeout(loadingIndicatorTimer);
    loadingIndicatorTimer = undefined;
  }
  loadingIndicator.hidden = true;

  const orderedTasks = sortedTasks();
  const activeTasks = orderedTasks.filter((task) => isTaskVisible(task));
  const hiddenTasks = orderedTasks.filter((task) => !isTaskVisible(task));

  renderTodoTables(activeTasks, hiddenTasks);
  activeTableRegion.hidden = activeTasks.length === 0;
  activeEmptyMessage.hidden = activeTasks.length > 0;
  activeEmptyMessage.classList.remove("todo-loading");
  activeEmptyMessage.removeAttribute("aria-busy");
  activeEmptyMessage.textContent =
    tasks.length > 0
      ? "No tasks are ready right now."
      : "No tasks yet. Add one to get started.";
  if (hiddenTasks.length === 0) hiddenTasksShown = false;
  hiddenTasksSection.hidden = hiddenTasks.length === 0;
  toggleHiddenButton.textContent = hiddenTasksShown ? "Hide hidden tasks" : "Show hidden tasks";
  toggleHiddenButton.setAttribute("aria-expanded", String(hiddenTasksShown));
  hiddenContent.hidden = !hiddenTasksShown;
  updateSandboxControls();

  belowTableContent.hidden = false;
  belowTableFooter.hidden = false;
  scheduleVisibilityRefresh();
}

function completeTask(task: TodoTask): void {
  const completedAt = getCurrentDate();
  const hiddenUntil = getCompletionDueDate(completedAt, task.recurrence);
  updateTaskVisibility(
    task,
    { hiddenUntil: hiddenUntil.toISOString(), hiddenReason: "completed" },
    `Completed "${task.title}". It will return ${dateTimeFormat.format(hiddenUntil)}.`,
  );
}

function snoozeTask(task: TodoTask): void {
  const hiddenUntil = getSnoozeDueDate(getCurrentDate());
  updateTaskVisibility(
    task,
    { hiddenUntil: hiddenUntil.toISOString(), hiddenReason: "snoozed" },
    `Snoozed "${task.title}" until ${dateTimeFormat.format(hiddenUntil)}.`,
  );
}

function markTaskIncomplete(task: TodoTask): void {
  updateTaskVisibility(
    task,
    { hiddenUntil: null, hiddenReason: null },
    `Marked "${task.title}" incomplete.`,
  );
}

function unsnoozeTask(task: TodoTask): void {
  updateTaskVisibility(
    task,
    { hiddenUntil: null, hiddenReason: null },
    `Unsnoozed "${task.title}".`,
  );
}

function updateTaskVisibility(
  task: TodoTask,
  visibility: Pick<TodoTask, "hiddenUntil" | "hiddenReason">,
  message: string,
): void {
  tasks = tasks.map((currentTask) =>
    currentTask.id === task.id ? { ...currentTask, ...visibility } : currentTask,
  );
  saveTasks(message);
}

function expireReadyTasks(announce = true): { count: number; error: string | null } {
  const now = getCurrentDate();
  const readyTasks = tasks.filter(
    (task) => task.hiddenUntil !== null && Date.parse(task.hiddenUntil) <= now.getTime(),
  );
  if (readyTasks.length === 0) {
    scheduleVisibilityRefresh();
    return { count: 0, error: null };
  }

  const readyIds = new Set(readyTasks.map((task) => task.id));
  tasks = tasks.map((task) =>
    readyIds.has(task.id) ? { ...task, hiddenUntil: null, hiddenReason: null } : task,
  );
  const saveError = saveTasksToStorage(getCurrentStorageKey(), tasks);
  const expiryError = "A task is ready, but its updated state could not be saved.";
  render();
  if (saveError) {
    if (announce) setStatus(expiryError, true);
  } else if (announce) {
    setStatus(
      `${readyTasks.length} task${readyTasks.length === 1 ? "" : "s"} ready to work on.`,
    );
  }
  return {
    count: readyTasks.length,
    error: saveError ? expiryError : null,
  };
}

function scheduleVisibilityRefresh(): void {
  if (visibilityTimer !== undefined) window.clearTimeout(visibilityTimer);
  if (sandboxModeEnabled) {
    visibilityTimer = undefined;
    return;
  }
  const now = Date.now();
  const hiddenDates = tasks
    .map((task) => (task.hiddenUntil ? Date.parse(task.hiddenUntil) : Number.POSITIVE_INFINITY))
    .filter((dueDate) => dueDate > now);
  const nextDueDate = Math.min(...hiddenDates);
  if (!Number.isFinite(nextDueDate)) {
    visibilityTimer = undefined;
    return;
  }
  const maximumTimeout = 2_147_000_000;
  const delay = Math.min(maximumTimeout, Math.max(0, nextDueDate - now));
  visibilityTimer = window.setTimeout(expireReadyTasks, delay);
}

function toggleSandboxMode(): void {
  const nextMode = !sandboxModeEnabled;
  const modeError = storeSandboxMode(nextMode);
  sandboxModeEnabled = nextMode;

  let dateError: string | null = null;
  if (sandboxModeEnabled) {
    const sandboxDateResult = readSandboxDate();
    sandboxNow = sandboxDateResult.date;
    dateError = sandboxDateResult.error;
  } else {
    sandboxNow = null;
  }

  const taskLoadResult = loadTasks(getCurrentStorageKey());
  tasks = taskLoadResult.tasks;

  const expiryResult = expireReadyTasks(false);
  render();
  const errors = [modeError, dateError, taskLoadResult.error, expiryResult.error].filter(
    (error): error is string => error !== null,
  );
  if (errors.length > 0) {
    setStatus(errors.join(" "), true);
  } else {
    setStatus(
      sandboxModeEnabled
        ? "Sandbox mode enabled. Your tasks are unchanged."
        : "Sandbox mode disabled. Showing your tasks.",
    );
  }
}

function simulateNextDay(): void {
  if (!sandboxModeEnabled || !sandboxNow) return;

  sandboxNow = getNextLocalDay(sandboxNow);
  const dateError = storeSandboxDate(sandboxNow);
  const expiryResult = expireReadyTasks(false);
  render();

  const errors = [dateError, expiryResult.error].filter(
    (error): error is string => error !== null,
  );
  if (errors.length > 0) {
    setStatus(errors.join(" "), true);
    return;
  }

  const readyMessage =
    expiryResult.count > 0
      ? ` ${expiryResult.count} task${expiryResult.count === 1 ? "" : "s"} ready.`
      : "";
  setStatus(`Sandbox date advanced to ${dateTimeFormat.format(sandboxNow)}.${readyMessage}`);
}

function resetSandbox(): void {
  if (!sandboxModeEnabled) return;

  sandboxNow = new Date();
  const dateError = storeSandboxDate(sandboxNow);
  tasks = tasks.map((task) => ({
    ...task,
    hiddenUntil: null,
    hiddenReason: null,
  }));

  const taskError = saveTasksToStorage(getCurrentStorageKey(), tasks);
  render();

  const errors = [dateError, taskError].filter((error): error is string => error !== null);
  if (errors.length > 0) {
    setStatus(errors.join(" "), true);
  } else {
    setStatus("Sandbox reset. The date is back to today and all tasks are incomplete.");
  }
}

newTaskButton.addEventListener("click", () => dialogs.openTask());
toggleHiddenButton.addEventListener("click", () => {
  hiddenTasksShown = !hiddenTasksShown;
  render();
});
sandboxToggleButton.addEventListener("click", toggleSandboxMode);
sandboxExitButton.addEventListener("click", toggleSandboxMode);
simulateNextDayButton.addEventListener("click", simulateNextDay);
sandboxResetButton.addEventListener("click", resetSandbox);
exportTasksButton.addEventListener("click", exportRegularTasks);
importFileInput.addEventListener("change", prepareTaskImport);
cancelImportButton.addEventListener("click", () => importDialog.close());
confirmImportButton.addEventListener("click", confirmTaskImport);
importDialog.addEventListener("close", () => {
  pendingImportTasks = null;
});
window.addEventListener("dateformat-changed", render);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") expireReadyTasks();
});

loadingIndicatorTimer = window.setTimeout(() => {
  if (!initialRenderComplete) loadingIndicator.hidden = false;
}, 100);

const initialExpiryResult = expireReadyTasks(false);
render();
if (startupErrors.length > 0) {
  setStatus(startupErrors.join(" "), true);
} else if (initialExpiryResult.error) {
  setStatus(initialExpiryResult.error, true);
} else if (initialExpiryResult.count > 0) {
  setStatus(
    `${initialExpiryResult.count} task${initialExpiryResult.count === 1 ? "" : "s"} ready to work on.`,
  );
}
