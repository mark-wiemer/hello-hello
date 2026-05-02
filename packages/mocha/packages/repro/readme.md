# Mocha cli.js migration to ESM

[Repo: Convert `cli.js` to ESM · Issue 5899 · mochajs/mocha](https://github.com/mochajs/mocha/issues/5899)

## Repro

I cannot yet reproduce this issue reliably. The "special require logic" documented in the "Areas of concern" section is not currently working as intended on any branch, but I promise it was working at one point! It seems like even when installing from registry, it's using the local files. I'm going to remove the Mocha submodule entirely for commits that rely on the registry.

To reproduce this issue, I'm using my fork, `mark-wiemer/mocha`, and two branches:

- [`issue-5899-12.0.0-beta-9.4-unreleased`](https://github.com/mark-wiemer/mocha/tree/issue-5899-12.0.0-beta-9.4-unreleased): based on tip of `main` at the time of writing (2026-05-02)
- [`issue-5899-11.7.5`](https://github.com/mark-wiemer/mocha/tree/issue-5899-12.0.0-11.7.5): based on 11.7.5 (tag `v11.7.5`), just adding logs

If any `log` code blocks have an isolated timestamp near the top or at the end, that's from my custom shell config, not Mocha. I'm trying to manually remove them but may forget!

### Repro steps

#### Local

<!-- todo add submodule -->

In `package.json`, ensure we're using the local version:

```diff
- "mocha": "11.7.5"
+ "mocha": "file:../mocha"
```

Then run:

```sh
# Go to packages/mocha/packages/mocha
cd ../mocha
npm i
# Go to packages/mocha/packages/repro
cd ../repro
npm install
npm run cli
```

#### Registry

<!-- todo delete submodule -->

Custom repro steps, change `package.json`:

```diff
- "mocha": "file:../mocha"
+ "mocha": "11.7.5"
```

Then run:

```sh
npm install
npm run cli
```

### 11.7.5 from registry (fails, "cannot find module")

Actual result on Windows:

```log
$ npm run cli

> cli
> npx cross-env DEBUG=mocha:cli* mocha --no-package

  mocha:cli:config findConfig: found config file C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\.mocharc.json +0ms
  mocha:cli:config loadConfig: trying to parse config at C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\.mocharc.json +1ms
  mocha:cli:mocha loaded opts {
  _: [],
  package: false,
  config: false,
  reporter: 'my-reporter',
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha running Mocha in-process +0ms
  mocha:cli:cli entered main with raw args [] +0ms

✖ ERROR: TypeError: Could not load reporter "my-reporter":

 Error: Cannot find module 'C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\my-reporter'
Require stack:
- C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js
- C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\options.js
- C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\bin\mocha.js
    at Function._resolveFilename (node:internal/modules/cjs/loader:1383:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1025:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1030:22)
    at Function._load (node:internal/modules/cjs/loader:1192:37)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:237:24)
    at Module.require (node:internal/modules/cjs/loader:1463:12)
    at require (node:internal/modules/helpers:147:16)
    at exports.validateLegacyPlugin (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js:292:25)
    at C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run.js:359:9 {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\lib\\cli\\run-helpers.js',
    'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\lib\\cli\\options.js',
    'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\bin\\mocha.js'
  ]
}
    at createInvalidReporterError (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\errors.js:95:13)
    at createInvalidLegacyPluginError (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\errors.js:229:14)
    at createUnknownError (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js:275:5)
    at exports.validateLegacyPlugin (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js:294:15)
    at C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run.js:359:9 {
  code: 'ERR_MOCHA_INVALID_REPORTER',
  reporter: 'my-reporter'
}
```

Expected result on Windows is below. It's taken from an unsaved worktree, working to recover it!

```log
$ npm run cli

> cli
> npx cross-env DEBUG=mocha:cli* mocha --no-package

  mocha:cli:config findConfig: found config file C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\.mocharc.json +0ms
  mocha:cli:config loadConfig: trying to parse config at C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\.mocharc.json +1ms
  mocha:cli:mocha loaded opts {
  _: [],
  package: false,
  config: false,
  reporter: 'my-reporter',
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha running Mocha in-process +1ms
  mocha:cli:cli entered main with raw args [] +0ms
  mocha:cli:run post-yargs config {
  package: [Getter/Setter],
  _: [],
  config: false,
  reporter: 'my-reporter',
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ],
  watchIgnore: [ 'node_modules', '.git' ],
  'pass-on-failing-test-suite': false,
  passOnFailingTestSuite: false,
  spec: [ 'test' ],
  '$0': 'mocha'
} +0ms
  mocha:cli:lookup-files looking for files using glob pattern: test+(.js|.cjs|.mjs) +0ms
  mocha:cli:run:helpers test files (in order):  [
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\repro\\test.js'
] +0ms
  mocha:cli:run:helpers single run with 1 file(s) +0ms
Hello from test
my-reporter loaded successfully from CWD node_modules
```

### 11.7.5 from local (v11.7.5, fails, "cannot find module")

Windows:

```log
$ npm run cli

> cli
> npx cross-env DEBUG=mocha:cli* mocha --no-package

  mocha:cli:config findConfig: found config file C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\.mocharc.json +0ms
  mocha:cli:config loadConfig: trying to parse config at C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\.mocharc.json +1ms
  mocha:cli:mocha loaded opts {
  _: [],
  package: false,
  config: false,
  reporter: 'my-reporter',
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha running Mocha in-process +0ms
  mocha:cli:cli entered main with raw args [] +0ms

✖ ERROR: TypeError: Could not load reporter "my-reporter":

 Error: Cannot find module 'C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\my-reporter'
Require stack:
- C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js
- C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\options.js
- C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\bin\mocha.js
    at Function._resolveFilename (node:internal/modules/cjs/loader:1383:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1025:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1030:22)
    at Function._load (node:internal/modules/cjs/loader:1192:37)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:237:24)
    at Module.require (node:internal/modules/cjs/loader:1463:12)
    at require (node:internal/modules/helpers:147:16)
    at exports.validateLegacyPlugin (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js:292:25)
    at C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run.js:359:9 {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\lib\\cli\\run-helpers.js',
    'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\lib\\cli\\options.js',
    'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\bin\\mocha.js'
  ]
}
    at createInvalidReporterError (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\errors.js:95:13)
    at createInvalidLegacyPluginError (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\errors.js:229:14)
    at createUnknownError (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js:275:5)
    at exports.validateLegacyPlugin (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js:294:15)
    at C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run.js:359:9 {
  code: 'ERR_MOCHA_INVALID_REPORTER',
  reporter: 'my-reporter'
}
```

### issue-5899-11.7.5 from local (74435be5)

asd

### issue-5899-12.0.0-beta-9.4-unreleased from local (6fb0419, fails, "cannot find module")

Windows:

```log
$ npm run cli

> cli
> npx cross-env DEBUG=mocha:cli* mocha --no-package

  mocha:cli:config findConfig: found config file C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\.mocharc.json +0ms
  mocha:cli:config loadConfig: trying to parse config at C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\.mocharc.json +1ms
  mocha:cli:mocha loaded opts {
  _: [],
  package: false,
  config: false,
  reporter: 'my-reporter',
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha running Mocha in-process +1ms
  mocha:cli:cli entered main with raw args [] +0ms
  mocha:cli:cli module.paths before modification: [
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\lib\\cli\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\lib\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\node_modules',
  'C:\\Users\\markw\\my-stuff\\node_modules',
  'C:\\Users\\markw\\node_modules',
  'C:\\Users\\node_modules',
  'C:\\node_modules'
] +1ms
  mocha:cli:cli module.paths after modification: [
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\lib\\cli\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\lib\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\node_modules',
  'C:\\Users\\markw\\my-stuff\\node_modules',
  'C:\\Users\\markw\\node_modules',
  'C:\\Users\\node_modules',
  'C:\\node_modules',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\repro',
  'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\repro\\node_modules'
] +0ms

✖ ERROR: TypeError: Could not load reporter "my-reporter":

 Error: Cannot find module 'C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\my-reporter'
Require stack:
- C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js
    at Function._resolveFilename (node:internal/modules/cjs/loader:1383:15)
    at defaultResolveImpl (node:internal/modules/cjs/loader:1025:19)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1030:22)
    at Function._load (node:internal/modules/cjs/loader:1192:37)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:237:24)
    at Module.require (node:internal/modules/cjs/loader:1463:12)
    at require (node:internal/modules/helpers:147:16)
    at exports.validateLegacyPlugin (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js:294:25)
    at C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run.js:356:9 {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    'C:\\Users\\markw\\my-stuff\\hello-hello\\packages\\mocha\\packages\\mocha\\lib\\cli\\run-helpers.js'
  ]
}
    at createInvalidReporterError (file:///C:/Users/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/errors.mjs:48:13)
    at createInvalidLegacyPluginError (file:///C:/Users/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/errors.mjs:182:14)
    at createUnknownError (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js:277:5)
    at exports.validateLegacyPlugin (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run-helpers.js:296:15)
    at C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\mocha\lib\cli\run.js:356:9 {
  code: 'ERR_MOCHA_INVALID_REPORTER',
  reporter: 'my-reporter'
}
```

## Areas of concern

There were three areas of concern:

1. Special `require` logic:

   ```js
   // ensure we can require() from current working directory
   if (typeof module.paths !== "undefined") {
     module.paths.push(cwd(), path.resolve("node_modules"));
   }
   ```

2. Allow direct execution:

   ```js
   // allow direct execution
   if (require.main === module) {
     exports.main();
   }
   ```

3. `bin/_mocha` logic:

   ```js
   /**
    * This file remains for backwards compatibility only.
    * Don't put stuff in this file.
    * @see module:lib/cli
    */

   require("../lib/cli").main();
   ```

### Special `require` logic

CJS code:

```js
// ensure we can require() from current working directory
if (typeof module.paths !== "undefined") {
  module.paths.push(cwd(), path.resolve("node_modules"));
}
```

[Modules: CommonJS modules | Node.js v25.9.0 Documentation](https://nodejs.org/api/modules.html#modulepaths)

- doesn't have much info! "The search paths for the module."

[2026-05-02 07:20 PDT - AI chat "Module.paths support in ESM migration" (Claude Sonnet 4.6)](https://claude.ai/share/64c8a5eb-91d1-4545-907b-63c5cbeb565e)

- working to verify AI claims...

### Allow direct execution

CJS code:

```js
// allow direct execution
if (require.main === module) {
  exports.main();
}
```

This has been changed in an open PR ([feat: convert `lib/cli/cli.mjs` to ESM by hainenber · Pull Request 5909 · mochajs/mocha](https://github.com/mochajs/mocha/pull/5909)):

```js
if (__filename === process.argv[1]) {
  main();
}
```

This is how I'd do it, my concerns are resolved :)

### `bin/_mocha` logic:

CJS code:

```js
/**
 * This file remains for backwards compatibility only.
 * Don't put stuff in this file.
 * @see module:lib/cli
 */

require("../lib/cli").main();
```

This doesn't need to change, `bin/_mocha` requires `lib/cli/index.js`, not the `lib/cli/cli.js` file. My concerns are resolved :)

## Followup work

Boxes are checked when work items are created or work is done :)

- [ ] Ensure there is test coverage for invoking via CLI and with custom require path
