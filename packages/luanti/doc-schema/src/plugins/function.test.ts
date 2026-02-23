import { dedent } from "@/types.js";
import { functionPlugin } from "./function.js";
import { testArray } from "@/test-utils.js";

const rawCases = [
  {
    name: "passes when contents are a list of core API functions",
    markdown: `
      - \`core.get_current_modname()\`: returns the currently loading mod's name,
      when loading a mod.
    `,
    expectedMessage: undefined,
    expectedPosition: undefined,
  },
  {
    name: "fails when top-level list items don't contain core API functions",
    markdown: `
      - \`not_core.get_current_modname()\`: this is not a core API function.
    `,
    expectedMessage:
      "Expected list item to contain a core API function call like `core.functionName(params)`",
    expectedPosition: {
      start: { line: 3, column: 3, offset: 33 },
      end: { line: 3, column: 35, offset: 65 },
    },
  },
];

const cases = rawCases.map((testCase) => ({
  ...testCase,
  markdown: "## 'core' namespace reference\n\n" + dedent(testCase.markdown),
}));

testArray(functionPlugin, cases);
