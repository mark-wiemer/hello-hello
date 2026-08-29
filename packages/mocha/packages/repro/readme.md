# Issue 6252: Mocha 12 RC 6 fails to parse some common cases

[Issue 6252](https://github.com/mochajs/mocha/issues/6252)

Reproduction attempts are on Linux Mint 22.1 Cinnamon in Bash.

## Can repro

### should parse quoted flags from MOCHA_OPTIONS

```
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:mocha npm test


> test
> npx cross-env MOCHA_OPTIONS="--grep 'foo bar' --color" mocha; echo; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)

  mocha:cli:mocha loaded opts {
  _: [ "bar'" ],
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  package: false,
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ],
  grep: "'foo",
  color: true,
  config: false
} +0ms
  mocha:cli:mocha running Mocha in-process +0ms
Error: No test files found: "bar'"

Exit code 0
  mocha:cli:mocha loaded opts { _: [], version: true } +0ms
  mocha:cli:mocha running Mocha in-process +1ms
Mocha 12.0.0-rc.6
Node v22.21.1
```

### should allow negative numeric values in MOCHA_OPTIONS

```
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:mocha npm test


> test
> mocha --timeout -1; echo; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)

Error: Not enough arguments following: timeout

Exit code 0
  mocha:cli:mocha loaded opts { _: [], version: true } +0ms
  mocha:cli:mocha running Mocha in-process +1ms
Mocha 12.0.0-rc.6
Node v22.21.1
```

### rejects unterminated quoted arguments

`file:../mocha`: `12.0.0-rc.6.mark-wiemer-cli-parser-regression-repro`

```
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:mocha npm test


> test
> npx cross-env MOCHA_OPTIONS='--grep "foo' mocha ; echo; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)

Error: Unterminated quote in arguments: --grep "foo

Exit code 0
  mocha:cli:mocha loaded opts { _: [], version: true } +0ms
  mocha:cli:mocha running Mocha in-process +1ms
Mocha 12.0.0-rc.6.mark-wiemer-cli-parser-regression-repro
Node v22.21.1
```

`Mocha 12.0.0-rc.6`:

```
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:mocha npm test


> test
> npx cross-env MOCHA_OPTIONS='--grep "foo' mocha ; echo; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)

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
  grep: '"foo',
  config: false
} +0ms
  mocha:cli:mocha running Mocha in-process +1ms


  ✔ "foo bar

  1 passing (0ms)


Exit code 0
  mocha:cli:mocha loaded opts { _: [], version: true } +0ms
  mocha:cli:mocha running Mocha in-process +1ms
Mocha 12.0.0-rc.6
Node v22.21.1
```

`Mocha 11.8.0`:

```
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:mocha npm test


> test
> npx cross-env MOCHA_OPTIONS='--grep "foo' mocha ; echo; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)

  mocha:cli:mocha loaded opts {
  _: [],
  config: false,
  package: false,
  grep: '"foo',
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  reporter: 'spec',
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha running Mocha in-process +1ms


  ✔ "foo bar

  1 passing (1ms)


Exit code 0
  mocha:cli:mocha loaded opts { _: [], version: true } +0ms
  mocha:cli:mocha running Mocha in-process +1ms
Mocha 11.8.0
Node v22.21.1
```
