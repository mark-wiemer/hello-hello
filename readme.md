# Hello Hello!

The starter project to start all starter projects.

This is a monorepo hosting all my "Hello World" projects with various tools.
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

- [Bash](./packages/bash/readme.md): A cross-platform shell
- [Git](./packages/git/readme.md): A version control system
- [GitHub](./packages/hello-github/readme.md): Tools for editing GitHub settings via CLI
  - Includes details on `.github` folder
- [jq (jqlang)](./packages/jq/readme.md): CLI tool for editing JSON files
- [luanti](./packages/luanti/readme.md): An open-source engine, distribution platform, and client for "boxel" games
- [Melvor Idle](./packages/melvor/readme.md): A heavily moddable RuneScape-inspired game
- [mod.io](./packages/mod.io/readme.md): A site for hosting game mods
- [pnpm](./packages/pnpm/readme.md): Node package manager, alternative to npm
- [POSIX](./packages/posix/readme.md): Set of cross-OS standards by IEEE
- [Remark](./packages/remark/readme.md): Markdown toolchain for JS
  - Created by [unified](https://unifiedjs.com/), the same collective behind [MDX](https://mdxjs.com/community/about/#who-governs-mdx) and other content processing toolchains
