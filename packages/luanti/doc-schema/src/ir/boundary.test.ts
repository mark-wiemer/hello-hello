import { expect, test } from "@/types.js";
import { parseApiModel, parseEntry } from "./index.js";

test("keeps explicitly-empty callable arrays", () => {
  const result = parseEntry({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [],
    returns: [],
    envs: [],
  });
  expect(result.success).toBe(true);
  if (result.success && result.data.kind === "function") {
    expect(result.data).toMatchObject({ params: [], returns: [], envs: [] });
  }
});

test("strips unknown top-level keys rather than rejecting", () => {
  const result = parseEntry({ kind: "function", name: "core.x", summary: "s", bogus: 123 });
  expect(result.success).toBe(true);
  if (result.success) expect(result.data).not.toHaveProperty("bogus");
});

test("strips unknown keys nested inside a param", () => {
  const result = parseEntry({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "a", type: "number", bogus: 1 }],
  });
  expect(result.success).toBe(true);
  if (result.success && result.data.kind === "function") {
    expect(result.data.params[0]).not.toHaveProperty("bogus");
  }
});

test("preserves duplicate environment values (no de-duplication)", () => {
  const result = parseEntry({
    kind: "function",
    name: "core.x",
    summary: "s",
    envs: ["server-main", "server-main"],
  });
  expect(result.success).toBe(true);
  if (result.success && result.data.kind === "function") {
    expect(result.data.envs).toEqual(["server-main", "server-main"]);
  }
});

test("accepts a string default but rejects a numeric default", () => {
  const ok = parseEntry({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "a", type: "number", default: "0" }],
  });
  expect(ok.success).toBe(true);
  if (ok.success && ok.data.kind === "function") expect(ok.data.params[0].default).toBe("0");

  const bad = parseEntry({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "a", type: "number", default: 0 }],
  });
  expect(bad.success).toBe(false);
});

test("allows the optional flag to coexist with a nilable type", () => {
  const result = parseEntry({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "a", type: "string?", optional: true }],
  });
  expect(result.success).toBe(true);
  if (result.success && result.data.kind === "function") {
    expect(result.data.params[0]).toMatchObject({ optional: true, type: "string?" });
  }
});

test("validates a very long union type expression", () => {
  const union = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)).join(" | ");
  const result = parseEntry({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "x", type: union }],
  });
  expect(result.success).toBe(true);
});

test("validates complex type expressions in returns and fields", () => {
  const returns = parseEntry({
    kind: "function",
    name: "core.get_mapgen_object",
    summary: "s",
    returns: [{ type: "(VoxelManip, Vector, Vector)" }],
  });
  expect(returns.success).toBe(true);

  const fields = parseEntry({
    kind: "struct",
    name: "S",
    fields: [{ name: "lookup", type: "{string: MapNode[]?}" }],
  });
  expect(fields.success).toBe(true);
});

test("validates type expressions inside a nested class method", () => {
  const result = parseEntry({
    kind: "class",
    name: "C",
    methods: [
      {
        kind: "method",
        name: "m",
        summary: "s",
        params: [{ name: "p", type: "MapNode[]?" }],
        returns: [{ name: "r", type: "(A, B)" }],
      },
    ],
  });
  expect(result.success).toBe(true);
});

test("accepts a struct field with a default but no description", () => {
  const result = parseEntry({
    kind: "struct",
    name: "ABMDefinition",
    fields: [{ name: "label", type: "string?", default: `""` }],
  });
  expect(result.success).toBe(true);
  if (result.success && result.data.kind === "struct") {
    expect(result.data.fields[0]).toMatchObject({ default: `""` });
    expect(result.data.fields[0]).not.toHaveProperty("description");
  }
});

test("accepts an enum with exactly one value", () => {
  expect(parseEntry({ kind: "enum", name: "E", values: [{ value: "only" }] }).success).toBe(true);
});

test("requires the API model version to be a string", () => {
  expect(parseApiModel({ version: 5, entries: [] }).success).toBe(false);

  const ok = parseApiModel({ version: "2", entries: [] });
  expect(ok.success).toBe(true);
  if (ok.success) expect(ok.data.version).toBe("2");
});
