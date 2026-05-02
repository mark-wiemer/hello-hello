import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const reporterDir = join(__dirname, "node_modules", "my-reporter");
const reporterFile = join(reporterDir, "index.js");

const customReporter = `
// node_modules/my-reporter/index.js (ignored but necessary!)
"use strict";
const Mocha = require("mocha");
const Base = Mocha.reporters.Base;

class MyReporter extends Base {
  constructor(runner) {
    super(runner);
    console.log("my-reporter loaded successfully from CWD node_modules");
  }
}

module.exports = MyReporter;
`;

if (!existsSync(reporterFile)) {
  mkdirSync(reporterDir, { recursive: true });
  writeFileSync(reporterFile, customReporter, "utf8");
}
