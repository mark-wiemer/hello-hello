# Sandbox by Mark Wiemer

A minimal game written in vanilla Lua to learn the Luanti API and dev loop.

## Getting started

Instructions are for Linux Mint 22.1 Cinnamon with Bash and Node 26.9.0.
May not work on other setups.
Feel free to [open an issue on GitHub](https://github.com/mark-wiemer/hello-hello/issues/new) for help.

### Pre-requisites

- Node.js 26.9.0+ (I recommend using [fnm](https://github.com/schniz/fnm#installation))
- Luanti 5.17.0+

### Building and running

This script will move the game into the default Luanti install location:

```sh
node scripts/build.js
```

Then open or restart Luanti, and the game should appear as `mw-sandbox`.

## Gameplay

Currently minimal: Break and place blocks instantly.
All other behavior is default Luanti engine logic, including world gen.

### In-progress

[Stairs](./mods/mw_stair/readme.md)!

## Mods

Mods follow the `calm_train_case` naming convention.

- [minimal](./mods/minimal/readme.md): The minimum required features to get a game running.
- [stair](./mods/mw_stair/readme.md): Upright stairs (WIP)

## Scripts

- `build.sh`: builds and deploys the game

## Other files

- `cspell.json`: enables spell-checking for documentation
- `game.conf`: metadata necessary for Luanti
- `package.json`: helps orchestrate Node.js scripts

## Developer tools

- Decrease view range: `-`
- Increase view range: `=`
- Toggle debug info: F5
- Toggle profiler: F6

### Luanti in-game commands

Once in a world, you can type `/` to open the command palette / chat.

- `/help` lists all available commands

### Flying

- `/grantme all` allows you to fly and perform all actions.
- Enabled the "Double tap jump for fly" in settings for convenience
- Default keybind for fly is K

### Speed

- Default keybind to enable fast mode is J
- Default keybind to move fast is E (though I use Left Shift)

### VS Code extensions

These extensions aid in Lua development in general.

- sumneko.lua
