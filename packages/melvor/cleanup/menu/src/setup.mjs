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
  cleanupMetaInfoMain();
  cleanupMetaInfoManage();
}

/**
 * Hide noisy elements in the main part of the meta info section.
 * This section includes everything from the top of the page down to, but not including,
 * the mod manager button. All content is hidden by this func unless otherwise noted:
 * - platform syncs
 * - expansions list
 * - logo (not hidden by this mod)
 * - "game by Malcs" text
 * - Patreon button
 * - version number
 * - Melvor Idle 2 promo
 * - "also available on..." card
 * - Discord button
 * @param {MetaInfoMainSelectors?} selectors
 */
function cleanupMetaInfoMain(
  selectors = {
    metaInfo: ".hero-static",
    mainRelative: "div:nth-of-type(1) > div",
  },
) {
  /**
   * Prefer provided selectors when possible, fallback to defaults
   * @type {Required<MetaInfoMainSelectors>}
   */
  const seles = {
    metaInfo: ".hero-static",
    mainRelative: "div:nth-of-type(1) > div",
    ...selectors,
  };
  const mainAbsoluteSelector = `${seles.metaInfo} > ${seles.mainRelative}`;
  /** All within the `mainAbsoluteSelector` */
  const relativeSelectorsToHide = [
    "h5:nth-of-type(1)", // "game by Malcs" text
    "h3:nth-of-type(1)", // Patreon button
    "h5:nth-of-type(2)", // version number
    "div:nth-of-type(2)", // Melvor Idle 2 promo
    "div:nth-of-type(3)", // "also available on..." card
    "div:nth-of-type(4)", // Discord button
    "div:nth-of-type(5)", // platform syncs and expansions list (top of page)
  ];
  const absoluteSelectorsToHide = relativeSelectorsToHide.map(
    (relativeSelector) => `${mainAbsoluteSelector} > ${relativeSelector}`,
  );
  hideSelectors(absoluteSelectorsToHide);
}

/**
 * Hide noisy elements in the manage part of the meta info section.
 * All content is preserved by this func unless otherwise noted:
 * This section includes:
 * - mod manager button
 * - active mod profile text (moved above the mod manager button)
 * - invisible button
 *   - presumably only to add empty space, as it does not have an onclick handler
 *   - this mod sets "display: none" instead of "display: inline-block", so empty space is removed
 * - manage button
 * - logout button
 * @param {MetaInfoManageSelectors?} selectors
 */
function cleanupMetaInfoManage(
  selectors = {
    metaInfo: ".hero-static",
    manageRelative: "div:nth-of-type(2) > div",
  },
) {
  /**
   * Prefer provided selectors when possible, fallback to defaults
   * @type {Required<MetaInfoManageSelectors>}
   */
  const seles = {
    metaInfo: ".hero-static",
    manageRelative: "div:nth-of-type(2) > div",
    ...selectors,
  };
  const manageAbsoluteSelector = `${seles.metaInfo} > ${seles.manageRelative}`;
  /** All within the `manageAbsoluteSelector` */
  const relativeSelectorsToHide = [
    "button:nth-of-type(1)", // invisible button presumably there for padding
  ];
  const manageAbsoluteSelectorsToHide = relativeSelectorsToHide.map(
    (relativeSelector) => `${manageAbsoluteSelector} > ${relativeSelector}`,
  );
  hideSelectors(manageAbsoluteSelectorsToHide);

  //#region Move active mod profile text above the mod manager button
  const activeModProfileText = document.querySelector(
    `${manageAbsoluteSelector} > p:nth-of-type(1)`,
  );
  const modManagerButton = document.querySelector(`${manageAbsoluteSelector} > div:nth-of-type(1)`);
  if (activeModProfileText && modManagerButton) {
    modManagerButton.parentNode.insertBefore(activeModProfileText, modManagerButton);
  } else {
    console.error("Couldn't find both the active mod profile text and the mod manager button");
  }
  //#endregion
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

//#region typedefs
/**
 * Selectors for the meta info section and its main section.
 * Any number can be provided, functions using this should merge with a default object.
 * @typedef {Object} MetaInfoMainSelectors
 * @property {string?} metaInfo default: `.hero-static`
 * @property {string?} mainRelative the inner div in the main section of the meta info section (`div:nth-of-type(1) > div`)
 */

/**
 * Selectors for the meta info element and its manage section.
 * Any number can be provided, functions using this should merge with a default object.
 * @typedef {Object} MetaInfoManageSelectors
 * @property {string?} metaInfo default: `.hero-static`
 * @property {string?} manageRelative the inner div in the manage section of the meta info section (`div:nth-of-type(2) > div`)
 */
//#endregion
