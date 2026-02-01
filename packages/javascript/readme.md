# Hello JavaScript

It's quite a popular language! This folder contains both reference JavaScript files and my guidance for structuring JavaScript-based projects (including TypeScript projects): tooling like linters, formatters, and test frameworks.

## Setup

To run JavaScript, one must first install a JavaScript runtime. There are three major players: Node, Deno, and Bun. I use Node, which has the world's most annoying [installation configuration](https://nodejs.org/en/download) as of writing (2026-01-28). For most projects, I use [Bash](../bash/readme.md), Node 22, `fnm`, and `pnpm` on both Windows and Linux. I use `npm` for [Mocha](../mocha/readme.md)-related work or any advanced work on Windows, like AHK++. `fnm` on Windows is not recommended by Node but I'm not about to install Docker just for this and Chocolatey isn't sufficient. `fnm` and `pnpm` on Windows don't get along, so I do almost all development on Linux.

1. ```sh
   sudo choco install fnm
   fnm install 22.21.1
   fnm default 22.21.1
   ```
1. Update `.bashrc` to include this at the end:
   ```sh
   eval "$(fnm env --use-on-cd --shell bash)"
   ```
1. Restart terminal or run `source ~/.bashrc`
1. ```sh
   fnm use 22.21.1
   ```

This doesn't seem to quite work: https://github.com/pnpm/pnpm/issues/10531. Likely a corepack issue? I hate corepack.

## Resources

- [Chocolatey (choco)](https://github.com/chocolatey/choco)
- [fnm](https://github.com/Schniz/fnm)
- [Hello Bash](../bash/readme.md)
- [Hello TypeScript](../typescript/readme.md)
- [Hello pnpm](../pnpm/readme.md)
- [JSDoc](https://jsdoc.app/): integrated into VS Code
- [Node.js](https://nodejs.org/)
- [TSDoc](https://tsdoc.org/): not integrated into VS Code as of writing (2026-01-28)
