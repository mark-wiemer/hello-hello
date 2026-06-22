import { expect, test } from "@/types.js";
import { parseApiModel, parseEntry, toJsonSchema } from "./index.js";

test("accepts a valid function entry and fills array defaults", () => {
  const result = parseEntry({
    kind: "function",
    name: "core.get_node",
    summary: "Returns the node at the given position.",
    params: [{ name: "pos", type: "Vector" }],
    returns: [{ name: "node", type: "MapNode" }],
    envs: ["server-main", "client"],
  });

  expect(result.success).toBe(true);
  if (result.success && result.data.kind === "function") {
    // `params`/`returns`/`envs` supplied here; an omitted array should default.
    expect(result.data.params[0]).toMatchObject({ name: "pos", type: "Vector" });
  }
});

test("defaults missing callable arrays to empty", () => {
  const result = parseEntry({
    kind: "function",
    name: "core.get_us_time",
    summary: "Returns time with microsecond precision.",
  });

  expect(result.success).toBe(true);
  if (result.success && result.data.kind === "function") {
    expect(result.data.params).toEqual([]);
    expect(result.data.returns).toEqual([]);
    expect(result.data.envs).toEqual([]);
  }
});

test("rejects a param whose type expression is malformed", () => {
  const result = parseEntry({
    kind: "function",
    name: "core.bad",
    summary: "Has an unbalanced group in a type.",
    params: [{ name: "pos", type: "(Vector" }],
  });

  expect(result.success).toBe(false);
  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message).join("\n");
    expect(messages).toContain("Invalid type expression");
    expect(messages).toContain("(Vector");
  }
});

test("rejects an unknown environment", () => {
  const result = parseEntry({
    kind: "function",
    name: "core.somewhere",
    summary: "Uses a bogus environment.",
    envs: ["mainmenu"],
  });

  expect(result.success).toBe(false);
});

test("accepts an enum entry", () => {
  const result = parseEntry({
    kind: "enum",
    name: "core.log.Level",
    values: [{ value: "none" }, { value: "error" }, { value: "warning" }],
  });

  expect(result.success).toBe(true);
});

test("accepts a class with inheritance and a method", () => {
  const result = parseEntry({
    kind: "class",
    name: "PlayerRef",
    extends: "ObjectRef",
    methods: [
      {
        kind: "method",
        name: "set_fov",
        summary: "Sets the player's field of view.",
        params: [{ name: "fov", type: "number" }],
        envs: ["server-main", "client"],
      },
    ],
  });

  expect(result.success).toBe(true);
});

test("validates a whole API model and defaults its version", () => {
  const result = parseApiModel({
    entries: [
      { kind: "function", name: "core.log", summary: "Logs text." },
    ],
  });

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.version).toBe("0");
    expect(result.data.entries).toHaveLength(1);
  }
});

test("exports a JSON Schema for editor tooling", () => {
  const schema = toJsonSchema();
  expect(typeof schema).toBe("object");
  expect(schema).not.toBeNull();
});
