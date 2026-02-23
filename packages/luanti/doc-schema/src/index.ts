import { h1Plugin } from "@/plugins/h1.js";
import {
  dirname,
  fileURLToPath,
  path,
  read,
  remarkParse,
  remarkStringify,
  unified,
  write,
} from "@/types.js";
import { functionPlugin } from "./plugins/function.js";
import { reporter } from "vfile-reporter";

const __dirname = dirname(fileURLToPath(import.meta.url));

const name = "lua-api";
const vfile = await read({ path: path.join(__dirname, `${name}.md`) });
if (!vfile.path) {
  console.error("Error: File not found");
  process.exit(1);
}
const file = await unified()
  .use(remarkParse) // Parse Markdown to AST
  .use(h1Plugin)
  .use(functionPlugin)
  .use(remarkStringify) // Stringify AST back to Markdown
  .process(vfile);

console.log(reporter(file));

try {
  const transformedName = `${name}_transformed.md`;
  await write({ path: path.join(__dirname, transformedName), value: String(file) });
  console.log(`Wrote ${transformedName}.`);
} catch (error) {
  console.error("Error writing transformed file:", error);
}
