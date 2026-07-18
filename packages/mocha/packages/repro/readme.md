# Issue 5922: two hook crashes

[PR 5922](https://github.com/mochajs/mocha/issues/5922)

Cannot repro as described on Linux Mint 22.1 Cinnamon, requested an update to the report.

```log
$ npm run test

> test
> cross-env NODE_ENV=test mocha

(node:219243) [DEP0151] DeprecationWarning: No "main" or "exports" field defined in the package.json for /.../repro/node_modules/mocha/ resolving the main entry point "index.js", imported from /.../repro/test.js.
Default "index" lookups for the main are deprecated for ES modules.
(Use `node --trace-deprecation ...` to show where the warning was created)


  cascade
    1) "before all" hook for "runs after setup"
    2) "after all" hook for "runs after setup"


  0 passing (1ms)
  2 failing

  1) cascade
       "before all" hook for "runs after setup":
     Error: the real error
      at Context.<anonymous> (file:///.../repro/test.js:7:11)
      at process.processImmediate (node:internal/timers:534:21)

  2) cascade
       "after all" hook for "runs after setup":
     TypeError: Cannot read properties of undefined (reading 'close')
      at Context.<anonymous> (file:///.../repro/test.js:11:21)
      at process.processImmediate (node:internal/timers:534:21)
```

```log
$ npm run test:allow-uncaught

> test:allow-uncaught
> cross-env NODE_ENV=test mocha --allow-uncaught

(node:218080) [DEP0151] DeprecationWarning: No "main" or "exports" field defined in the package.json for /.../repro/node_modules/mocha/ resolving the main entry point "index.js", imported from /.../repro/test.js.
Default "index" lookups for the main are deprecated for ES modules.
(Use `node --trace-deprecation ...` to show where the warning was created)


  cascade
/.../repro/node_modules/mocha/lib/runner.cjs:1115
    throw err;
    ^

Error: the real error
    at Context.<anonymous> (file:///.../repro/test.js:7:11)
    at callFn (file:///.../repro/node_modules/mocha/lib/runnable.js:360:23)
    at Hook.run (file:///.../repro/node_modules/mocha/lib/runnable.js:348:7)
    at next (/.../repro/node_modules/mocha/lib/runner.cjs:619:10)
    at Immediate.<anonymous> (/.../repro/node_modules/mocha/lib/runner.cjs:702:5)
    at process.processImmediate (node:internal/timers:534:21)
```
