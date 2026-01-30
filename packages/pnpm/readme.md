# Hello pnpm

`pnpm` ([performant npm](https://pnpm.io/faq#what-does-pnpm-stand-for)) is a Node package manager, an alternative to `npm`. I use Linux for all pnpm-related development: if you have issues on Windows, I can't help!

## Usage

`pnpm` can be used as an alternative to:

- `npm install` (`pnpm add` for new packages, `pnpm install` for existing ones)
- `npm start`
- `npm run`
- `npx` (`pnpx` or `pnpm dlx`)
- more...

## Configuring

[pnpm settings docs](https://pnpm.io/settings) lists each possible config value with a description.
[pnpm config docs (10.x)](https://pnpm.io/10.x/cli/config) has details on all the possible values for pnpm 10.x.

### Preferred config

```
pnpm config set -g init-type module
pnpm config set -g init-license MIT
pnpm config set -g init-version 0.1.0
```

### Scripts

According to AI, on Windows, `pnpm` cannot call itself, so something like:

```jsonc
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ci": "pnpm test --run", // just doesn't work!
  },
}
```

I can't find a good workaround here, closest I can think is to create a JS file for each re-used command, but that doesn't sound fun to say the least.

I was using an unofficial approach to Node installations on Windows (fnm), so I didn't expect support there. Docker was a pain, to say the least. Chocolatey didn't quite work. Corepack is just plain bad, at least, I can't get it to work.

I've switched to Linux for all pnpm-related development instead, because it does work on Linux.
