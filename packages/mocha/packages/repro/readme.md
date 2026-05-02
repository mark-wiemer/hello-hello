# Mocha cli.js migration to ESM

[Repo: Convert `cli.js` to ESM · Issue 5899 · mochajs/mocha](https://github.com/mochajs/mocha/issues/5899)

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

## Special `require` logic

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

## Allow direct execution

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

## `bin/_mocha` logic:

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
