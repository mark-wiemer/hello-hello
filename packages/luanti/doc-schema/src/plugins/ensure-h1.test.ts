import { expect, test } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { ensureH1Plugin } from "./ensure-h1.js";
import remarkStringify from "remark-stringify";

const expectedH1Text = "Luanti Lua Modding API Reference";
const expectedPluginName = "ensure-h1";
const processor = unified().use(remarkParse).use(ensureH1Plugin).use(remarkStringify);
const parse = async (markdown: string) => await processor.process(markdown);
test.each([
  {
    name: "passes when single h1 with correct text exists",
    markdown: `# ${expectedH1Text}`,
    expectedLength: 0,
    expectedMessage: undefined,
  },
  {
    name: "throws when no h1 heading found",
    markdown: "## hello world",
    expectedLength: 1,
    expectedMessage: "Expected one h1 heading, found 0",
  },
  {
    name: "throws when multiple h1 headings exist",
    markdown: "# hello world\n\n# another h1",
    expectedLength: 1,
    expectedMessage: "Expected one h1 heading, found 2",
  },
  {
    name: "throws when h1 text does not match expected",
    markdown: "# wrong text",
    expectedLength: 1,
    expectedMessage: 'h1 text is "wrong text", expected "Luanti Lua Modding API Reference"',
  },
])("$name", async ({ markdown, expectedLength, expectedMessage }) => {
  const result = await parse(markdown);
  expect(result.messages).toHaveLength(expectedLength);
  if (expectedMessage) {
    expect(result.messages[0].message).toContain(expectedMessage);
    expect(result.messages[0].source).toBe(expectedPluginName);
  }
});
