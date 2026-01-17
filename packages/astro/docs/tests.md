# Tests

When moving the site to a different framework, be sure to check the following:

1. Load time
1. Size of resources transferred
1. External links open in a new tab
1. Accessibility Insights FastPass passes

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
