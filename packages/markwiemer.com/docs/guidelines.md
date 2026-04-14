# Guidelines for markwiemer.com

<!--
When adding a new entry, ensure that each of these has an enforcement rule
or a work item to add enforcement.
-->

Items are in no particular order.

- **All files should be named without whitespace.** This makes referencing them easier in code: filenames with whitespace require being quoted, and quoting things in shells makes life hard. Ref (#90)[https://github.com/mark-wiemer/hello-hello/issues/90]
- **Avoid fancy punctuation in source.** Fancy punctuation is often copy-pasted in but applied inconsitently. The subtle visual differences can be annoying to manage. Ref (#89)[https://github.com/mark-wiemer/hello-hello/issues/89]
- **All files relating to a specific date should have names that start with that date.** If an event started on that date, the record should be named starting with the date the event started.
- **If a few related files match the same date, they should also have a category and 1-based index.** 1-based is just a bit easier to manage, e.g. `2023-04-16-ai-02-define-prompt-engineering`. The category comes first so that lexical sort orders by day, then category.
- **If many related files match the same date, they should have a granular datetime.** Usually to the minute, optionally to the second if necessary, with an additional 1-based index after the second identifier if necessary.
- **Links that start before a quote should extend to the end of the quote, punctuation included.**
  - Do this:
    - `[ACME says "we have the best stuff!"]()`
    - `ACME says "[we did a good thing]()"`
  - Avoid this: `[ACME says "don't do this]()!"`
- **Styling punctuation the same as its neighboring text.**
