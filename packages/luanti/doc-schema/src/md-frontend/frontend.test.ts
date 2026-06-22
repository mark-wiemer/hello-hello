import { dedent, expect, test } from "@/types.js";
import { parseMarkdown } from "./frontend.js";

test("lowers a full function entry into the IR", () => {
  const md = dedent(`
    #### Function \`core.get_node(pos)\`

    Returns the node at the given position.

    - Args:
      - \`pos\` : \`Vector\` : position to query
    - Returns:
      - \`node\` : \`MapNode\` : the node at the position
    - Envs:
      - \`server-main\`
      - \`client\`
  `);

  const result = parseMarkdown(md);

  expect(result.issues).toEqual([]);
  expect(result.warnings).toEqual([]);
  expect(result.model?.entries[0]).toMatchObject({
    kind: "function",
    name: "core.get_node",
    summary: "Returns the node at the given position.",
    params: [{ name: "pos", type: "Vector", description: "position to query" }],
    returns: [{ name: "node", type: "MapNode", description: "the node at the position" }],
    envs: ["server-main", "client"],
  });
});

test("splits the first paragraph as summary and the rest as description", () => {
  const md = dedent(`
    #### Function \`core.after(time)\`

    Calls func after time seconds.

    More detail in a second paragraph.

    - Args:
      - \`time\` : \`number\`
  `);

  const result = parseMarkdown(md);
  expect(result.model?.entries[0]).toMatchObject({
    summary: "Calls func after time seconds.",
    description: "More detail in a second paragraph.",
  });
});

test("lowers param attributes (optional, default, unit) into the IR", () => {
  const md = dedent(`
    #### Method \`set_fov(fov, is_multiplier, transition_time)\`

    Sets the player's field of view.

    - Args:
      - \`fov\` : \`number\` : Field of View to set
      - \`is_multiplier\` : \`boolean\`, optional, default \`false\` : whether the FOV is a multiplier
      - \`transition_time\` : \`number\`, default \`0\`, unit \`seconds\` : smooth transition time
  `);

  const result = parseMarkdown(md);
  expect(result.issues).toEqual([]);
  expect(result.model?.entries[0]).toMatchObject({
    kind: "method",
    name: "set_fov",
    params: [
      { name: "fov", type: "number", description: "Field of View to set" },
      {
        name: "is_multiplier",
        type: "boolean",
        optional: true,
        default: "false",
        description: "whether the FOV is a multiplier",
      },
      {
        name: "transition_time",
        type: "number",
        default: "0",
        unit: "seconds",
        description: "smooth transition time",
      },
    ],
  });
});

test("does not set optional/unit on a plain arg", () => {
  const md = dedent(`
    #### Function \`core.x(a)\`

    X.

    - Args:
      - \`a\` : \`number\` : just a number
  `);

  const param = parseMarkdown(md).model?.entries[0];
  expect(param).toMatchObject({ params: [{ name: "a", type: "number" }] });
  expect((param as { params: object[] }).params[0]).not.toHaveProperty("optional");
  expect((param as { params: object[] }).params[0]).not.toHaveProperty("unit");
});

test("lowers a struct field default attribute", () => {
  const md = dedent(`
    #### Struct \`ABMDefinition\`

    An active block modifier.

    - Fields:
      - \`label\` : \`string?\`, default \`""\` : descriptive label
      - \`chance\` : \`integer?\` : trigger probability
  `);

  const result = parseMarkdown(md);
  expect(result.issues).toEqual([]);
  expect(result.model?.entries[0]).toMatchObject({
    kind: "struct",
    fields: [
      { name: "label", type: "string?", default: `""`, description: "descriptive label" },
      { name: "chance", type: "integer?", description: "trigger probability" },
    ],
  });
});

test("supports an unnamed return value", () => {
  const md = dedent(`
    #### Function \`core.is_yes(arg)\`

    Parses a boolean-ish value.

    - Returns:
      - \`boolean\`
  `);

  const result = parseMarkdown(md);
  expect(result.model?.entries[0]).toMatchObject({ returns: [{ type: "boolean" }] });
});

test("lowers an enumeration entry", () => {
  const md = dedent(`
    ##### Enumeration \`Level\`

    - Values:
      - \`"none"\` : no logging
      - \`"error"\` : errors only
  `);

  const result = parseMarkdown(md);
  expect(result.model?.entries[0]).toMatchObject({
    kind: "enum",
    name: "Level",
    values: [
      { value: "none", description: "no logging" },
      { value: "error", description: "errors only" },
    ],
  });
});

