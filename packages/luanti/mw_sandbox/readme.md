# Sandbox by Mark Wiemer

A minimal game written in vanilla Lua to learn the Luanti API and dev loop.

## Gameplay

Nearly all behavior is builtin to Luanti.
This game adds basic stairs crafted in an L-shape from stone.
See [gameplay.md](./docs/gameplay.md) for more details.

## Getting started

Instructions are for Linux Mint 22.1 Cinnamon with Bash and Node 26.9.0.
May not work on other setups.
Feel free to [open an issue on GitHub](https://github.com/mark-wiemer/hello-hello/issues/new) for help.

### Pre-requisites

- Luanti 5.17.0+

Highly recommended:

- Node.js 26.9.0+ (I recommend using [fnm](https://github.com/schniz/fnm#installation))

### Building with Node

This script will move the game into the default Luanti install location:

```sh
node scripts/build.js
```

### Building without Node

1. Identify your user data directory
   1. Open Luanti
   1. Go to About
   1. Click "Open User Data Directory"
1. Copy this folder into your user data directory's `games` folder (e.g. this file would be `path/to/.minetest/games/mw_sandbox/readme.md`)

### Playing

Open or restart Luanti and the game should appear as `mw_sandbox`.

## Learn more

See [docs](./docs/readme.md) for more info.
