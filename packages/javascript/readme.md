# Hello JavaScript

It's quite a popular language! This folder contains both reference JavaScript files and my guidance for structuring JavaScript-based projects (including TypeScript projects): tooling like linters, formatters, and test frameworks.

## Setup

Running JavaScript files is surprisingly complicated.

To run JavaScript, one must first install a JavaScript runtime. There are three major players: Node, Deno, and Bun. Node is independent, Deno is owned by Cloudflare, and Bun is owned by Anthropic. I use Node. If you're running a single standalone file, this is all you need.

If you want to use a package with dependencies, you must use a package manager. Node is paired with npm. Deno and Bun have built-in package managers.

If you want to later update your runtime, you should install a runtime version manager. I use `fnm` for Node. Deno and Bun, as much newer systems, presumably have simpler upgrade workflows, but I haven't used them enough to know.

### Node

Node has the world's most annoying [installation configuration](https://nodejs.org/en/download) as of writing (2026-11-03). For most projects, I use [Bash](../bash/readme.md), Node 26, `fnm`, and `npm` on both Windows and Linux. The Node team doesn't recommend `fnm` on Windows, but it works for my use-cases so far. That said, I do nearly all development on Linux nowadays.

For more on Linux, see [Hello Linux Mint](../new-machine/linux/linux-mint.md)

For Windows, try:

1. ```sh
   sudo choco install fnm
   fnm install 26
   fnm default 26
   ```
1. Update `.bashrc` to include this at the end:
   ```sh
   eval "$(fnm env --use-on-cd --shell bash)"
   ```
1. Restart terminal or run `source ~/.bashrc`
1. ```sh
   fnm use 26
   ```

Again, I use Linux.

Also, I've experimented with running basic `ts` files directly with Node, e.g. `node index.ts`. For more advanced TS features, see [Hello TypeScript](../typescript/readme.md).

Once things are working, you should be able to run `node hello.js` and see `Hello world!` output.

## Resources

- [Chocolatey (choco)](https://github.com/chocolatey/choco)
- [fnm](https://github.com/Schniz/fnm)
- [Hello Bash](../bash/readme.md)
- [Hello TypeScript](../typescript/readme.md)
- [Hello pnpm](../pnpm/readme.md)
- [JSDoc](https://jsdoc.app/): integrated into VS Code
- [Node.js](https://nodejs.org/)
- [TSDoc](https://tsdoc.org/): not integrated into VS Code as of writing (2026-01-28)
