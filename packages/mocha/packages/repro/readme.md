# Issue 6265: `--parallel` worker death loses spec file path on synthetic failure

[Issue 6265](https://github.com/mochajs/mocha/issues/6265)

Reproduction attempts are on Linux Mint 22.1 Cinnamon in Bash using fnm.

```log
$ npm run test

> test
> mocha --parallel --jobs 2 --reporter json; echo; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)

{
  "stats": {
    "suites": 0,
    "tests": 1,
    "passes": 1,
    "pending": 0,
    "failures": 1,
    "start": "2026-09-12T21:54:48.005Z",
    "end": "2026-09-12T21:54:48.074Z",
    "duration": 69
  },
  "tests": [
    {
      "title": "works",
      "fullTitle": "works",
      "file": "/.../repro/test/works.spec.js",
      "duration": 0,
      "currentRetry": 0,
      "speed": "fast",
      "err": {}
    }
  ],
  "pending": [],
  "failures": [
    {
      "title": "Uncaught error outside test suite",
      "fullTitle": "Uncaught error outside test suite",
      "currentRetry": 0,
      "err": {
        "stack": "Error: Workerpool Worker terminated Unexpectedly\n    exitCode: `1`\n signalCode: `null`\n    spawnfile: `/.../bin/node`\n    stdout: `null`\n    stderr: `null`\n\n    at ChildProcess.<anonymous> (node_modules/workerpool/src/WorkerHandler.js:369:13)\n    at ChildProcess.emit (node:events:509:20)\n    at ChildProcess._handle.onexit (node:internal/child_process:294:12)",
        "message": "Workerpool Worker terminated Unexpectedly\n    exitCode: `1`\n    signalCode: `null`\n    workerpool.script: `/.../repro/node_modules/mocha/lib/nodejs/worker.cjs`\n    spawnArgs: `/.../bin/node,/.../repro/node_modules/mocha/lib/nodejs/worker.cjs`\n    spawnfile: `/.../bin/node`\n    stdout: `null`\n    stderr: `null`\n",
        "uncaught": true
      }
    }
  ],
  "passes": [
    {
      "title": "works",
      "fullTitle": "works",
      "file": "/.../repro/test/works.spec.js",
      "duration": 0,
      "currentRetry": 0,
      "speed": "fast",
      "err": {}
    }
  ]
}
Exit code 0
Mocha 12.0.1
Node v26.5.0
```
