import {
  createTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/table-core";
import { formatRecurrence } from "../../utils/todo";
import type { TodoTask } from "./types";

interface TodoTableCallbacks {
  onComplete: (task: TodoTask) => void;
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

const activeColumns: ColumnDef<TodoTask, unknown>[] = [
  { id: "drag", header: "Reorder" },
  { id: "complete", header: "Complete" },
  { accessorKey: "title", header: "Task" },
  {
    id: "recurrence",
    accessorFn: (task) => formatRecurrence(task.recurrence),
    header: "Recurrence",
  },
  { id: "actions", header: "Actions" },
];

const hiddenColumns: ColumnDef<TodoTask, unknown>[] = [
  { accessorKey: "title", header: "Task" },
  {
    id: "recurrence",
    accessorFn: (task) => formatRecurrence(task.recurrence),
    header: "Recurrence",
  },
  { id: "shows-again", header: "Shows again" },
  { id: "status", header: "Status" },
  { id: "actions", header: "Actions" },
];

export function createTodoTableRenderer({
  activeTable,
  hiddenTable,
  onComplete,
  onSnooze,
  onUnsnooze,
  onMarkIncomplete,
  onEdit,
  onDelete,
  formatDueDate,
}: TodoTableRendererOptions) {
  function createTableInstance(
    data: TodoTask[],
    columns: ColumnDef<TodoTask, unknown>[],
  ) {
    return createTable<TodoTask>({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getRowId: (task) => task.id,
      state: {},
      onStateChange: () => {},
      renderFallbackValue: null,
      debugTable: import.meta.env.DEV,
    });
  }

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
        `Mark task incomplete: ${task.title}`,
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
    dragCell.append(dragHandle);
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
    columns: ColumnDef<TodoTask, unknown>[],
    createRow: (task: TodoTask) => HTMLTableRowElement,
  ): void {
    const table = createTableInstance(data, columns);
    const body = tableElement.tBodies[0] ?? tableElement.createTBody();
    body.replaceChildren(...table.getRowModel().rows.map((row) => createRow(row.original)));
  }

  return (activeTasks: TodoTask[], hiddenTasks: TodoTask[]): void => {
    renderTable(activeTable, activeTasks, activeColumns, createActiveRow);
    renderTable(hiddenTable, hiddenTasks, hiddenColumns, createHiddenRow);
  };
}
