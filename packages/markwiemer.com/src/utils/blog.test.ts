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
  it.each<[Arg, Arg]>([
    [
      { postDate: "2026-04-12", postTime: "20:02 PST" },
      { postDate: "2026-04-12", postTime: "21:01 PST" },
    ],
    [
      { postDate: "2026-04-10", postTime: "20:02 PST" },
      { postDate: "2026-04-12", postTime: "09:01 PST" },
    ],
    [
      { postDate: "2026-04-10", postTime: "20:02 PDT" },
      { postDate: "2026-04-10", postTime: "21:03 PST" },
    ],
  ])("a before b", (a, b) => {
    expect(sortBlogPostsOldestFirst(a, b)).toBeLessThan(0);
  });

  it.each<[Arg, Arg]>([
    [
      { postDate: "2026-04-12", postTime: "21:01 PST" },
      { postDate: "2026-04-12", postTime: "20:02 PST" },
    ],
    [
      { postDate: "2026-04-12", postTime: "09:01 PST" },
      { postDate: "2026-04-10", postTime: "20:02 PST" },
    ],
    [
      { postDate: "2026-04-10", postTime: "21:03 PST" },
      { postDate: "2026-04-10", postTime: "20:02 PDT" },
    ],
  ])("b before a", (a, b) => {
    expect(sortBlogPostsOldestFirst(a, b)).toBeGreaterThan(0);
  });

  it.each<[Arg, Arg]>([
    [
      { postDate: "2026-04-12", postTime: "21:01 PST" },
      { postDate: "2026-04-12", postTime: "21:01 PST" },
    ],
  ])("equal", (a, b) => {
    expect(sortBlogPostsOldestFirst(a, b)).toBe(0);
  });
});
