import { expect, test } from "@/types.js";
import { formatType, parseType, TypeExprError } from "./index.js";

/** Parse then re-print, to assert structure via a canonical string form. */
const roundTrip = (input: string): string => formatType(parseType(input));

const valid: Array<[name: string, input: string, expected: string]> = [
  ["primitive", "string", "string"],
  ["dotted reference", "core.get_node.pos", "core.get_node.pos"],
  ["special @args access", "core.after.F.@args", "core.after.F.@args"],
  ["string literal", `"warning"`, `"warning"`],
  ["enum as literal union", `"none" | "error" | "warning"`, `"none" | "error" | "warning"`],
  ["optional suffix", "string?", "string?"],
  ["list suffix", "MapNode[]", "MapNode[]"],
  ["optional then list", "string?[]", "string?[]"],
  ["list then optional", "string[]?", "string[]?"],
  ["union", "string | number | boolean", "string | number | boolean"],
  ["exclude", "any exclude string", "any exclude string"],
  ["exclude binds looser than union", "(A | B | C) exclude B", "(A | B | C) exclude B"],
  ["empty group", "()", "()"],
  ["group", "(string, number)", "(string, number)"],
  ["variadic group", "(string...)", "(string...)"],
  ["tuple", "{a, b, c}", "{a, b, c}"],
  ["tuple with rest", "{a, b, c...}", "{a, b, c...}"],
  ["mapping", "{string: number}", "{string: number}"],
  ["nested list of optional groups", "(A, B, C)?[]", "(A, B, C)?[]"],
];

test.each(valid)("parses %s", (_name, input, expected) => {
  expect(roundTrip(input)).toBe(expected);
});

const invalid: Array<[name: string, input: string, offset: number, messageIncludes: string]> = [
  ["empty input", "", 0, "Empty type expression"],
  ["unbalanced open paren", "(string", 7, "Expected"],
  ["unbalanced open brace", "{a, b", 5, "Expected"],
  ["lone open bracket", "string[", 6, "'[]' list suffix"],
  ["unterminated string", `"warning`, 0, "Unterminated string literal"],
  ["trailing input", "string number", 7, "Unexpected trailing input"],
  ["leading exclude", "exclude string", 0, "Unexpected 'exclude'"],
  ["unexpected character", "string & number", 7, "Unexpected character '&'"],
];

test.each(invalid)("rejects %s", (_name, input, offset, messageIncludes) => {
  try {
    parseType(input);
    throw new Error("expected parseType to throw");
  } catch (error) {
    expect(error).toBeInstanceOf(TypeExprError);
    const typeError = error as TypeExprError;
    expect(typeError.message).toContain(messageIncludes);
    expect(typeError.offset).toBe(offset);
  }
});

test("exposes spans for error mapping", () => {
  const node = parseType("MapNode[]");
  expect(node.span).toEqual({ start: 0, end: 9 });
});
