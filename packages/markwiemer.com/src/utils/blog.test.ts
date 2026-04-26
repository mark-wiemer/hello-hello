import { describe, expect, it } from "vitest";
import { getAllBlogPosts, sortBlogPostsOldestFirst } from "./blog";

describe("getAllBlogPosts", () => {
  it("includes the expected slug and filename", () => {
    const paths = getAllBlogPosts();
    expect(
      paths.find((entry) => entry.params.slug === "testing-accessibility-reflow"),
      `${paths.map((path) => JSON.stringify(path))}`,
    ).not.toBeUndefined();
  });
});

describe("sortBlogPostsOldestFirst", () => {
  type Arg = Parameters<typeof sortBlogPostsOldestFirst>[0];
  it("basic test", () => {
    const a: Arg = {
      postDate: "2026-04-12",
      postTime: "20:02 PST",
    };
    const b: Arg = {
      postDate: "2026-04-12",
      postTime: "21:01 PST",
    };
    expect(sortBlogPostsOldestFirst(a, b)).toBeLessThan(0);
  });
});
