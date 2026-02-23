import { zeroPosition } from "@/constants.js";
import { Plugin, Root, Heading, Text } from "@/types.js";
import { makeMessageFactory } from "@/utils.js";

/**
 * Expects exactly one h1 heading with the text "Luanti Lua Modding API Reference".
 */
export const h1Plugin: Plugin<[], Root> = () => {
  const makeMessage = makeMessageFactory("h1");

  return (tree: Root, file): void => {
    const h1s = tree.children.filter(
      (node): node is Heading => node.type === "heading" && node.depth === 1,
    );

    if (h1s.length === 0) {
      makeMessage(file, "Expected one h1 heading, found 0", {
        place: zeroPosition,
      });
      return;
    }

    if (h1s.length > 1) {
      makeMessage(file, `Expected one h1 heading, found ${h1s.length}`, {
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
      makeMessage(file, `h1 text is "${h1Text}", expected "${expectedH1}"`, {
        place: h1s[0].position,
      });
    }
  };
};
