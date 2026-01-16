# Hello Hello!

Why use many repo when one repo do trick?

This is a monorepo slowly growing to host all my personal work.
It's organized as a `pnpm` workspace to filter out some of the noise.
You can treat the root `package.json` as my minimal recommendations for any JS package.
Although this repo isn't limited to JS, that's where I spend most of my time.

## Setting up pnpm

This is also my first repo with pnpm, I was an npm guy before but it's time for a change!

I followed `https://pnpm.io/installation`:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

This gave me `pnpm 10.23.0` bundled with Node 20.11.1, but I don't plan to use the bundled version.
I use `fnm` to manage Node versions and I generally use an LTS version (22.21.1 as of writing)

## Commit messages

Historically, I haven't followed a particular commit message style. But [Mocha](https://mochajs.org/next/) follows [Angular commit conventions](https://github.com/angular/angular/blob/26fed34e0e340166b70702d6177ad639bbfa94aa/contributing-docs/commit-message-guidelines.md) to auto-generate release logs and I think this is worth trying out :)

## Index

- [AHK++](./packages/ahkpp/readme.md): IDE extension for AHK v1 and v2 language support
- [Bash](./packages/bash/readme.md): Cross-platform shell
- [Git](./packages/git/readme.md): Version control system, includes notes on Git LFS
- [GitHub](./packages/github/readme.md): DevOps platform
  - [Codespaces](./packages/github/codespaces/readme.md)
  - [Pages](./packages/github/pages/readme.md)
  - [REST API](./packages/github/rest/readme.md)
- [JavaScript](./packages/javascript/readme.md): Programming language for adding interactivity to websites
  - [jq (jqlang)](./packages/javascript/jq/readme.md): CLI tool for editing JSON files
- [luanti](./packages/luanti/readme.md): Open-source engine, distribution platform, and client for "boxel" games
- [markwiemer.com](./packages/markwiemer.com/readme.md): My personal website!
- [Melvor Idle](./packages/melvor/readme.md): Heavily moddable RuneScape-inspired game
- [Mocha](./packages/mocha): JavaScript test framework for Node.js & the browser
- [mod.io](./packages/mod.io/readme.md): Site for hosting game mods
- [New machine](./packages/new-machine/readme.md): Setup steps for any new machine
- [pnpm](./packages/pnpm/readme.md): Node package manager, alternative to npm
- [POSIX](./packages/posix/readme.md): Set of cross-OS standards by IEEE
- [React](./packages/react/readme.md): Library for creating complex interactive websites
- [Remark](./packages/remark/readme.md): Markdown toolchain for JS
- [Rust](./packages/rust/readme.md): Programming language emphasizing safety and performance
- [TypeScript](./packages/typescript/readme.md): Programming language that adds types to JavaScript
- [Visual Studio Code](./packages/vscode/readme.md): IDE

## License

MIT

Copyright (c) 2026 Mark Wiemer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
