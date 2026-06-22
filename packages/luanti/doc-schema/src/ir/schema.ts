// Namespace import is deliberate: `import { z } from "zod"` pulls zod's
// aggregated `z` object, which Vite/vitest assembles lazily and reads as
// `undefined` during top-level module evaluation (e.g. `z.string()` below).
// `import * as z` binds zod's direct named exports, which are ready immediately.
import * as z from "zod";
import { parseType, TypeExprError } from "@/type-expr/index.js";

/**
 * The intermediate representation (IR) for the Luanti API.
 *
 * This is the hub of the pipeline: a Markdown (or any) front-end lowers into
 * this validated model, and every emitter (LuaCATS, HTML, TypeScript, JSON)
 * reads from it. The IR is the single source of truth, decoupled from how the
 * docs happen to be authored.
 *
 * Validation deliberately reuses the `type-expr` parser so a malformed type
 * annotation fails here with a precise, offset-aware message rather than
 * silently flowing through to an emitter.
 */

/**
 * A string that must parse as a valid type expression. The raw text is kept in
 * the IR (emitters re-parse as needed); validation only checks parseability.
 */
export const typeExpr = z.string().superRefine((value, ctx) => {
  try {
    parseType(value);
  } catch (error) {
    const detail =
      error instanceof TypeExprError
        ? `${error.message} (at offset ${error.offset})`
        : String(error);
    ctx.addIssue({ code: "custom", message: `Invalid type expression "${value}": ${detail}` });
  }
});

/** The runtime environments a symbol can be used in. */
export const environment = z.enum([
  "server-load",
  "server-before-mods-loaded",
  "server-main",
  "server-async",
  "server-mapgen",
  "client",
  // Convenience specifiers that expand to multiple concrete environments.
  "all",
  "server",
]);

/** Fields shared by every documented entry. */
const meta = {
  description: z.string().optional(),
  /** First Luanti version the symbol is available in, e.g. `"5.16.0"`. */
  availableSince: z.string().optional(),
  experimental: z.boolean().optional(),
};

export const param = z.object({
  name: z.string().min(1),
  type: typeExpr,
  optional: z.boolean().optional(),
  default: z.string().optional(),
  /** Unit of a numeric/vector value, e.g. `"seconds"` or `"degrees"`. */
  unit: z.string().optional(),
  description: z.string().optional(),
});

export const returnValue = z.object({
  /** Lua allows multiple returns, so each gets an optional name for reference. */
  name: z.string().optional(),
  type: typeExpr,
  description: z.string().optional(),
});

export const field = z.object({
  name: z.string().min(1),
  type: typeExpr,
  default: z.string().optional(),
  description: z.string().optional(),
});

export const callableShape = {
  name: z.string().min(1),
  summary: z.string(),
  params: z.array(param).default([]),
  returns: z.array(returnValue).default([]),
  envs: z.array(environment).default([]),
  ...meta,
};

export const functionEntry = z.object({ kind: z.literal("function"), ...callableShape });

export const methodEntry = z.object({ kind: z.literal("method"), ...callableShape });

export const enumEntry = z.object({
  kind: z.literal("enum"),
  name: z.string().min(1),
  values: z
    .array(z.object({ value: z.string(), description: z.string().optional() }))
    .min(1),
  ...meta,
});

export const structEntry = z.object({
  kind: z.literal("struct"),
  name: z.string().min(1),
  fields: z.array(field).default([]),
  ...meta,
});

export const classEntry = z.object({
  kind: z.literal("class"),
  name: z.string().min(1),
  extends: z.string().optional(),
  fields: z.array(field).default([]),
  methods: z.array(methodEntry).default([]),
  ...meta,
});

export const entry = z.discriminatedUnion("kind", [
  functionEntry,
  methodEntry,
  enumEntry,
  structEntry,
  classEntry,
]);

export const apiModel = z.object({
  /** Schema version, so generated artifacts can be revalidated over time. */
  version: z.string().default("0"),
  entries: z.array(entry).default([]),
});

export type TypeExpr = z.infer<typeof typeExpr>;
export type Environment = z.infer<typeof environment>;
export type Param = z.infer<typeof param>;
export type ReturnValue = z.infer<typeof returnValue>;
export type Field = z.infer<typeof field>;
export type FunctionEntry = z.infer<typeof functionEntry>;
export type MethodEntry = z.infer<typeof methodEntry>;
export type EnumEntry = z.infer<typeof enumEntry>;
export type StructEntry = z.infer<typeof structEntry>;
export type ClassEntry = z.infer<typeof classEntry>;
export type Entry = z.infer<typeof entry>;
export type ApiModel = z.infer<typeof apiModel>;
