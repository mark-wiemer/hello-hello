import { describe, expect, it } from "vitest";
import { getBlogPostPaths } from "./recent-posts";
import { getBlogPostPaths, getPreface } from "./recent-posts";

describe("getBlogPostPaths", () => {
  it("includes the expected slug and filename", () => {
    const paths = getBlogPostPaths();
    expect(
      paths.find((entry) => entry.params.slug === "testing-accessibility-reflow"),
    ).not.toBeUndefined();
  });
});

describe("getPreface", () => {
  describe("getPreface", () => {
    it.each([
      ["2024-10-08", undefined, undefined, "article", "2024-10-08."],
      ["2024-10-08", "3:30 PM", undefined, "article", "2024-10-08, 3:30 PM."],
      ["2024-10-08", undefined, "2024-10-09", "article", "2024-10-08. Last updated 2024-10-09."],
      [
        "2024-10-08",
        "3:30 PM",
        "2024-10-09",
        "article",
        "2024-10-08, 3:30 PM. Last updated 2024-10-09.",
      ],
      [
        "2024-10-08",
        undefined,
        undefined,
        "notes",
        "2024-10-08. These are personal notes, subject to change. None of this is legal advice.",
      ],
      [
        "2024-10-08",
        "3:30 PM",
        "2024-10-09",
        "notes",
        "2024-10-08, 3:30 PM. Last updated 2024-10-09. These are personal notes, subject to change. None of this is legal advice.",
      ],
    ])(
      "returns expected result for parameters: %s, %s, %s, %s",
      (date, time, lastUpdated, postType, expected) => {
        const result = getPreface(date, time, lastUpdated, postType);
        expect(result).toBe(expected);
      },
    );
  });
});
