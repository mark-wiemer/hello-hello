# Guidelines for markwiemer.com

<!--
When adding a new guideline,
ensure that each of these has an enforcement rule
or an issue to add enforcement.
Link the issue to the guideline for tracking.
If the guideline cannot be enforced, add `(cannot be enforced)` for clarity.
-->

Items are in no particular order.

## Citations

- cite articles as `date - title - author for publication`
  [#135](https://github.com/mark-wiemer/hello-hello/issues/135)
  - date is optional, see style for date format,
    can include timestamp in format `2026-01-12 15:45 Pacific`
    (or Mountain, Central, Eastern).
  - author is optional if not likely relevant, esp. if there are multiple authors
- order articles in lists:
  undated, dated with timestamp, dated without timestamp
  [#139](https://github.com/mark-wiemer/hello-hello/issues/139)

### Specific sources

- **Executive orders of the President of the United States: use federalregister.gov,**
  e.g. https://www.federalregister.gov/documents/2025/01/29/2025-02007/protecting-the-meaning-and-value-of-american-citizenship
  [#137](https://github.com/mark-wiemer/hello-hello/issues/137)
  - with link text of the structure: `date of filing - Executive Order ___: Order title - Federal Register`
- **Supreme Court of the United States: use supremecourt.gov/search,**
  e.g. https://www.supremecourt.gov/search.aspx?filename=/docket/docketfiles/html/public/24a884.html
  [#136](https://github.com/mark-wiemer/hello-hello/issues/136)
  - with link text of the structure: `date of filing - No. ___: plaintiff v. defendant - Supreme Court`
- **The Congressional Globe**: e.g. `[1866 - The Debates and Proceedings of the First Session of the Thirty-Ninth Congress: p2881-3840 - The Congressional Globe](https://www.congress.gov/congressional-globe/congress-39-session-1-part-4.pdf)`
- **Wikipedia: do not cite.** Instead, cite primary sources. [#134](https://github.com/mark-wiemer/hello-hello/issues/134)

## Filenames

- **All files should be named without whitespace.**
  This makes referencing them easier in code:
  filenames with whitespace require being quoted,
  and quoting things in shells makes life hard.
  [#90](https://github.com/mark-wiemer/hello-hello/issues/90)
- **All files relating to a specific date should have names that start with that date.**
  If an event started on that date, the record should
  be named starting with the date the event started. (cannot be enforced)
- **If a few related files match the same date, they should also have a category and 1-based index.**
  1-based is just a bit easier to manage,
  e.g. `2023-04-16-ai-02-define-prompt-engineering`.
  The category comes first so that lexical sort orders by day, then category.
  [#140](https://github.com/mark-wiemer/hello-hello/issues/140)
- **If many related files match the same date, they should have a granular datetime.**
  Usually to the minute, optionally to the second if necessary,
  with an additional 1-based index after the second identifier if necessary.
  [#141](https://github.com/mark-wiemer/hello-hello/issues/141)

## Miscellaneous

- **Manually reflow Markdown lines.** Break lines on the ends of sentences
  and before conjunctions or prepositions, when necessary.
  85 characters per column, max. [#144](https://github.com/mark-wiemer/hello-hello/issues/144)
- **Avoid fancy punctuation in source.**
  Fancy punctuation is often copy-pasted in but applied inconsistently.
  The subtle visual differences can be annoying to manage.
  [#89](https://github.com/mark-wiemer/hello-hello/issues/89)
- **Links that start before a quote should extend to the end of the quote, punctuation included.**
  [#142](https://github.com/mark-wiemer/hello-hello/issues/142)
  - Do this:
    - `[ACME says "we have the best stuff!"]()`
    - `ACME says "[we did a good thing]()"`
  - Avoid this: `[ACME says "don't do this]()!"`
- **Style punctuation the same as its neighboring text.**
  This applies to bold, italics, and underlines,
  with the exception of links as above.
  [#138](https://github.com/mark-wiemer/hello-hello/issues/138)

## Style

- **For dates, use RFC.** yyyy-MM-dd hh:mm:ss, to the granularity relevant,
  e.g. 2026-12-25 is Christmas,
  2026-12-31 23:59:59 is the last second of the year.
  (#69, #71, #104, #143)
- **When referring to a person, it's OK to use only their last name without a title,**
  especially if they're a public figure
  (e.g. "Trump" does not need to be "President Trump" or "Mr. Trump" or "Donald Trump").
  Add titles and/or first names when it aids in clarity. (cannot be enforced)
- **When referring to a specific executive order, capitalize "Order":**
  See [NARA Writing Style Guide](https://www.archives.gov/files/open/plain-writing/style-guide.pdf)
  (cannot be enforced)
- **Avoid two links separated only by whitespace.**
  [#147](https://github.com/mark-wiemer/hello-hello/issues/147)
- **Avoid link text that starts or end with whitespace.**
  [#148](https://github.com/mark-wiemer/hello-hello/issues/148)

## Technical

- **Avoid a domain-specific language.**
- **Avoid GitHub Flavored Markdown-specific features.**
