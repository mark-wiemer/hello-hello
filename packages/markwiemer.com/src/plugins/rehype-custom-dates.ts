import type { Root, Element, Text, ElementContent } from "hast";

/**
 * Matches ISO dates (YYYY-MM-DD) at word boundaries.
 * Uses global flag to find all occurrences in a text node.
 */
const isoDateGlobal = /\b(\d{4}-\d{2}-\d{2})\b/g;

/** Non-global version used for quick `.test()` checks (no state issues) */
const isoDateTest = /\b\d{4}-\d{2}-\d{2}\b/;

/** Elements whose text content should not be transformed */
const skipTags = new Set(["code", "pre", "script", "style", "time"]);

/** Returns true if the given YYYY-MM-DD string represents a real calendar date */
export function isValidIsoDate(dateStr: string): boolean {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

/**
 * Splits a text value on valid ISO dates and returns an array of hast nodes.
 * Plain text segments become Text nodes; valid ISO dates become
 * `<time datetime="..." class="custom-date">` Element nodes.
 *
 * Returns `null` when no valid dates are found (signals "keep original node").
 */
export function splitTextOnDates(value: string): ElementContent[] | null {
  // Collect valid matches first
  const validMatches: { dateStr: string; start: number; end: number }[] = [];
  for (const match of value.matchAll(isoDateGlobal)) {
    const dateStr = match[1];
    if (isValidIsoDate(dateStr)) {
      validMatches.push({ dateStr, start: match.index, end: match.index + match[0].length });
    }
  }

  if (validMatches.length === 0) return null;

  const nodes: ElementContent[] = [];
  let lastIndex = 0;

  for (const { dateStr, start, end } of validMatches) {
    // Text before the date
    if (start > lastIndex) {
      nodes.push({ type: "text", value: value.slice(lastIndex, start) } as Text);
    }

    // The <time> element
    nodes.push({
      type: "element",
      tagName: "time",
      properties: { dateTime: dateStr, className: ["custom-date"] },
      children: [{ type: "text", value: dateStr } as Text],
    } as Element);

    lastIndex = end;
  }

  // Remaining text after last match
  if (lastIndex < value.length) {
    nodes.push({ type: "text", value: value.slice(lastIndex) } as Text);
  }

  return nodes;
}

/**
 * Recursively processes a node's children, replacing text nodes that
 * contain ISO dates with `<time>` elements. Skips elements in `skipTags`.
 * Handles regular hast elements, the root, and MDX JSX elements
 * (mdxJsxFlowElement / mdxJsxTextElement).
 */
function processNode(node: any): void {
  // Skip certain HTML elements
  if (node.type === "element" && skipTags.has(node.tagName)) return;
  // Skip MDX JSX elements whose name matches a skip tag (unlikely but safe)
  if ((node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") && skipTags.has(node.name)) return;

  if (!Array.isArray(node.children)) return;

  // First recurse into child elements (including MDX JSX nodes)
  for (const child of node.children) {
    if (child.type === "element" || child.type === "root" || child.type === "mdxJsxFlowElement" || child.type === "mdxJsxTextElement") {
      processNode(child);
    }
  }

  // Then split text nodes that contain dates
  const newChildren: ElementContent[] = [];
  let changed = false;

  for (const child of node.children) {
    if (child.type === "text" && isoDateTest.test(child.value)) {
      const parts = splitTextOnDates(child.value);
      if (parts !== null) {
        newChildren.push(...parts);
        changed = true;
        continue;
      }
    }
    newChildren.push(child as ElementContent);
  }

  if (changed) {
    node.children = newChildren;
  }
}

/**
 * Rehype plugin that converts ISO date strings (YYYY-MM-DD) in text nodes
 * to `<time datetime="..." class="custom-date">` elements, matching the
 * output of the CustomDate Astro component.
 */
export default function rehypeCustomDates() {
  return (tree: Root) => {
    processNode(tree);
  };
}
