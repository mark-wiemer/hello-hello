import { process, readFileSync } from "@/types.js";
import { runCli } from "./index.js";

// Thin executable wrapper: wire the real filesystem into the testable core.
const result = runCli(process.argv.slice(2), { readFile: (path) => readFileSync(path, "utf8") });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exit(result.exitCode);
