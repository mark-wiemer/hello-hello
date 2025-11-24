import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { read, write } from "to-vfile";
import { visit } from "unist-util-visit";

// Custom plugin to modify heading levels
function adjustHeadings() {
  return (tree) => {
    visit(tree, "heading", (node) => {
      node.depth = Math.min(node.depth + 1, 6); // Increase all headings by 1
    });
  };
}

// Basic processing pipeline
const file = await unified()
  .use(remarkParse) // Parse Markdown to AST
  .use(adjustHeadings)
  .use(remarkStringify) // Stringify AST back to Markdown
  .process(await read("input.md"));

await write({ path: "output.md", value: String(file) });
