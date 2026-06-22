import { expect, test } from "@/types.js";
import { formatType, parseType, TypeExprError } from "./index.js";

const roundTrip = (input: string): string => formatType(parseType(input));

const nested: Array<[name: string, input: string, expected: string]> = [
  ["tuple with optional rest group", "{a, (b|c)?...}", "{a, (b | c)?...}"],
  ["doubly nested group", "((A))", "((A))"],
  ["mapping to a list of a union", "{string: (a|b)[]}", "{string: (a | b)[]}"],
  ["group with mapping and rest", "(A, {k: v}, C...)", "(A, {k: v}, C...)"],
  ["tuple with mapping and rest", "{a, {b: c}, d...}", "{a, {b: c}, d...}"],
  ["double list suffix", "a[][]", "a[][]"],
  ["optional then rest", "a?...", "a?..."],
  ["mapping to optional list", "{string: MapNode[]?}", "{string: MapNode[]?}"],
  ["mixed literal and ref union", `"none" | Level | nil`, `"none" | Level | nil`],
  ["empty tuple", "{}", "{}"],
  ["literal with punctuation", `"<color>"`, `"<color>"`],
];

test.each(nested)("parses %s", (_name, input, expected) => {
  expect(roundTrip(input)).toBe(expected);
});

const whitespace: Array<[name: string, input: string, expected: string]> = [
  ["padded union", "  string   |   number  ", "string | number"],
  ["newline-separated union", "a\n|\nb", "a | b"],
  ["spaces inside braces", "{ a , b }", "{a, b}"],
  ["spaces inside group", "( a )", "(a)"],
];

test.each(whitespace)("normalises whitespace in %s", (_name, input, expected) => {
  expect(roundTrip(input)).toBe(expected);
});

const excludes: Array<[name: string, input: string, expected: string]> = [
  ["exclude chain is left-associative", "a exclude b exclude c", "a exclude b exclude c"],
  ["exclude binds looser than union on both sides", "a | b exclude c | d", "a | b exclude c | d"],
  ["postfix binds tighter than exclude", "a? exclude b", "a? exclude b"],
];

test.each(excludes)("handles %s", (_name, input, expected) => {
  expect(roundTrip(input)).toBe(expected);
});

const errors: Array<[name: string, input: string, offset: number, includes: string]> = [
  ["question after rest", "a...?", 4, "Unexpected trailing input"],
  ["unbalanced brace inside group", "(a, {b)", 6, "Expected '}'"],
  ["stray comma in group", "(a,, b)", 3, "Expected a type"],
  ["trailing comma in group", "(a,)", 3, "Expected a type"],
  ["colon at top level", "a : b", 2, "Unexpected trailing input"],
  ["mapping with no value", "{a:}", 3, "Expected a type"],
  ["leading pipe", "|a", 0, "Expected a type"],
  ["trailing pipe", "a|", 2, "Expected a type"],
  ["dangling exclude", "a exclude", 9, "Expected a type"],
];

test.each(errors)("rejects %s", (_name, input, offset, includes) => {
  try {
    parseType(input);
    throw new Error("expected parseType to throw");
  } catch (error) {
    expect(error).toBeInstanceOf(TypeExprError);
    expect((error as TypeExprError).offset).toBe(offset);
    expect((error as TypeExprError).message).toContain(includes);
  }
});

test("spans cover the full extent of compound nodes", () => {
  expect(parseType("a | b").span).toEqual({ start: 0, end: 5 });
  expect(parseType("(a, b)").span).toEqual({ start: 0, end: 6 });
  expect(parseType("a exclude b").span).toEqual({ start: 0, end: 11 });
});

test("nested nodes carry their own spans", () => {
  const mapping = parseType("{string: number}");
  expect(mapping.kind).toBe("mapping");
  if (mapping.kind === "mapping") {
    expect(mapping.key.span).toEqual({ start: 1, end: 7 });
    expect(mapping.value.span).toEqual({ start: 9, end: 15 });
  }
});
