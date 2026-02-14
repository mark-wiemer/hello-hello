var Promise = require("bluebird");

Promise.config({
  warnings: true,
  longStackTraces: true,
});

describe("Suite", function () {
  it("Test", function () {
    return Promise.bind(this).then(function () {
      this.skip();
    });
  });
});
