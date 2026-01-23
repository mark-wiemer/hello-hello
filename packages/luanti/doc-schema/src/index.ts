import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { read, write } from "to-vfile";
import { Plugin } from "unified";
import { Root, Heading, Text } from "mdast";
import process from "node:process";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ensureH1Plugin: Plugin<[], Root> = () => {
  return (tree: Root): void => {
    const h1s = tree.children.filter(
      (node): node is Heading => node.type === "heading" && node.depth === 1,
    );

    if (h1s.length === 0) {
      console.error("Error: No h1 element found");
      process.exit(1);
    }

    if (h1s.length > 1) {
      console.error("Error: Multiple h1 elements found");
      process.exit(1);
    }

    const h1Text = h1s[0].children
      .filter((child): child is Text => child.type === "text")
      .map((child: Text) => child.value)
      .join("");

    const expectedH1 = "Luanti Lua Modding API Reference";
    if (h1Text !== expectedH1) {
      console.error(`Error: h1 text is "${h1Text}", expected "${expectedH1}"`);
      process.exit(1);
    }
  };
};

const name = "lua-api";
const vfile = await read({ path: path.join(__dirname, `${name}.md`) });
if (!vfile.path) {
  console.error("Error: File not found");
  process.exit(1);
}
const file = await unified()
  .use(remarkParse) // Parse Markdown to AST
  .use(ensureH1Plugin)
  .use(remarkStringify) // Stringify AST back to Markdown
  .process(vfile);
await write({ path: path.join(__dirname, `${name}_transformed.md`), value: String(file) });
