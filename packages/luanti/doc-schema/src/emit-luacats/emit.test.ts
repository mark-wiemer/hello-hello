import { expect, test } from "@/types.js";
import { parseApiModel, parseEntry } from "@/ir/index.js";
import { emitEntry, emitModel } from "./index.js";

/** Validate a fixture through the IR, then emit it (also exercises integration). */
const emit = (raw: unknown): string => {
  const result = parseEntry(raw);
  if (!result.success) throw new Error(`invalid fixture: ${result.error.message}`);
  return emitEntry(result.data);
};

test("emits a function with params, returns, and environments", () => {
  const out = emit({
    kind: "function",
    name: "core.get_node",
    summary: "Returns the node at the given position.",
    params: [{ name: "pos", type: "Vector" }],
    returns: [{ name: "node", type: "MapNode" }],
    envs: ["server-main", "client"],
  });

  expect(out).toContain("--- Returns the node at the given position.");
  expect(out).toContain("--- Environments: server-main, client");
  expect(out).toContain("---@param pos Vector");
  expect(out).toContain("---@return MapNode node");
  expect(out).toContain("function core.get_node(pos) end");
});

test("marks optional params with a trailing question mark", () => {
  const out = emit({
    kind: "function",
    name: "core.get_modnames",
    summary: "Returns loaded mod names.",
    params: [
      { name: "load_order", type: "boolean", optional: true, description: "defines the order" },
    ],
  });

  expect(out).toContain("---@param load_order? boolean defines the order");
  expect(out).toContain("function core.get_modnames(load_order) end");
});

test("emits a multi-line description as contiguous doc comments", () => {
  const out = emit({
    kind: "function",
    name: "core.after",
    summary: "Calls func after time seconds.\n\nJobs are executed in order.",
  });

  expect(out).toContain("--- Calls func after time seconds.");
  expect(out).toContain("---"); // the blank line between paragraphs
  expect(out).toContain("--- Jobs are executed in order.");
});

test("emits an enum as a LuaCATS alias union", () => {
  const out = emit({
    kind: "enum",
    name: "core.log.Level",
    values: [{ value: "none" }, { value: "error" }, { value: "warning" }],
  });

  expect(out).toBe(`---@alias core.log.Level "none" | "error" | "warning"`);
});

test("emits a class with inheritance, fields, and methods", () => {
  const out = emit({
    kind: "class",
    name: "PlayerRef",
    extends: "ObjectRef",
    description: "A connected player.",
    fields: [{ name: "is_player", type: "boolean", description: "always true" }],
    methods: [
      {
        kind: "method",
        name: "set_fov",
        summary: "Sets the field of view.",
        params: [{ name: "fov", type: "number" }],
      },
    ],
  });

  expect(out).toContain("--- A connected player.");
  expect(out).toContain("---@class PlayerRef : ObjectRef");
  expect(out).toContain("---@field is_player boolean always true");
  expect(out).toContain("PlayerRef = {}");
  expect(out).toContain("---@param fov number");
  expect(out).toContain("function PlayerRef:set_fov(fov) end");
});

test("omits the inheritance clause when there is no parent class", () => {
  const out = emit({ kind: "class", name: "ObjectRef" });
  expect(out).toContain("---@class ObjectRef");
  expect(out).not.toContain(" : ");
});

test("emits a struct as a class with fields", () => {
  const out = emit({
    kind: "struct",
    name: "MapNode",
    fields: [
      { name: "name", type: "string", description: "registered name" },
      { name: "param1", type: "number" },
    ],
  });

  expect(out).toContain("---@class MapNode");
  expect(out).toContain("---@field name string registered name");
  expect(out).toContain("---@field param1 number");
});

test("emitModel wraps entries in a ---@meta header and trailing newline", () => {
  const model = parseApiModel({
    entries: [
      { kind: "function", name: "core.log", summary: "Logs text." },
      { kind: "enum", name: "Level", values: [{ value: "none" }] },
    ],
  });
  if (!model.success) throw new Error("invalid model fixture");

  const out = emitModel(model.data);
  expect(out.startsWith("---@meta\n")).toBe(true);
  expect(out).toContain("function core.log() end");
  expect(out).toContain(`---@alias Level "none"`);
  expect(out.endsWith("\n")).toBe(true);
});
