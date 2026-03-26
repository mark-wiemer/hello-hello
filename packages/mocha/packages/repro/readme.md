# Mocha issue 5812

[Bug: .mocharc.js / .mocharc.mjs / ESM export default configs don't seem to work](https://github.com/mochajs/mocha/issues/5812)

(Does not repro on current Mocha main, Node 22.21.1, Linux Mint 22.1 Cinnamon)

## Description

### Expected

Given the explanation in the configuring mocha guide, I would expect a config file named `.mocharc.js` or `.mocharc.mjs` with the following contents to work:

<!-- no language ID here to preserve double-quote usage reported -->

```
console.log('mocha config');

export default {
  "extension": ["ts", "tsx"],
  "node-option": ["import=tsx"],
  "recursive": true,
  "reporter": "spec",
  "require": ["./test/setup.ts"],
  "spec": ["src/**/*.test.ts"],
  "timeout": 5000,
  "watch-files": ["src/**/*.ts", "test/**/*.ts"]
}
```

in package:

```
"type": "module",
...
"test": "cross-env NODE_ENV=test mocha",
```

### Actual

When I run `pnpm run test`, the .mjs file is completely ignored, and the .js file is read (console output happens), but the export default { ... } seems to be ignored. Converting this config back to .mocharc.json works as expected.

### Minimal, Complete and Verifiable Example

create a .mocharc.js config file with `export default { ... }` as the config interface and run the test suite. Config will be ignored.

### Versions

version 11.7.5

### Additional Info

_No response_
