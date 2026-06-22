import {
  ApiModel,
  ClassEntry,
  Entry,
  EnumEntry,
  FunctionEntry,
  MethodEntry,
  Param,
  ReturnValue,
  StructEntry,
} from "@/ir/index.js";
import { typeToTs } from "./type-to-ts.js";

/**
 * Emit a first-pass TypeScript declaration sketch from the IR: an `interface`
 * per class/struct, a string-literal `type` per enum, and a `declare function`
 * per function. Dotted names (`core.get_node`) are sanitised to valid
 * identifiers with the canonical name preserved in JSDoc; proper namespace
 * nesting is a future refinement.
 */
export const emitModel = (model: ApiModel): string => {
  const header = "// Generated TypeScript bindings from the Luanti API IR. Do not edit by hand.";
  const body = model.entries.map(emitEntry).join("\n\n");
  return `${header}\n\n${body}\n`;
};

export const emitEntry = (entry: Entry): string => {
  switch (entry.kind) {
    case "function":
    case "method":
      return emitFunction(entry);
    case "class":
      return emitClass(entry);
    case "struct":
      return emitStruct(entry);
    case "enum":
      return emitEnum(entry);
  }
};

const sanitize = (name: string): string => name.replace(/[^A-Za-z0-9_$]/g, "_");

const indent = (lines: string[]): string[] => lines.map((line) => (line ? `  ${line}` : line));

/** A JSDoc block from the given parts (joined with em dashes), or nothing. */
const docBlock = (...parts: Array<string | undefined>): string[] => {
  const text = parts.filter(Boolean).join(" — ");
  if (!text) return [];
  const lines = text.split("\n");
  return lines.length === 1 ? [`/** ${lines[0]} */`] : ["/**", ...lines.map((l) => ` * ${l}`), " */"];
};

const param = (value: Param): string =>
  `${value.name}${value.optional ? "?" : ""}: ${typeToTs(value.type)}`;

const signature = (params: Param[]): string => params.map(param).join(", ");

const returnType = (returns: ReturnValue[]): string => {
  if (returns.length === 0) return "void";
  if (returns.length === 1) return typeToTs(returns[0].type);
  // Lua multi-returns become a labelled tuple.
  return `[${returns.map((r) => `${r.name ? `${r.name}: ` : ""}${typeToTs(r.type)}`).join(", ")}]`;
};

const emitFunction = (entry: FunctionEntry | MethodEntry): string =>
  [
    ...docBlock(entry.name, entry.summary),
    `export declare function ${sanitize(entry.name)}(${signature(entry.params)}): ${returnType(entry.returns)};`,
  ].join("\n");

const memberMethod = (method: MethodEntry): string[] => [
  ...docBlock(method.summary),
  `${method.name}(${signature(method.params)}): ${returnType(method.returns)};`,
];

const memberField = (name: string, type: string, description?: string): string[] => [
  ...docBlock(description),
  `${name}: ${typeToTs(type)};`,
];

const emitClass = (entry: ClassEntry): string => {
  const heading = `export interface ${sanitize(entry.name)}${
    entry.extends ? ` extends ${sanitize(entry.extends)}` : ""
  } {`;
  const members: string[] = [
    ...entry.fields.flatMap((field) => memberField(field.name, field.type, field.description)),
    ...entry.methods.flatMap(memberMethod),
  ];
  return [...docBlock(entry.description), heading, ...indent(members), "}"].join("\n");
};

const emitStruct = (entry: StructEntry): string => {
  const members = entry.fields.flatMap((field) =>
    memberField(field.name, field.type, field.description),
  );
  return [
    ...docBlock(entry.description),
    `export interface ${sanitize(entry.name)} {`,
    ...indent(members),
    "}",
  ].join("\n");
};

const emitEnum = (entry: EnumEntry): string => {
  const union = entry.values.map((value) => `"${value.value}"`).join(" | ");
  return [...docBlock(entry.name, entry.description), `export type ${sanitize(entry.name)} = ${union};`].join(
    "\n",
  );
};
