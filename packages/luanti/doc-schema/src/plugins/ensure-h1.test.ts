import { expect, test } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { ensureH1Plugin } from "./ensure-h1.js";
import remarkStringify from "remark-stringify";

const processor = unified().use(remarkParse).use(ensureH1Plugin).use(remarkStringify);
const parse = async (markdown: string) => await processor.process(markdown);
const expectedH1Text = "Luanti Lua Modding API Reference";

test("passes when single h1 with correct text exists", async () => {
  const markdown = `# ${expectedH1Text}`;
  const result = await parse(markdown);

  expect(result.messages).toHaveLength(0);
});

test("throws when no h1 heading found", async () => {
  const markdown = "## hello world";
  const result = await parse(markdown);

  expect(result.messages).toHaveLength(1);
  expect(result.messages[0].message).toContain("Expected one h1 heading, found 0");
});

test("throws when multiple h1 headings exist", async () => {
  const markdown = "# hello world\n\n# another h1";
  const result = await parse(markdown);
  expect(result.messages).toHaveLength(1);
  expect(result.messages[0].message).toContain("Expected one h1 heading, found 2");
});

test("throws when h1 text does not match expected", async () => {
  const markdown = "# wrong text";
  const result = await parse(markdown);

  expect(result.messages).toHaveLength(1);
  expect(result.messages[0].message).toContain(
    'h1 text is "wrong text", expected "Luanti Lua Modding API Reference"',
  );
});
