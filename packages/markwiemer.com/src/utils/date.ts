import { getCollection } from "astro:content";

/*
As of writing, this resolves to:

```ts
type DateParts = {
    postDate: string;
    postTime?: string | undefined;
}
```

Ideally this resolves to something closer to the source in
src/content.config.ts

Ref https://github.com/mark-wiemer/hello-hello/issues/127
*/
type DateParts = Pick<
  Awaited<ReturnType<typeof getCollection<"blog">>>[0]["data"],
  "postDate" | "postTime"
>;

function toDateString(f: DateParts): string {
  if (!f.postTime) return f.postDate;
  return `${f.postDate} ${f.postTime.slice(0, `00:00`.length + 1)}`;
}

function toTimestamp(f: DateParts): number {
  return Date.parse(toDateString(f));
}

/**
 * Does not handle edge cases around Daylight Saving Time.
 * @returns
 * - Negative if `a` should precede `b` when sorted (`a` is older)
 * - Zero if `a` and `b` represent the same time
 * - Positive if `a` should come after `b` when sorted (`b` is older)
 */
export function oldestFirst(a: DateParts, b: DateParts): number {
  return toTimestamp(a) - toTimestamp(b);
}
