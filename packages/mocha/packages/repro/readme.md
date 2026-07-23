# Issue 6147: DEP0151

[Issue 6147](https://github.com/mochajs/mocha/issues/6147)

Fails in RC 2:

```log
$ npm test

> test
> mocha --version; mocha

12.0.0-rc.2
(node:19839) [DEP0151] DeprecationWarning: No "main" or "exports" field defined in the package.json for /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/node_modules/mocha/ resolving the main entry point "index.js", imported from /home/markw/my-stuff/hello-hello/packages/mocha/packages/repro/test.js.
Default "index" lookups for the main are deprecated for ES modules.
(Use `node --trace-deprecation ...` to show where the warning was created)


  ✔ works

  1 passing (0ms)
```
