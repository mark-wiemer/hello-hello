import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { write } from "to-vfile";
import { visit } from "unist-util-visit";

// #region Basic processing pipeline with plugin
function adjustHeadings() {
  return (tree) => {
    visit(tree, "heading", (node) => {
      node.depth = Math.min(node.depth + 1, 6); // Increase all headings by 1
    });
  };
}
const file = await unified()
  .use(remarkParse) // Parse Markdown to AST
  .use(adjustHeadings)
  .use(remarkStringify) // Stringify AST back to Markdown
  .process("# Hello\n\n- li one\n* li two");
await write({ path: "output.md", value: String(file) });
// #endregion

// #region Show full AST
const processor = unified().use(remarkParse);
const tree = processor.parse("# Hello\n\n- li one\n* li two");

// console.log(JSON.stringify(tree, null, 2));
// #endregion Show full AST
