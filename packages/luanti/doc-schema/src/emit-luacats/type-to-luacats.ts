import { parseType, TypeNode } from "@/type-expr/index.js";

/**
 * Translate a Luanti type expression into a [LuaCATS](https://luals.github.io/wiki/annotations/)
 * type string for consumption by LuaLS.
 *
 * LuaCATS cannot express everything our type algebra can (it has no `exclude`,
 * no positional varg groups), so this is a best-effort lowering: unsupported
 * constructs degrade to the nearest representable LuaCATS type rather than
 * failing. Those lossy cases are called out below.
 */
export const typeToLuaCats = (input: string | TypeNode): string =>
  mapNode(typeof input === "string" ? parseType(input) : input);

const mapNode = (node: TypeNode): string => {
  switch (node.kind) {
    case "ref":
      return node.name;
    case "literal":
      return `"${node.value}"`;
    case "union":
      return node.members.map(mapNode).join("|");
    case "optional":
      return `${mapNode(node.inner)}?`;
    case "list":
      return `${mapNode(node.element)}[]`;
    case "mapping":
      return `table<${mapNode(node.key)}, ${mapNode(node.value)}>`;
    case "tuple":
      return mapTuple(node.elements);
    // Lossy lowerings:
    case "exclude":
      // LuaCATS has no set-difference; keep the base type.
      return mapNode(node.base);
    case "rest":
      // `...` is expressed at the signature level, not in a type position.
      return mapNode(node.inner);
    case "group":
      // A standalone varg group has no LuaCATS equivalent.
      return "any";
  }
};

const mapTuple = (elements: TypeNode[]): string => {
  // LuaCATS has no rest syntax inside a table literal; fall back to `table`.
  if (elements.length === 0 || elements.some((element) => element.kind === "rest")) {
    return "table";
  }
  const fields = elements.map((element, index) => `[${index + 1}]: ${mapNode(element)}`);
  return `{ ${fields.join(", ")} }`;
};
