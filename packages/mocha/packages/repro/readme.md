# Issue 6116: nondeterminism

[PR 6116](https://github.com/mochajs/mocha/issues/6116)

Repros as-described on Linux Mint 22.1 Cinnamon:

```log
$ npm run test

> test
> cross-env NODE_ENV=test mocha


  1) Uncaught error outside test suite

  0 passing (1ms)
  1 failing

  1) Uncaught error outside test suite:
     Uncaught Error: boom
      at Timeout._onTimeout (file:///.../test.js:2:9)
      at listOnTimeout (node:internal/timers:588:17)
      at process.processTimers (node:internal/timers:523:7)





  suite
    ✔ should pass

$ npm run test

> test
> cross-env NODE_ENV=test mocha



  1) Uncaught error outside test suite
  suite
    ✔ should pass


  1 passing (3ms)
  1 failing

  1) Uncaught error outside test suite:
     Uncaught Error: boom
      at Timeout._onTimeout (file:///.../test.js:2:9)
      at listOnTimeout (node:internal/timers:588:17)
      at process.processTimers (node:internal/timers:523:7)
```