test("lowers a struct entry with fields and a description", () => {
  const md = dedent(`
    #### Struct \`MapNode\`

    A node on the map.

    - Fields:
      - \`name\` : \`string\` : registered name
      - \`param1\` : \`number\`
  `);

  const result = parseMarkdown(md);
  expect(result.model?.entries[0]).toMatchObject({
    kind: "struct",
    name: "MapNode",
    description: "A node on the map.",
    fields: [
      { name: "name", type: "string", description: "registered name" },
      { name: "param1", type: "number" },
    ],
  });
});

test("ignores prose headings and only lowers entry headings", () => {
  const md = dedent(`
    ## Introduction

    Some narrative text that is not an API entry.

    #### Function \`core.log(text)\`

    Logs text.
  `);

  const result = parseMarkdown(md);
  expect(result.entries).toHaveLength(1);
  expect(result.model?.entries[0]).toMatchObject({ name: "core.log" });
});

test("surfaces IR validation issues for a malformed type expression", () => {
  const md = dedent(`
    #### Function \`core.bad(x)\`

    Has a malformed arg type.

    - Args:
      - \`x\` : \`number |\`
  `);

  const result = parseMarkdown(md);
  expect(result.model).toBeUndefined();
  expect(result.issues.join("\n")).toContain("Invalid type expression");
});

test("warns and skips a malformed arg row without a type", () => {
  const md = dedent(`
    #### Function \`core.x(a)\`

    Missing the type on its argument.

    - Args:
      - \`a\`
  `);

  const result = parseMarkdown(md);
  expect(result.warnings.join("\n")).toContain("Skipped arg");
  expect(result.model?.entries[0]).toMatchObject({ name: "core.x", params: [] });
});

test("attaches deeper Method headings to the preceding Class", () => {
  const md = dedent(`
    #### Class \`PlayerRef\`

    A connected player.

    ##### Method \`set_fov(fov)\`

    Sets the field of view.

    - Args:
      - \`fov\` : \`number\`

    ##### Method \`get_fov()\`

    Gets the field of view.

    - Returns:
      - \`fov\` : \`number\`
  `);

  const result = parseMarkdown(md);
  expect(result.issues).toEqual([]);
  // The two methods are nested, not top-level.
  expect(result.entries).toHaveLength(1);
  const entry = result.model?.entries[0];
  expect(entry).toMatchObject({ kind: "class", name: "PlayerRef" });
  expect((entry as { methods: { name: string }[] }).methods.map((m) => m.name)).toEqual([
    "set_fov",
    "get_fov",
  ]);
});

test("closes a class when a sibling-depth heading follows", () => {
  const md = dedent(`
    #### Class \`ObjectRef\`

    Base object.

    ##### Method \`is_valid()\`

    Validity check.

    #### Class \`PlayerRef\`

    A player.

    ##### Method \`set_fov(fov)\`

    Sets FOV.
  `);

  const result = parseMarkdown(md);
  expect(result.issues).toEqual([]);
  expect(result.entries).toHaveLength(2);
  const [objectRef, playerRef] = (result.model?.entries ?? []) as Array<{
    name: string;
    methods: { name: string }[];
  }>;
  expect(objectRef.name).toBe("ObjectRef");
  expect(objectRef.methods.map((m) => m.name)).toEqual(["is_valid"]);
  expect(playerRef.name).toBe("PlayerRef");
  expect(playerRef.methods.map((m) => m.name)).toEqual(["set_fov"]);
});

test("a Method heading at or above class depth stays a top-level entry", () => {
  const md = dedent(`
    #### Class \`ObjectRef\`

    Base object.

    #### Method \`orphan()\`

    Not nested: same depth as the class heading.
  `);

  const result = parseMarkdown(md);
  expect(result.entries).toHaveLength(2);
  expect((result.model?.entries ?? []).map((e) => e.kind)).toEqual(["class", "method"]);
});

test("a standalone Method with no class remains top-level", () => {
  const md = dedent(`
    ##### Method \`is_valid()\`

    Returns whether the object is valid.

    - Returns:
      - \`validity\` : \`boolean\`
  `);

  const result = parseMarkdown(md);
  expect(result.entries).toHaveLength(1);
  expect(result.model?.entries[0]).toMatchObject({ kind: "method", name: "is_valid" });
});

test("lowers multiple entries from one document", () => {
  const md = dedent(`
    #### Function \`core.log(text)\`

    Logs text.

    #### Struct \`MapNode\`

    A node.

    - Fields:
      - \`name\` : \`string\`
  `);

  const result = parseMarkdown(md);
  expect(result.entries).toHaveLength(2);
  expect(result.model?.entries.map((e) => e.kind)).toEqual(["function", "struct"]);
});
