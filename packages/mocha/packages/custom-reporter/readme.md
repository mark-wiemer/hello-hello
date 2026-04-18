# Mocha custom reporters

Testing https://github.com/mochajs/mocha/pull/5677

## Overview

We removed `util.inherits` in a series of PRs related to item 5025. However, we didn't validate how much of a breaking change this would be. While research is ongoing, the official documented approach in Mocha 11.7.5 does not work in Mocha 12.0.0-beta-9.2. This contradicts our claim of "no intentional breaking changes" in Mocha 12 (item 5357) but is consistent with our statement in the same issue: "Mocha 12 will be used to ... Remove usage of `util.inherits` and convert all manual prototype management to ECMAScript classes"

All configs are tested on Linux Mint with Node 22.21.1

## Mocha 11.7.5

```
npm i -D mocha@11.7.5
```

This works:

```
npm run test:old
```

This fails:

```
npm run test:new:cjs
```

<details><summary>Detailed output</summary>

`npm run test:old:debug`:

```log
$ npm run test:old:debug

> custom-reporter@1.0.0 test:old:debug
> DEBUG=mocha:* mocha add.test.js --reporter my-old-reporter.cjs

  mocha:esm-utils assigning requireOrImport, require_module === true +0ms
  mocha:cli:options no config found in /home/markw/my-stuff/hello-hello/packages/mocha/packages/custom-reporter/package.json +0ms
  mocha:cli:mocha loaded opts {
  _: [ 'add.test.js' ],
  reporter: 'my-old-reporter.cjs',
  config: false,
  package: false,
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha running Mocha in-process +0ms
  mocha:cli:cli entered main with raw args [] +0ms
  mocha:plugin-loader registered plugin def "mochaHooks" +0ms
  mocha:plugin-loader registered plugin def "mochaGlobalSetup" +0ms
  mocha:plugin-loader registered plugin def "mochaGlobalTeardown" +0ms
  mocha:plugin-loader registered 3 plugin defs (0 ignored) +0ms
  mocha:plugin-loader finalized plugins: [Object: null prototype] {} +0ms
  mocha:cli:run post-yargs config {
  package: [Getter/Setter],
  _: [],
  reporter: 'my-old-reporter.cjs',
  config: false,
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ],
  watchIgnore: [ 'node_modules', '.git' ],
  'pass-on-failing-test-suite': false,
  passOnFailingTestSuite: false,
  spec: [ 'add.test.js' ],
  '$0': 'mocha'
} +0ms
  mocha:suite slow 75 +0ms
  mocha:suite timeout 2000 +1ms
  mocha:mocha configured 0 global setup functions +0ms
  mocha:mocha configured 0 global teardown functions +0ms
  mocha:cli:run:helpers test files (in order):  [
  '/home/markw/my-stuff/hello-hello/packages/mocha/packages/custom-reporter/add.test.js'
] +0ms
  mocha:cli:run:helpers single run with 1 file(s) +0ms
  mocha:mocha set lazy load to true +0ms
  mocha:suite timeout 2000 +2ms
  mocha:suite retries -1 +0ms
  mocha:suite slow 75 +0ms
  mocha:suite bail false +0ms
  mocha:runnable timeout 2000 +0ms
  mocha:runnable slow 75 +0ms
  mocha:runner grep(): setting to /.*/ +0ms
  mocha:runner globals(): setting to [
  mocha:runner   'global',          'clearImmediate',
  mocha:runner   'setImmediate',    'clearInterval',
  mocha:runner   'clearTimeout',    'setInterval',
  mocha:runner   'setTimeout',      'queueMicrotask',
  mocha:runner   'structuredClone', 'atob',
  mocha:runner   'btoa',            'performance',
  mocha:runner   'fetch',           'navigator',
  mocha:runner   'crypto',          'before',
  mocha:runner   'after',           'beforeEach',
  mocha:runner   'afterEach',       'run',
  mocha:runner   'context',         'describe',
  mocha:runner   'xcontext',        'xdescribe',
  mocha:runner   'specify',         'it',
  mocha:runner   'xspecify',        'xit',
  mocha:runner   'XMLHttpRequest',  'Date'
  mocha:runner ] +0ms
  mocha:runner globals(): setting to [] +1ms
  mocha:runner run(): got options: {
  mocha:runner   diff: true,
  mocha:runner   extension: [ 'js', 'cjs', 'mjs' ],
  mocha:runner   package: false,
  mocha:runner   reporter: 'my-old-reporter.cjs',
  mocha:runner   slow: 75,
  mocha:runner   timeout: 2000,
  mocha:runner   ui: 'bdd',
  mocha:runner   'watch-ignore': [ 'node_modules', '.git' ],
  mocha:runner   _: [],
  mocha:runner   config: false,
  mocha:runner   watchIgnore: [ 'node_modules', '.git' ],
  mocha:runner   'pass-on-failing-test-suite': false,
  mocha:runner   passOnFailingTestSuite: false,
  mocha:runner   spec: [ 'add.test.js' ],
  mocha:runner   '$0': 'mocha',
  mocha:runner   grep: undefined,
  mocha:runner   reporterOption: undefined,
  mocha:runner   reporterOptions: undefined,
  mocha:runner   global: [],
  mocha:runner   globalSetup: [],
  mocha:runner   globalTeardown: [],
  mocha:runner   enableGlobalSetup: true,
  mocha:runner   enableGlobalTeardown: true,
  mocha:runner   files: [
  mocha:runner     '/home/markw/my-stuff/hello-hello/packages/mocha/packages/custom-reporter/add.test.js'
  mocha:runner   ]
  mocha:runner } +0ms
  mocha:runner trying to remove listener for untracked object process {
  version: 'v22.21.1',
  versions: [Object],
  arch: 'x64',
  platform: 'linux',
  release: [Object],
  _rawDebug: [Function: _rawDebug],
  moduleLoadList: [Array],
  binding: [Function: binding],
  _linkedBinding: [Function: _linkedBinding],
  _events: [Object: null prototype],
  _eventsCount: 4,
  _maxListeners: undefined,
  domain: null,
  _exiting: [Getter/Setter],
  exitCode: [Getter/Setter],
  config: [Object],
  dlopen: [Function: dlopen],
  uptime: [Function: uptime],
  _getActiveRequests: [Function: _getActiveRequests],
  _getActiveHandles: [Function: _getActiveHandles],
  getActiveResourcesInfo: [Function: getActiveResourcesInfo],
  reallyExit: [Function: reallyExit],
  _kill: [Function: _kill],
  loadEnvFile: [Function: loadEnvFile],
  cpuUsage: [Function: cpuUsage],
  threadCpuUsage: [Function: threadCpuUsage],
  resourceUsage: [Function: resourceUsage],
  memoryUsage: [Function],
  constrainedMemory: [Function: constrainedMemory],
  availableMemory: [Function: availableMemory],
  kill: [Function: kill],
  exit: [Function: exit],
  execve: [Function: execve],
  ref: [Function: ref],
  unref: [Function: unref],
  finalization: [Getter/Setter],
  hrtime: [Function],
  openStdin: [Function (anonymous)],
  getuid: [Function: getuid],
  geteuid: [Function: geteuid],
  getgid: [Function: getgid],
  getegid: [Function: getegid],
  getgroups: [Function: getgroups],
  allowedNodeEnvironmentFlags: [NodeEnvironmentFlagsSet],
  assert: [Function: deprecated],
  features: [Object],
  _fatalException: [Function (anonymous)],
  setUncaughtExceptionCaptureCallback: [Function: setUncaughtExceptionCaptureCallback],
  hasUncaughtExceptionCaptureCallback: [Function: hasUncaughtExceptionCaptureCallback],
  emitWarning: [Function: emitWarning],
  nextTick: [Function: nextTick],
  _tickCallback: [Function: runNextTicks],
  sourceMapsEnabled: [Getter],
  setSourceMapsEnabled: [Function: setSourceMapsEnabled],
  getBuiltinModule: [Function: getBuiltinModule],
  _debugProcess: [Function: _debugProcess],
  _debugEnd: [Function: _debugEnd],
  _startProfilerIdleNotifier: [Function (anonymous)],
  _stopProfilerIdleNotifier: [Function (anonymous)],
  stdout: [Getter],
  stdin: [Getter],
  stderr: [Getter],
  abort: [Function: abort],
  umask: [Function: wrappedUmask],
  chdir: [Function: wrappedChdir],
  cwd: [Function: wrappedCwd],
  initgroups: [Function: initgroups],
  setgroups: [Function: setgroups],
  setegid: [Function (anonymous)],
  seteuid: [Function (anonymous)],
  setgid: [Function (anonymous)],
  setuid: [Function (anonymous)],
  env: [Object],
  title: 'node',
  argv: [Array],
  execArgv: [],
  pid: 99727,
  ppid: 99726,
  execPath: '/home/markw/.local/share/fnm/node-versions/v22.21.1/installation/bin/node',
  debugPort: 9229,
  argv0: 'node',
  _preload_modules: [],
  report: [Getter],
  mainModule: [Object],
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
} +0ms
  mocha:runner trying to remove listener for untracked object process {
  version: 'v22.21.1',
  versions: [Object],
  arch: 'x64',
  platform: 'linux',
  release: [Object],
  _rawDebug: [Function: _rawDebug],
  moduleLoadList: [Array],
  binding: [Function: binding],
  _linkedBinding: [Function: _linkedBinding],
  _events: [Object: null prototype],
  _eventsCount: 4,
  _maxListeners: undefined,
  domain: null,
  _exiting: [Getter/Setter],
  exitCode: [Getter/Setter],
  config: [Object],
  dlopen: [Function: dlopen],
  uptime: [Function: uptime],
  _getActiveRequests: [Function: _getActiveRequests],
  _getActiveHandles: [Function: _getActiveHandles],
  getActiveResourcesInfo: [Function: getActiveResourcesInfo],
  reallyExit: [Function: reallyExit],
  _kill: [Function: _kill],
  loadEnvFile: [Function: loadEnvFile],
  cpuUsage: [Function: cpuUsage],
  threadCpuUsage: [Function: threadCpuUsage],
  resourceUsage: [Function: resourceUsage],
  memoryUsage: [Function],
  constrainedMemory: [Function: constrainedMemory],
  availableMemory: [Function: availableMemory],
  kill: [Function: kill],
  exit: [Function: exit],
  execve: [Function: execve],
  ref: [Function: ref],
  unref: [Function: unref],
  finalization: [Getter/Setter],
  hrtime: [Function],
  openStdin: [Function (anonymous)],
  getuid: [Function: getuid],
  geteuid: [Function: geteuid],
  getgid: [Function: getgid],
  getegid: [Function: getegid],
  getgroups: [Function: getgroups],
  allowedNodeEnvironmentFlags: [NodeEnvironmentFlagsSet],
  assert: [Function: deprecated],
  features: [Object],
  _fatalException: [Function (anonymous)],
  setUncaughtExceptionCaptureCallback: [Function: setUncaughtExceptionCaptureCallback],
  hasUncaughtExceptionCaptureCallback: [Function: hasUncaughtExceptionCaptureCallback],
  emitWarning: [Function: emitWarning],
  nextTick: [Function: nextTick],
  _tickCallback: [Function: runNextTicks],
  sourceMapsEnabled: [Getter],
  setSourceMapsEnabled: [Function: setSourceMapsEnabled],
  getBuiltinModule: [Function: getBuiltinModule],
  _debugProcess: [Function: _debugProcess],
  _debugEnd: [Function: _debugEnd],
  _startProfilerIdleNotifier: [Function (anonymous)],
  _stopProfilerIdleNotifier: [Function (anonymous)],
  stdout: [Getter],
  stdin: [Getter],
  stderr: [Getter],
  abort: [Function: abort],
  umask: [Function: wrappedUmask],
  chdir: [Function: wrappedChdir],
  cwd: [Function: wrappedCwd],
  initgroups: [Function: initgroups],
  setgroups: [Function: setgroups],
  setegid: [Function (anonymous)],
  seteuid: [Function (anonymous)],
  setgid: [Function (anonymous)],
  setuid: [Function (anonymous)],
  env: [Object],
  title: 'node',
  argv: [Array],
  execArgv: [],
  pid: 99727,
  ppid: 99726,
  execPath: '/home/markw/.local/share/fnm/node-versions/v22.21.1/installation/bin/node',
  debugPort: 9229,
  argv0: 'node',
  _preload_modules: [],
  report: [Getter],
  mainModule: [Object],
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
} +0ms
  mocha:runner _addEventListener(): adding for event uncaughtException; 0 current listeners +1ms
  mocha:runner _addEventListener(): adding for event unhandledRejection; 0 current listeners +0ms
  mocha:runner run(): starting +0ms
  mocha:runner run(): emitting start +0ms
  mocha:runner run(): emitted start +0ms
  mocha:runner runSuite(): running  +0ms
  mocha:runner runSuite(): running add +0ms
  mocha:runner _addEventListener(): adding for event error; 0 current listeners +1ms
pass: add works
  mocha:runner run(): root suite completed; emitting end +0ms
end: 1/1
  mocha:runner run(): emitted end +0ms
```

