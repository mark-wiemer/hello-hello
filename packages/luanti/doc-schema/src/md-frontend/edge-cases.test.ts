import { dedent, expect, test } from "@/types.js";
import { parseMarkdown } from "./frontend.js";

test("uses only the first sub-entry list when a paragraph splits them", () => {
  // KNOWN LIMITATION: the canonical format expects one list holding all
  // sub-entries; a second list after intervening prose is not merged in.
  const md = dedent(`
    #### Function \`core.x(a)\`

    Summary.

    - Args:
      - \`a\` : \`number\`

    Some prose between the lists.

    - Returns:
      - \`r\` : \`boolean\`
  `);

  const result = parseMarkdown(md);
  const entry = result.model?.entries[0];
  expect(entry).toMatchObject({ params: [{ name: "a", type: "number" }] });
  expect((entry as { returns: unknown[] }).returns).toEqual([]);
});

test("allows an empty summary when there is no description paragraph", () => {
  const md = dedent(`
    #### Function \`core.get_us_time()\`

    - Returns:
      - \`time\` : \`number\`
  `);

  const result = parseMarkdown(md);
  expect(result.issues).toEqual([]);
  expect(result.model?.entries[0]).toMatchObject({ summary: "" });
});

test("recognises an entry heading with trailing punctuation after the code", () => {
  const md = dedent(`
    #### Function \`core.log(text)\`:

    Logs text.
  `);

  const result = parseMarkdown(md);
  expect(result.entries).toHaveLength(1);
  expect(result.model?.entries[0]).toMatchObject({ kind: "function", name: "core.log" });
});

test("recognises an entry heading with a trailing note after the code", () => {
  const md = dedent(`
    #### Function \`core.x()\` (deprecated)

    Old function.
  `);

  expect(parseMarkdown(md).model?.entries[0]).toMatchObject({ kind: "function", name: "core.x" });
});

test("accepts environment rows written as plain text instead of code", () => {
  const md = dedent(`
    #### Function \`core.x()\`

    Summary.

    - Envs:
      - server-main
      - client
  `);

  const result = parseMarkdown(md);
  expect(result.issues).toEqual([]);
  expect(result.model?.entries[0]).toMatchObject({ envs: ["server-main", "client"] });
});

test("keeps a colon inside a return description", () => {
  const md = dedent(`
    #### Function \`core.get_node(pos)\`

    Returns a node.

    - Returns:
      - \`node\` : \`MapNode\` : name is "ignore" : for unloaded chunks
  `);

  const result = parseMarkdown(md);
  expect(result.model?.entries[0]).toMatchObject({
    returns: [{ name: "node", type: "MapNode", description: `name is "ignore" : for unloaded chunks` }],
  });
});

test("parses compact colon-separated rows without spaces", () => {
  const md = dedent(`
    #### Function \`core.x(pos)\`

    Summary.

    - Args:
      - \`pos\`:\`Vector\`:position to query
  `);

  const result = parseMarkdown(md);
  expect(result.model?.entries[0]).toMatchObject({
    params: [{ name: "pos", type: "Vector", description: "position to query" }],
  });
});

test("handles a class with a Fields list and nested Method headings", () => {
  const md = dedent(`
    #### Class \`PlayerRef\`

    A player.

    - Fields:
      - \`is_player\` : \`boolean\`

    ##### Method \`set_fov(fov)\`

    Sets FOV.

    - Args:
      - \`fov\` : \`number\`
  `);

  const result = parseMarkdown(md);
  expect(result.issues).toEqual([]);
  const entry = result.model?.entries[0];
  expect(entry).toMatchObject({
    kind: "class",
    description: "A player.",
    fields: [{ name: "is_player", type: "boolean" }],
  });
  expect((entry as { methods: { name: string; params: unknown[] }[] }).methods).toMatchObject([
    { name: "set_fov", params: [{ name: "fov", type: "number" }] },
  ]);
});

test("strips quotes from enum values containing hyphens and spaces", () => {
  const md = dedent(`
    ##### Enumeration \`Mode\`

    - Values:
      - \`"a-b"\` : a hyphenated value
      - \`"with space"\` : a spaced value
  `);

  const result = parseMarkdown(md);
  expect(result.model?.entries[0]).toMatchObject({
    values: [
      { value: "a-b", description: "a hyphenated value" },
      { value: "with space", description: "a spaced value" },
    ],
  });
});

test("matches sub-entry labels case-insensitively", () => {
  const md = dedent(`
    #### Function \`core.x(a, b)\`

    Summary.

    - ARGS:
      - \`a\` : \`number\`
    - Arguments:
      - \`b\` : \`string\`
  `);

  // Both labels resolve to args; the second list-item overwrites under the same key.
  const result = parseMarkdown(md);
  const params = (result.model?.entries[0] as { params: { name: string }[] }).params;
  expect(params.map((p) => p.name)).toEqual(["b"]);
});
