# Issue 6147: DEP0151

[PR 6147](https://github.com/mochajs/mocha/issues/6147)

Repro on Linux Mint 22.1 Cinnamon:

```log
$ npm run test

> test
> cross-env NODE_ENV=test mocha

(node:232588) [DEP0151] DeprecationWarning: No "main" or "exports" field defined in the package.json for /.../repro/node_modules/mocha/ resolving the main entry point "index.js", imported from /.../repro/test.js.
Default "index" lookups for the main are deprecated for ES modules.
(Use `node --trace-deprecation ...` to show where the warning was created)


  mocha
    ✔ works


  1 passing (1ms)
```
