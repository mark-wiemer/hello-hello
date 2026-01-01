export function setup(ctx) {
  console.log(`Hello From My Mod ${ctx.version}!`);
  console.log(ctx);
  cleanupMetaInfoSection();
}

/**
 * Hides noisy elements within the "meta info section".
 * This is the left panel on desktop.
 * Does not appear on mobile.
 */
function cleanupMetaInfoSection() {
  const heroStaticSelector = ".hero-static > div:nth-of-type(1) > div";

  /** All within the `heroStaticSelector` */
  const relativeSelectorsToHide = [
    "h5:nth-of-type(1)", // "game by Malcs" text
    "h3:nth-of-type(1)", // Patreon badge
    "h5:nth-of-type(2)", // version number
    "div:nth-of-type(2)", // Melvor Idle 2 promo
    "div:nth-of-type(3)", // "also available on..." card
    "div:nth-of-type(4)", // Discord link
    "div:nth-of-type(5)", // platform syncs and expansions list (top of page)
  ];
  const absoluteSelectorsToHide = relativeSelectorsToHide.map(
    (selector) => `${heroStaticSelector} > ${selector}`,
  );
  hideSelectors(absoluteSelectorsToHide);
}

/**
 * Creates a `style` element applying `display: none` to each of the provided selectors
 * @param {string[]} selectors CSS selectors
 */
function hideSelectors(selectors) {
  const styleSheet = document.createElement("style");
  const rules = selectors.map((s) => `${s} { display: none }`).join("\n");
  styleSheet.textContent = rules;
  document.head.appendChild(styleSheet);
}

/**
 * Sets the element's display to none.
 *
 * Does nothing if the element is falsy.
 * @param {Element} el
 */
function hide(el) {
  if (!el) {
    console.log("element not found");
    return;
  }
  el.style.display = "none";
}
