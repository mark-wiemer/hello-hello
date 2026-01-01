# Hello Melvor

OK it's time to clean up all these weird UX issues with Melvor!

## Development

Melvor Idle hosts mods on [mod.io](../mod.io/readme.md), and modiom is a CLI client to manage mod.io artifacts.

### Create new mod

ClickOps in the GUI

### Edit existing mod

- Attempting to reupload the same version will result in a silent failure

Sample script:

```sh
zip -r dist/cleanup-menu.zip . -i ./cleanup/menu/**
# 2869: game ID for Melvor Idle
# 5641775: global mod ID, visible in mod.io
modiom upload 2869 5641775 dist/cleanup-menu.zip --version 0.1.2 --changelog "Hello world"
```

## Projects

### Cleanup

- Batch of mods organized by affected skill or view (bank, menu, settings, etc.)
- Organize the UX, removing noise and adding search when valuable
- Does not affect what players can do, but allows them to do it faster
  - Same number of clicks, but buttons are easier to find

### QoL

- Does affect what players can do
  - e.g. macro to harvest, apply goop, and replant with one click

## Resources

- [Mod Creation/Getting Started - Melvor Idle Wiki](https://wiki.melvoridle.com/w/Mod_Creation/Getting_Started)
