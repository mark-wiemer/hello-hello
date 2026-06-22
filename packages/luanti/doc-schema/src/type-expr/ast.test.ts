import { expect, test } from "@/types.js";
import { formatType, KNOWN_PRIMITIVES, parseType, TypeNode } from "./index.js";

test("parses a union into the expected structure", () => {
  const node = parseType("string | number | boolean");
  expect(node.kind).toBe("union");
  if (node.kind === "union") {
    expect(node.members.map((m) => m.kind)).toEqual(["ref", "ref", "ref"]);
    expect(node.members.map((m) => (m.kind === "ref" ? m.name : null))).toEqual([
      "string",
      "number",
      "boolean",
    ]);
  }
});

test("nests suffixes in application order", () => {
  // `string?[]` is a list of optionals: list(optional(string)).
  const node = parseType("string?[]");
  expect(node.kind).toBe("list");
  if (node.kind === "list") {
    expect(node.element.kind).toBe("optional");
  }

  // `string[]?` is an optional list: optional(list(string)).
  const swapped = parseType("string[]?");
  expect(swapped.kind).toBe("optional");
  if (swapped.kind === "optional") {
    expect(swapped.inner.kind).toBe("list");
  }
});

const shapes: Array<[input: string, kind: TypeNode["kind"]]> = [
  ["string", "ref"],
  [`"x"`, "literal"],
  ["a | b", "union"],
  ["a exclude b", "exclude"],
  ["a?", "optional"],
  ["a[]", "list"],
  ["a...", "rest"],
  ["(a, b)", "group"],
  ["{a, b}", "tuple"],
  ["{a: b}", "mapping"],
];

test.each(shapes)("parses %s as a %s node", (input, kind) => {
  expect(parseType(input).kind).toBe(kind);
});

test("preserves dotted reference names including @ segments", () => {
  const node = parseType("core.after.F.@args");
  expect(node).toMatchObject({ kind: "ref", name: "core.after.F.@args" });
});

test("captures literal values without quotes", () => {
  const node = parseType(`"verbose"`);
  expect(node).toMatchObject({ kind: "literal", value: "verbose" });
});

test("exclude binds looser than union", () => {
  const node = parseType("a | b exclude c");
  expect(node.kind).toBe("exclude");
  if (node.kind === "exclude") {
    expect(node.base.kind).toBe("union");
    expect(node.excluded.kind).toBe("ref");
  }
});

test("formatType round-trips a constructed node", () => {
  const span = { start: 0, end: 0 };
  const node: TypeNode = {
    kind: "optional",
    span,
    inner: {
      kind: "list",
      span,
      element: { kind: "ref", name: "MapNode", span },
    },
  };
  expect(formatType(node)).toBe("MapNode[]?");
});

test("KNOWN_PRIMITIVES contains the documented Lua primitives", () => {
  for (const primitive of ["any", "never", "nil", "boolean", "number", "integer", "string", "table", "function"]) {
    expect(KNOWN_PRIMITIVES.has(primitive)).toBe(true);
  }
  expect(KNOWN_PRIMITIVES.has("Vector")).toBe(false);
});
