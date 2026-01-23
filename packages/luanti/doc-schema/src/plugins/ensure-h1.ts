import { Plugin, Root, Heading, Text } from "@/types.js";

export const ensureH1Plugin: Plugin<[], Root> = () => {
  return (tree: Root): void => {
    const h1s = tree.children.filter(
      (node): node is Heading => node.type === "heading" && node.depth === 1,
    );

    if (h1s.length === 0) {
      console.error("Error: No h1 element found");
      process.exit(1);
    }

    if (h1s.length > 1) {
      console.error("Error: Multiple h1 elements found");
      process.exit(1);
    }

    const h1Text = h1s[0].children
      .filter((child): child is Text => child.type === "text")
      .map((child: Text) => child.value)
      .join("");

    const expectedH1 = "Luanti Lua Modding API Reference";
    if (h1Text !== expectedH1) {
      console.error(`Error: h1 text is "${h1Text}", expected "${expectedH1}"`);
      process.exit(1);
    }
  };
};
