# Tests

When moving the site to a different framework, be sure to check the following:

1. Load time
1. Size of resources transferred
1. External links open in a new tab
1. Accessibility Insights FastPass passes

## Userspace links

These links should always redirect somewhere useful:

- /games
- /games/dodge-the-creeps
- /games/racetrack-tycoon
- /games/snake
- /games/\*/index.html (any index.html file under the games folder, including /games/index.html)
- todo more

## Link state matrix

There are three colors: unvisited, visited, and plaintext. Plaintext color is, well, the color of plaintext.

1. No hover, unvisited: unvisited
2. Hover unvisited: unvisited outlined
3. No hover, visited: visited
4. Hover visited: visited outlined
5. Active unvisited: plaintext outlined
6. Active visited: plaintext outlined

Then duplicate for light mode and dark mode!

To simplify this work, see [Issue 13](https://github.com/mark-wiemer/hello-hello/issues/13)

## Breakpoints

### Names

- 320: Minimum
- 320-480: Very thin
- 480-640: Thin
- 640-1280: Medium
- 1280+: Wide

### 320-480px

- Homepage heading should still be unbroken
- Header images should still be side-by-side

### 320-640px

- Modern app chart has 1 column

### 640-1280px

- Modern app chart has 3 columns

### 1280px+

- Modern app chart has 5 columns

## Accessibility

- Home page
- Snake game
- "About" blog post (includes `figure`)
- Glossary (includes `dl`)
- Resume
- Software (includes `grid`)

### States

- Nav open vs closed
