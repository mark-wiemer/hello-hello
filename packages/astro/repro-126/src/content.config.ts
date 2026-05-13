// Magic file for Astro
// https://docs.astro.build/en/guides/content-collections/#defining-build-time-content-collections

import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    base: "./src/pages/blog/content",
    generateId: ({ entry }) => {
      // e.g. `entry === '2021-11-21-testing-accessibility-reflow.mdx'`
      /** e.g. `testing-accessibility-reflow.mdx` */
      const withoutDate = entry.slice("yyyy-mm-dd-".length);
      /** e.g. `testing-accessibility-reflow` */
      const withoutDateOrDotMdx = withoutDate.slice(0, withoutDate.length - ".mdx".length);
      return withoutDateOrDotMdx;
    },
    pattern: "**/*.mdx",
  }),
  // Schema copied from ./utils/blog.ts#PostFrontmatter
  schema: z.object({
    /** ISO date (not time) */
    lastUpdated: z.string().optional(),
    /** Whether to list the post in the index and home page */
    listed: z.boolean().optional(),
    /** Medium URL where this was originally posted */
    original: z.string().optional(),
    /** Original posted ISO date (not time), e.g. `2026-04-12` */
    postDate: z.iso.date(),
    /**
     * Original posted local time (not date), e.g. `20:02 PDT` or `09:32 PST`.
     * Only PDT or PST are used.
     */
    postTime: z
      .string()
      .regex(/^\d\d:\d\d P(D|S)T$/)
      .optional(),
    /** Main heading for the article */
    postTitle: z.string(),
    /** If not provided, it's implicitly an article. */
    postType: z.literal(["notes"]).optional(),
  }),
});

export const collections = { blog };
