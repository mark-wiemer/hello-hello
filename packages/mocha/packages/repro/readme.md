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

## Cannot repro

### splits arguments on all whitespace

```
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:mocha npm test


> test
> npx cross-env MOCHA_OPTIONS='' mocha  --grep foo
> --color  ; echo; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)

  mocha:cli:mocha loaded opts {
  _: [],
  grep: 'foo\r',
  config: false,
  package: false,
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

sh: 2: --color: not found

Exit code 0
  mocha:cli:mocha loaded opts { _: [], version: true } +0ms
  mocha:cli:mocha running Mocha in-process +0ms
Mocha 11.8.0
Node v22.21.1
```

### preserves trailing backslashes in unquoted arguments

11.8.0: prints help and exits with 0

```
$ npm run test

> test
> npx cross-env MOCHA_OPTIONS='--grep foo\' mocha; echo; echo Exit code $?; echo Mocha$(mocha --version); echo Node $(node --version)

mocha inspect [spec..]

Run tests with Mocha

Commands
  mocha inspect [spec..]  Run tests with Mocha                         [default]
...
    Docs: https://mochajs.org/

✖ ERROR: null

Exit code 0
Mocha 11.8.0
Node v22.21.1
```

12.0.0-rc.6: prints error and exits with 0

```
$ npm run test

> test
> npx cross-env MOCHA_OPTIONS='--grep foo\' mocha; echo; echo Exit code $?; echo Mocha$(mocha --version); echo Node $(node --version)

/.../repro/node_modules/mocha/lib/mocha.cjs:562
    this.options.grep = new RegExp(arg[1] || arg[0], arg[2]);
                        ^

SyntaxError: Invalid regular expression: /foo\/: \ at end of pattern
    at new RegExp (<anonymous>)
    at Mocha.grep (/.../repro/node_modules/mocha/lib/mocha.cjs:562:25)
    at new Mocha (/.../repro/node_modules/mocha/lib/mocha.cjs:176:8)
    at exports.handler (/.../repro/node_modules/mocha/lib/cli/run.cjs:140:17)
    at runCommand (file:///.../repro/node_modules/mocha/lib/cli/cli.js:96:14)

Node.js v22.21.1

Exit code 0
Mocha 12.0.0-rc.6
Node v22.21.1
```

This PR (mark-wiemer-cli-parser-regression-repro): same as RC 6, prints error and exits with 0

```
$ npm run test

> test
> npx cross-env MOCHA_OPTIONS='--grep foo\' mocha; echo; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)

/home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/mocha.cjs:562
    this.options.grep = new RegExp(arg[1] || arg[0], arg[2]);
                        ^

SyntaxError: Invalid regular expression: /foo\/: \ at end of pattern
    at new RegExp (<anonymous>)
    at Mocha.grep (/home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/mocha.cjs:562:25)
    at new Mocha (/home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/mocha.cjs:176:8)
    at exports.handler (/home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/cli/run.cjs:140:17)
    at runCommand (file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/cli/cli.js:96:14)

Node.js v22.21.1

Exit code 0
Mocha 12.0.0-rc.6.mark-wiemer-cli-parser-regression-repro
Node v22.21.1
```
