import { List, ListItem } from "@/types.js";
import {
  descriptionAfter,
  inlineCodeValues,
  parseAnnotations,
  stringifyInline,
  stripQuotes,
} from "./inline.js";
import { itemParagraph } from "./mdast.js";

/**
 * Parsed sub-entries of an API entry. These mirror the IR's structured fields;
 * the front-end fills whichever are present in the Markdown.
 */
export interface SubEntries {
  params: unknown[];
  returns: unknown[];
  envs: string[];
  values: unknown[];
  fields: unknown[];
}

const empty = (): SubEntries => ({ params: [], returns: [], envs: [], values: [], fields: [] });

/** The nested list of a list item (the sub-entry's children), if any. */
const itemList = (item: ListItem): List | undefined =>
  item.children.find((child): child is List => child.type === "list");

const labelOf = (item: ListItem): string =>
  itemParagraph(item)
    .map(stringifyInline)
    .join("")
    .replace(/:\s*$/, "")
    .trim()
    .toLowerCase();

/**
 * Parse the single top-level list under an entry into structured sub-entries.
 * Each top-level item is a labelled section (`Args:`, `Returns:`, `Envs:`,
 * `Values:`, `Fields:`) whose nested list holds the rows.
 */
export const parseSubEntries = (list: List, warnings: string[]): SubEntries => {
  const result = empty();

  for (const item of list.children) {
    const label = labelOf(item);
    const rows = itemList(item)?.children ?? [];

    switch (label) {
      case "args":
      case "arguments":
        result.params = rows.map((row) => parseNamedType(row, warnings, "arg")).filter(Boolean);
        break;
      case "returns":
      case "return":
        result.returns = rows.map((row) => parseReturn(row)).filter(Boolean);
        break;
      case "envs":
      case "environments":
        result.envs = rows.map(parseEnv).filter((v): v is string => Boolean(v));
        break;
      case "values":
        result.values = rows.map(parseEnumValue).filter(Boolean);
        break;
      case "fields":
        result.fields = rows.map((row) => parseNamedType(row, warnings, "field")).filter(Boolean);
        break;
      default:
        if (label) warnings.push(`Unrecognised sub-entry "${label}"`);
    }
  }

  return result;
};

const withDescription = (base: Record<string, unknown>, description: string) =>
  description ? { ...base, description } : base;

/**
 * `` `name` : `type`[, attrs] : desc `` -> `{ name, type, ... }`.
 *
 * Args carry `optional`/`default`/`unit`; fields carry only `default` (the IR
 * field shape has no optional/unit — nilability is expressed in the type).
 */
const parseNamedType = (row: ListItem, warnings: string[], what: "arg" | "field"): unknown => {
  const children = itemParagraph(row);
  const codes = inlineCodeValues(children);
  if (codes.length < 2) {
    warnings.push(`Skipped ${what}: expected \`name\` : \`type\`, found ${codes.length} code span(s)`);
    return undefined;
  }

  const ann = parseAnnotations(children, 2);
  const base: Record<string, unknown> = { name: codes[0], type: codes[1] };
  if (what === "arg") {
    if (ann.optional) base.optional = true;
    if (ann.unit !== undefined) base.unit = ann.unit;
  }
  if (ann.default !== undefined) base.default = ann.default;
  if (ann.description) base.description = ann.description;
  return base;
};

/** `` `name` : `type` : desc `` or `` `type` : desc `` (unnamed) -> ReturnValue. */
const parseReturn = (row: ListItem): unknown => {
  const children = itemParagraph(row);
  const codes = inlineCodeValues(children);
  if (codes.length === 0) return undefined;
  if (codes.length === 1) {
    return withDescription({ type: codes[0] }, descriptionAfter(children, 1));
  }
  return withDescription({ name: codes[0], type: codes[1] }, descriptionAfter(children, 2));
};

/** `` `server-main` `` -> `"server-main"`. */
const parseEnv = (row: ListItem): string | undefined => {
  const children = itemParagraph(row);
  const codes = inlineCodeValues(children);
  if (codes[0]) return codes[0];
  const text = children.map(stringifyInline).join("").trim();
  return text || undefined;
};

/** `` `"none"` : desc `` -> `{ value: "none", description? }`. */
const parseEnumValue = (row: ListItem): unknown => {
  const children = itemParagraph(row);
  const codes = inlineCodeValues(children);
  if (codes.length === 0) return undefined;
  return withDescription({ value: stripQuotes(codes[0]) }, descriptionAfter(children, 1));
};
