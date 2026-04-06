import { describe, expect, it } from "vitest";
import rehypeCustomDates, { isValidIsoDate, splitTextOnDates } from "./rehype-custom-dates";
import type { Root, Element, Text } from "hast";

// ── isValidIsoDate ──────────────────────────────────────────────────

describe("isValidIsoDate", () => {
  it.each([
    "2024-01-01",
    "2024-12-31",
    "2024-02-29", // leap year
    "2000-02-29", // century leap year
    "2026-04-05",
  ])("returns true for valid date %s", (date) => {
    expect(isValidIsoDate(date)).toBe(true);
  });

  it.each([
    "2024-13-01", // month > 12
    "2024-00-01", // month 0
    "2024-01-32", // day > 31
    "2024-02-30", // Feb 30
    "2023-02-29", // non-leap year
    "2100-02-29", // century non-leap year
    "2024-04-31", // April has 30 days
  ])("returns false for invalid date %s", (date) => {
    expect(isValidIsoDate(date)).toBe(false);
  });
});

// ── splitTextOnDates ────────────────────────────────────────────────

describe("splitTextOnDates", () => {
  it("returns a single time element for a standalone date", () => {
    const nodes = splitTextOnDates("2024-01-15");
    expect(nodes).toHaveLength(1);
    expect(nodes[0]).toMatchObject({
      type: "element",
      tagName: "time",
      properties: { dateTime: "2024-01-15", className: ["custom-date"] },
      children: [{ type: "text", value: "2024-01-15" }],
    });
  });

  it("splits text before and after a date", () => {
    const nodes = splitTextOnDates("Posted on 2024-06-01 by Mark");
    expect(nodes).toHaveLength(3);
    expect(nodes[0]).toMatchObject({ type: "text", value: "Posted on " });
    expect(nodes[1]).toMatchObject({
      type: "element",
      tagName: "time",
      properties: { dateTime: "2024-06-01" },
    });
    expect(nodes[2]).toMatchObject({ type: "text", value: " by Mark" });
  });

  it("handles multiple dates in one string", () => {
    const nodes = splitTextOnDates("From 2024-01-01 to 2024-12-31.");
    expect(nodes).toHaveLength(5);
    expect(nodes![0]).toMatchObject({ type: "text", value: "From " });
    expect(nodes![1]).toMatchObject({
      type: "element",
      tagName: "time",
      properties: { dateTime: "2024-01-01" },
    });
    expect(nodes![2]).toMatchObject({ type: "text", value: " to " });
    expect(nodes![3]).toMatchObject({
      type: "element",
      tagName: "time",
      properties: { dateTime: "2024-12-31" },
    });
    expect(nodes![4]).toMatchObject({ type: "text", value: "." });
  });

  it("returns null when string contains only invalid dates", () => {
    const nodes = splitTextOnDates("Date: 2024-13-01");
    expect(nodes).toBeNull();
  });

  it("converts valid dates and keeps invalid ones as text", () => {
    const nodes = splitTextOnDates("Good: 2024-01-01, Bad: 2024-13-01");
    expect(nodes).toHaveLength(3);
    expect(nodes![0]).toMatchObject({ type: "text", value: "Good: " });
    expect(nodes![1]).toMatchObject({
      type: "element",
      tagName: "time",
      properties: { dateTime: "2024-01-01" },
    });
    expect(nodes![2]).toMatchObject({ type: "text", value: ", Bad: 2024-13-01" });
  });

  it("returns null for text with no dates", () => {
    const nodes = splitTextOnDates("Hello world");
    expect(nodes).toBeNull();
  });

  it("handles date at the start of text", () => {
    const nodes = splitTextOnDates("2024-01-01: Fix typo");
    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toMatchObject({
      type: "element",
      tagName: "time",
      properties: { dateTime: "2024-01-01" },
    });
    expect(nodes[1]).toMatchObject({ type: "text", value: ": Fix typo" });
  });

  it("handles date at the end of text", () => {
    const nodes = splitTextOnDates("Last updated 2024-01-01");
    expect(nodes).toHaveLength(2);
    expect(nodes[0]).toMatchObject({ type: "text", value: "Last updated " });
    expect(nodes[1]).toMatchObject({
      type: "element",
      tagName: "time",
      properties: { dateTime: "2024-01-01" },
    });
  });
});

// ── rehypeCustomDates (full plugin) ─────────────────────────────────

function text(value: string): Text {
  return { type: "text", value };
}
function el(tagName: string, children: (Element | Text)[]): Element {
  return { type: "element", tagName, properties: {}, children };
}

