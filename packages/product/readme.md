# Hello Product

Recommendations I try to follow for all products I build, regardless of framework:

- Accessibility
  - Accessibility Insights full assessment every 90 days
- Performance
  - Test all pages with "Slow 3G" connection
  - Defer all images, but with Cumulative Layout Shift handled
  - Use low-res images first with optional high-res images based on connection speed, connection type?, user preferences
  - Prioritize sending minified content instead of sending inspectable content
    - Source code linked anyway, see "transparency" section
  - Only apply CSS rules where necessary (e.g. don't apply rules to all `figure` elements if only some need them)
  - Use stylesheets instead of repeated style attributes
- Privacy
  - No cookie banner: Only use strictly necessary cookies
  - Transparent tracking: If I do track info, it's always
    - Opt-in
    - Easy to opt out (max 4 clicks: menu > settings > telemetry > opt out)
    - Clear what data is being sent (sample JSON payload)
    - Clear what data will never be sent (IP, location, etc.)
    - Clear when the tracked data changes
      - Users are automatically opted out?
      - Subtle badge appears in settings submenu
      - Notification? (max 1 change per month if so? Notification spam sucks)
- Security
  - I only build static sites right now, so no special concerns here
- Transparency
  - Source code linked at bottom of each page
  - Licensed under MIT or other widely-recognized FOSS license
- Tooling
  - When working with source code, spell-checker should be enabled
