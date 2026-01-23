import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { read, write } from "to-vfile";

const name = "lua-api";
const file = await unified()
  .use(remarkParse) // Parse Markdown to AST
  .use(remarkStringify) // Stringify AST back to Markdown
  .process(await read({ path: `${name}.md` }));
await write({ path: `${name}_transformed.md`, value: String(file) });
