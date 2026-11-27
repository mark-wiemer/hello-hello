import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { resolve, relative } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const openingMarkerPattern = /^<{7,}(?: .*)?$/;
const ancestorMarkerPattern = /^\|{7,}(?: .*)?$/;
const separatorMarkerPattern = /^={7,}$/;
const closingMarkerPattern = /^>{7,}(?: .*)?$/;

export function findConflictMarkerLines(content) {
  const conflictMarkerLines = [];
  let openLine = null;
  let separatorLines = [];
  let ancestorLines = [];

  for (const [index, line] of content.split(/\r\n?|\n/).entries()) {
    const lineNumber = index + 1;

    if (openingMarkerPattern.test(line)) {
      openLine = lineNumber;
      separatorLines = [];
      ancestorLines = [];
      continue;
    }

    if (openLine === null) continue;
    if (ancestorMarkerPattern.test(line)) {
      ancestorLines.push(lineNumber);
    } else if (separatorMarkerPattern.test(line)) {
      separatorLines.push(lineNumber);
    } else if (closingMarkerPattern.test(line)) {
      if (separatorLines.length > 0) {
        conflictMarkerLines.push(openLine, ...ancestorLines, ...separatorLines, lineNumber);
      }

      openLine = null;
      separatorLines = [];
      ancestorLines = [];
    }
  }

  return conflictMarkerLines;
}

function getRepositoryFiles(repositoryRoot) {
  return execFileSync(
    "git",
    ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
    { cwd: repositoryRoot, encoding: "utf8" },
  )
    .split("\0")
    .filter(Boolean);
}

function main() {
  const repositoryRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8",
  }).trim();
  const files = getRepositoryFiles(repositoryRoot);
  const findings = [];
  let filesScanned = 0;

  for (const file of files) {
    const absolutePath = resolve(repositoryRoot, file);
    if (!existsSync(absolutePath) || !lstatSync(absolutePath).isFile()) continue;

    const content = readFileSync(absolutePath);
    if (content.includes(0)) continue;

    filesScanned++;
    for (const line of findConflictMarkerLines(content.toString("utf8"))) {
      findings.push(`${JSON.stringify(relative(repositoryRoot, absolutePath))}:${line}`);
    }
  }

  if (findings.length > 0) {
    console.error("Conflict markers found:");
    for (const finding of findings) {
      console.error(`  ${finding}: merge conflict marker`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`No conflict markers found in ${filesScanned} text files.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    main();
  } catch (error) {
    console.error(`Unable to check for conflict markers: ${error.message}`);
    process.exitCode = 2;
  }
}
