import { expect, test } from "@/types.js";
import { parseEntry } from "@/ir/index.js";
import { emitEntry } from "./index.js";

const emit = (raw: unknown): string => {
  const result = parseEntry(raw);
  if (!result.success) throw new Error(`invalid fixture: ${result.error.message}`);
  return emitEntry(result.data);
};

test("lowers optional+list type combos in params", () => {
  const out = emit({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [
      { name: "a", type: "string?[]" },
      { name: "b", type: "string[]?" },
    ],
  });
  expect(out).toContain("---@param a string?[]");
  expect(out).toContain("---@param b string[]?");
});

test("emits one @return line per return value", () => {
  const out = emit({
    kind: "function",
    name: "core.get_mapgen_object",
    summary: "s",
    returns: [
      { name: "vm", type: "VoxelManip" },
      { name: "emin", type: "Vector" },
    ],
  });
  expect(out).toContain("---@return VoxelManip vm");
  expect(out).toContain("---@return Vector emin");
});

test("lowers a nested mapping param type", () => {
  const out = emit({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "m", type: "{string: MapNode[]?}" }],
  });
  expect(out).toContain("---@param m table<string, MapNode[]?>");
});

test("lowers a tuple param type to indexed fields", () => {
  const out = emit({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "t", type: "{a, b}" }],
  });
  expect(out).toContain("---@param t { [1]: a, [2]: b }");
});

test("drops the excluded side of an exclude type", () => {
  const out = emit({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "v", type: "any exclude string" }],
  });
  expect(out).toContain("---@param v any");
});

test("marks an optional param carrying a list type", () => {
  const out = emit({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "flags", type: "string[]", optional: true }],
  });
  expect(out).toContain("---@param flags? string[]");
});

test("lowers a method whose return is a mapping", () => {
  const out = emit({
    kind: "class",
    name: "MetaRef",
    methods: [
      { kind: "method", name: "to_table", summary: "s", returns: [{ type: "{string: string}" }] },
    ],
  });
  expect(out).toContain("function MetaRef:to_table() end");
  expect(out).toContain("---@return table<string, string>");
});

test("emits a single-value enum alias", () => {
  const out = emit({ kind: "enum", name: "E", values: [{ value: "only" }] });
  expect(out).toBe(`---@alias E "only"`);
});

test("renders a multi-line description with special characters", () => {
  const out = emit({
    kind: "function",
    name: "core.x",
    summary: "Use `core.y` and @foo.\nSecond line.",
  });
  expect(out).toContain("--- Use `core.y` and @foo.");
  expect(out).toContain("--- Second line.");
});

test("a function with no params and no returns emits a bare signature", () => {
  const out = emit({ kind: "function", name: "core.get_us_time", summary: "Microsecond time." });
  expect(out).toContain("function core.get_us_time() end");
  expect(out).not.toContain("---@param");
  expect(out).not.toContain("---@return");
});
