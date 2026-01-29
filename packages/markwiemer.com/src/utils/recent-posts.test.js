import { describe, expect, it } from "vitest";
import { getBlogPostPaths } from "./recent-posts";

describe("getBlogPostPaths", () => {
  // todo improve first-run performance
  it("includes the expected slug and filename", () => {
    const paths = getBlogPostPaths();
    const match = paths.find(
      (entry) => entry.props.filename === "2021-11-21 testing-accessibility-reflow",
    );

    expect(match?.params.slug).toBe("testing-accessibility-reflow");
  });
});
