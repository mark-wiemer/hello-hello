import { expect, Paragraph, PhrasingContent, remarkParse, Root, test, unified } from "@/types.js";
import {
  descriptionAfter,
  inlineCodeValues,
  parseAnnotations,
  stringifyInline,
  stripQuotes,
} from "./inline.js";

const phrasing = (markdown: string): PhrasingContent[] => {
  const tree = unified().use(remarkParse).parse(markdown) as Root;
  return (tree.children[0] as Paragraph).children;
};

test("collects inline code values in order", () => {
  expect(inlineCodeValues(phrasing("`name` : `type` : a description"))).toEqual(["name", "type"]);
});

test("extracts the description after the type code span", () => {
  expect(descriptionAfter(phrasing("`name` : `type` : a description"), 2)).toBe("a description");
});

test("extracts the description after a single code span", () => {
  expect(descriptionAfter(phrasing("`MapNode` : the resulting node"), 1)).toBe("the resulting node");
});

test("keeps inline code that appears inside a description", () => {
  expect(descriptionAfter(phrasing("`a` : `b` : returns `nil` on failure"), 2)).toBe(
    "returns `nil` on failure",
  );
});

test("returns an empty description when there is none", () => {
  expect(descriptionAfter(phrasing("`a` : `b`"), 2)).toBe("");
});

test("stringifyInline round-trips text and code", () => {
  expect(phrasing("plain `code` text").map(stringifyInline).join("")).toBe("plain `code` text");
});

const quoteCases: Array<[input: string, expected: string]> = [
  [`"none"`, "none"],
  ["none", "none"],
  [`"a`, `"a`],
  [`""`, ""],
];

test.each(quoteCases)("stripQuotes(%s)", (input, expected) => {
  expect(stripQuotes(input)).toBe(expected);
});

test("parseAnnotations reads a plain description with no attributes", () => {
  expect(parseAnnotations(phrasing("`pos` : `Vector` : position to query"), 2)).toEqual({
    description: "position to query",
  });
});

test("parseAnnotations reads default and unit attributes plus description", () => {
  expect(
    parseAnnotations(
      phrasing("`transition_time` : `number`, default `0`, unit `seconds` : transition time"),
      2,
    ),
  ).toEqual({ default: "0", unit: "seconds", description: "transition time" });
});

test("parseAnnotations reads optional and a quoted default with no description", () => {
  expect(
    parseAnnotations(phrasing('`level` : `core.log.Level`, optional, default `"none"`'), 2),
  ).toEqual({ optional: true, default: `"none"` });
});

test("parseAnnotations keeps a quoted empty-string default", () => {
  expect(parseAnnotations(phrasing('`label` : `string?`, default `""` : a label'), 2)).toEqual({
    default: `""`,
    description: "a label",
  });
});

test("parseAnnotations handles the compact colon form", () => {
  expect(parseAnnotations(phrasing("`param1`:`number`:Light"), 2)).toEqual({ description: "Light" });
});

test("parseAnnotations returns empty object when nothing follows the type", () => {
  expect(parseAnnotations(phrasing("`time` : `number`"), 2)).toEqual({});
});
