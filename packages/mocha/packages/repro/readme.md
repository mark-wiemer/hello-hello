# Issue 6147: DEP0151

[Issue 6147](https://github.com/mochajs/mocha/issues/6147)

Reproductions are on Linux Mint 22.1 Cinnamon with Node 22.21.1. Irrelevant path parts replaced with ellipsis.

Fails with reported DEP0151 error in RC 2:

```
$ npm test

> test
> mocha --version; mocha

12.0.0-rc.2
(node:19839) [DEP0151] DeprecationWarning: No "main" or "exports" field defined in the package.json for /.../repro/node_modules/mocha/ resolving the main entry point "index.js", imported from /.../repro/test.js.
Default "index" lookups for the main are deprecated for ES modules.
(Use `node --trace-deprecation ...` to show where the warning was created)


  ✔ works

  1 passing (0ms)
```

Works in beta 9.4:

```
$ npm test

> test
> mocha --version; mocha

12.0.0-beta-9.4


  ✔ works

  1 passing (1ms)
```

Fails even worse in beta 9.5 and beta 9.6:

```
$ npm test

> test
> mocha --version; mocha

12.0.0-beta-9.6

 Exception during run: Error: Cannot find package '/.../repro/node_modules/mocha/index.js' imported from /.../repro/test.js
    at legacyMainResolve (node:internal/modules/esm/resolve:204:26)
    at packageResolve (node:internal/modules/esm/resolve:777:12)
    at moduleResolve (node:internal/modules/esm/resolve:853:18)
    at defaultResolve (node:internal/modules/esm/resolve:983:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:731:20)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:708:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:310:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:182:49) {
  code: 'ERR_MODULE_NOT_FOUND'
}
```
