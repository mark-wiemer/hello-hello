# Hello Melvor

OK it's time to clean up all these weird UX issues with Melvor!

## Development

Melvor Idle hosts mods on [mod.io](../mod.io/readme.md), and modiom is a CLI client to manage mod.io artifacts.

### Create new mod

ClickOps in the GUI, be sure to check "Supported Game Version: 1.3.1" (or whatever the latest version is)

### Edit existing mod

- Attempting to reupload the same version will result in a silent failure

Sample script:

```sh
./upload.sh cleanup/menu 0.1.8
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
