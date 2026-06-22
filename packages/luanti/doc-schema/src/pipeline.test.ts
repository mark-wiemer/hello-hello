import { dedent, expect, test } from "@/types.js";
import { parseMarkdown } from "@/md-frontend/index.js";
import { emitModel } from "@/emit-luacats/index.js";

/**
 * End-to-end guard for the whole pipeline: canonical Markdown is lowered into
 * the validated IR and then emitted as a LuaCATS `---@meta` stub. This is the
 * path that delivers IDE support via a LuaLS addon.
 */
test("Markdown lowers to the IR and emits LuaCATS", () => {
  const md = dedent(`
    #### Function \`core.get_node(pos)\`

    Returns the node at the given position.

    - Args:
      - \`pos\` : \`Vector\` : position to query
    - Returns:
      - \`node\` : \`MapNode\`
    - Envs:
      - \`server-main\`

    #### Class \`PlayerRef\`

    A connected player.

    ##### Enumeration \`Level\`

    - Values:
      - \`"none"\`
      - \`"error"\`
  `);

  const parsed = parseMarkdown(md);
  expect(parsed.issues).toEqual([]);
  expect(parsed.model).toBeDefined();

  const lua = emitModel(parsed.model!);

  expect(lua.startsWith("---@meta\n")).toBe(true);
  expect(lua).toContain("--- Returns the node at the given position.");
  expect(lua).toContain("--- Environments: server-main");
  expect(lua).toContain("---@param pos Vector position to query");
  expect(lua).toContain("---@return MapNode node");
  expect(lua).toContain("function core.get_node(pos) end");
  expect(lua).toContain("---@class PlayerRef");
  expect(lua).toContain(`---@alias Level "none" | "error"`);
});
