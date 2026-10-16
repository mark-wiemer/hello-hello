# Docs for Sandbox by Mark Wiemer

## Known issues

Refer to [GitHub issues tagged "package: luanti sandbox"](https://github.com/mark-wiemer/hello-hello/issues?q=state%3Aopen%20label%3A%22package%3A%20luanti%20sandbox%22)

## Mods

Mods follow the `calm_train_case` naming convention.

- [minimal](../mods/minimal/readme.md): The minimum required features to get a game running.
- [stair](../mods/mw_stair/readme.md): Upright stairs (WIP)

## Scripts

- `build.sh`: builds and deploys the game

## Other files

- `/cspell.json`: enables spell-checking for documentation
- `/game.conf`: metadata necessary for Luanti
- `/package.json`: helps orchestrate Node.js scripts

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

### Items

- `/giveme mw_stair:stair` for example adds a stair to your inventory

### VS Code extensions

These extensions aid in Lua development in general.

- sumneko.lua
