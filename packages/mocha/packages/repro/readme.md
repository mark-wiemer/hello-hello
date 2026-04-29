# Mocha issue 5812

[Bug: .mocharc.js / .mocharc.mjs / ESM export default configs don't seem to work](https://github.com/mochajs/mocha/issues/5812)

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

## Setup

Node 22.21.1, Linux Mint 22.1 Cinnamon

`package.json` has two variants, Mocha main and Mocha release:

```json
{
  "type": "module",
  "//": {
    "": "this is just for notes, not used anywhere",
    "dependencies": {
      "mocha-main": "file:../mocha",
      "mocha-release": "11.7.5"
    }
  },
  "scripts": {
    "test:debug": "npx cross-env DEBUG=mocha:cli:mocha npm test",
    "test": "cross-env NODE_ENV=test mocha"
  },
  "dependencies": {
    "mocha": "11.7.5"
  },
  "devDependencies": {
    "cross-env": "^10.1.0"
  }
}
```

```js
// .mocharc.js or .mocharc.mjs
export default {
  spec: ["src/**/*.test.ts"],
};
```

```ts
// src/sample.test.ts
console.log("Hello from sample.test.ts");
```

## Mocha 11.7.5 (does repro)

`.mocharc.mjs`: New values not logged anywhere

```log
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:mocha npm test


> test
> cross-env NODE_ENV=test mocha

  mocha:cli:mocha loaded opts {
  _: [],
  config: false,
  package: false,
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha running Mocha in-process +1ms
Error: No test files found: "test"
```

`.mocharc.js`: Does repro (values not included at all)

```log
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:mocha npm test


> test
> cross-env NODE_ENV=test mocha

  mocha:cli:mocha loaded opts {
  _: [],
  config: false,
  package: false,
  __esModule: true,
  default: { spec: [ 'src/**/*.test.ts' ] },
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha running Mocha in-process +0ms
Error: No test files found: "test"
```

## Mocha main branch (1b3d6042, 2026-04-27, does not repro)

`.mocharc.mjs`: Does not repro

```log
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:mocha npm test


> test
> cross-env NODE_ENV=test mocha

  mocha:cli:mocha loaded opts {
  _: [ 'src/**/*.test.ts' ],
  config: false,
  package: false,
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha running Mocha in-process +1ms
Hello from sample.test.ts


  0 passing (0ms)

```

`.mocharc.js`: Does not repro

```log
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:mocha npm test


> test
> cross-env NODE_ENV=test mocha

  mocha:cli:mocha loaded opts {
  _: [ 'src/**/*.test.ts' ],
  config: false,
  package: false,
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha running Mocha in-process +1ms
Hello from sample.test.ts


  0 passing (1ms)

```

## Conclusion

Fixed in an unreleased commit after 11.7.5, will be fixed in 12.0.0 and is already fixed in a beta release.
