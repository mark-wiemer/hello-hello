# Hello Hello!

Why use many repo when one repo do trick?

This is a monorepo of all my personal work, with minor exceptions.
AHK++ will stay its own repo for better issue tracking and stargazing.
Websites I maintain beyond markwiemer.com will stay their own repos
because I use GitHub pages, which only supports one site per repo.

## Index

- [AHK++](./packages/ahkpp/readme.md): IDE extension for AHK v1 and v2 language support
- [Aspire](./packages/aspire/readme.md): Orchestration toolkit for distributed applications
- [Astro](./packages/astro/readme.md): Web framework for content-driven websites
- [Bash](./packages/bash/readme.md): Cross-platform shell
- [.NET (dotnet)](./packages/dotnet/readme.md): Open-source framework for any software
- [Git](./packages/git/readme.md): Version control system, includes notes on Git LFS
- [GitHub](./packages/github/readme.md): DevOps platform
  - [Codespaces](./packages/github/codespaces/readme.md)
  - [Pages](./packages/github/pages/readme.md)
  - [REST API](./packages/github/rest/readme.md)
- [JavaScript](./packages/javascript/readme.md): Programming language for adding interactivity to websites
  - [jq (jqlang)](./packages/javascript/jq/readme.md): CLI tool for editing JSON files
- [jj (Jujutsu)](./packages/jj/readme.md): Replacement for Git
- [Luanti](./packages/luanti/readme.md): Open-source engine, distribution platform, and client for "boxel" games
- [markwiemer.com](./packages/markwiemer.com/readme.md): My personal website!
- [Melvor Idle](./packages/melvor/readme.md): Heavily moddable RuneScape-inspired game
- [Mocha](./packages/mocha): JavaScript test framework for Node.js and the browser
- [mod.io](./packages/mod.io/readme.md): Site for hosting UGC
- [Modrinth](./packages/modrinth/readme.md): App for managing Minecraft versions and UGC
- [New machine](./packages/new-machine/readme.md): Setup steps for any new machine
- [Notes](./packages/notes/readme.md): Miscellaneous notes
- [pnpm](./packages/pnpm/readme.md): Node package manager, alternative to npm
- [Podman](./packages/podman/readme.md): Open-source containerization platform, like Docker
- [POSIX](./packages/posix/readme.md): Set of cross-OS standards by IEEE
- [Product recommendations](./packages/product/readme.md): Recommendations for products I maintain
- [React](./packages/react/readme.md): Library for creating complex interactive websites
- [Rust](./packages/rust/readme.md): Programming language emphasizing safety and performance
- [TypeScript](./packages/typescript/readme.md): Programming language that adds types to JavaScript
- [Unified](./packages/unified/readme.md): Software collective for content processing
- [Visual Studio Code](./packages/vscode/readme.md): IDE

## Glossary

- **boxel**: Cubic voxel. Think of games like Minecraft, but not like Astroneer or A Game About Digging a Hole. (I made up this term for this context and haven't seen it in broad use, so I almost always wrap it in quotes: "boxel")
- **DevOps**: Developer operations. Includes security. DevSecOps is a mess of a term, let's stick with DevOps.
- **UGC**: User-generated content. An umbrella term for mods, texture packs, shaders, etc.
- **voxel**: Volumetric pixel. Generally refers to a type of game where players can permanently modify the terrain.

## Setting up pnpm

This repo is organized as a `pnpm` workspace to filter out some of the noise.
You can treat the root `package.json` as my minimal recommendations for any JS package.
Although this repo isn't limited to JS, that's where I spend most of my time.

This is also my first repo with pnpm, I was an npm guy before but it's time for a change!

I followed `https://pnpm.io/installation` on Linux Mint:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

This gave me `pnpm 10.23.0` bundled with Node 20.11.1, but I don't plan to use the bundled version.
I use `fnm` to manage Node versions and I generally use an LTS version (22.21.1 as of writing). I don't use pnpm on Windows, see [/packages/pnpm/readme.md](/packages/pnpm/readme.md) for more info.

## Commit messages

Historically, I haven't followed a particular commit message style. But [Mocha](https://mochajs.org/next/) follows [Angular commit conventions](https://github.com/angular/angular/blob/26fed34e0e340166b70702d6177ad639bbfa94aa/contributing-docs/commit-message-guidelines.md) to auto-generate release logs and I think this is worth trying out :)

## License

Some software subpackages are restricted by their own license. All subpackages are free and open-source to the best of my knowledge. When not otherwise specified, the MIT license below applies.

MIT

Copyright (c) 2026 Mark Wiemer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
