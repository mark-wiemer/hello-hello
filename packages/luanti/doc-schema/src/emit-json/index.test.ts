import { expect, test } from "@/types.js";
import { parseApiModel } from "@/ir/index.js";
import { emitJson, toStableJson } from "./index.js";

test("sorts object keys recursively", () => {
  expect(toStableJson({ b: 1, a: { d: 2, c: 3 } })).toBe(
    ["{", `  "a": {`, `    "c": 3,`, `    "d": 2`, "  },", `  "b": 1`, "}", ""].join("\n"),
  );
});

test("preserves array order", () => {
  expect(toStableJson([3, 1, 2])).toBe("[\n  3,\n  1,\n  2\n]\n");
});

test("ends with a single trailing newline", () => {
  expect(toStableJson({ a: 1 }).endsWith("}\n")).toBe(true);
});

test("emits a validated model and round-trips to an equivalent object", () => {
  const parsed = parseApiModel({
    entries: [{ kind: "function", name: "core.log", summary: "Logs text." }],
  });
  if (!parsed.success) throw new Error("invalid model fixture");

  const json = emitJson(parsed.data);
  const reread = JSON.parse(json);
  expect(reread.entries[0]).toMatchObject({ kind: "function", name: "core.log" });
});

test("sorts keys of objects nested inside arrays", () => {
  expect(toStableJson([{ b: 1, a: 2 }])).toBe(
    ["[", "  {", `    "a": 2,`, `    "b": 1`, "  }", "]", ""].join("\n"),
  );
});

test("is independent of input key insertion order", () => {
  expect(toStableJson({ a: 1, b: { c: 3, d: 4 } })).toBe(toStableJson({ b: { d: 4, c: 3 }, a: 1 }));
});

test("is byte-identical across repeated calls on a validated model", () => {
  const parsed = parseApiModel({
    entries: [
      { kind: "enum", name: "Level", values: [{ value: "none" }, { value: "error" }] },
      { kind: "function", name: "core.log", summary: "Logs." },
    ],
  });
  if (!parsed.success) throw new Error("invalid model fixture");
  expect(emitJson(parsed.data)).toBe(emitJson(parsed.data));
});
