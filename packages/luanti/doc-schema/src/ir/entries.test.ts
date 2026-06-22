import { expect, test } from "@/types.js";
import { parseApiModel, parseEntry } from "./index.js";

const environments = [
  "server-load",
  "server-before-mods-loaded",
  "server-main",
  "server-async",
  "server-mapgen",
  "client",
  "all",
  "server",
];

test.each(environments)("accepts environment %s", (env) => {
  const result = parseEntry({
    kind: "function",
    name: "core.x",
    summary: "s",
    envs: [env],
  });
  expect(result.success).toBe(true);
});

test("preserves all optional param attributes", () => {
  const result = parseEntry({
    kind: "function",
    name: "player.set_fov",
    summary: "Sets FOV.",
    params: [
      {
        name: "transition_time",
        type: "number",
        optional: true,
        default: "0",
        unit: "seconds",
        description: "transition time",
      },
    ],
  });

  expect(result.success).toBe(true);
  if (result.success && result.data.kind === "function") {
    expect(result.data.params[0]).toEqual({
      name: "transition_time",
      type: "number",
      optional: true,
      default: "0",
      unit: "seconds",
      description: "transition time",
    });
  }
});

test("allows an unnamed return value", () => {
  const result = parseEntry({
    kind: "function",
    name: "core.is_yes",
    summary: "Parses a boolean-ish value.",
    returns: [{ type: "boolean" }],
  });
  expect(result.success).toBe(true);
});

test("accepts a struct entry with fields and defaults", () => {
  const result = parseEntry({
    kind: "struct",
    name: "ABMDefinition",
    fields: [
      { name: "label", type: "string?", default: '""', description: "profiling label" },
      { name: "nodenames", type: "string[]", description: "nodes to act on" },
    ],
  });
  expect(result.success).toBe(true);
});

test("accepts a top-level method entry", () => {
  const result = parseEntry({
    kind: "method",
    name: "is_valid",
    summary: "Returns whether the object is valid.",
    returns: [{ name: "validity", type: "boolean" }],
  });
  expect(result.success).toBe(true);
});

test("rejects an enum with no values", () => {
  const result = parseEntry({ kind: "enum", name: "Empty", values: [] });
  expect(result.success).toBe(false);
});

test("rejects an empty entry name", () => {
  const result = parseEntry({ kind: "function", name: "", summary: "s" });
  expect(result.success).toBe(false);
});

test("rejects an unknown entry kind", () => {
  const result = parseEntry({ kind: "namespace", name: "core" });
  expect(result.success).toBe(false);
});

test("rejects an entry with no kind", () => {
  const result = parseEntry({ name: "core.x", summary: "s" });
  expect(result.success).toBe(false);
});

test("rejects a malformed type expression in a nested class method", () => {
  const result = parseEntry({
    kind: "class",
    name: "PlayerRef",
    methods: [
      {
        kind: "method",
        name: "set_fov",
        summary: "Sets FOV.",
        params: [{ name: "fov", type: "number |" }],
      },
    ],
  });

  expect(result.success).toBe(false);
  if (!result.success) {
    const messages = result.error.issues.map((i) => i.message).join("\n");
    expect(messages).toContain("Invalid type expression");
  }
});

test("rejects a malformed type expression in a struct field", () => {
  const result = parseEntry({
    kind: "struct",
    name: "Broken",
    fields: [{ name: "bad", type: "{a:" }],
  });
  expect(result.success).toBe(false);
});

test("keeps a custom API model version and validates mixed entries", () => {
  const result = parseApiModel({
    version: "1.2.3",
    entries: [
      { kind: "function", name: "core.log", summary: "Logs." },
      { kind: "class", name: "ObjectRef" },
      { kind: "enum", name: "Level", values: [{ value: "none" }] },
      { kind: "struct", name: "MapNode", fields: [{ name: "name", type: "string" }] },
    ],
  });

  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.version).toBe("1.2.3");
    expect(result.data.entries).toHaveLength(4);
  }
});

test("an empty API model defaults version and entries", () => {
  const result = parseApiModel({});
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.version).toBe("0");
    expect(result.data.entries).toEqual([]);
  }
});
