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
  cleanupMetaInfoMain();

  // #region mods, manage, logout
  const heroStaticManageSelector = `${heroStaticSelector} > div:nth-of-type(2) > div`;
  const manageRelativeSelectorsToHide = [
    "button:nth-of-type(1)", // invisible button presumably there for padding
  ];
  const manageAbsoluteSelectorsToHide = manageRelativeSelectorsToHide.map(
    (s) => `${heroStaticManageSelector} > ${s}`,
  );
  hideSelectors(manageAbsoluteSelectorsToHide);
  // #endregion
}

// todo cleanup types
/**
 * Hide noisy elements in the main part of the meta info section.
 * @param {object} options optional selectors for
 * - the hero static element (default: `.hero-static`)
 * - the inner main div in the "hero static" element (`div:nth-of-type(1) > div`)
 */
function cleanupMetaInfoMain(
  options = {
    heroStaticSelector: ".hero-static",
    mainSelector: "div:nth-of-type(1) > div",
  },
) {
  /** Prefer provided options when possible, fallback to defaults */
  const opts = {
    heroStaticSelector: ".hero-static",
    mainRelativeSelector: "div:nth-of-type(1) > div",
    ...options,
  };
  const mainAbsoluteSelector = `${opts.heroStaticSelector} > ${opts.mainRelativeSelector}`;
  /** All within the `heroStaticMainSelector` */
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
    (relativeSelector) => `${mainAbsoluteSelector} > ${relativeSelector}`,
  );
  hideSelectors(absoluteSelectorsToHide);
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
