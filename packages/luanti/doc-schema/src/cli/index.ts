import { parseMarkdown } from "@/md-frontend/index.js";
import { emitModel } from "@/emit-luacats/index.js";
import { emitModel as emitTs } from "@/emit-ts/index.js";
import { emitJson } from "@/emit-json/index.js";
import { coverage, formatCoverage } from "@/coverage/index.js";

/**
 * The CLI core, written as a pure function of its arguments and an injected file
 * reader so it can be unit-tested without spawning a process or touching disk.
 * `src/cli/bin.ts` is the thin executable wrapper around it.
 *
 * Exit codes: 0 success, 1 validation failure, 2 usage / I/O error.
 */
export interface CliDeps {
  readFile: (path: string) => string;
}

export interface CliResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

const USAGE = [
  "Usage: luanti-doc <command> <file.md>",
  "",
  "Commands:",
  "  validate <file.md>   Validate the document and report any issues",
  "  build <file.md>      Emit LuaCATS (default), JSON (--json), or TypeScript (--ts)",
  "  coverage <file.md>   Report migration coverage (migrated vs passthrough)",
].join("\n");

export const runCli = (argv: string[], deps: CliDeps): CliResult => {
  const [command, ...rest] = argv;
  switch (command) {
    case "validate":
      return validate(rest, deps);
    case "build":
      return build(rest, deps);
    case "coverage":
      return coverageCommand(rest, deps);
    case "help":
    case "--help":
    case "-h":
      return { exitCode: 0, stdout: `${USAGE}\n`, stderr: "" };
    case undefined:
      return { exitCode: 2, stdout: "", stderr: `${USAGE}\n` };
    default:
      return usageError(`Unknown command "${command}"`);
  }
};

interface Args {
  positionals: string[];
  flags: Set<string>;
}

const parseArgs = (rest: string[]): Args => {
  const positionals: string[] = [];
  const flags = new Set<string>();
  for (const arg of rest) {
    if (arg.startsWith("-")) flags.add(arg);
    else positionals.push(arg);
  }
  return { positionals, flags };
};

const usageError = (message: string): CliResult => ({
  exitCode: 2,
  stdout: "",
  stderr: `${message}\n\n${USAGE}\n`,
});

const readSource = (
  file: string,
  deps: CliDeps,
): { md: string } | { error: CliResult } => {
  try {
    return { md: deps.readFile(file) };
  } catch (error) {
    return {
      error: {
        exitCode: 2,
        stdout: "",
        stderr: `error: cannot read ${file}: ${(error as Error).message}\n`,
      },
    };
  }
};

const formatWarnings = (warnings: string[]): string =>
  warnings.map((warning) => `warning: ${warning}`).join("\n");

const failure = (issues: string[], warningText: string): CliResult => ({
  exitCode: 1,
  stdout: "",
  stderr: `${[issues.map((issue) => `error: ${issue}`).join("\n"), warningText].filter(Boolean).join("\n")}\n`,
});

/**
 * Shared command shape: parse args, require exactly one `<file.md>`, read it,
 * then hand the contents and flags to `run`. Usage/I/O errors short-circuit.
 */
const withSource = (
  command: string,
  rest: string[],
  deps: CliDeps,
  run: (md: string, flags: Set<string>) => CliResult,
): CliResult => {
  const { positionals, flags } = parseArgs(rest);
  if (positionals.length !== 1) return usageError(`${command} expects exactly one <file.md>`);

  const source = readSource(positionals[0], deps);
  if ("error" in source) return source.error;

  return run(source.md, flags);
};

const validate = (rest: string[], deps: CliDeps): CliResult =>
  withSource("validate", rest, deps, (md) => {
    const result = parseMarkdown(md);
    const warningText = formatWarnings(result.warnings);
    if (result.issues.length) return failure(result.issues, warningText);

    const count = result.model?.entries.length ?? 0;
    return {
      exitCode: 0,
      stdout: `ok: ${count} ${count === 1 ? "entry" : "entries"}\n`,
      stderr: warningText ? `${warningText}\n` : "",
    };
  });

const build = (rest: string[], deps: CliDeps): CliResult =>
  withSource("build", rest, deps, (md, flags) => {
    const result = parseMarkdown(md);
    const warningText = formatWarnings(result.warnings);
    if (result.issues.length || !result.model) return failure(result.issues, warningText);

    const output = flags.has("--ts")
      ? emitTs(result.model)
      : flags.has("--json")
        ? emitJson(result.model)
        : emitModel(result.model);
    return { exitCode: 0, stdout: output, stderr: warningText ? `${warningText}\n` : "" };
  });

const coverageCommand = (rest: string[], deps: CliDeps): CliResult =>
  withSource("coverage", rest, deps, (md) => ({
    exitCode: 0,
    stdout: formatCoverage(coverage(md)),
    stderr: "",
  }));
