import { describe, expect, it } from "vitest";
import { getBlogPostPaths } from "./recent-posts";

describe("getBlogPostPaths", () => {
  it("includes the expected slug and filename", () => {
    const paths = getBlogPostPaths();
    expect(
      paths.find((entry) => entry.params.slug === "testing-accessibility-reflow"),
    ).not.toBeUndefined();
  });
});
