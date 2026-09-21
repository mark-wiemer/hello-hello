# Sandbox by Mark Wiemer

A minimal game written in vanilla Lua to learn the Luanti API and dev loop.

## Getting started

Instructions are for Linux Mint 22.1 Cinnamon with Bash and Node 26.9.0.
May not work on other setups.
Feel free to [open an issue on GitHub](https://github.com/mark-wiemer/hello-hello/issues/new) for help.

```sh
node scripts/build.js
```

Then open or restart Luanti, and it should appear as `mw-sandbox`.

## Gameplay

Currently minimal: Break and place blocks instantly.
All other behavior is default Luanti engine logic, including world gen.

## Mods

Mods follw the `calm_train_case` naming convention.

### minimal

The minimum required features to get a game running.

[minimal/readme.md](./mods/minimal/readme.md)
