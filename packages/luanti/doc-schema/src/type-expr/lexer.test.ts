import { expect, test } from "@/types.js";
import { TypeExprError } from "./errors.js";
import { tokenize, TokenType } from "./lexer.js";

/** Token types excluding the trailing `eof`. */
const kinds = (input: string): TokenType[] => tokenize(input).slice(0, -1).map((t) => t.type);

const sequences: Array<[name: string, input: string, expected: TokenType[]]> = [
  ["single ident", "string", ["ident"]],
  ["dotted path", "core.get_node", ["ident", "dot", "ident"]],
  ["three segments", "a.b.c", ["ident", "dot", "ident", "dot", "ident"]],
  ["special @ access", "core.after.F.@args", ["ident", "dot", "ident", "dot", "ident", "dot", "at", "ident"]],
  ["union", "A | B", ["ident", "pipe", "ident"]],
  ["group", "(a, b)", ["lparen", "ident", "comma", "ident", "rparen"]],
  ["brace mapping", "{x: y}", ["lbrace", "ident", "colon", "ident", "rbrace"]],
  ["optional", "a?", ["ident", "question"]],
  ["list suffix", "a[]", ["ident", "listSuffix"]],
  ["ellipsis", "a...", ["ident", "ellipsis"]],
  ["ellipsis between idents", "a...b", ["ident", "ellipsis", "ident"]],
  ["string literal", `"hi"`, ["string"]],
];

test.each(sequences)("tokenizes %s", (_name, input, expected) => {
  expect(kinds(input)).toEqual(expected);
});

test("always terminates with an eof token", () => {
  const tokens = tokenize("a");
  expect(tokens[tokens.length - 1].type).toBe("eof");
});

test("captures string literal value without quotes", () => {
  const [token] = tokenize(`"warning"`);
  expect(token).toMatchObject({ type: "string", value: "warning", start: 0, end: 9 });
});

test("skips whitespace and records correct offsets", () => {
  const tokens = tokenize("ab  cd");
  expect(tokens[0]).toMatchObject({ value: "ab", start: 0, end: 2 });
  expect(tokens[1]).toMatchObject({ value: "cd", start: 4, end: 6 });
  expect(tokens[2]).toMatchObject({ type: "eof", start: 6, end: 6 });
});

test("treats underscores and digits as ident parts", () => {
  const [token] = tokenize("get_node2");
  expect(token).toMatchObject({ type: "ident", value: "get_node2" });
});

const errors: Array<[name: string, input: string, offset: number, includes: string]> = [
  ["lone open bracket", "a[", 1, "'[]' list suffix"],
  ["bracket at end", "a[ ]", 1, "'[]' list suffix"],
  ["unterminated string", `"x`, 0, "Unterminated string literal"],
  ["unexpected character", "a&b", 1, "Unexpected character '&'"],
  ["unexpected at offset", "ab#", 2, "Unexpected character '#'"],
];

test.each(errors)("rejects %s", (_name, input, offset, includes) => {
  try {
    tokenize(input);
    throw new Error("expected tokenize to throw");
  } catch (error) {
    expect(error).toBeInstanceOf(TypeExprError);
    expect((error as TypeExprError).offset).toBe(offset);
    expect((error as TypeExprError).message).toContain(includes);
  }
});
