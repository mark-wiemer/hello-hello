---
name: web-dev-a11y
description: Use when creating or changing a web component, widget, or interactive control in this repository. Check accessibility, responsive behavior, and consistency with existing widgets.
---

# Accessible web development

## Before implementation

- Identify the package that owns the page or component. Read its `AGENTS.md`,
  README, and applicable design and test guidance before changing the UI.
- Inspect the shared layout, global styles, and nearby components. Reuse
  existing components and visual patterns where practical; keep reusable
  controls and unrelated interaction logic in focused modules.
- For `packages/markwiemer.com`, read `docs/guidelines.md` and `docs/tests.md`,
  then compare nearby components and `WorkoutTimer.astro` for theme tokens,
  focus styling, responsive behavior, and control sizing. Treat it as a
  reference, not as a substitute for the site guidelines.

## Accessible implementation

- Prefer native HTML semantics and controls. Associate every form input with a
  visible label; give icon-only controls an accessible name; expose validation,
  status, and changing content to assistive technology when needed.
- Make every workflow operable with a keyboard as well as a pointer. Keep
  focus visible, manage focus when an interaction changes context, and provide
  keyboard alternatives to custom gestures such as drag-and-drop.
- Dialogs need a visible close or cancel control for pointer users; do not rely
  on Escape alone. Preserve a clear way to return to the prior context.
- Make interactive targets at least 24 by 24 CSS pixels. Prefer 44 by 44 pixel
  targets, matching the site's workout timer controls.
- Use the site's theme tokens, support light and dark themes, and check narrow
  viewports and 200% zoom for clipping, overlap, and unnecessary scrolling.

## Verification

- Add or update focused tests for the changed interaction, keyboard operation,
  accessible names and state, and target dimensions where applicable.
- Run the owning package's relevant checks and accessibility tests. For
  `packages/markwiemer.com`, use its Playwright axe checks in
  `src/e2e/a11y.spec.ts` along with the relevant component behavior tests.
