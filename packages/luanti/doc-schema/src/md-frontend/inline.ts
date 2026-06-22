import { PhrasingContent } from "@/types.js";

/**
 * Helpers for reading the disciplined inline form used by sub-entry list items:
 * `` `name` : `type` : free-text description ``.
 *
 * The structured spine (names, types) lives in inline code spans; everything
 * after the last structural code span is opaque description prose.
 */

/** Flatten any phrasing content back to text, re-wrapping code spans in backticks. */
export const stringifyInline = (node: PhrasingContent): string => {
  switch (node.type) {
    case "text":
      return node.value;
    case "inlineCode":
      return `\`${node.value}\``;
    default:
      if ("children" in node && Array.isArray(node.children)) {
        return node.children.map(stringifyInline).join("");
      }
      if ("value" in node && typeof node.value === "string") return node.value;
      return "";
  }
};

/** The values of the inline code spans, in document order. */
export const inlineCodeValues = (children: PhrasingContent[]): string[] =>
  children.filter((child) => child.type === "inlineCode").map((child) => child.value);

/**
 * Text following the `afterCodeCount`-th inline code span, with any leading
 * separator (`:` and surrounding whitespace) stripped. Used to pull a
 * description out from after the `name`/`type` code spans.
 */
export const descriptionAfter = (children: PhrasingContent[], afterCodeCount: number): string => {
  let seen = 0;
  let out = "";
  for (const child of children) {
    if (child.type === "inlineCode") {
      seen++;
      if (seen > afterCodeCount) out += `\`${child.value}\``;
      continue;
    }
    if (seen >= afterCodeCount) out += stringifyInline(child);
  }
  return out.replace(/^[\s:]+/, "").trim();
};

/** Strip a single pair of surrounding double quotes, e.g. `"none"` -> `none`. */
export const stripQuotes = (value: string): string =>
  value.length >= 2 && value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value;

/** Optional attributes carried between a type and its description. */
export interface Annotations {
  optional?: boolean;
  default?: string;
  unit?: string;
  description?: string;
}

type AnnToken = { kind: "text"; value: string } | { kind: "code"; value: string };

/**
 * Parse the region after the `afterCodeCount`-th code span into attributes and a
 * description. Recognises a comma-separated attribute list of `optional`,
 * `` default `value` `` and `` unit `value` `` before an optional `: description`,
 * e.g. `` `bool`, optional, default `false`, unit `seconds` : the description ``.
 *
 * `default`/`unit` values are kept verbatim from their code span (so `"none"`
 * and `0` retain their Lua source form). The first `:` in a text run marks the
 * start of the description.
 */
export const parseAnnotations = (
  children: PhrasingContent[],
  afterCodeCount: number,
): Annotations => {
  const tokens: AnnToken[] = [];
  let seen = 0;
  for (const child of children) {
    if (child.type === "inlineCode") {
      seen++;
      if (seen > afterCodeCount) tokens.push({ kind: "code", value: child.value });
    } else if (seen >= afterCodeCount) {
      tokens.push({ kind: "text", value: stringifyInline(child) });
    }
  }

  const attrTokens: AnnToken[] = [];
  const descTokens: AnnToken[] = [];
  let inDescription = false;
  for (const token of tokens) {
    if (inDescription) {
      descTokens.push(token);
      continue;
    }
    if (token.kind === "text") {
      const colon = token.value.indexOf(":");
      if (colon !== -1) {
        const before = token.value.slice(0, colon);
        const after = token.value.slice(colon + 1);
        if (before) attrTokens.push({ kind: "text", value: before });
        inDescription = true;
        if (after) descTokens.push({ kind: "text", value: after });
        continue;
      }
    }
    attrTokens.push(token);
  }

  const result: Annotations = {};

  // Flatten the attribute region to a sequence of comma-separated words + codes.
  const items: AnnToken[] = [];
  for (const token of attrTokens) {
    if (token.kind === "code") {
      items.push(token);
      continue;
    }
    for (const piece of token.value.split(",")) {
      const word = piece.trim();
      if (word) items.push({ kind: "text", value: word });
    }
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind !== "text") continue;
    const word = item.value.toLowerCase();
    if (word === "optional") result.optional = true;
    else if (word === "default" && items[i + 1]?.kind === "code") result.default = items[++i].value;
    else if (word === "unit" && items[i + 1]?.kind === "code") result.unit = items[++i].value;
  }

  const description = descTokens
    .map((token) => (token.kind === "code" ? `\`${token.value}\`` : token.value))
    .join("")
    .trim();
  if (description) result.description = description;

  return result;
};
