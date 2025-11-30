import { Plugin, unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { read, write } from "to-vfile";
import { visit } from "unist-util-visit";
import type { Root, RootContent } from "mdast";
import type { Options } from "remark-parse";

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

// #region Transform core namespace reference to TypeScript signatures
type BasicPlugin = Plugin<[(Readonly<Options> | null | undefined)?], Root, Root>;

const coreNamespaceRefToTS: BasicPlugin = () => {
  return (tree) => {
    const transformedChildren: RootContent[] = [];

    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      // Look for list items that contain API functions
      // listItem
      // - paragraph
      //   - inlineCode (core.functionName(params))
      //   - text (: description)
      //   - list (sub-bullets)
      if (node.type === "list") {
        for (const listItem of node.children) {
          // Skip non-listItem nodes or those without children (as a safety check)
          if (listItem.type !== "listItem" || !listItem.children) {
            transformedChildren.push(listItem);
            continue;
          }

          // Skip list items that don't have a paragraph child
          const paragraph = listItem.children.find((child) => child.type === "paragraph");
          if (!paragraph?.children?.[0]) {
            transformedChildren.push(listItem);
            continue;
          }

          // Skip if the first child is not inlineCode with core.functionName(params)
          const firstChild = paragraph.children[0];
          if (
            !firstChild ||
            firstChild.type !== "inlineCode" ||
            !firstChild.value.includes("core.") ||
            !firstChild.value.includes("(")
          ) {
            transformedChildren.push(listItem);
            continue;
          }

          // Extract function name and parameters
          // Example: core.functionName(param1, param2)
          // Skip match failures (as a safety check)
          const funcMatch = firstChild.value.match(/core\.(\w+)\(([^)]*)\)/);
          if (!funcMatch) {
            transformedChildren.push(listItem);
            continue;
          }

          const [, funcName, params] = funcMatch;

          // Collect all text content for the description
          const remainingText = paragraph.children.slice(1);

          // Process the description and sub-bullets
          const descriptionParts: string[] = [];

          // Get summary (text after the colon)
          const summary = remainingText
            .filter((child) => child.type === "text")
            .map((child) => child.value)
            .join("")
            .replace(/^:\s*/, "") // Remove leading colon
            .trim();
          if (summary) {
            descriptionParts.push(summary);
          }

          // Look for nested list items (sub-bullets)
          const nestedList = listItem.children.find((child) => child.type === "list");
          if (nestedList && nestedList.children) {
            nestedList.children.forEach((nestedItem) => {
              if (nestedItem.type === "listItem" && nestedItem.children) {
                const nestedParagraph = nestedItem.children.find(
                  (child) => child.type === "paragraph",
                );
                if (nestedParagraph && nestedParagraph.children) {
                  const nestedText = nestedParagraph.children
                    .map((child) =>
                      child.type === "text"
                        ? child.value
                        : child.type === "inlineCode"
                          ? `\`${child.value}\``
                          : "",
                    )
                    .join("")
                    .trim();
                  if (nestedText) {
                    descriptionParts.push(`- ${nestedText}`);
                  }
                }
              }
            });
          }

          // Create JSDoc comment lines
          const jsdocLines = ["/**"];
          descriptionParts.forEach((part, index) => {
            if (index === 0) {
              jsdocLines.push(` * ${part}`);
            } else {
              jsdocLines.push(` * ${part}`);
            }
          });
          jsdocLines.push(" */");

          // Create function signature
          const signature = `${funcName}(this: void${params.length > 0 ? ", " : ""}${params})`;

          // Create code block with JSDoc + function signature
          const codeContent = jsdocLines.join("\n") + "\n" + signature;

          transformedChildren.push({ type: "code", lang: "ts", value: codeContent });
        }
      } else {
        // Keep non-list nodes as-is (headings, etc.)
        transformedChildren.push(node);
      }
    }

    tree.children = transformedChildren;
  };
};

const addNote: BasicPlugin = () => {
  return (tree) => {
    // Find the first heading
    const headingIndex = tree.children.findIndex((node) => node.type === "heading");

    if (headingIndex !== -1) {
      // Insert a paragraph with the note after the heading
      tree.children.splice(headingIndex + 1, 0, {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "Compare with ",
          },
          {
            type: "link",
            url: "https://api.luanti.org/core-namespace-reference/",
            children: [
              {
                type: "text",
                value: "official docs",
              },
            ],
          },
        ],
      });
    }
  };
};

const file = await unified()
  .use(remarkParse) // Parse Markdown to AST
  .use(coreNamespaceRefToTS)
  .use(addNote)
  .use(remarkStringify) // Stringify AST back to Markdown
  .process(await read({ path: "lua_api_out.md" }));
await write({ path: "lua_api_transformed.md", value: String(file) });
// #endregion
