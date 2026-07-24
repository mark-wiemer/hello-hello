# Issue 5507: unhandledRejection

[Issue 5507](https://github.com/mochajs/mocha/issues/5507)

Reproduction attempts are on Linux Mint 22.1 Cinnamon in Bash.

Cannot reproduce with Mocha 12 RC 5:

```
$ npm test

> test
> mocha --version; node --version; mocha; echo $?

12.0.0-rc.5
v20.19.0


  1) t

  0 passing (3ms)
  1 failing

  1) t:

      AssertionError [ERR_ASSERTION]: Expected values to be loosely deep-equal:

[Object: null prototype] {}

should loosely deep-equal

{
  a: 1
}
      + expected - actual

      -{}
      +{
      +  "a": 1
      +}

      at Context.<anonymous> (test.js:2:26)
      at process.processImmediate (node:internal/timers:483:21)



1
```
