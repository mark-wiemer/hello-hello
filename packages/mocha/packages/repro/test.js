import { describe, after, it } from "mocha";

describe("outer suite", () => {
  after(() => {
    throw new Error("outer cleanup failed");
  });

  describe("inner suite", () => {
    it("fails for the real reason", () => {
      throw new Error("inner test failed");
    });
  });
});
