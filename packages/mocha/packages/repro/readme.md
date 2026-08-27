# Issue 6245: unhandledRejection

[Issue 6245](https://github.com/mochajs/mocha/issues/6245)

Reproduction attempts are on Linux Mint 22.1 Cinnamon in Bash.

Cannot reproduce with Mocha 11.8.0:

```
$ npm test

> test
> echo Mocha $(mocha --version); echo Node $(node --version); node test.js; echo Exit code $?

Mocha 11.8.0
Node v22.21.1
function
Exit code 0
```

Can reproduce with Mocha 12 RC 6:

```
$ npm test

> test
> echo Mocha $(mocha --version); echo Node $(node --version); node test.js; echo Exit code $?

Mocha 12.0.0-rc.6
Node v22.21.1
object
/.../repro/test.js:3
new Mocha();
^

TypeError: Mocha is not a constructor
    at Object.<anonymous> (/.../repro/test.js:3:1)
    at Module._compile (node:internal/modules/cjs/loader:1706:14)
    at Object..js (node:internal/modules/cjs/loader:1839:10)
    at Module.load (node:internal/modules/cjs/loader:1441:32)
    at Function._load (node:internal/modules/cjs/loader:1263:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:237:24)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
    at node:internal/main/run_main_module:36:49

Node.js v22.21.1
Exit code 1
```
