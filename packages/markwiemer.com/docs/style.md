# Style guide

## Guidance

- "open-source" not "open source"
- avoid special characters, even when copy-pasting, they mess with appearance on mobile
- avoid empty bullet points for clarity
- ignore leading and trailing spaces in HTML that are inserted by Astro/Prettier formatting

## Reasons

Browsers trim all leading and trailing spaces. Manually removing them has no impact on UX aside from a minimal impact on file size/page load time. Likely less than 0.1% change. ROI not worth it.
