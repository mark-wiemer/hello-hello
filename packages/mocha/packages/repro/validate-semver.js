#!/usr/bin/env node

// this file is not related to any particular repro

import { valid, lt, gt, eq, compare } from "semver";

const version1 = "v12.0.0-alpha-issue-5899.0";
const version2 = "v12.0.0-beta-9.3";

console.log(`Comparing: ${version1} vs ${version2}`);
console.log();

// Validate versions are valid semver
const v1Clean = valid(version1);
const v2Clean = valid(version2);

console.log(`Version 1 parsed: ${v1Clean}`);
console.log(`Version 2 parsed: ${v2Clean}`);
console.log();

// Compare
const result = lt(v1Clean, v2Clean);
console.log(`${version1} < ${version2}: ${result}`);
console.log();

// Additional comparisons
console.log(`${version1} > ${version2}: ${gt(v1Clean, v2Clean)}`);
console.log(`${version1} = ${version2}: ${eq(v1Clean, v2Clean)}`);
console.log();

console.log(`Comparison order: ${compare(v1Clean, v2Clean)}`);
