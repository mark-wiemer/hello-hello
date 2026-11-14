import {
  isValidRecurrence,
  type Recurrence,
  type RecurrenceUnit,
} from "../../utils/todo";
import type { TodoTask } from "./types";

interface TodoDialogElements {
  taskDialog: HTMLDialogElement;
  taskForm: HTMLFormElement;
  taskDialogHeading: HTMLHeadingElement;
  titleInput: HTMLInputElement;
  intervalInput: HTMLInputElement;
  intervalError: HTMLParagraphElement;
  unitInput: HTMLSelectElement;
  formError: HTMLParagraphElement;
  cancelTaskButton: HTMLButtonElement;
  closeTaskButton: HTMLButtonElement;
  deleteDialog: HTMLDialogElement;
  deleteMessage: HTMLParagraphElement;
  cancelDeleteButton: HTMLButtonElement;
  confirmDeleteButton: HTMLButtonElement;
  focusAfterDelete: HTMLElement;
}

interface TodoDialogCallbacks {
  onSaveTask: (taskId: string | null, title: string, recurrence: Recurrence) => void;
  onDeleteTask: (taskId: string) => void;
}

function isRecurrenceUnit(value: string): value is RecurrenceUnit {
  return value === "days" || value === "weeks" || value === "months";
}

export function createTodoDialogs(
  elements: TodoDialogElements,
  callbacks: TodoDialogCallbacks,
) {
  const {
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
    focusAfterDelete,
  } = elements;
  let editingTaskId: string | null = null;
  let deletingTaskId: string | null = null;

  function openTask(task?: TodoTask): void {
    editingTaskId = task?.id ?? null;
    taskForm.reset();
    formError.hidden = true;
    clearIntervalError();
    titleInput.setCustomValidity("");
    taskDialogHeading.textContent = task ? "Edit task" : "New task";
    if (task) {
      titleInput.value = task.title;
      intervalInput.value = String(task.recurrence.interval);
      unitInput.value = task.recurrence.unit;
    }
    intervalInput.dispatchEvent(new Event("input", { bubbles: true }));
    taskDialog.showModal();
    titleInput.focus();
  }

  function clearIntervalError(): void {
    intervalInput.removeAttribute("aria-invalid");
    intervalError.hidden = true;
    intervalError.textContent = "";
  }

  function showIntervalError(): void {
    intervalInput.setAttribute("aria-invalid", "true");
    intervalError.textContent = "Enter a whole number from 1 to 99.";
    intervalError.hidden = false;
  }

  function openDelete(task: TodoTask): void {
    deletingTaskId = task.id;
    deleteMessage.textContent = `Delete "${task.title}"? This cannot be undone.`;
    deleteDialog.showModal();
    cancelDeleteButton.focus();
  }

  function handleTaskSubmit(event: SubmitEvent): void {
    event.preventDefault();
    titleInput.setCustomValidity(
      titleInput.value.trim().length > 0 ? "" : "Enter a task title.",
    );
    if (!taskForm.reportValidity()) return;

    const recurrenceUnit = unitInput.value;
    const recurrenceInterval = Number(intervalInput.value);
    if (
      !isRecurrenceUnit(recurrenceUnit) ||
      !isValidRecurrence({ interval: recurrenceInterval, unit: recurrenceUnit })
    ) {
      formError.textContent = "Choose a whole number from 1 to 99 and a recurrence unit.";
      formError.hidden = false;
      return;
    }

    const taskId = editingTaskId;
    const title = titleInput.value.trim();
    const recurrence: Recurrence = { interval: recurrenceInterval, unit: recurrenceUnit };
    editingTaskId = null;
    taskDialog.close();
    callbacks.onSaveTask(taskId, title, recurrence);
  }

  titleInput.addEventListener("input", () => titleInput.setCustomValidity(""));
  intervalInput.addEventListener("invalid", (event) => {
    event.preventDefault();
    showIntervalError();
    if (titleInput.validity.valid) intervalInput.focus();
  });
  intervalInput.addEventListener("input", () => {
    if (intervalInput.validity.valid) clearIntervalError();
  });
  cancelTaskButton.addEventListener("click", () => taskDialog.close());
  closeTaskButton.addEventListener("click", () => taskDialog.close());
  taskDialog.addEventListener("close", () => {
    editingTaskId = null;
  });
  taskForm.addEventListener("submit", handleTaskSubmit);
  cancelDeleteButton.addEventListener("click", () => {
    deletingTaskId = null;
    deleteDialog.close();
  });
  confirmDeleteButton.addEventListener("click", () => {
    if (!deletingTaskId) return;
    const taskId = deletingTaskId;
    deletingTaskId = null;
    deleteDialog.close();
    callbacks.onDeleteTask(taskId);
    focusAfterDelete.focus();
  });

  return { openTask, openDelete };
}
