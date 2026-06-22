import * as z from "zod";
import { apiModel, entry, ApiModel, Entry } from "./schema.js";

export * from "./schema.js";

/** Validate an unknown value as a full {@link ApiModel}. */
export const parseApiModel = (data: unknown) => apiModel.safeParse(data);

/** Validate an unknown value as a single {@link Entry}. */
export const parseEntry = (data: unknown) => entry.safeParse(data);

/**
 * JSON Schema for a single entry, suitable for wiring into editors so doc
 * writers get autocomplete/validation on the structured fields. Backed by
 * Zod v4's built-in converter.
 */
export const toJsonSchema = () => z.toJSONSchema(entry);

export type { ApiModel, Entry };
