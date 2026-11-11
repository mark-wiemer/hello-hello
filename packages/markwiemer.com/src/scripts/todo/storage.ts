import { isValidRecurrence } from "../../utils/todo";
import type { TodoTask } from "./types";

export const storageKey = "markwiemer.todo.tasks.v1";
export const sandboxStorageKey = "markwiemer.todo.sandbox.tasks.v1";
const sandboxModeSessionKey = "markwiemer.todo.sandbox.enabled.v1";
const sandboxDateSessionKey = "markwiemer.todo.sandbox.date.v1";

function isValidTask(value: unknown): value is TodoTask {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<TodoTask>;
  const recurrence = candidate.recurrence;
  const hasValidRecurrence =
    recurrence !== undefined &&
    typeof recurrence.interval === "number" &&
    (recurrence.unit === "days" ||
      recurrence.unit === "weeks" ||
      recurrence.unit === "months") &&
    isValidRecurrence(recurrence);
  const hasValidHiddenUntil =
    candidate.hiddenUntil === null ||
    (typeof candidate.hiddenUntil === "string" &&
      Number.isFinite(Date.parse(candidate.hiddenUntil)));
  const hasValidHiddenReason =
    candidate.hiddenReason === null ||
    candidate.hiddenReason === "completed" ||
    candidate.hiddenReason === "snoozed";

  return (
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.title === "string" &&
    candidate.title.trim().length > 0 &&
    typeof candidate.position === "number" &&
    Number.isFinite(candidate.position) &&
    hasValidRecurrence &&
    hasValidHiddenUntil &&
    hasValidHiddenReason &&
    ((candidate.hiddenUntil === null && candidate.hiddenReason === null) ||
      (candidate.hiddenUntil !== null && candidate.hiddenReason !== null))
  );
}

export function loadTasks(key: string): { tasks: TodoTask[]; error: string | null } {
  try {
    const storedTasks = localStorage.getItem(key);
    if (!storedTasks) return { tasks: [], error: null };

    const parsed: unknown = JSON.parse(storedTasks);
    if (
      !Array.isArray(parsed) ||
      !parsed.every(isValidTask) ||
      new Set(parsed.map((task) => task.id)).size !== parsed.length
    ) {
      throw new TypeError("Saved task data does not match the todo app format.");
    }

    return { tasks: parsed.sort((a, b) => a.position - b.position), error: null };
  } catch (error) {
    console.error("[todo] Could not load saved tasks.", error);
    return {
      tasks: [],
      error:
        "Saved tasks could not be loaded. Browser storage may be unavailable or contain invalid data.",
    };
  }
}

export function saveTasksToStorage(key: string, tasks: TodoTask[]): string | null {
  try {
    localStorage.setItem(key, JSON.stringify(tasks));
    return null;
  } catch (error) {
    console.error("[todo] Could not save tasks.", error);
    return "Changes could not be saved to this browser.";
  }
}

export function readSandboxMode(): { enabled: boolean; error: string | null } {
  try {
    return { enabled: sessionStorage.getItem(sandboxModeSessionKey) === "true", error: null };
  } catch (error) {
    console.error("[todo] Could not read sandbox mode.", error);
    return {
      enabled: false,
      error: "Sandbox mode could not be restored from this tab.",
    };
  }
}

export function readSandboxDate(): { date: Date; error: string | null } {
  try {
    const storedDate = sessionStorage.getItem(sandboxDateSessionKey);
    const date = storedDate ? new Date(storedDate) : new Date();
    if (!Number.isFinite(date.getTime())) {
      throw new TypeError("Saved sandbox date is invalid.");
    }
    if (!storedDate) sessionStorage.setItem(sandboxDateSessionKey, date.toISOString());
    return { date, error: null };
  } catch (error) {
    console.error("[todo] Could not read sandbox date.", error);
    return {
      date: new Date(),
      error: "Sandbox date could not be restored; it is using the current date.",
    };
  }
}

export function storeSandboxMode(enabled: boolean): string | null {
  try {
    if (enabled) sessionStorage.setItem(sandboxModeSessionKey, "true");
    else sessionStorage.removeItem(sandboxModeSessionKey);
    return null;
  } catch (error) {
    console.error("[todo] Could not save sandbox mode.", error);
    return "Sandbox mode could not be saved for this tab.";
  }
}

export function storeSandboxDate(date: Date): string | null {
  try {
    sessionStorage.setItem(sandboxDateSessionKey, date.toISOString());
    return null;
  } catch (error) {
    console.error("[todo] Could not save sandbox date.", error);
    return "The sandbox date could not be saved for this tab.";
  }
}
