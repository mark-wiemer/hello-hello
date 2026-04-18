import { add } from "./add.js";
import assert from "node:assert";

describe("add", () => {
  it("works", () => {
    assert.equal(add(1, 1), 2);
  });
});
