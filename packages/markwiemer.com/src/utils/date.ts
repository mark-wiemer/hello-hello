type DateParts = {
  // TS cannot easily represent exact types here (union too complex)
  // Learning more about Zod:
  // https://github.com/mark-wiemer/hello-hello/issues/122
  /**
   * Original posted ISO date (not time), e.g. `2026-04-12`
   * todo `${number}-${number}-${number}`
   */
  postDate: string;
  /**
   * Original posted local time (not date), e.g. `20:02 PDT` or `09:32 PST`
   * Only PDT or PST are used.
   * todo `${number}:${number} P${"D" | "S"}T`
   */
  postTime?: string;
};

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
