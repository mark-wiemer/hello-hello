import { h1Plugin } from "./h1.js";
import { zeroPosition } from "@/constants.js";
import { testArray } from "@/test-utils.js";

const expectedH1Text = "Luanti Lua Modding API Reference";

testArray(h1Plugin, [
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
    expectedMessage: `h1 text is "wrong text", expected "${expectedH1Text}"`,
    expectedPosition: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: 1, column: 13, offset: 12 },
    },
  },
]);
