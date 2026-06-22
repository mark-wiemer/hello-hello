import { InlineCode, ListItem, Paragraph, PhrasingContent } from "@/types.js";

/**
 * Small structural mdast helpers shared by the front-end and the coverage tool.
 * These are generic tree accessors; the disciplined inline-row parsing lives in
 * `inline.ts`.
 */

/** The phrasing content of a list item's first paragraph, or `[]` if it has none. */
export const itemParagraph = (item: ListItem): PhrasingContent[] => {
  const paragraph = item.children.find((child): child is Paragraph => child.type === "paragraph");
  return paragraph ? paragraph.children : [];
};

/** The value of the first inline code span in `children`, if any. */
export const firstInlineCode = (children: PhrasingContent[]): string | undefined => {
  const code = children.find((child): child is InlineCode => child.type === "inlineCode");
  return code?.value;
};
