import { dedent, expect, test } from "@/types.js";
import { parseMarkdown } from "@/md-frontend/index.js";
import { emitModel as emitLuaCats } from "@/emit-luacats/index.js";
import { emitModel as emitTs } from "@/emit-ts/index.js";
import { emitJson } from "@/emit-json/index.js";

/**
 * One document exercising every entry kind, lowered to the IR and fanned out to
 * all three emitters. Asserts on concrete shapes (not full snapshots) so it
 * stays resilient to incidental formatting changes.
 */
const md = dedent(`
  #### Function \`core.after(time, func)\`

  Calls func after time seconds.

  - Args:
    - \`time\` : \`number\`, unit \`seconds\` : delay before running
    - \`func\` : \`function\`, optional, default \`nil\` : the callback
  - Returns:
    - \`job\` : \`JobHandle\` : a handle
    - \`ok\` : \`boolean\`
  - Envs:
    - \`server-main\`
    - \`client\`

  #### Class \`PlayerRef\`

  A connected player.

  - Fields:
    - \`is_player\` : \`boolean\`

  ##### Method \`set_fov(fov)\`

  Sets the field of view.

  - Args:
    - \`fov\` : \`number\`

  #### Struct \`MapNode\`

  A node on the map.

  - Fields:
    - \`name\` : \`string\`
    - \`param1\` : \`number\`

  #### Enumeration \`LightBank\`

  - Values:
    - \`"day"\`
    - \`"night"\`
`);

const parsed = parseMarkdown(md);

test("the document lowers cleanly to four IR entries", () => {
  expect(parsed.issues).toEqual([]);
  expect(parsed.model?.entries.map((entry) => entry.kind)).toEqual([
    "function",
    "class",
    "struct",
    "enum",
  ]);
});

test("emits LuaCATS for every entry kind", () => {
  const lua = emitLuaCats(parsed.model!);
  expect(lua).toContain("function core.after(time, func) end");
  expect(lua).toContain("--- Environments: server-main, client");
  expect(lua).toContain("---@param func? function the callback");
  expect(lua).toContain("---@return JobHandle job a handle");
  expect(lua).toContain("---@return boolean ok");
  expect(lua).toContain("---@class PlayerRef");
  expect(lua).toContain("function PlayerRef:set_fov(fov) end");
  expect(lua).toContain("---@class MapNode");
  expect(lua).toContain("---@field param1 number");
  expect(lua).toContain(`---@alias LightBank "day" | "night"`);
});

test("emits TypeScript for every entry kind", () => {
  const ts = emitTs(parsed.model!);
  expect(ts).toContain(
    "export declare function core_after(time: number, func?: Function): [job: JobHandle, ok: boolean];",
  );
  expect(ts).toContain("export interface PlayerRef {");
  expect(ts).toContain("  is_player: boolean;");
  expect(ts).toContain("  set_fov(fov: number): void;");
  expect(ts).toContain("export interface MapNode {");
  expect(ts).toContain("  name: string;");
  expect(ts).toContain(`export type LightBank = "day" | "night";`);
});

test("emits JSON that preserves attributes LuaCATS drops", () => {
  const data = JSON.parse(emitJson(parsed.model!));
  expect(data.entries.map((e: { kind: string }) => e.kind)).toEqual([
    "function",
    "class",
    "struct",
    "enum",
  ]);

  const fn = data.entries[0];
  expect(fn.name).toBe("core.after");
  expect(fn.params.find((p: { name: string }) => p.name === "time")).toMatchObject({
    unit: "seconds",
    description: "delay before running",
  });
  expect(fn.params.find((p: { name: string }) => p.name === "func")).toMatchObject({
    optional: true,
    default: "nil",
  });
  expect(fn.returns).toHaveLength(2);

  expect(data.entries[1].methods[0].name).toBe("set_fov");
  expect(data.entries[3].values.map((v: { value: string }) => v.value)).toEqual(["day", "night"]);
});
