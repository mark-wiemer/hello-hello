import { Plugin, Root, Heading, Text } from "@/types.js";

/**
 * Expects exactly one h1 heading with the text "Luanti Lua Modding API Reference".
 */
export const h1Plugin: Plugin<[], Root> = () => {
  const source = "ensure-h1";
  return (tree: Root, file): void => {
    const h1s = tree.children.filter(
      (node): node is Heading => node.type === "heading" && node.depth === 1,
    );

    if (h1s.length === 0) {
      file.message("Expected one h1 heading, found 0", {
        source: source,
      });
      return;
    }

    if (h1s.length > 1) {
      file.message(`Expected one h1 heading, found ${h1s.length}`, {
        source: source,
        place: h1s[1].position,
      });
      return;
    }

    const h1Text = h1s[0].children
      .filter((child): child is Text => child.type === "text")
      .map((child: Text) => child.value)
      .join("");

    const expectedH1 = "Luanti Lua Modding API Reference";
    if (h1Text !== expectedH1) {
      file.message(`h1 text is "${h1Text}", expected "${expectedH1}"`, {
        source: source,
        place: h1s[0].position,
      });
    }
  };
};
