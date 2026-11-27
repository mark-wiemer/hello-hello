import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Todo table implementation", () => {
  it("does not depend on TanStack Table", () => {
    const packageJson = readFileSync(
      new URL("../../../package.json", import.meta.url),
      "utf8",
    );
    const tableSource = readFileSync(
      new URL("./tables.ts", import.meta.url),
      "utf8",
    );

    expect(packageJson).not.toContain("@tanstack/table-core");
    expect(tableSource).not.toContain("@tanstack/table-core");
  });
});
