import { dedent, expect, test } from "@/types.js";
import { CliDeps, runCli } from "./index.js";

const deps = (files: Record<string, string>): CliDeps => ({
  readFile: (path) => {
    if (path in files) return files[path];
    throw new Error("ENOENT: no such file or directory");
  },
});

const validMd = dedent(`
  #### Function \`core.log(text)\`

  Logs text.

  - Args:
    - \`text\` : \`string\`
`);

const invalidMd = dedent(`
  #### Function \`core.bad(x)\`

  Bad type.

  - Args:
    - \`x\` : \`number |\`
`);

const warnMd = dedent(`
  #### Function \`core.x(a)\`

  Missing the arg type.

  - Args:
    - \`a\`
`);

test("validate succeeds on a well-formed document", () => {
  const result = runCli(["validate", "api.md"], deps({ "api.md": validMd }));
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("ok: 1 entry");
  expect(result.stderr).toBe("");
});

test("validate fails on a malformed type and reports the issue", () => {
  const result = runCli(["validate", "api.md"], deps({ "api.md": invalidMd }));
  expect(result.exitCode).toBe(1);
  expect(result.stdout).toBe("");
  expect(result.stderr).toContain("error:");
  expect(result.stderr).toContain("Invalid type expression");
});

test("validate succeeds but reports warnings on a skipped row", () => {
  const result = runCli(["validate", "api.md"], deps({ "api.md": warnMd }));
  expect(result.exitCode).toBe(0);
  expect(result.stderr).toContain("warning:");
  expect(result.stderr).toContain("Skipped arg");
});

test("validate without a file argument is a usage error", () => {
  const result = runCli(["validate"], deps({}));
  expect(result.exitCode).toBe(2);
  expect(result.stderr).toContain("Usage:");
});

test("validate on a missing file is an I/O error", () => {
  const result = runCli(["validate", "missing.md"], deps({}));
  expect(result.exitCode).toBe(2);
  expect(result.stderr).toContain("cannot read missing.md");
});

test("build emits LuaCATS by default", () => {
  const result = runCli(["build", "api.md"], deps({ "api.md": validMd }));
  expect(result.exitCode).toBe(0);
  expect(result.stdout.startsWith("---@meta\n")).toBe(true);
  expect(result.stdout).toContain("function core.log(text) end");
});

test("build --json emits parseable JSON", () => {
  const result = runCli(["build", "api.md", "--json"], deps({ "api.md": validMd }));
  expect(result.exitCode).toBe(0);
  const parsed = JSON.parse(result.stdout);
  expect(parsed.entries[0]).toMatchObject({ kind: "function", name: "core.log" });
});

test("build --ts emits TypeScript declarations", () => {
  const result = runCli(["build", "api.md", "--ts"], deps({ "api.md": validMd }));
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("// Generated TypeScript bindings");
  expect(result.stdout).toContain("export declare function core_log(text: string): void;");
});

test("build fails on an invalid document", () => {
  const result = runCli(["build", "api.md"], deps({ "api.md": invalidMd }));
  expect(result.exitCode).toBe(1);
  expect(result.stdout).toBe("");
  expect(result.stderr).toContain("error:");
});

test("coverage reports a migration summary", () => {
  const md = dedent(`
    #### Function \`core.get_node(pos)\`

    Returns the node.

    ### \`voxelmanip\`

    A mapgen object.
  `);
  const result = runCli(["coverage", "api.md"], deps({ "api.md": md }));
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("coverage: 1/2 symbols migrated");
  expect(result.stderr).toBe("");
});

test("coverage without a file argument is a usage error", () => {
  const result = runCli(["coverage"], deps({}));
  expect(result.exitCode).toBe(2);
  expect(result.stderr).toContain("Usage:");
});

test("more than one file argument is a usage error", () => {
  const result = runCli(["validate", "a.md", "b.md"], deps({ "a.md": validMd, "b.md": validMd }));
  expect(result.exitCode).toBe(2);
  expect(result.stderr).toContain("validate expects exactly one <file.md>");
});

test("stray flags are ignored by commands that don't use them", () => {
  const result = runCli(["validate", "api.md", "--json"], deps({ "api.md": validMd }));
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("ok: 1 entry");
});

test("flags may appear before the file argument", () => {
  const result = runCli(["build", "--json", "api.md"], deps({ "api.md": validMd }));
  expect(result.exitCode).toBe(0);
  expect(JSON.parse(result.stdout).entries[0]).toMatchObject({ name: "core.log" });
});

test("an unknown command is a usage error", () => {
  const result = runCli(["frobnicate"], deps({}));
  expect(result.exitCode).toBe(2);
  expect(result.stderr).toContain('Unknown command "frobnicate"');
});

test("help prints usage and exits zero", () => {
  const result = runCli(["--help"], deps({}));
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("Usage:");
});

test("no command prints usage to stderr and exits non-zero", () => {
  const result = runCli([], deps({}));
  expect(result.exitCode).toBe(2);
  expect(result.stderr).toContain("Usage:");
});
