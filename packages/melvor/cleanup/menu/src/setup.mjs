export function setup(ctx) {
  console.log(`Hello from cleanup-main-menu ${ctx.version}!`);
  console.log(ctx);
  cleanupMetaInfoSection();
  cleanupMainSection();
}

/**
 * Hides noisy elements within the "meta info section".
 * This is the left panel on desktop.
 * Does not appear on mobile.
 */
function cleanupMetaInfoSection() {
  const heroStaticSelector = ".hero-static";
  const heroStaticMainSelector = `${heroStaticSelector} > div:nth-of-type(1) > div`;
  /** All within the `heroStaticMainSelector` */
  const mainRelativeSelectorsToHide = [
    "h5:nth-of-type(1)", // "game by Malcs" text
    "h3:nth-of-type(1)", // Patreon badge
    "h5:nth-of-type(2)", // version number
    "div:nth-of-type(2)", // Melvor Idle 2 promo
    "div:nth-of-type(3)", // "also available on..." card
    "div:nth-of-type(4)", // Discord link
    "div:nth-of-type(5)", // platform syncs and expansions list (top of page)
  ];
  const mainAbsoluteSelectorsToHide = mainRelativeSelectorsToHide.map(
    (s) => `${heroStaticMainSelector} > ${s}`,
  );
  hideSelectors(mainAbsoluteSelectorsToHide);

  const heroStaticManageSelector = `${heroStaticSelector} > div:nth-of-type(2) > div`;
  const manageRelativeSelectorsToHide = [
    "button:nth-of-type(1)", // invisible button presumably there for padding
  ];
  const manageAbsoluteSelectorsToHide = manageRelativeSelectorsToHide.map(
    (s) => `${heroStaticManageSelector} > ${s}`,
  );
  hideSelectors(manageAbsoluteSelectorsToHide);
}

/**
 * Hides the local backup reminder.
 */
function cleanupMainSection() {
  const characterSelectSelector = ".hero-alt > div:nth-of-type(5) > div:nth-of-type(2)";
  const headerSelector = `${characterSelectSelector} > div:nth-of-type(1)`;
  const localBackupSelector = `${headerSelector} > h5`;
  hideSelectors([localBackupSelector]);
}

/**
 * Alias for `styleSelectors(selectors, "display: none")`
 * @param {string[]} selectors CSS selectors
 */
function hideSelectors(selectors) {
  styleSelectors(selectors, "display: none");
}

/**
 * Alias for `styleSelectors(selectors, "border: 1px solid cyan")`.
 * (Kept in case we use it later for debugging.)
 * @param {string[]} selectors CSS selectors
 */
function outlineSelectors(selectors) {
  styleSelectors(selectors, "border: 1px solid cyan");
}

/** Applies the rule to all selectors, and appends result to head of document. */
function styleSelectors(selectors, rule) {
  const styleSheet = document.createElement("style");
  const rules = selectors.map((s) => `${s} { ${rule} }`).join("\n");
  styleSheet.textContent = rules;
  document.head.appendChild(styleSheet);
}
