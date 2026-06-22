import { Heading, List, Paragraph, remarkParse, Root, RootContent, unified } from "@/types.js";
import { ApiModel, parseApiModel } from "@/ir/index.js";
import { HeadingEntry, readEntryHeading } from "./heading.js";
import { stringifyInline } from "./inline.js";
import { parseSubEntries } from "./sub-entries.js";

export interface ParseResult {
  /** The validated model, or undefined if validation failed. */
  model: ApiModel | undefined;
  /** The raw lowered entries, regardless of validation outcome. */
  entries: unknown[];
  /** Non-fatal front-end warnings (e.g. a malformed sub-entry row). */
  warnings: string[];
  /** IR validation issues, as `path: message` strings. */
  issues: string[];
}

/**
 * Lower a Markdown document into a validated {@link ApiModel}.
 *
 * The Markdown AST is used only to *segment* entries (by heading) and to pull
 * the disciplined structured rows; it is never the source of truth. Everything
 * is lowered into the IR and validated there.
 */
export const parseMarkdown = (markdown: string): ParseResult => {
  const tree = unified().use(remarkParse).parse(markdown) as Root;
  const warnings: string[] = [];
  const entries = buildEntries(tree, warnings);
  const validated = parseApiModel({ entries });

  return {
    model: validated.success ? validated.data : undefined,
    entries,
    warnings,
    issues: validated.success
      ? []
      : validated.error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`),
  };
};

/** A class entry currently accepting deeper method headings as its own. */
interface OpenClass {
  methods: unknown[];
  depth: number;
}

const buildEntries = (tree: Root, warnings: string[]): unknown[] => {
  const children = tree.children;
  const headingIndexes = children
    .map((child, index) => (child.type === "heading" ? index : -1))
    .filter((index) => index !== -1);

  const entries: unknown[] = [];
  let openClass: OpenClass | null = null;

  headingIndexes.forEach((headingIndex, position) => {
    const node = children[headingIndex] as Heading;
    const depth = node.depth;

    // Leaving a class's subtree (a heading at the same or shallower depth) closes it.
    if (openClass && depth <= openClass.depth) openClass = null;

    const head = readEntryHeading(node);
    if (!head) return;

    const end = headingIndexes[position + 1] ?? children.length;
    const body = children.slice(headingIndex + 1, end);
    const entry = buildEntry(head, body, warnings);

    if (head.kind === "class") {
      entries.push(entry);
      openClass = { methods: (entry as { methods: unknown[] }).methods, depth };
    } else if (head.kind === "method" && openClass) {
      // A method nested under an open class becomes that class's method.
      openClass.methods.push(entry);
    } else {
      entries.push(entry);
    }
  });
  return entries;
};

const buildEntry = (head: HeadingEntry, body: RootContent[], warnings: string[]): unknown => {
  const firstListIndex = body.findIndex((node) => node.type === "list");
  const preList = firstListIndex === -1 ? body : body.slice(0, firstListIndex);
  const paragraphs = preList
    .filter((node): node is Paragraph => node.type === "paragraph")
    .map((paragraph) => paragraph.children.map(stringifyInline).join("").trim())
    .filter(Boolean);

  const list = firstListIndex === -1 ? undefined : (body[firstListIndex] as List);
  const sub = list ? parseSubEntries(list, warnings) : undefined;

  const description = paragraphs.length ? paragraphs.join("\n\n") : undefined;

  switch (head.kind) {
    case "function":
    case "method":
      return {
        kind: head.kind,
        name: head.name,
        summary: paragraphs[0] ?? "",
        ...(paragraphs.length > 1 ? { description: paragraphs.slice(1).join("\n\n") } : {}),
        params: sub?.params ?? [],
        returns: sub?.returns ?? [],
        envs: sub?.envs ?? [],
      };
    case "enum":
      return {
        kind: "enum",
        name: head.name,
        ...(description ? { description } : {}),
        values: sub?.values ?? [],
      };
    case "struct":
      return {
        kind: "struct",
        name: head.name,
        ...(description ? { description } : {}),
        fields: sub?.fields ?? [],
      };
    case "class":
      return {
        kind: "class",
        name: head.name,
        ...(description ? { description } : {}),
        fields: sub?.fields ?? [],
        // Populated from nested Method headings during entry assembly.
        methods: [],
      };
  }
};
