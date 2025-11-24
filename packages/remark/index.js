import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { read, write } from "to-vfile";

// Basic processing pipeline
const file = await unified()
  .use(remarkParse) // Parse Markdown to AST
  .use(remarkStringify) // Stringify AST back to Markdown
  .process(await read("input.md"));

await write({ path: "output.md", value: String(file) });
