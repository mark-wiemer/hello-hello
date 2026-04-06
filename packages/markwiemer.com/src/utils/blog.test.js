import { describe, expect, it } from "vitest";
import { getAllBlogPosts } from "./blog";

describe("getAllBlogPosts", () => {
  it("includes the expected slug and filename", () => {
    const paths = getAllBlogPosts();
    expect(
      paths.find((entry) => entry.params.slug === "testing-accessibility-reflow"),
    ).not.toBeUndefined();
  });
});
