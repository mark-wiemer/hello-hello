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

## Index

- [Bash](./packages/bash/readme.md): A cross-platform shell
- [GitHub](./packages/hello-github/readme.md): Tools for editing GitHub settings via CLI
- [jq (jqlang)](./packages/jq/readme.md): CLI tool for editing JSON files
- [pnpm](./packages/pnpm/readme.md): Node package manager, alternative to npm
- [POSIX](./packages/posix/readme.md): Set of cross-OS standards by IEEE
