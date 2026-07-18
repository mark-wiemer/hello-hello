# Issue 5925: parent-suite teardown error masks original failure from nested suite

[Issue 5925](https://github.com/mochajs/mocha/issues/5925)

Repro on Linux Mint 22.1 Cinnamon:

```log
$ npm run test

> test
> cross-env NODE_ENV=test mocha

(node:234721) [DEP0151] DeprecationWarning: No "main" or "exports" field defined in the package.json for /.../repro/node_modules/mocha/ resolving the main entry point "index.js", imported from /.../repro/test.js.
Default "index" lookups for the main are deprecated for ES modules.
(Use `node --trace-deprecation ...` to show where the warning was created)


  outer suite
    inner suite
      1) fails for the real reason
    2) "after all" hook in "outer suite"


  0 passing (1ms)
  2 failing

  1) outer suite
       inner suite
         fails for the real reason:
     Error: inner test failed
      at Context.<anonymous> (file:///.../repro/test.js:10:13)
      at process.processImmediate (node:internal/timers:534:21)

  2) outer suite
       "after all" hook in "outer suite":
     Error: outer cleanup failed
      at Context.<anonymous> (file:///.../repro/test.js:5:11)
      at process.processImmediate (node:internal/timers:534:21)
```

There should only be the "fails for the real reason" error, not the "after all" error.
