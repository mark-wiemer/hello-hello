import { Heading } from "@/types.js";

export type EntryKindKeyword = "function" | "method" | "enum" | "struct" | "class";

const KEYWORDS: Record<string, EntryKindKeyword> = {
  function: "function",
  method: "method",
  enumeration: "enum",
  enum: "enum",
  struct: "struct",
  class: "class",
};

export interface HeadingEntry {
  kind: EntryKindKeyword;
  /** The symbol name, e.g. `core.get_node` or `MapNode`. */
  name: string;
  /** The raw code span from the heading, e.g. `core.get_node(pos)`. */
  rawSignature: string;
}

/**
 * Read an entry heading of the form ``<Keyword> `signature` ``, e.g.
 * ``Function `core.get_node(pos)` `` or ``Enumeration `Level` ``. A bare
 * ``` `core.x()` ``` heading (no keyword) is treated as a function. Headings
 * that don't carry a code span, or whose keyword is unrecognised, return null —
 * those are ordinary prose headings, not API entries.
 *
 * Only text *before* the code span forms the keyword, so trailing text or
 * punctuation (``Function `core.x()`:`` or ``… `core.x()` (deprecated)``) does
 * not defeat recognition.
 */
export const readEntryHeading = (node: Heading): HeadingEntry | null => {
  let keyword = "";
  let code: string | undefined;
  for (const child of node.children) {
    if (child.type === "inlineCode") {
      if (code === undefined) code = child.value;
    } else if (child.type === "text" && code === undefined) {
      keyword += child.value;
    }
  }
  if (!code) return null;

  const kw = keyword.trim().toLowerCase();
  let kind = KEYWORDS[kw];
  if (!kind) {
    if (kw === "" && code.includes("(")) kind = "function";
    else return null;
  }

  const name = extractName(code, kind);
  if (!name) return null;
  return { kind, name, rawSignature: code };
};

const extractName = (code: string, kind: EntryKindKeyword): string => {
  if (kind === "function" || kind === "method") {
    const paren = code.indexOf("(");
    return (paren === -1 ? code : code.slice(0, paren)).trim();
  }
  return code.trim();
};
