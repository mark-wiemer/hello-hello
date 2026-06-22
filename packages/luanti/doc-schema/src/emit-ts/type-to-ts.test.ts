import { expect, test } from "@/types.js";
import { typeToTs } from "./type-to-ts.js";

const cases: Array<[name: string, input: string, expected: string]> = [
  ["number", "number", "number"],
  ["integer collapses to number", "integer", "number"],
  ["string", "string", "string"],
  ["boolean", "boolean", "boolean"],
  ["nil maps to null", "nil", "null"],
  ["table maps to object", "table", "object"],
  ["function maps to Function", "function", "Function"],
  ["any", "any", "any"],
  ["never", "never", "never"],
  ["named ref passes through", "Vector", "Vector"],
  ["string literal", `"warning"`, `"warning"`],
  ["optional becomes union with null", "string?", "string | null"],
  ["list", "MapNode[]", "MapNode[]"],
  ["list of primitives", "integer[]", "number[]"],
  ["optional then list parenthesises", "string?[]", "(string | null)[]"],
  ["list then optional", "string[]?", "string[] | null"],
  ["union", "string | number", "string | number"],
  ["literal union", `"a" | "b"`, `"a" | "b"`],
  ["mapping with string key", "{string: number}", "Record<string, number>"],
  ["mapping with number key", "{number: MapNode}", "Record<number, MapNode>"],
  ["mapping with non-index key falls back to string", "{Vector: number}", "Record<string, number>"],
  ["tuple", "{a, b, c}", "[a, b, c]"],
  ["tuple with rest", "{a, b, c...}", "[a, b, ...c[]]"],
  ["empty group", "()", "[]"],
  ["group", "(string, number)", "[string, number]"],
  ["variadic group", "(string...)", "[...string[]]"],
  ["optional group", "(A, B, C)?", "[A, B, C] | null"],
  ["exclude keeps base", "any exclude string", "any"],
  ["dotted @ accessor falls back to any", "core.after.F.@args", "any"],
];

test.each(cases)("maps %s", (_name, input, expected) => {
  expect(typeToTs(input)).toBe(expected);
});
