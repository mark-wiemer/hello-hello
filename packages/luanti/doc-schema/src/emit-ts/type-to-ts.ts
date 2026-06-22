import { parseType, TypeNode } from "@/type-expr/index.js";

/**
 * Translate a Luanti type expression into a TypeScript type string.
 *
 * Like the LuaCATS lowering, this is best-effort: constructs TypeScript can't
 * express (set difference) degrade to the nearest representable type. Lua `nil`
 * maps to `null`; `integer` collapses to `number`; mappings become `Record<…>`
 * (with a string-key fallback when the key isn't `string`/`number`); varg groups
 * and tuples become tuple types.
 */
export const typeToTs = (input: string | TypeNode): string =>
  mapNode(typeof input === "string" ? parseType(input) : input);

const PRIMITIVES: Record<string, string> = {
  number: "number",
  integer: "number",
  string: "string",
  boolean: "boolean",
  nil: "null",
  table: "object",
  function: "Function",
  any: "any",
  never: "never",
};

const needsParens = (node: TypeNode): boolean =>
  node.kind === "optional" || node.kind === "union" || node.kind === "exclude";

/** Map a node, wrapping in parentheses when a suffix (`[]`) would otherwise mis-bind. */
const atom = (node: TypeNode): string =>
  needsParens(node) ? `(${mapNode(node)})` : mapNode(node);

const mapElements = (elements: TypeNode[]): string =>
  elements
    .map((element) =>
      element.kind === "rest" ? `...${atom(element.inner)}[]` : mapNode(element),
    )
    .join(", ");

const mapNode = (node: TypeNode): string => {
  switch (node.kind) {
    case "ref":
      if (node.name in PRIMITIVES) return PRIMITIVES[node.name];
      // Dotted `@` accessors (e.g. `core.after.F.@args`) have no TS form.
      return node.name.includes("@") ? "any" : node.name;
    case "literal":
      return `"${node.value}"`;
    case "union":
      return node.members.map(mapNode).join(" | ");
    case "optional":
      return `${mapNode(node.inner)} | null`;
    case "list":
      return `${atom(node.element)}[]`;
    case "tuple":
    case "group":
      return `[${mapElements(node.elements)}]`;
    case "mapping": {
      const key = mapNode(node.key);
      const value = mapNode(node.value);
      const tsKey = key === "string" || key === "number" ? key : "string";
      return `Record<${tsKey}, ${value}>`;
    }
    // Lossy lowerings:
    case "exclude":
      return mapNode(node.base);
    case "rest":
      return `${atom(node.inner)}[]`;
  }
};
