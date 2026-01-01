export function setup(ctx) {
  console.log(`Hello From My Mod ${ctx.version}!`);
  console.log(ctx);
  const heroStatic = document.querySelector(".hero-static");
  if (heroStatic) {
    // hide "A game by Malcs" text
    hide(heroStatic.querySelector("div:nth-of-type(1) > div > h5:nth-of-type(1)"));
  }
}

/**
 * Sets the element's display to none.
 *
 * Does nothing if the element is falsy.
 * @param {Element} el
 */
function hide(el) {
  if (!el) return;
  el.style.display = "none";
}
