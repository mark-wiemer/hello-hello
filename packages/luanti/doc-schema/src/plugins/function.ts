import { zeroPosition } from "@/constants.js";
import { Plugin, Root, Heading, Text } from "@/types.js";
import { makeMessageFactory } from "@/utils.js";

/**
 * Expects exactly one h1 heading with the text "Luanti Lua Modding API Reference".
 */
export const functionPlugin: Plugin<[], Root> = () => {
  const coreNamespaceHeadingText = "'core' namespace reference";
  return (tree: Root, file): void => {
    const makeMessage = makeMessageFactory("function", file);
    // First, we fetch the section of the document that references the 'core' namespace, which should be an h2 heading with the coreNamespaceHeadingText. We get everything starting at that heading until the next heading of the same or higher level.
    const headings = tree.children.filter((node) => node.type === "heading") as Heading[];
    const coreHeadingIndex = headings.findIndex(
      (heading) =>
        heading.children.length > 0 &&
        heading.children[0].type === "text" &&
        heading.children[0].value === coreNamespaceHeadingText,
    );

    if (coreHeadingIndex === -1) {
      makeMessage("Could not find 'core' namespace heading", {
        place: zeroPosition,
      });
      return;
    }

    const coreHeading = headings[coreHeadingIndex];
    const coreHeadingDepth = coreHeading.depth;
    const coreHeadingPosition = tree.children.indexOf(coreHeading);
    const nextHeadingPosition = tree.children.findIndex(
      (node, index) =>
        index > coreHeadingPosition &&
        node.type === "heading" &&
        (node as Heading).depth <= coreHeadingDepth,
    );

    const endPosition = nextHeadingPosition === -1 ? tree.children.length : nextHeadingPosition;
    const coreSection = tree.children.slice(coreHeadingPosition + 1, endPosition);

    // For each list in this section, check top-level list items
    // For each list item that starts with a code span, check if it matches the pattern `core.functionName(params)`
    const lists = coreSection.filter((node) => node.type === "list");

    lists.forEach((list) => {
      const listItems = list.children || [];

      listItems.forEach((item) => {
        const rawListItemFirstChild = item.children?.[0];
        if (rawListItemFirstChild?.type !== "paragraph") {
          makeMessage("Found unexpected list item, expected a paragraph. Stopping.", {
            place: item.position,
          });
          return;
        }

        const trueItemStart = rawListItemFirstChild.children[0];
        if (trueItemStart.type !== "inlineCode") return;
        if (!trueItemStart.value.startsWith("core.")) {
          makeMessage(
            "Expected list item to contain a core API function call like `core.functionName(params)`",
            { place: trueItemStart.position },
          );
          return;
        }
      });
    });
  };
};
