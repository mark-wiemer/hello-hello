import type { TodoTask } from "./types";

interface TodoReorderingOptions {
  table: HTMLTableElement;
  getTasks: () => TodoTask[];
  getSelectedTaskIds: () => Set<string>;
  isTaskVisible: (task: TodoTask) => boolean;
  onReordered: (tasks: TodoTask[]) => void;
}

export function createTodoReordering({
  table,
  getTasks,
  getSelectedTaskIds,
  isTaskVisible,
  onReordered,
}: TodoReorderingOptions) {
  let draggedTaskIds: string[] = [];

  function getActiveTasks(): TodoTask[] {
    return getTasks().filter((task) => isTaskVisible(task));
  }

  function canMoveSelection(direction: "up" | "down"): boolean {
    const activeTasks = getActiveTasks();
    const selectedTaskIds = getSelectedTaskIds();
    return activeTasks.some((task, index) => {
      if (!selectedTaskIds.has(task.id)) return false;
      const neighborIndex = direction === "up" ? index - 1 : index + 1;
      return (
        neighborIndex >= 0 &&
        neighborIndex < activeTasks.length &&
        !selectedTaskIds.has(activeTasks[neighborIndex].id)
      );
    });
  }

  function replaceActiveOrder(nextActiveTasks: TodoTask[]): void {
    const orderedTasks = getTasks();
    let activeIndex = 0;
    const reorderedTasks = orderedTasks.map((task) => {
      if (!isTaskVisible(task)) return task;
      const nextTask = nextActiveTasks[activeIndex++];
      return nextTask ?? task;
    });
    onReordered(reorderedTasks);
  }

  function moveSelection(direction: "up" | "down"): void {
    const activeTasks = getActiveTasks();
    const selectedTaskIds = getSelectedTaskIds();
    const reorderedTasks = [...activeTasks];

    if (direction === "up") {
      for (let index = 1; index < reorderedTasks.length; index += 1) {
        if (
          selectedTaskIds.has(reorderedTasks[index].id) &&
          !selectedTaskIds.has(reorderedTasks[index - 1].id)
        ) {
          [reorderedTasks[index - 1], reorderedTasks[index]] = [
            reorderedTasks[index],
            reorderedTasks[index - 1],
          ];
        }
      }
    } else {
      for (let index = reorderedTasks.length - 2; index >= 0; index -= 1) {
        if (
          selectedTaskIds.has(reorderedTasks[index].id) &&
          !selectedTaskIds.has(reorderedTasks[index + 1].id)
        ) {
          [reorderedTasks[index], reorderedTasks[index + 1]] = [
            reorderedTasks[index + 1],
            reorderedTasks[index],
          ];
        }
      }
    }

    replaceActiveOrder(reorderedTasks);
  }

  function clearDropMarker(): void {
    for (const row of table.querySelectorAll<HTMLTableRowElement>(
      "tr.todo-row--drop-before, tr.todo-row--drop-after",
    )) {
      row.classList.remove("todo-row--drop-before", "todo-row--drop-after");
    }
  }

  function reorderSelection(targetId: string, insertAfter: boolean): void {
    const activeTasks = getActiveTasks();
    const movingTasks = activeTasks.filter((task) => draggedTaskIds.includes(task.id));
    if (movingTasks.length === 0 || movingTasks.some((task) => task.id === targetId)) return;

    const remainingTasks = activeTasks.filter((task) => !draggedTaskIds.includes(task.id));
    const targetIndex = remainingTasks.findIndex((task) => task.id === targetId);
    if (targetIndex < 0) return;

    remainingTasks.splice(targetIndex + Number(insertAfter), 0, ...movingTasks);
    replaceActiveOrder(remainingTasks);
  }

  table.addEventListener("dragstart", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const row = target.closest<HTMLTableRowElement>("tr[data-task-id]");
    const taskId = row?.dataset.taskId;
    if (!taskId) return;

    const selectedTaskIds = getSelectedTaskIds();
    draggedTaskIds = selectedTaskIds.has(taskId)
      ? getActiveTasks()
          .filter((task) => selectedTaskIds.has(task.id))
          .map((task) => task.id)
      : [taskId];
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", taskId);
    }
    clearDropMarker();
  });

  table.addEventListener("dragover", (event) => {
    const target = event.target;
    if (!(target instanceof Element) || draggedTaskIds.length === 0) return;
    const targetRow = target.closest<HTMLTableRowElement>("tr[data-task-id]");
    if (!targetRow) return;

    event.preventDefault();
    const targetId = targetRow.dataset.taskId;
    if (!targetId || draggedTaskIds.includes(targetId)) {
      clearDropMarker();
      return;
    }

    const insertAfter =
      event.clientY > targetRow.getBoundingClientRect().top + targetRow.offsetHeight / 2;
    clearDropMarker();
    targetRow.classList.add(insertAfter ? "todo-row--drop-after" : "todo-row--drop-before");
  });

  table.addEventListener("dragleave", (event) => {
    const relatedTarget = event.relatedTarget;
    if (!(relatedTarget instanceof Node) || !table.contains(relatedTarget)) {
      clearDropMarker();
    }
  });

  table.addEventListener("drop", (event) => {
    const target = event.target;
    if (!(target instanceof Element) || draggedTaskIds.length === 0) return;
    const targetRow = target.closest<HTMLTableRowElement>("tr[data-task-id]");
    const targetId = targetRow?.dataset.taskId;
    if (!targetId || !targetRow) return;

    event.preventDefault();
    const insertAfter =
      event.clientY > targetRow.getBoundingClientRect().top + targetRow.offsetHeight / 2;
    reorderSelection(targetId, insertAfter);
    clearDropMarker();
    draggedTaskIds = [];
  });

  table.addEventListener("dragend", () => {
    clearDropMarker();
    draggedTaskIds = [];
  });

  return { canMoveSelection, moveSelection };
}
