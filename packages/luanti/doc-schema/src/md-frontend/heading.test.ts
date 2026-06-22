import { expect, Heading, remarkParse, Root, test, unified } from "@/types.js";
import { readEntryHeading } from "./heading.js";

const heading = (markdown: string): Heading =>
  (unified().use(remarkParse).parse(markdown) as Root).children[0] as Heading;

test("reads a function heading with a keyword", () => {
  expect(readEntryHeading(heading("#### Function `core.get_node(pos)`"))).toEqual({
    kind: "function",
    name: "core.get_node",
    rawSignature: "core.get_node(pos)",
  });
});

const keywordCases: Array<[name: string, markdown: string, kind: string, symbol: string]> = [
  ["method", "##### Method `set_fov(fov)`", "method", "set_fov"],
  ["enumeration", "### Enumeration `Level`", "enum", "Level"],
  ["struct", "#### Struct `MapNode`", "struct", "MapNode"],
  ["class", "#### Class `PlayerRef`", "class", "PlayerRef"],
];

test.each(keywordCases)("reads a %s heading", (_name, markdown, kind, symbol) => {
  expect(readEntryHeading(heading(markdown))).toMatchObject({ kind, name: symbol });
});

test("treats a bare code heading with parens as a function", () => {
  expect(readEntryHeading(heading("#### `core.after(time, func)`"))).toMatchObject({
    kind: "function",
    name: "core.after",
  });
});

test("ignores a prose heading with no code span", () => {
  expect(readEntryHeading(heading("## Introduction"))).toBeNull();
});

test("ignores a heading whose keyword is unrecognised", () => {
  expect(readEntryHeading(heading("### Notes about `core`"))).toBeNull();
});
