import mocha from "mocha";

// You can extend other reporters by changing the class you extend:
// class MyReporter extends mocha.reporters.Spec {
class MyReporter extends mocha.reporters.Base {
  constructor(runner) {
    super(runner);

    let passes = 0;
    let failures = 0;

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
