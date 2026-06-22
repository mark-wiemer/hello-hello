import { TypeExprError } from "./errors.js";

export type TokenType =
  | "ident"
  | "string"
  | "dot"
  | "at"
  | "pipe"
  | "lparen"
  | "rparen"
  | "lbrace"
  | "rbrace"
  | "comma"
  | "colon"
  | "question"
  | "listSuffix"
  | "ellipsis"
  | "eof";

export interface Token {
  type: TokenType;
  value: string;
  start: number;
  end: number;
}

const isWhitespace = (ch: string): boolean => ch === " " || ch === "\t" || ch === "\n" || ch === "\r";
const isIdentStart = (ch: string): boolean => /[A-Za-z_]/.test(ch);
const isIdentPart = (ch: string): boolean => /[A-Za-z0-9_]/.test(ch);

const SINGLE_CHAR_TOKENS: Record<string, TokenType> = {
  "|": "pipe",
  "(": "lparen",
  ")": "rparen",
  "{": "lbrace",
  "}": "rbrace",
  ",": "comma",
  ":": "colon",
  "?": "question",
  "@": "at",
};

/**
 * Convert a type-expression string into a flat list of tokens, terminated by a
 * single `eof` token. Throws {@link TypeExprError} on any unrecognised input.
 */
export const tokenize = (input: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (isWhitespace(ch)) {
      i++;
      continue;
    }

    // `...` rest marker vs. `.` path separator.
    if (ch === ".") {
      if (input[i + 1] === "." && input[i + 2] === ".") {
        tokens.push({ type: "ellipsis", value: "...", start: i, end: i + 3 });
        i += 3;
      } else {
        tokens.push({ type: "dot", value: ".", start: i, end: i + 1 });
        i += 1;
      }
      continue;
    }

    // `[]` list suffix; a lone `[` is an error.
    if (ch === "[") {
      if (input[i + 1] === "]") {
        tokens.push({ type: "listSuffix", value: "[]", start: i, end: i + 2 });
        i += 2;
        continue;
      }
      throw new TypeExprError("Expected ']' to form a '[]' list suffix", i);
    }

    // String-literal type, e.g. `"warning"`.
    if (ch === '"') {
      const start = i;
      i++; // opening quote
      let value = "";
      while (i < input.length && input[i] !== '"') {
        value += input[i];
        i++;
      }
      if (i >= input.length) {
        throw new TypeExprError("Unterminated string literal", start);
      }
      i++; // closing quote
      tokens.push({ type: "string", value, start, end: i });
      continue;
    }

    const single = SINGLE_CHAR_TOKENS[ch];
    if (single) {
      tokens.push({ type: single, value: ch, start: i, end: i + 1 });
      i += 1;
      continue;
    }

    if (isIdentStart(ch)) {
      const start = i;
      while (i < input.length && isIdentPart(input[i])) i++;
      tokens.push({ type: "ident", value: input.slice(start, i), start, end: i });
      continue;
    }

    throw new TypeExprError(`Unexpected character '${ch}'`, i);
  }

  tokens.push({ type: "eof", value: "", start: input.length, end: input.length });
  return tokens;
};
