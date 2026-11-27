import { formatRecurrence } from "../../utils/todo";
import type { TodoTask } from "./types";

interface TodoTableCallbacks {
  onComplete: (task: TodoTask) => void;
  onMoveTask: (task: TodoTask, direction: "up" | "down") => void;
  onSnooze: (task: TodoTask) => void;
  onUnsnooze: (task: TodoTask) => void;
  onMarkIncomplete: (task: TodoTask) => void;
  onEdit: (task: TodoTask) => void;
  onDelete: (task: TodoTask) => void;
  formatDueDate: (date: string) => string;
}

interface TodoTableRendererOptions extends TodoTableCallbacks {
  activeTable: HTMLTableElement;
  hiddenTable: HTMLTableElement;
}

export function createTodoTableRenderer({
  activeTable,
  hiddenTable,
  onComplete,
  onMoveTask,
  onSnooze,
  onUnsnooze,
  onMarkIncomplete,
  onEdit,
  onDelete,
  formatDueDate,
}: TodoTableRendererOptions) {
  function appendButton(
    parent: HTMLElement,
    label: string,
    onClick: () => void,
    ariaLabel = label,
  ): void {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-label", ariaLabel);
    button.addEventListener("click", onClick);
    parent.append(button);
  }

  function createCompletionCell(task: TodoTask): HTMLTableCellElement {
    const cell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", `Complete task: ${task.title}`);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) onComplete(task);
    });
    cell.append(checkbox);
    return cell;
  }

  function createTaskActions(task: TodoTask, isHidden: boolean): HTMLDivElement {
    const actions = document.createElement("div");
    actions.className = "task-actions";

    if (!isHidden) {
      appendButton(
        actions,
        "Snooze",
        () => onSnooze(task),
        `Snooze until tomorrow: ${task.title}`,
      );
    } else if (task.hiddenReason === "completed") {
      appendButton(
        actions,
        "Mark incomplete",
        () => onMarkIncomplete(task),
        `Mark incomplete: ${task.title}`,
      );
    } else if (task.hiddenReason === "snoozed") {
      appendButton(
        actions,
        "Unsnooze",
        () => onUnsnooze(task),
        `Unsnooze task: ${task.title}`,
      );
    }
    appendButton(actions, "Edit", () => onEdit(task), `Edit task: ${task.title}`);
    appendButton(actions, "Delete", () => onDelete(task), `Delete task: ${task.title}`);
    return actions;
  }

  function createActiveRow(task: TodoTask): HTMLTableRowElement {
    const row = document.createElement("tr");
    row.dataset.taskId = task.id;
    row.draggable = true;

    const dragCell = row.insertCell();
    const dragHandle = document.createElement("span");
    dragHandle.className = "drag-handle";
    dragHandle.setAttribute("aria-hidden", "true");
    dragHandle.textContent = "⠿";
    const reorderControls = document.createElement("div");
    reorderControls.className = "reorder-controls";
    reorderControls.append(dragHandle);
    dragCell.append(reorderControls);
    row.append(createCompletionCell(task));

    const titleCell = row.insertCell();
    titleCell.textContent = task.title;
    const recurrenceCell = row.insertCell();
    recurrenceCell.textContent = formatRecurrence(task.recurrence);
    const actionsCell = row.insertCell();
    actionsCell.append(createTaskActions(task, false));
    return row;
  }

  function createHiddenRow(task: TodoTask): HTMLTableRowElement {
    const row = document.createElement("tr");
    if (task.hiddenReason === "completed") row.classList.add("todo-row--completed");

    const titleCell = row.insertCell();
    titleCell.textContent = task.title;
    const recurrenceCell = row.insertCell();
    recurrenceCell.textContent = formatRecurrence(task.recurrence);
    const dueDateCell = row.insertCell();
    dueDateCell.textContent = task.hiddenUntil ? formatDueDate(task.hiddenUntil) : "";
    const statusCell = row.insertCell();
    statusCell.textContent = task.hiddenReason === "completed" ? "Completed" : "Snoozed";
    const actionsCell = row.insertCell();
    actionsCell.append(createTaskActions(task, true));
    return row;
  }

  function renderTable(
    tableElement: HTMLTableElement,
    data: TodoTask[],
    createRow: (task: TodoTask, index: number) => HTMLTableRowElement,
  ): void {
    const body = tableElement.tBodies[0] ?? tableElement.createTBody();
    body.replaceChildren(
      ...data.map((task, index) => createRow(task, index)),
    );
  }

  return (activeTasks: TodoTask[], hiddenTasks: TodoTask[]): void => {
    renderTable(activeTable, activeTasks, (task, index) => {
      const row = createActiveRow(task);
      const controls = row.querySelector<HTMLDivElement>(".reorder-controls");
      if (!controls) throw new Error("Active task row is missing reorder controls.");

      for (const direction of ["up", "down"] as const) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "reorder-button";
        const icon = document.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = direction === "up" ? "↑" : "↓";
        button.append(icon);
        button.setAttribute("aria-label", `Move ${direction}: ${task.title}`);
        button.dataset.taskId = task.id;
        button.dataset.moveDirection = direction;
        button.disabled =
          direction === "up" ? index === 0 : index === activeTasks.length - 1;
        button.addEventListener("click", () => onMoveTask(task, direction));
        controls.append(button);
      }

      return row;
    });
    renderTable(hiddenTable, hiddenTasks, createHiddenRow);
  };
}
