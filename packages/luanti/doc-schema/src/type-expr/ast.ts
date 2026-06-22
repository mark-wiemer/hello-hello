/**
 * Abstract syntax tree for the Luanti type-expression mini-language.
 *
 * This intentionally implements a useful subset of the type algebra sketched in
 * `notes/misc-notes.md`: references, string literals, unions, `exclude`,
 * optional (`?`), list (`[]`) and rest (`...`) suffixes, varg groups (`( )`)
 * and brace tuples / mappings (`{ }`). Generics, structural intersections and
 * value constraints are deliberately out of scope for this first pass.
 */

/** Half-open offset range `[start, end)` into the source string. */
export interface Span {
  start: number;
  end: number;
}

/** Primitive type names recognised by Luanti's docs (still parsed as `ref`s). */
export const KNOWN_PRIMITIVES = new Set([
  "any",
  "never",
  "nil",
  "boolean",
  "number",
  "integer",
  "string",
  "table",
  "function",
]);

/** A named type or dotted reference, e.g. `MapNode` or `core.after.F.@args`. */
export interface RefNode {
  kind: "ref";
  name: string;
  span: Span;
}

/** A string-literal type, e.g. an enum member like `"warning"`. */
export interface LiteralNode {
  kind: "literal";
  value: string;
  span: Span;
}

/** `A | B | C` */
export interface UnionNode {
  kind: "union";
  members: TypeNode[];
  span: Span;
}

/** `A exclude B` */
export interface ExcludeNode {
  kind: "exclude";
  base: TypeNode;
  excluded: TypeNode;
  span: Span;
}

/** `A?` — sugar for `A | nil`. */
export interface OptionalNode {
  kind: "optional";
  inner: TypeNode;
  span: Span;
}

/** `A[]` */
export interface ListNode {
  kind: "list";
  element: TypeNode;
  span: Span;
}

/** `A...` — a variadic "rest" element, only meaningful inside groups/tuples. */
export interface RestNode {
  kind: "rest";
  inner: TypeNode;
  span: Span;
}

/** `(A, B, C)` — a variadic expression / argument or return list. */
export interface GroupNode {
  kind: "group";
  elements: TypeNode[];
  span: Span;
}

/** `{A, B, C}` — a positional tuple table. */
export interface TupleNode {
  kind: "tuple";
  elements: TypeNode[];
  span: Span;
}

/** `{K: V}` — a mapping table. */
export interface MappingNode {
  kind: "mapping";
  key: TypeNode;
  value: TypeNode;
  span: Span;
}

export type TypeNode =
  | RefNode
  | LiteralNode
  | UnionNode
  | ExcludeNode
  | OptionalNode
  | ListNode
  | RestNode
  | GroupNode
  | TupleNode
  | MappingNode;

/**
 * Render a {@link TypeNode} back to a canonical, normalised string. Useful for
 * round-trip tests and for emitters that need a stable textual form.
 */
export const formatType = (node: TypeNode): string => {
  switch (node.kind) {
    case "ref":
      return node.name;
    case "literal":
      return `"${node.value}"`;
    case "union":
      return node.members.map(formatType).join(" | ");
    case "exclude":
      return `${formatType(node.base)} exclude ${formatType(node.excluded)}`;
    case "optional":
      return `${formatType(node.inner)}?`;
    case "list":
      return `${formatType(node.element)}[]`;
    case "rest":
      return `${formatType(node.inner)}...`;
    case "group":
      return `(${node.elements.map(formatType).join(", ")})`;
    case "tuple":
      return `{${node.elements.map(formatType).join(", ")}}`;
    case "mapping":
      return `{${formatType(node.key)}: ${formatType(node.value)}}`;
  }
};
