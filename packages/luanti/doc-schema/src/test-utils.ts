import { expect, Position, remarkParse, remarkStringify, test, unified } from "./types.js";

export type TestCase = {
  name: string;
  markdown: string;
} & (
  | {
      /** hello world */
      expectedMessage: string;
      expectedPosition: Position;
    }
  | {
      expectedMessage: undefined;
      expectedPosition: undefined;
    }
);

export const testArray = (plugin: any, cases: TestCase[]) => {
  const processor = unified().use(remarkParse).use(plugin).use(remarkStringify);
  const parse = async (markdown: string) => await processor.process(markdown);
  return test.each<TestCase>(cases)(
    "$name",
    async ({ markdown, expectedMessage, expectedPosition }) => {
      const result = await parse(markdown);
      expect(result.messages).toHaveLength(expectedMessage ? 1 : 0);
      if (expectedMessage) {
        expect(result.messages[0].message).toContain(expectedMessage);
        expect(result.messages[0].source).toBe("luanti-doc-schema");
        expect(result.messages[0].place).toEqual(expectedPosition);
      }
    },
  );
};
