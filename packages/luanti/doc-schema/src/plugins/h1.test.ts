import { expect, test } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { h1Plugin } from "./h1.js";
import remarkStringify from "remark-stringify";
import { zeroPosition } from "@/constants.js";

const expectedH1Text = "Luanti Lua Modding API Reference";
const expectedSource = "luanti-doc-schema";
const processor = unified().use(remarkParse).use(h1Plugin).use(remarkStringify);
const parse = async (markdown: string) => await processor.process(markdown);
test.each([
  {
    name: "single h1 with correct text exists",
    markdown: `# ${expectedH1Text}`,
    expectedMessage: undefined,
    expectedPosition: undefined,
  },
  {
    name: "no h1 heading found",
    markdown: "## hello world",
    expectedMessage: "Expected one h1 heading, found 0",
    expectedPosition: zeroPosition,
  },
  {
    name: "multiple h1 headings exist",
    markdown: "# hello world\n\n# another h1",
    expectedMessage: "Expected one h1 heading, found 2",
    expectedPosition: {
      start: { line: 3, column: 1, offset: 15 },
      end: { line: 3, column: 13, offset: 27 },
    },
  },
  {
    name: "h1 text does not match expected",
    markdown: "# wrong text",
    expectedMessage: 'h1 text is "wrong text", expected "Luanti Lua Modding API Reference"',
    expectedPosition: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 13, offset: 12 },
    },
  },
])("$name", async ({ markdown, expectedMessage, expectedPosition }) => {
  const result = await parse(markdown);
  expect(result.messages).toHaveLength(expectedMessage ? 1 : 0);
  if (expectedMessage) {
    expect(result.messages[0].message).toContain(expectedMessage);
    expect(result.messages[0].source).toBe(expectedSource);
    expect(result.messages[0].place).toEqual(expectedPosition);
  }
});
