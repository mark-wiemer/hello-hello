import { describe, expect, it } from "vitest";
import { parseTaskExport, serializeTaskExport } from "./storage";
import type { TodoTask } from "./types";

const tasks: TodoTask[] = [
  {
    id: "second",
    title: "Second task",
    recurrence: { interval: 1, unit: "days" },
    position: 1,
    hiddenUntil: "2099-01-01T00:00:00.000Z",
    hiddenReason: "completed",
  },
  {
    id: "first",
    title: "First task",
    recurrence: { interval: 2, unit: "weeks" },
    position: 0,
    hiddenUntil: null,
    hiddenReason: null,
  },
];

describe("todo task export", () => {
  it("serializes and restores tasks in their display order", () => {
    const serialized = serializeTaskExport(tasks);
    const result = parseTaskExport(serialized);

    expect(result).toEqual({ tasks: [tasks[1], tasks[0]], error: null });
    expect(JSON.parse(serialized)).toMatchObject({
      format: "markwiemer.todo.tasks",
      version: 1,
      tasks,
    });
  });

  it("rejects malformed, unsupported, or invalid task data", () => {
    for (const contents of [
      "{",
      JSON.stringify({ format: "other", version: 1, tasks }),
      JSON.stringify({ format: "markwiemer.todo.tasks", version: 2, tasks }),
      JSON.stringify({
        format: "markwiemer.todo.tasks",
        version: 1,
        tasks: [{ ...tasks[0], recurrence: { interval: 100, unit: "days" } }],
      }),
    ]) {
      expect(parseTaskExport(contents)).toMatchObject({
        tasks: [],
        error: expect.any(String),
      });
    }
  });

  it("rejects duplicate task IDs", () => {
    const contents = serializeTaskExport([tasks[0]!, { ...tasks[0]!, position: 2 }]);

    expect(parseTaskExport(contents)).toMatchObject({
      tasks: [],
      error: expect.any(String),
    });
  });
});
