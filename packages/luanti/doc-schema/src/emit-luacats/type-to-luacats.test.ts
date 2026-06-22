import { expect, test } from "@/types.js";
import { typeToLuaCats } from "./type-to-luacats.js";

const cases: Array<[name: string, input: string, expected: string]> = [
  ["primitive", "string", "string"],
  ["named ref", "Vector", "Vector"],
  ["integer", "integer", "integer"],
  ["string literal", `"warning"`, `"warning"`],
  ["optional", "string?", "string?"],
  ["list", "MapNode[]", "MapNode[]"],
  ["optional then list", "string?[]", "string?[]"],
  ["list then optional", "string[]?", "string[]?"],
  ["union", "string | number", "string|number"],
  ["literal union", `"a" | "b" | "c"`, `"a"|"b"|"c"`],
  ["mapping", "{string: number}", "table<string, number>"],
  ["mapping of refs", "{number: MapNode}", "table<number, MapNode>"],
  ["tuple", "{a, b, c}", "{ [1]: a, [2]: b, [3]: c }"],
  ["nested tuple/mapping", "{a, {b: c}}", "{ [1]: a, [2]: table<b, c> }"],
  // Lossy lowerings: these degrade rather than fail.
  ["tuple with rest falls back to table", "{a, b, c...}", "table"],
  ["empty tuple falls back to table", "{}", "table"],
  ["exclude keeps base", "any exclude string", "any"],
  ["group falls back to any", "(string, number)", "any"],
  ["variadic group falls back to any", "(string...)", "any"],
  ["optional group", "(A, B, C)?", "any?"],
];

test.each(cases)("maps %s", (_name, input, expected) => {
  expect(typeToLuaCats(input)).toBe(expected);
});

test("accepts a pre-parsed node as well as a string", () => {
  expect(typeToLuaCats("string")).toBe("string");
});
