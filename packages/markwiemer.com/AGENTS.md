# markwiemer.com

Start each response with `markwiemer.com:` and any other required prefixes.

Before changing this site:

- Read [site guidelines](docs/guidelines.md) and follow their content and style
  conventions.
- Read the [test checklist](docs/tests.md) when changing pages, layout, styling,
  or interactions. Preserve its accessibility, responsive, and navigation
  expectations.
- Check the [site README](readme.md) for setup and package commands.
- Review [the shared layout](src/layouts/Layout.astro),
  [global styles](src/public/styles.css), and nearby pages or components before
  introducing visual patterns. Extend the existing theme and responsive
  conventions.
- For content that depends on client-side initialization, keep dependent
  controls and lower-page content hidden until the initial render finishes.
  Delay any loading indicator by 100 ms so instant loads do not flash it;
  reserve the loading area's height.

Write or update a failing test before changing production behavior. Update this
file when user feedback establishes a recurring site-specific instruction.
