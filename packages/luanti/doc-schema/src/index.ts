import { ensureH1Plugin } from "@/plugins/ensure-h1.js";
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

const __dirname = dirname(fileURLToPath(import.meta.url));

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

if (file.messages.length === 0) {
  console.log("No issues found.");
} else {
  console.log(`Found ${file.messages.length} issue${file.messages.length > 1 ? "s" : ""}:`);
  file.messages.forEach((message) => {
    console.log(`${message.message} (Source: ${message.source})`);
  });
}

await write({ path: path.join(__dirname, `${name}_transformed.md`), value: String(file) });
