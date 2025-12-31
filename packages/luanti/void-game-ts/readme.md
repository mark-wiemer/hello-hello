# Void, a minimal Luanti game

A fork of linuxdirk's minimal Void game for Luanti, used as a testbed for a noob like me.

This version uses [TypeScriptToLua](https://github.com/TypeScriptToLua/TypeScriptToLua) and is meant to be developed alongside [@mark-wiemer/luanti-api](https://github.com/mark-wiemer/luanti-api)

## Getting started

1. Install Node.js and npm
1. Clone this repo
1. Clone [luanti-api repo](https://github.com/mark-wiemer/luanti-api)
1. `cd` into this repo
1. `pnpm i --no-workspace` to install dependencies and link to the cloned luanti-api
1. `pnpm run build` to compile TypeScript to Lua and move all game-necessary files to a `dist` folder. Re-run this whenever you change the TS.
1. Copy `dist` into your Luanti games folder however you like, e.g. `cp -r dist path/to/luanti/games/void`
   - On Linux Mint, a common path is `~/.var/app/org.luanti.luanti/.minetest/games/void`
   - `cp -r dist ~/.var/app/org.luanti.luanti/.minetest/games/void`
1. The game should appear in Luanti!

## Toolchain

Tools are listed alphabetically

### Packages

- `@mark-wiemer/luanti-api` for declaring Luanti API functions in TypeScript
- `cpy-cli` for cross-platform copying game files into the dist folder
- `typescript` for writing the source code
- `tstl`, TypeScriptToLua, for transpiling TypeScript to Lua

### VS Code extensions

- LuaLS for enhanced syntax highlighting
- StyLua for styling of generated files
