export function setup(ctx) {
  console.log(`Hello from cleanup-main-menu ${ctx.version}!`);
  console.log(ctx);
  cleanupMetaInfoSection();
  cleanupMainSection();
}

/**
 * Hides noisy elements within the "meta info section".
 * This is the left panel on desktop.
 * Also rearranges some elements for readability.
 * Does not appear on mobile or thin viewports.
 */
function cleanupMetaInfoSection() {
  cleanupMetaInfoMain();
  hideMetaInfoManageNoise();
  moveActiveModProfileText();
}

//#region globals (readonly)
const metaInfoSelector = ".hero-static";
const metaInfoMainSelector = `${metaInfoSelector} > div:nth-of-type(1) > div`;
const metaInfoManageSelector = `${metaInfoSelector} > div:nth-of-type(2) > div`;
const activeModProfileTextSelector = `${metaInfoManageSelector} > p:nth-of-type(1)`;
const modManagerButtonSelector = `${metaInfoManageSelector} > div:nth-of-type(1)`;
//#endregion

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
 */
function cleanupMetaInfoMain() {
  /** All within the `metaInfoMainSelector` */
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
    (relativeSelector) => `${metaInfoMainSelector} > ${relativeSelector}`,
  );
  hideSelectors(absoluteSelectorsToHide);
}

/**
 * Hide noisy elements in the manage part of the meta info section.
 * All content is preserved by this func unless otherwise noted:
 * This section includes:
 * - mod manager button
 * - active mod profile text
 * - invisible button
 *   - presumably only to add empty space, as it does not have an onclick handler
 *   - this mod sets "display: none" instead of "display: inline-block", so empty space is removed
 * - manage button
 * - logout button
 */
function hideMetaInfoManageNoise() {
  /** All within `metaInfoManageSelector` */
  const relativeSelectorsToHide = [
    "button:nth-of-type(1)", // invisible button presumably there for padding
  ];
  const manageAbsoluteSelectorsToHide = relativeSelectorsToHide.map(
    (relativeSelector) => `${metaInfoManageSelector} > ${relativeSelector}`,
  );
  hideSelectors(manageAbsoluteSelectorsToHide);
}

/**
 * Move the "active mod profile" text from below the "Mod Manager" button
 * to above that button.
 * Error to console if the text or button cannot be found.
 */
function moveActiveModProfileText() {
  const activeModProfileText = document.querySelector(activeModProfileTextSelector);
  const modManagerButton = document.querySelector(modManagerButtonSelector);
  if (activeModProfileText && modManagerButton) {
    modManagerButton.parentNode.insertBefore(activeModProfileText, modManagerButton);
  } else {
    console.error("Couldn't find both the active mod profile text and the mod manager button");
  }
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