`npm run test:new:cjs:debug`:

```log
$ npm run test:new:cjs:debug

> custom-reporter@1.0.0 test:new:cjs:debug
> DEBUG=mocha:* mocha add.test.js --reporter my-new-reporter.cjs

  mocha:esm-utils assigning requireOrImport, require_module === true +0ms
  mocha:cli:options no config found in /home/markw/my-stuff/hello-hello/packages/mocha/packages/custom-reporter/package.json +0ms
  mocha:cli:mocha loaded opts {
  _: [ 'add.test.js' ],
  reporter: 'my-new-reporter.cjs',
  config: false,
  package: false,
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ]
} +0ms
  mocha:cli:mocha running Mocha in-process +0ms
  mocha:cli:cli entered main with raw args [] +0ms
  mocha:plugin-loader registered plugin def "mochaHooks" +0ms
  mocha:plugin-loader registered plugin def "mochaGlobalSetup" +0ms
  mocha:plugin-loader registered plugin def "mochaGlobalTeardown" +0ms
  mocha:plugin-loader registered 3 plugin defs (0 ignored) +0ms
  mocha:plugin-loader finalized plugins: [Object: null prototype] {} +0ms
heyo
  mocha:cli:run post-yargs config {
  package: [Getter/Setter],
  _: [],
  reporter: 'my-new-reporter.cjs',
  config: false,
  diff: true,
  extension: [ 'js', 'cjs', 'mjs' ],
  slow: 75,
  timeout: 2000,
  ui: 'bdd',
  'watch-ignore': [ 'node_modules', '.git' ],
  watchIgnore: [ 'node_modules', '.git' ],
  'pass-on-failing-test-suite': false,
  passOnFailingTestSuite: false,
  spec: [ 'add.test.js' ],
  '$0': 'mocha'
} +0ms
  mocha:suite slow 75 +0ms
  mocha:suite timeout 2000 +0ms
  mocha:mocha configured 0 global setup functions +0ms
  mocha:mocha configured 0 global teardown functions +0ms
  mocha:cli:run:helpers test files (in order):  [
  '/home/markw/my-stuff/hello-hello/packages/mocha/packages/custom-reporter/add.test.js'
] +0ms
  mocha:cli:run:helpers single run with 1 file(s) +0ms
  mocha:mocha set lazy load to true +1ms
  mocha:suite timeout 2000 +3ms
  mocha:suite retries -1 +0ms
  mocha:suite slow 75 +0ms
  mocha:suite bail false +0ms
  mocha:runnable timeout 2000 +0ms
  mocha:runnable slow 75 +0ms
  mocha:runner grep(): setting to /.*/ +0ms
  mocha:runner globals(): setting to [
  mocha:runner   'global',          'clearImmediate',
  mocha:runner   'setImmediate',    'clearInterval',
  mocha:runner   'clearTimeout',    'setInterval',
  mocha:runner   'setTimeout',      'queueMicrotask',
  mocha:runner   'structuredClone', 'atob',
  mocha:runner   'btoa',            'performance',
  mocha:runner   'fetch',           'navigator',
  mocha:runner   'crypto',          'before',
  mocha:runner   'after',           'beforeEach',
  mocha:runner   'afterEach',       'run',
  mocha:runner   'context',         'describe',
  mocha:runner   'xcontext',        'xdescribe',
  mocha:runner   'specify',         'it',
  mocha:runner   'xspecify',        'xit',
  mocha:runner   'XMLHttpRequest',  'Date'
  mocha:runner ] +0ms
  mocha:runner globals(): setting to [] +0ms
  mocha:runner run(): got options: {
  mocha:runner   diff: true,
  mocha:runner   extension: [ 'js', 'cjs', 'mjs' ],
  mocha:runner   package: false,
  mocha:runner   reporter: 'my-new-reporter.cjs',
  mocha:runner   slow: 75,
  mocha:runner   timeout: 2000,
  mocha:runner   ui: 'bdd',
  mocha:runner   'watch-ignore': [ 'node_modules', '.git' ],
  mocha:runner   _: [],
  mocha:runner   config: false,
  mocha:runner   watchIgnore: [ 'node_modules', '.git' ],
  mocha:runner   'pass-on-failing-test-suite': false,
  mocha:runner   passOnFailingTestSuite: false,
  mocha:runner   spec: [ 'add.test.js' ],
  mocha:runner   '$0': 'mocha',
  mocha:runner   grep: undefined,
  mocha:runner   reporterOption: undefined,
  mocha:runner   reporterOptions: undefined,
  mocha:runner   global: [],
  mocha:runner   globalSetup: [],
  mocha:runner   globalTeardown: [],
  mocha:runner   enableGlobalSetup: true,
  mocha:runner   enableGlobalTeardown: true,
  mocha:runner   files: [
  mocha:runner     '/home/markw/my-stuff/hello-hello/packages/mocha/packages/custom-reporter/add.test.js'
  mocha:runner   ]
  mocha:runner } +1ms
  mocha:runner trying to remove listener for untracked object process {
  version: 'v22.21.1',
  versions: [Object],
  arch: 'x64',
  platform: 'linux',
  release: [Object],
  _rawDebug: [Function: _rawDebug],
  moduleLoadList: [Array],
  binding: [Function: binding],
  _linkedBinding: [Function: _linkedBinding],
  _events: [Object: null prototype],
  _eventsCount: 4,
  _maxListeners: undefined,
  domain: null,
  _exiting: [Getter/Setter],
  exitCode: [Getter/Setter],
  config: [Object],
  dlopen: [Function: dlopen],
  uptime: [Function: uptime],
  _getActiveRequests: [Function: _getActiveRequests],
  _getActiveHandles: [Function: _getActiveHandles],
  getActiveResourcesInfo: [Function: getActiveResourcesInfo],
  reallyExit: [Function: reallyExit],
  _kill: [Function: _kill],
  loadEnvFile: [Function: loadEnvFile],
  cpuUsage: [Function: cpuUsage],
  threadCpuUsage: [Function: threadCpuUsage],
  resourceUsage: [Function: resourceUsage],
  memoryUsage: [Function],
  constrainedMemory: [Function: constrainedMemory],
  availableMemory: [Function: availableMemory],
  kill: [Function: kill],
  exit: [Function: exit],
  execve: [Function: execve],
  ref: [Function: ref],
  unref: [Function: unref],
  finalization: [Getter/Setter],
  hrtime: [Function],
  openStdin: [Function (anonymous)],
  getuid: [Function: getuid],
  geteuid: [Function: geteuid],
  getgid: [Function: getgid],
  getegid: [Function: getegid],
  getgroups: [Function: getgroups],
  allowedNodeEnvironmentFlags: [NodeEnvironmentFlagsSet],
  assert: [Function: deprecated],
  features: [Object],
  _fatalException: [Function (anonymous)],
  setUncaughtExceptionCaptureCallback: [Function: setUncaughtExceptionCaptureCallback],
  hasUncaughtExceptionCaptureCallback: [Function: hasUncaughtExceptionCaptureCallback],
  emitWarning: [Function: emitWarning],
  nextTick: [Function: nextTick],
  _tickCallback: [Function: runNextTicks],
  sourceMapsEnabled: [Getter],
  setSourceMapsEnabled: [Function: setSourceMapsEnabled],
  getBuiltinModule: [Function: getBuiltinModule],
  _debugProcess: [Function: _debugProcess],
  _debugEnd: [Function: _debugEnd],
  _startProfilerIdleNotifier: [Function (anonymous)],
  _stopProfilerIdleNotifier: [Function (anonymous)],
  stdout: [Getter],
  stdin: [Getter],
  stderr: [Getter],
  abort: [Function: abort],
  umask: [Function: wrappedUmask],
  chdir: [Function: wrappedChdir],
  cwd: [Function: wrappedCwd],
  initgroups: [Function: initgroups],
  setgroups: [Function: setgroups],
  setegid: [Function (anonymous)],
  seteuid: [Function (anonymous)],
  setgid: [Function (anonymous)],
  setuid: [Function (anonymous)],
  env: [Object],
  title: 'node',
  argv: [Array],
  execArgv: [],
  pid: 99861,
  ppid: 99860,
  execPath: '/home/markw/.local/share/fnm/node-versions/v22.21.1/installation/bin/node',
  debugPort: 9229,
  argv0: 'node',
  _preload_modules: [],
  report: [Getter],
  mainModule: [Object],
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
} +0ms
  mocha:runner trying to remove listener for untracked object process {
  version: 'v22.21.1',
  versions: [Object],
  arch: 'x64',
  platform: 'linux',
  release: [Object],
  _rawDebug: [Function: _rawDebug],
  moduleLoadList: [Array],
  binding: [Function: binding],
  _linkedBinding: [Function: _linkedBinding],
  _events: [Object: null prototype],
  _eventsCount: 4,
  _maxListeners: undefined,
  domain: null,
  _exiting: [Getter/Setter],
  exitCode: [Getter/Setter],
  config: [Object],
  dlopen: [Function: dlopen],
  uptime: [Function: uptime],
  _getActiveRequests: [Function: _getActiveRequests],
  _getActiveHandles: [Function: _getActiveHandles],
  getActiveResourcesInfo: [Function: getActiveResourcesInfo],
  reallyExit: [Function: reallyExit],
  _kill: [Function: _kill],
  loadEnvFile: [Function: loadEnvFile],
  cpuUsage: [Function: cpuUsage],
  threadCpuUsage: [Function: threadCpuUsage],
  resourceUsage: [Function: resourceUsage],
  memoryUsage: [Function],
  constrainedMemory: [Function: constrainedMemory],
  availableMemory: [Function: availableMemory],
  kill: [Function: kill],
  exit: [Function: exit],
  execve: [Function: execve],
  ref: [Function: ref],
  unref: [Function: unref],
  finalization: [Getter/Setter],
  hrtime: [Function],
  openStdin: [Function (anonymous)],
  getuid: [Function: getuid],
  geteuid: [Function: geteuid],
  getgid: [Function: getgid],
  getegid: [Function: getegid],
  getgroups: [Function: getgroups],
  allowedNodeEnvironmentFlags: [NodeEnvironmentFlagsSet],
  assert: [Function: deprecated],
  features: [Object],
  _fatalException: [Function (anonymous)],
  setUncaughtExceptionCaptureCallback: [Function: setUncaughtExceptionCaptureCallback],
  hasUncaughtExceptionCaptureCallback: [Function: hasUncaughtExceptionCaptureCallback],
  emitWarning: [Function: emitWarning],
  nextTick: [Function: nextTick],
  _tickCallback: [Function: runNextTicks],
  sourceMapsEnabled: [Getter],
  setSourceMapsEnabled: [Function: setSourceMapsEnabled],
  getBuiltinModule: [Function: getBuiltinModule],
  _debugProcess: [Function: _debugProcess],
  _debugEnd: [Function: _debugEnd],
  _startProfilerIdleNotifier: [Function (anonymous)],
  _stopProfilerIdleNotifier: [Function (anonymous)],
  stdout: [Getter],
  stdin: [Getter],
  stderr: [Getter],
  abort: [Function: abort],
  umask: [Function: wrappedUmask],
  chdir: [Function: wrappedChdir],
  cwd: [Function: wrappedCwd],
  initgroups: [Function: initgroups],
  setgroups: [Function: setgroups],
  setegid: [Function (anonymous)],
  seteuid: [Function (anonymous)],
  setgid: [Function (anonymous)],
  setuid: [Function (anonymous)],
  env: [Object],
  title: 'node',
  argv: [Array],
  execArgv: [],
  pid: 99861,
  ppid: 99860,
  execPath: '/home/markw/.local/share/fnm/node-versions/v22.21.1/installation/bin/node',
  debugPort: 9229,
  argv0: 'node',
  _preload_modules: [],
  report: [Getter],
  mainModule: [Object],
  [Symbol(shapeMode)]: false,
  [Symbol(kCapture)]: false
} +0ms
  mocha:runner _addEventListener(): adding for event uncaughtException; 0 current listeners +0ms
  mocha:runner _addEventListener(): adding for event unhandledRejection; 0 current listeners +0ms
  mocha:runner run(): starting +1ms
  mocha:runner run(): emitting start +0ms
  mocha:runner run(): emitted start +0ms
  mocha:runner runSuite(): running  +0ms
  mocha:runner runSuite(): running add +0ms
  mocha:runner _addEventListener(): adding for event error; 0 current listeners +0ms
  mocha:runner run(): root suite completed; emitting end +1ms
  mocha:runner run(): emitted end +0ms
```

</details>

## Mocha 12.0.0-beta-9.2

```
npm i -D mocha@12.0.0-beta-9.2
```

This fails:

```
npm run test:old
```

This also fails:

```
npm run test:new:cjs
```

## References

- [#5025 - 🐛 Bug: remove util.inherits / convert to classes](https://github.com/mochajs/mocha/issues/5025)
- [#5180 - chore: switch reporters from util.inherits to ES2015 classes](https://github.com/mochajs/mocha/pull/5180)
- [#5357 - 📌 Mocha 12 Release Plan](https://github.com/mochajs/mocha/issues/5357)
