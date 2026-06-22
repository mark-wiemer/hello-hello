import { ApiModel } from "@/ir/index.js";

/**
 * Recursively sort object keys so serialisation is deterministic. Arrays keep
 * their order (it is meaningful for params/returns); only object keys are sorted.
 */
const sortKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((key) => [key, sortKeys((value as Record<string, unknown>)[key])]),
    );
  }
  return value;
};

/** Serialise any value to stable, key-sorted JSON with a trailing newline. */
export const toStableJson = (value: unknown): string => `${JSON.stringify(sortKeys(value), null, 2)}\n`;

/** Emit the IR model as the canonical JSON backend artifact. */
export const emitJson = (model: ApiModel): string => toStableJson(model);
