var mocha = require("mocha");

console.log("heyo");

class MyReporter {
  MyReporter(runner) {
    console.log("hello");
    this.passes = 0;
    this.failures = 0;
    mocha.reporters.Base.call(this, runner);

    runner.on("pass", function (test) {
      passes++;
      console.log("pass: %s", test.fullTitle());
    });

    runner.on("fail", function (test, err) {
      failures++;
      console.log("fail: %s -- error: %s", test.fullTitle(), err.message);
    });

    runner.on("end", function () {
      console.log("end: %d/%d", passes, passes + failures);
    });
  }
}

// To have this reporter "extend" a built-in reporter, change it to extend:
// class MyReporter extends mocha.reporters.Spec {
module.exports = MyReporter;
