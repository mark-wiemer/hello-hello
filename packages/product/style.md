# Product style guide

General guidelines for the text and some UX used in each product.

- follow [The Elements of Style (aka Strunk & White)](https://en.wikipedia.org/wiki/The_Elements_of_Style)
- only use one menu button by default (everything is a subment of the product's main menu)
  - simple to remember
  - cleaner look and feel
  - advanced products can allow users to bring submenus into the main surface, similar to putting app icons on their home screen
- avoid special characters (special apostrophes, etc), even when copy-pasting, for consistency
- avoid empty bullet points for clarity
- ignore leading and trailing spaces in HTML that are inserted by Astro/Prettier formatting
  - browsers trim all leading and trailing spaces. Manually removing them has no impact on UX aside from a minimal impact on file size/page load time. Likely less than 0.1% change. ROI not worth it.
