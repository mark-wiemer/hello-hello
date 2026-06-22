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
import { typeToLuaCats } from "./type-to-luacats.js";

/**
 * Emit a LuaCATS definition file from the IR. The output is a LuaLS `---@meta`
 * stub: shipping it as a LuaLS addon gives Luanti modders IDE support (hover,
 * completion, diagnostics) in every editor LuaLS supports — no bespoke LSP.
 */
export const emitModel = (model: ApiModel): string => {
  const header = ["---@meta", "-- Generated from the Luanti API IR. Do not edit by hand."].join("\n");
  const body = model.entries.map(emitEntry).join("\n\n");
  return `${header}\n\n${body}\n`;
};

export const emitEntry = (entry: Entry): string => {
  switch (entry.kind) {
    case "function":
      return emitFunction(entry);
    case "method":
      // A method without an owning class is emitted as a bare function stub.
      return emitCallable(entry, entry.name);
    case "class":
      return emitClass(entry);
    case "enum":
      return emitEnum(entry);
    case "struct":
      return emitStruct(entry);
  }
};

/** `---` doc lines for a (possibly multi-line, possibly absent) text block. */
const docComment = (text: string | undefined): string[] => {
  if (!text) return [];
  return text.split("\n").map((line) => (line.length ? `--- ${line}` : "---"));
};

const envComment = (envs: string[]): string[] =>
  envs.length ? [`--- Environments: ${envs.join(", ")}`] : [];

const paramAnnotation = (param: Param): string => {
  const name = param.optional ? `${param.name}?` : param.name;
  const description = param.description ? ` ${param.description}` : "";
  return `---@param ${name} ${typeToLuaCats(param.type)}${description}`;
};

const returnAnnotation = (value: ReturnValue): string => {
  const parts = [typeToLuaCats(value.type)];
  if (value.name) parts.push(value.name);
  if (value.description) parts.push(value.description);
  return `---@return ${parts.join(" ")}`;
};

const signatureParams = (params: Param[]): string => params.map((param) => param.name).join(", ");

const emitFunction = (entry: FunctionEntry): string =>
  [
    ...docComment(entry.summary),
    ...docComment(entry.description),
    ...envComment(entry.envs),
    ...entry.params.map(paramAnnotation),
    ...entry.returns.map(returnAnnotation),
    `function ${entry.name}(${signatureParams(entry.params)}) end`,
  ].join("\n");

/** Emit `function <prefix>(...) end`, used for top-level and class methods alike. */
const emitCallable = (entry: FunctionEntry | MethodEntry, fullName: string): string =>
  [
    ...docComment(entry.summary),
    ...docComment(entry.description),
    ...envComment(entry.envs),
    ...entry.params.map(paramAnnotation),
    ...entry.returns.map(returnAnnotation),
    `function ${fullName}(${signatureParams(entry.params)}) end`,
  ].join("\n");

const emitMethod = (entry: MethodEntry, className: string): string =>
  emitCallable(entry, `${className}:${entry.name}`);

const fieldAnnotation = (name: string, type: string, description?: string): string =>
  `---@field ${name} ${typeToLuaCats(type)}${description ? ` ${description}` : ""}`;

const emitClass = (entry: ClassEntry): string => {
  const header = entry.extends ? `---@class ${entry.name} : ${entry.extends}` : `---@class ${entry.name}`;
  const declaration = [
    ...docComment(entry.description),
    header,
    ...entry.fields.map((field) => fieldAnnotation(field.name, field.type, field.description)),
    `${entry.name} = {}`,
  ].join("\n");
  const methods = entry.methods.map((method) => emitMethod(method, entry.name));
  return [declaration, ...methods].join("\n\n");
};

const emitStruct = (entry: StructEntry): string =>
  [
    ...docComment(entry.description),
    `---@class ${entry.name}`,
    ...entry.fields.map((field) => fieldAnnotation(field.name, field.type, field.description)),
  ].join("\n");

const emitEnum = (entry: EnumEntry): string => {
  const union = entry.values.map((value) => `"${value.value}"`).join(" | ");
  return [...docComment(entry.description), `---@alias ${entry.name} ${union}`].join("\n");
};
