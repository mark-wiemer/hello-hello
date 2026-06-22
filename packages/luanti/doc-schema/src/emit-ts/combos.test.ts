import { expect, test } from "@/types.js";
import { parseEntry } from "@/ir/index.js";
import { emitEntry } from "./index.js";

const emit = (raw: unknown): string => {
  const result = parseEntry(raw);
  if (!result.success) throw new Error(`invalid fixture: ${result.error.message}`);
  return emitEntry(result.data);
};

test("parenthesises optional-then-list and flattens list-then-optional", () => {
  const out = emit({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [
      { name: "a", type: "string?[]" },
      { name: "b", type: "string[]?" },
    ],
  });
  expect(out).toContain("a: (string | null)[]");
  expect(out).toContain("b: string[] | null");
});

test("emits multiple returns as a labelled tuple", () => {
  const out = emit({
    kind: "function",
    name: "core.get_mapgen_object",
    summary: "s",
    returns: [
      { name: "vm", type: "VoxelManip" },
      { name: "emin", type: "Vector" },
    ],
  });
  expect(out).toContain("): [vm: VoxelManip, emin: Vector];");
});

test("lowers a nested mapping field type to Record", () => {
  const out = emit({
    kind: "struct",
    name: "S",
    fields: [{ name: "lookup", type: "{string: MapNode[]?}" }],
  });
  expect(out).toContain("lookup: Record<string, MapNode[] | null>;");
});

test("lowers a tuple-with-rest param type", () => {
  const out = emit({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "t", type: "{a, b, c...}" }],
  });
  expect(out).toContain("t: [a, b, ...c[]]");
});

test("drops the excluded side of an exclude type", () => {
  const out = emit({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "v", type: "any exclude string" }],
  });
  expect(out).toContain("v: any");
});

test("emits a class interface with both a field and a method", () => {
  const out = emit({
    kind: "class",
    name: "Thing",
    fields: [{ name: "id", type: "integer" }],
    methods: [{ kind: "method", name: "label", summary: "s", returns: [{ type: "string" }] }],
  });
  expect(out).toContain("export interface Thing {");
  expect(out).toContain("  id: number;");
  expect(out).toContain("  label(): string;");
});

test("emits a single-value enum as a string-literal type", () => {
  const out = emit({ kind: "enum", name: "E", values: [{ value: "only" }] });
  expect(out).toContain(`export type E = "only";`);
});

test("renders a multi-line JSDoc with special characters", () => {
  const out = emit({
    kind: "function",
    name: "core.x",
    summary: "Use `core.y` and @foo.\nSecond line.",
  });
  expect(out).toContain(" * core.x — Use `core.y` and @foo.");
  expect(out).toContain(" * Second line.");
});

test("a function with no params and no returns is void with empty params", () => {
  const out = emit({ kind: "function", name: "core.get_us_time", summary: "Microsecond time." });
  expect(out).toContain("export declare function core_get_us_time(): void;");
});

test("marks an optional param with a trailing question mark", () => {
  const out = emit({
    kind: "function",
    name: "core.x",
    summary: "s",
    params: [{ name: "o", type: "number", optional: true }],
  });
  expect(out).toContain("core_x(o?: number)");
});
