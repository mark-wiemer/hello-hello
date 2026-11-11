---
name: web-dev-a11y
description: Use when creating or changing a web component, widget, or interactive control in this repository. Check accessibility, responsive behavior, and consistency with existing widgets.
---

# Accessible web components

Before creating or changing a web component:

- Read the website instructions and compare existing widgets, especially
  `WorkoutTimer.astro`, for consistent spacing, colors, responsive behavior,
  focus styling, and control sizing.
- Reuse existing components when practical. Keep reusable visual controls in
  their own component files and put unrelated interaction logic in focused
  modules.
- Give every input an associated label. Give icon-only buttons a clear
  accessible name, use native buttons for actions, and preserve keyboard
  operation with a visible focus indicator.
- Make increase/decrease buttons at least 24 by 24 CSS pixels. Prefer 44 by 44
  pixel targets to match the site's workout timer.
- Respect the site's light/dark theme tokens and verify the component at narrow
  viewport widths.
- Add or update tests for control behavior and target dimensions, then run the
  site's accessibility checks.
