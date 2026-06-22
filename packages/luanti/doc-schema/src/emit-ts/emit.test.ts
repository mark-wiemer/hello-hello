import { expect, test } from "@/types.js";
import { parseApiModel, parseEntry } from "@/ir/index.js";
import { emitEntry, emitModel } from "./index.js";

const emit = (raw: unknown): string => {
  const result = parseEntry(raw);
  if (!result.success) throw new Error(`invalid fixture: ${result.error.message}`);
  return emitEntry(result.data);
};

test("emits a function declaration with a sanitised name and JSDoc", () => {
  const out = emit({
    kind: "function",
    name: "core.get_node",
    summary: "Returns the node at the given position.",
    params: [{ name: "pos", type: "Vector" }],
    returns: [{ name: "node", type: "MapNode" }],
  });

  expect(out).toContain("/** core.get_node — Returns the node at the given position. */");
  expect(out).toContain("export declare function core_get_node(pos: Vector): MapNode;");
});

test("renders optional params and void returns", () => {
  const out = emit({
    kind: "function",
    name: "core.get_modnames",
    summary: "Lists mods.",
    params: [{ name: "load_order", type: "boolean", optional: true }],
  });
  expect(out).toContain("export declare function core_get_modnames(load_order?: boolean): void;");
});

test("renders multiple returns as a labelled tuple", () => {
  const out = emit({
    kind: "function",
    name: "core.get_mapgen_object",
    summary: "Returns several values.",
    returns: [
      { name: "vm", type: "VoxelManip" },
      { name: "emin", type: "Vector" },
    ],
  });
  expect(out).toContain("): [vm: VoxelManip, emin: Vector];");
});

test("emits an enum as a string-literal type alias", () => {
  const out = emit({
    kind: "enum",
    name: "core.log.Level",
    values: [{ value: "none" }, { value: "error" }, { value: "warning" }],
  });
  expect(out).toContain(`export type core_log_Level = "none" | "error" | "warning";`);
});

test("emits a struct as an interface with fields", () => {
  const out = emit({
    kind: "struct",
    name: "MapNode",
    description: "A node on the map.",
    fields: [
      { name: "name", type: "string", description: "registered name" },
      { name: "param1", type: "number" },
    ],
  });
  expect(out).toContain("/** A node on the map. */");
  expect(out).toContain("export interface MapNode {");
  expect(out).toContain("  /** registered name */");
  expect(out).toContain("  name: string;");
  expect(out).toContain("  param1: number;");
  expect(out.endsWith("}")).toBe(true);
});

test("emits a class interface with inheritance, fields, and methods", () => {
  const out = emit({
    kind: "class",
    name: "PlayerRef",
    extends: "ObjectRef",
    description: "A connected player.",
    fields: [{ name: "is_player", type: "boolean" }],
    methods: [
      {
        kind: "method",
        name: "set_fov",
        summary: "Sets the field of view.",
        params: [{ name: "fov", type: "number" }],
      },
    ],
  });

  expect(out).toContain("export interface PlayerRef extends ObjectRef {");
  expect(out).toContain("  is_player: boolean;");
  expect(out).toContain("  /** Sets the field of view. */");
  expect(out).toContain("  set_fov(fov: number): void;");
});

test("maps optional and nilable types in fields", () => {
  const out = emit({
    kind: "struct",
    name: "ABMDefinition",
    fields: [{ name: "label", type: "string?", default: `""` }],
  });
  expect(out).toContain("label: string | null;");
});

test("emitModel wraps entries in a header and trailing newline", () => {
  const model = parseApiModel({
    entries: [
      { kind: "function", name: "core.log", summary: "Logs." },
      { kind: "enum", name: "Level", values: [{ value: "none" }] },
    ],
  });
  if (!model.success) throw new Error("invalid model fixture");

  const out = emitModel(model.data);
  expect(out.startsWith("// Generated TypeScript bindings")).toBe(true);
  expect(out).toContain("export declare function core_log(): void;");
  expect(out).toContain(`export type Level = "none";`);
  expect(out.endsWith("\n")).toBe(true);
});
