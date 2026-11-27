import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { findConflictMarkerLines } from "./check-conflict-markers.js";

const checkerPath = fileURLToPath(new URL("./check-conflict-markers.js", import.meta.url));
const openingMarker = "<".repeat(7);
const separatorMarker = "=".repeat(7);
const ancestorMarker = "|".repeat(7);
const closingMarker = ">".repeat(7);

describe("findConflictMarkerLines", () => {
  it("finds all lines in a merge conflict block", () => {
    const content = [
      "before",
      `${openingMarker} HEAD`,
      "ours",
      `${ancestorMarker} base`,
      "base",
      separatorMarker,
      "theirs",
      `${closingMarker} feature`,
      "after",
    ].join("\n");

    expect(findConflictMarkerLines(content)).toEqual([2, 4, 6, 8]);
  });

  it("does not mistake standalone separators or inline text for conflict blocks", () => {
    const content = [
      "A heading",
      separatorMarker,
      `This text mentions ${openingMarker} inline`,
      `${openingMarker} incomplete`,
      "no separator or closing marker",
    ].join("\n");

    expect(findConflictMarkerLines(content)).toEqual([]);
  });

  it("handles CRLF line endings and multiple conflict blocks", () => {
    const content = [
      `${openingMarker} HEAD`,
      "ours",
      separatorMarker,
      "theirs",
      `${closingMarker} branch`,
      `${openingMarker} HEAD`,
      "ours again",
      separatorMarker,
      "theirs again",
      `${closingMarker} another-branch`,
    ].join("\r\n");

    expect(findConflictMarkerLines(content)).toEqual([1, 3, 5, 6, 8, 10]);
  });

  it("reports the file and line numbers when a repository contains a conflict", () => {
    const repositoryRoot = mkdtempSync(join(tmpdir(), "conflict-marker-check-"));

    try {
      execFileSync("git", ["init", "--quiet"], { cwd: repositoryRoot });
      writeFileSync(
        join(repositoryRoot, "conflicted.txt"),
        [
          `${openingMarker} HEAD`,
          "ours",
          separatorMarker,
          "theirs",
          `${closingMarker} branch`,
        ].join("\n"),
      );
      execFileSync("git", ["add", "conflicted.txt"], { cwd: repositoryRoot });

      const result = spawnSync(process.execPath, [checkerPath], {
        cwd: repositoryRoot,
        encoding: "utf8",
      });

      expect(result.status).toBe(1);
      expect(result.stderr).toContain('"conflicted.txt":1: merge conflict marker');
      expect(result.stderr).toContain('"conflicted.txt":3: merge conflict marker');
      expect(result.stderr).toContain('"conflicted.txt":5: merge conflict marker');
    } finally {
      rmSync(repositoryRoot, { recursive: true, force: true });
    }
  });
});
