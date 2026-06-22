/**
 * Error thrown when a type expression cannot be tokenized or parsed.
 *
 * `offset` is the 0-based index into the source string where the problem was
 * detected, so callers (e.g. the IR validator) can map it back to a line and
 * column in the original document.
 */
export class TypeExprError extends Error {
  readonly offset: number;

  constructor(message: string, offset: number) {
    super(message);
    this.name = "TypeExprError";
    this.offset = offset;
  }
}
