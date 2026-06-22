import { TypeExprError } from "./errors.js";
import { tokenize, Token, TokenType } from "./lexer.js";
import { TypeNode } from "./ast.js";

/**
 * Recursive-descent parser for the type-expression mini-language.
 *
 * Precedence, lowest to highest:
 *   exclude  ->  union (`|`)  ->  postfix (`?` `[]` `...`)  ->  primary
 *
 * `primary` is a parenthesised group `( )`, a brace tuple/mapping `{ }`,
 * a string literal, or a dotted reference.
 */
class Parser {
  private pos = 0;

  constructor(private readonly tokens: Token[]) {}

  private peek(): Token {
    return this.tokens[this.pos];
  }

  private next(): Token {
    return this.tokens[this.pos++];
  }

  private expect(type: TokenType, what: string): Token {
    const token = this.peek();
    if (token.type !== type) {
      throw new TypeExprError(`Expected ${what}, found ${describe(token)}`, token.start);
    }
    return this.next();
  }

  parse(): TypeNode {
    const node = this.parseExclude();
    const token = this.peek();
    if (token.type !== "eof") {
      throw new TypeExprError(`Unexpected trailing input ${describe(token)}`, token.start);
    }
    return node;
  }

  private parseExclude(): TypeNode {
    let base = this.parseUnion();
    while (this.peek().type === "ident" && this.peek().value === "exclude") {
      this.next(); // consume `exclude`
      const excluded = this.parseUnion();
      base = { kind: "exclude", base, excluded, span: spanOf(base, excluded) };
    }
    return base;
  }

  private parseUnion(): TypeNode {
    const members = [this.parsePostfix()];
    while (this.peek().type === "pipe") {
      this.next();
      members.push(this.parsePostfix());
    }
    if (members.length === 1) return members[0];
    return { kind: "union", members, span: spanOf(members[0], members[members.length - 1]) };
  }

  private parsePostfix(): TypeNode {
    let node = this.parsePrimary();
    loop: while (true) {
      const token = this.peek();
      switch (token.type) {
        case "question":
          this.next();
          node = { kind: "optional", inner: node, span: { start: node.span.start, end: token.end } };
          break;
        case "listSuffix":
          this.next();
          node = { kind: "list", element: node, span: { start: node.span.start, end: token.end } };
          break;
        case "ellipsis":
          // `...` is terminal: nothing may follow it (e.g. `A...?` is illegal).
          this.next();
          node = { kind: "rest", inner: node, span: { start: node.span.start, end: token.end } };
          break loop;
        default:
          break loop;
      }
    }
    return node;
  }

  private parsePrimary(): TypeNode {
    const token = this.peek();
    switch (token.type) {
      case "lparen":
        return this.parseGroup();
      case "lbrace":
        return this.parseBrace();
      case "string":
        this.next();
        return { kind: "literal", value: token.value, span: { start: token.start, end: token.end } };
      case "ident":
        if (token.value === "exclude") {
          throw new TypeExprError("Unexpected 'exclude' operator without a left-hand type", token.start);
        }
        return this.parseRef();
      default:
        throw new TypeExprError(`Expected a type, found ${describe(token)}`, token.start);
    }
  }

  /** A dotted path, e.g. `core.after.F.@args`. */
  private parseRef(): TypeNode {
    const first = this.expect("ident", "a type name");
    let name = first.value;
    let end = first.end;
    while (this.peek().type === "dot") {
      this.next();
      let segment: Token;
      if (this.peek().type === "at") {
        const at = this.next();
        const ident = this.expect("ident", "an identifier after '@'");
        segment = { type: "ident", value: `@${ident.value}`, start: at.start, end: ident.end };
      } else {
        segment = this.expect("ident", "an identifier after '.'");
      }
      name += `.${segment.value}`;
      end = segment.end;
    }
    return { kind: "ref", name, span: { start: first.start, end } };
  }

  /** `( )` variadic group, e.g. `(string, number...)`. */
  private parseGroup(): TypeNode {
    const open = this.expect("lparen", "'('");
    const elements = this.parseElements("rparen");
    const close = this.expect("rparen", "')'");
    return { kind: "group", elements, span: { start: open.start, end: close.end } };
  }

  /** `{ }` tuple `{a, b}` or mapping `{K: V}`. */
  private parseBrace(): TypeNode {
    const open = this.expect("lbrace", "'{'");
    if (this.peek().type === "rbrace") {
      const close = this.next();
      return { kind: "tuple", elements: [], span: { start: open.start, end: close.end } };
    }

    const first = this.parseExclude();
    if (this.peek().type === "colon") {
      this.next();
      const value = this.parseExclude();
      const close = this.expect("rbrace", "'}'");
      return { kind: "mapping", key: first, value, span: { start: open.start, end: close.end } };
    }

    const elements = [first];
    while (this.peek().type === "comma") {
      this.next();
      elements.push(this.parseExclude());
    }
    const close = this.expect("rbrace", "'}'");
    return { kind: "tuple", elements, span: { start: open.start, end: close.end } };
  }

  /** A comma-separated list of types, terminated by `closer` (not consumed). */
  private parseElements(closer: TokenType): TypeNode[] {
    if (this.peek().type === closer) return [];
    const elements = [this.parseExclude()];
    while (this.peek().type === "comma") {
      this.next();
      elements.push(this.parseExclude());
    }
    return elements;
  }
}

const spanOf = (a: TypeNode, b: TypeNode) => ({ start: a.span.start, end: b.span.end });

const describe = (token: Token): string =>
  token.type === "eof" ? "end of input" : `'${token.value}'`;

/** Parse a type-expression string into a {@link TypeNode}, or throw {@link TypeExprError}. */
export const parseType = (input: string): TypeNode => {
  const tokens = tokenize(input);
  if (tokens[0].type === "eof") {
    throw new TypeExprError("Empty type expression", 0);
  }
  return new Parser(tokens).parse();
};
