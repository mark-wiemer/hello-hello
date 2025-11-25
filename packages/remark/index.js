import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { read, write } from "to-vfile";
import { visit } from "unist-util-visit";

// #region Basic processing pipeline with plugin
/* /
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
//*/
// #endregion

// #region Show full AST
/* /
const processor = unified().use(remarkParse);
const tree = processor.parse("# Hello\n\n- li one\n* li two");

console.log(JSON.stringify(tree, null, 2));
*/
// #endregion Show full AST

// #region Parse Lua API and print core namespace reference

function filterCoreNamespace() {
  return (tree) => {
    let inCoreNamespace = false;
    let coreNamespaceIndex = -1;

    // First pass: find the core namespace section
    tree.children.forEach((node, index) => {
      if (node.type === "heading" && node.children) {
        const headingText = node.children
          .filter((child) => child.type === "text")
          .map((child) => child.value)
          .join("");

        if (
          headingText.toLowerCase().includes("core") &&
          headingText.toLowerCase().includes("namespace")
        ) {
          inCoreNamespace = true;
          coreNamespaceIndex = index;
        } else if (node.type === "heading" && node.depth <= 1 && inCoreNamespace) {
          inCoreNamespace = false;
        }
      }

      // Mark nodes to keep
      if (inCoreNamespace) {
        node._keep = true;
      }
    });

    // Second pass: filter out unmarked nodes
    tree.children = tree.children.filter((node) => node._keep);

    // Clean up temporary property
    tree.children.forEach((node) => delete node._keep);
  };
}

const file = await unified()
  .use(remarkParse) // Parse Markdown to AST
  .use(filterCoreNamespace)
  .use(remarkStringify) // Stringify AST back to Markdown
  .process(await read({ path: "lua_api.md" }));
await write({ path: "lua_api_out.md", value: String(file) });