describe("rehypeCustomDates", () => {
  it("converts a date in a paragraph", () => {
    const tree: Root = {
      type: "root",
      children: [el("p", [text("Published 2024-06-15.")])],
    };
    rehypeCustomDates()(tree);

    const p = tree.children[0] as Element;
    expect(p.children).toHaveLength(3);
    expect(p.children[0]).toMatchObject({ type: "text", value: "Published " });
    expect(p.children[1]).toMatchObject({
      type: "element",
      tagName: "time",
      properties: { dateTime: "2024-06-15", className: ["custom-date"] },
    });
    expect(p.children[2]).toMatchObject({ type: "text", value: "." });
  });

  it("skips dates inside <code> elements", () => {
    const tree: Root = {
      type: "root",
      children: [el("code", [text("2024-01-01")])],
    };
    rehypeCustomDates()(tree);

    const code = tree.children[0] as Element;
    expect(code.children).toHaveLength(1);
    expect(code.children[0]).toMatchObject({ type: "text", value: "2024-01-01" });
  });

  it("skips dates inside <pre> elements (including nested <code>)", () => {
    const tree: Root = {
      type: "root",
      children: [el("pre", [el("code", [text("const d = '2024-01-01';")])])],
    };
    rehypeCustomDates()(tree);

    const pre = tree.children[0] as Element;
    const code = pre.children[0] as Element;
    expect(code.children).toHaveLength(1);
    expect(code.children[0]).toMatchObject({ type: "text", value: "const d = '2024-01-01';" });
  });

  it("skips dates inside <time> elements to avoid double-wrapping", () => {
    const timeEl: Element = {
      type: "element",
      tagName: "time",
      properties: { dateTime: "2024-01-01", className: ["custom-date"] },
      children: [text("2024-01-01")],
    };
    const tree: Root = {
      type: "root",
      children: [el("p", [timeEl])],
    };
    rehypeCustomDates()(tree);

    const p = tree.children[0] as Element;
    expect(p.children).toHaveLength(1);
    expect(p.children[0]).toMatchObject({
      type: "element",
      tagName: "time",
      children: [{ type: "text", value: "2024-01-01" }],
    });
  });

  it("skips dates inside <script> elements", () => {
    const tree: Root = {
      type: "root",
      children: [el("script", [text('const date = "2024-01-01";')])],
    };
    rehypeCustomDates()(tree);

    const script = tree.children[0] as Element;
    expect(script.children).toHaveLength(1);
    expect(script.children[0]).toMatchObject({ type: "text", value: 'const date = "2024-01-01";' });
  });

  it("skips dates inside <style> elements", () => {
    const tree: Root = {
      type: "root",
      children: [el("style", [text("/* 2024-01-01 */")])],
    };
    rehypeCustomDates()(tree);

    const style = tree.children[0] as Element;
    expect(style.children).toHaveLength(1);
  });

  it("converts dates in deeply nested elements", () => {
    const tree: Root = {
      type: "root",
      children: [el("div", [el("p", [el("span", [text("2024-03-15")])])])],
    };
    rehypeCustomDates()(tree);

    const span = (tree.children[0] as Element).children[0] as Element;
    const inner = (span as Element).children[0] as Element;
    expect(inner.children).toHaveLength(1);
    expect(inner.children[0]).toMatchObject({
      type: "element",
      tagName: "time",
      properties: { dateTime: "2024-03-15" },
    });
  });

  it("handles a tree with no dates", () => {
    const tree: Root = {
      type: "root",
      children: [el("p", [text("No dates here!")])],
    };
    rehypeCustomDates()(tree);

    const p = tree.children[0] as Element;
    expect(p.children).toHaveLength(1);
    expect(p.children[0]).toMatchObject({ type: "text", value: "No dates here!" });
  });

  it("handles an empty tree", () => {
    const tree: Root = { type: "root", children: [] };
    rehypeCustomDates()(tree);
    expect(tree.children).toHaveLength(0);
  });

  it("handles dates in list items (like edit logs)", () => {
    const tree: Root = {
      type: "root",
      children: [
        el("ul", [
          el("li", [text("2026-01-02: Tiny grammar fixes")]),
          el("li", [text("2026-01-14: Add image")]),
        ]),
      ],
    };
    rehypeCustomDates()(tree);

    const li0 = (tree.children[0] as Element).children[0] as Element;
    expect(li0.children).toHaveLength(2);
    expect(li0.children[0]).toMatchObject({
      type: "element",
      tagName: "time",
      properties: { dateTime: "2026-01-02" },
    });
    expect(li0.children[1]).toMatchObject({ type: "text", value: ": Tiny grammar fixes" });
  });

  it("converts dates inside anchor text", () => {
    const a: Element = {
      type: "element",
      tagName: "a",
      properties: { href: "https://example.com/2024-01-01/article" },
      children: [text("Article from 2024-01-01")],
    };
    const tree: Root = {
      type: "root",
      children: [el("p", [a])],
    };
    rehypeCustomDates()(tree);

    const anchor = (tree.children[0] as Element).children[0] as Element;
    expect(anchor.children).toHaveLength(2);
    expect(anchor.children[0]).toMatchObject({ type: "text", value: "Article from " });
    expect(anchor.children[1]).toMatchObject({
      type: "element",
      tagName: "time",
      properties: { dateTime: "2024-01-01" },
    });
    // href attribute should be untouched
    expect(anchor.properties.href).toBe("https://example.com/2024-01-01/article");
  });
});
