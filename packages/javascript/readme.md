# Hello JavaScript

It's quite a popular language! This folder contains both reference JavaScript files and my guidance for structuring JavaScript-based projects (including TypeScript projects): tooling like linters, formatters, and test frameworks.

## Setup

To run JavaScript, one must first install a JavaScript runtime. There are three major players: Node, Deno, and Bun. I use Node, which has the world's most annoying [installation configuration](https://nodejs.org/en/download) as of writing (2026-01-28). For consistency, I use Node 22, Chocolatey, and `pnpm`:

```sh
# Download and install Node.js
sudo choco install nodejs --version="22.22.0"

# Verify the Node.js version
node -v

# Download and install pnpm
sudo corepack enable pnpm

# Verify pnpm version
pnpm -v

# Update pnpm
sudo pnpm install -g pnpm@latest

# Verify pnpm update
pnpm -v
```

This doesn't seem to quite work: https://github.com/pnpm/pnpm/issues/10531. Likely a corepack issue? I hate corepack.

## Resources

- [JSDoc](https://jsdoc.app/): integrated into VS Code
- [Hello TypeScript](../typescript/readme.md)
- [TSDoc](https://tsdoc.org/): not integrated into VS Code as of writing (2026-01-28)
