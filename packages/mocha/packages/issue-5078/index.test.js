import { expect } from "chai";

function doTest() {
  expect(1).to.equal(2);
}

describe("suite", () => {
  it("works", () => {
    doTest();
  });
});
