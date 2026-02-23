import { vfileMessageSource } from "./constants.js";
import { MessageOptions, VFile } from "./types.js";

export const makeMessageFactory =
  (ruleId: string) =>
  (file: VFile, message: string, options: Omit<MessageOptions, "source" | "ruleId">) => {
    file.message(message, {
      source: vfileMessageSource,
      ruleId,
      ...options,
    });
  };
