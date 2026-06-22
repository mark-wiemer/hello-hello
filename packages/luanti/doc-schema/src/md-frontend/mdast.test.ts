import { expect, List, ListItem, remarkParse, Root, test, unified } from "@/types.js";
import { firstInlineCode, itemParagraph } from "./mdast.js";

const firstListItem = (md: string): ListItem => {
  const tree = unified().use(remarkParse).parse(md) as Root;
  return (tree.children[0] as List).children[0];
};

test("itemParagraph returns the first paragraph's phrasing content", () => {
  const children = itemParagraph(firstListItem("- hello `code`"));
  expect(children.map((child) => child.type)).toEqual(["text", "inlineCode"]);
});

test("itemParagraph returns an empty array when the item has no paragraph", () => {
  expect(itemParagraph({ type: "listItem", children: [] } as unknown as ListItem)).toEqual([]);
});

test("firstInlineCode returns the first code span value", () => {
  const children = itemParagraph(firstListItem("- `a` : `b` : description"));
  expect(firstInlineCode(children)).toBe("a");
});

test("firstInlineCode returns undefined when the item leads with text", () => {
  const children = itemParagraph(firstListItem("- plain text with no code"));
  expect(firstInlineCode(children)).toBeUndefined();
});

test("firstInlineCode returns undefined for empty content", () => {
  expect(firstInlineCode([])).toBeUndefined();
});
