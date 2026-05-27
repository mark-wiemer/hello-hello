# docs: switch util.inherits to class extends

[PR 5677](https://github.com/mochajs/mocha/pull/5677)

Close, but failing:

```log
$ npm run test

> test
> cross-env NODE_ENV=test mocha

Hello from test

 Exception during run: TypeError: this._reporter is not a constructor
    at Mocha.run (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\node_modules\mocha\lib\mocha.js:998:18)
    at singleRun (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\node_modules\mocha\lib\cli\run-helpers.js:175:16)
    at async exports.handler (C:\Users\markw\my-stuff\hello-hello\packages\mocha\packages\repro\node_modules\mocha\lib\cli\run.js:376:5)
```
