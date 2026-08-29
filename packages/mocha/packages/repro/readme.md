# Issue 6252: Mocha 12 RC 6 fails to parse some common cases

[Issue 6252](https://github.com/mochajs/mocha/issues/6252)

Reproduction attempts are on Linux Mint 22.1 Cinnamon in Bash.

Cannot repro `should parse quoted flags from MOCHA_OPTIONS` failure:

```
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:mocha npm test


> test
> mocha --grep 'foo bar' --color; echo; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)

  mocha:cli:mocha loaded opts {
  _: [],
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  package: false,
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ],
  grep: 'foo bar',
  color: true,
  config: false
} +0ms
  mocha:cli:mocha running Mocha in-process +1ms


  0 passing (0ms)


Exit code 0
  mocha:cli:mocha loaded opts { _: [], version: true } +0ms
  mocha:cli:mocha running Mocha in-process +1ms
Mocha 12.0.0-rc.6
Node v22.21.1
```
