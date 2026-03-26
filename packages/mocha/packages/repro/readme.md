# Mocha issue 5812

[Bug: .mocharc.js / .mocharc.mjs / ESM export default configs don't seem to work](https://github.com/mochajs/mocha/issues/5812)

My setup: current Mocha main, Node 22.21.1, Linux Mint 22.1 Cinnamon

Two errors reported: `.mocharc.js` and `.mocharc.mjs`. I cannot repro either issue.

`.mocharc.js`: Cannot repro, instead I get this output:

```log
$ pnpm run test:debug

> @ test:debug /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro
> npx cross-env DEBUG=* npm test


> test
> cross-env NODE_ENV=test mocha

  mocha:esm-utils assigning requireOrImport, require_module === true +0ms
  mocha:cli:config findConfig: found config file /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/.mocharc.js +0ms
  mocha:cli:config loadConfig: trying to parse config at /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/.mocharc.js +0ms
  mocha:cli:config parsers: load cwd-relative path: "/home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/.mocharc.js" +0ms
mocha config
  mocha:cli:options no config found in /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/package.json +0ms
  mocha:cli:mocha loaded opts {
  _: [ 'src/**/*.test.ts' ],
  config: false,
  package: false,
  extension: [ 'ts', 'tsx' ],
  'node-option': [ 'import=tsx' ],
  recursive: true,
  reporter: 'spec',
  require: [ './test/setup.ts' ],
  timeout: 5000,
  'watch-files': [ 'src/**/*.ts', 'test/**/*.ts' ],
  diff: true,
  slow: 75,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha final node argv [ '--import=tsx' ] +0ms
  mocha:cli:mocha forking child process via command: /home/markw/.local/share/fnm/node-versions/v22.21.1/installation/bin/node --import=tsx /home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/cli/cli.js src/**/*.test.ts --no-config --no-package --extension ts --extension tsx --recursive --reporter spec --require ./test/setup.ts --timeout 5000 --watch-files src/**/*.ts --watch-files test/**/*.ts --diff --slow 75 --ui bdd --watch-ignore node_modules --watch-ignore .git +1ms
node:internal/modules/package_json_reader:314
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
        ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'tsx' imported from /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:314:9)
    at packageResolve (node:internal/modules/esm/resolve:767:81)
    at moduleResolve (node:internal/modules/esm/resolve:853:18)
    at defaultResolve (node:internal/modules/esm/resolve:983:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:731:20)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:708:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:310:38)
    at onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:664:36)
    at TracingChannel.tracePromise (node:diagnostics_channel:350:14)
    at ModuleLoader.import (node:internal/modules/esm/loader:663:21) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v22.21.1
 ELIFECYCLE  Command failed with exit code 1.
```

`.mocharc.mjs`: Cannot repro, instead I get this output:

```log
$ pnpm run test:debug

> @ test:debug /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro
> npx cross-env DEBUG=* npm test


> test
> cross-env NODE_ENV=test mocha

  mocha:esm-utils assigning requireOrImport, require_module === true +0ms
  mocha:cli:config findConfig: found config file /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/.mocharc.mjs +0ms
  mocha:cli:config loadConfig: trying to parse config at /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/.mocharc.mjs +0ms
  mocha:cli:config parsers: load cwd-relative path: "/home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/.mocharc.mjs" +0ms
mocha config
  mocha:cli:options no config found in /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/package.json +0ms
  mocha:cli:mocha loaded opts {
  _: [ 'src/**/*.test.ts' ],
  config: false,
  package: false,
  extension: [ 'ts', 'tsx' ],
  'node-option': [ 'import=tsx' ],
  recursive: true,
  reporter: 'spec',
  require: [ './test/setup.ts' ],
  timeout: 5000,
  'watch-files': [ 'src/**/*.ts', 'test/**/*.ts' ],
  diff: true,
  slow: 75,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha final node argv [ '--import=tsx' ] +1ms
  mocha:cli:mocha forking child process via command: /home/markw/.local/share/fnm/node-versions/v22.21.1/installation/bin/node --import=tsx /home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/cli/cli.js src/**/*.test.ts --no-config --no-package --extension ts --extension tsx --recursive --reporter spec --require ./test/setup.ts --timeout 5000 --watch-files src/**/*.ts --watch-files test/**/*.ts --diff --slow 75 --ui bdd --watch-ignore node_modules --watch-ignore .git +0ms
node:internal/modules/package_json_reader:314
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
        ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'tsx' imported from /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:314:9)
    at packageResolve (node:internal/modules/esm/resolve:767:81)
    at moduleResolve (node:internal/modules/esm/resolve:853:18)
    at defaultResolve (node:internal/modules/esm/resolve:983:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:731:20)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:708:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:310:38)
    at onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:664:36)
    at TracingChannel.tracePromise (node:diagnostics_channel:350:14)
    at ModuleLoader.import (node:internal/modules/esm/loader:663:21) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v22.21.1
 ELIFECYCLE  Command failed with exit code 1.
```

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
