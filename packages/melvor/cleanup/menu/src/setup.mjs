export function setup(ctx) {
  console.log(`Hello from cleanup-main-menu ${ctx.version}!`);
  console.log(ctx);
  cleanupUserFacingText(ctx);
  cleanupMetaInfoSection();
  cleanupMainSection();
}

/**
 * Makes user-facing text sentence case and clear.
 * User-facing text is also known as "copy," but we avoid that term
 * here for clarity.
 * - Change "manage account" button text from "Manage" to "Manage acount"
 */
export function cleanupUserFacingText() {
  const currentLang = typeof setLang !== "undefined" ? setLang : "en";

  const enFixes = {
    // Manage account button text
    CHARACTER_SELECT_7: "Manage account",
  };

  if (currentLang === "en") {
    loadedLangJson = { ...loadedLangJson, ...enFixes };
  }
}

/**
 * Hides noisy elements within the "meta info section".
 * This is the left panel on desktop.
 * Also updates some elements for readability:
 * - Moves "active mod profile" text above Mod Manager button
 * - Revamps "Change language" into a traditional button in the manage section
 * Meta info section not appear on mobile or thin viewports.
 */
function cleanupMetaInfoSection() {
  cleanupMetaInfoMain();
  hideMetaInfoManageNoise();
  moveActiveModProfileText();
  revampChangeLanguageButton();
}

//#region globals
const metaInfoSelector = ".hero-static";
const metaInfoMainSelector = `${metaInfoSelector} > div:nth-of-type(1) > div`;
//#region meta info manage
const metaInfoManageSelector = `${metaInfoSelector} > div:nth-of-type(2) > div`;
const activeModProfileTextSelector = `${metaInfoManageSelector} > p:nth-of-type(1)`;
const modManagerButtonSelector = `${metaInfoManageSelector} > div:nth-of-type(1)`;
const manageAccountButtonSelector = `${metaInfoManageSelector} > button:nth-of-type(3)`;
//#endregion meta info manage
const metaInfoFooterSelector = `${metaInfoSelector} > div:nth-of-type(3)`;
/**
 * Selector for the built-in "change language" button.
 * This mod adds a revamped button and deletes the built-in one.
 */
const changeLanguageButtonSelector = `${metaInfoFooterSelector} > ul:nth-of-type(2) > li:nth-of-type(2)`;
//#endregion globals

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
 * Revamp "change language" into a button just below the manage account button
 */
function revampChangeLanguageButton() {
  //#region clone "manage account" button
  const manageAccountButton = document.querySelector(manageAccountButtonSelector);
  if (!manageAccountButton) {
    console.error("Couldn't find the manage account button");
    return;
  }
  const newChangeLanguageButton = manageAccountButton.cloneNode(true);
  //#endregion

  //#region update icon
  const icon = newChangeLanguageButton.querySelector("i");
  if (!icon) {
    console.error("Couldn't find the `i` element");
    return;
  }
  icon.classList.remove("fa-user-cog");
  icon.classList.add("fa-language");
  //#endregion

  //#region update button text
  const langString = newChangeLanguageButton.querySelector("lang-string");
  if (!langString) {
    console.error("Couldn't find the lang string");
    return;
  }
  langString.setAttribute("lang-id", "MISC_STRING_11");
  //#endregion

  newChangeLanguageButton.onclick = () => changePageCharacterSelection(9);

  manageAccountButton.parentNode.insertBefore(
    newChangeLanguageButton,
    manageAccountButton.nextSibling,
  );

  //#region Delete old "change language" button
  const oldChangeLanguageButton = document.querySelector(changeLanguageButtonSelector);
  if (oldChangeLanguageButton) {
    oldChangeLanguageButton.remove();
  } else {
    console.error("Couldn't find the old change language button");
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
