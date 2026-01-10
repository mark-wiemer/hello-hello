# Hello Melvor

OK it's time to clean up all these weird UX issues with Melvor!

## Development

Melvor Idle hosts mods on [mod.io](../mod.io/readme.md), install modiom before getting started. modiom is a CLI client to manage mod.io artifacts.

### Create new mod

ClickOps in the GUI, be sure to check "Supported Game Version: 1.3.1" (or whatever the latest version is)

### Test changes to a mod

#### Steam client

The Steam client is the recommended client for testing, as it's less prone to crashing.

The Creator Toolkit has a [Directory Link](https://wiki.melvoridle.com/w/Mod_Creation/Creator_Toolkit#Directory_Link) feature to automatically build mod zips on reload. This can have a perf impact but is recommended for this project.

I recommend using VS Code local, not in-browser. That way you can simply refresh Melvor to get the latest changes, instead of having to commit, pull from the cloud, and then refresh Melvor.

See also [Enabling DevTools for the Steam and Epic Clients](https://wiki.melvoridle.com/w/Mod_Creation/Enabling_DevTools_for_the_Steam_and_Epic_Clients) to really speed up development!

#### Web client

For me, the web client often crashes once I'm in the game, even without any mods installed, due to some failure to save to a cloud. I haven't researched because the Steam client is often sufficient. This issue appears to be slightly worse when using Cleanup Main Menu 1.0.0, but I haven't gathered data yet.

Use the Creator Toolkit:

1. Build the zip:

   ```sh
   scripts/build-zip.sh cleanup/menu
   ```

1. Open Creator Toolkit
1. Upload the zip
1. Refresh the page

### Publish updated mod

- Attempting to reupload the same version will result in a silent failure

Sample script:

```sh
scripts/upload.sh cleanup/menu 0.1.8
```

## Projects

### Calc

Quick independent scripts for calculations (e.g. player combat level). Not mods.

### Cleanup

- Batch of mods organized by affected skill or view (bank, menu, settings, etc.)
- Organize the UX, removing noise and adding search when valuable
- Does not affect what players can do, but allows them to do it faster
  - Same number of clicks, but buttons are easier to find

### QoL

(Not created yet)

- Does affect what players can do
  - e.g. macro to harvest, apply goop, and replant with one click

## Resources

- [Melvor Idle Wiki: Mod Creation](https://wiki.melvoridle.com/w/Mod_Creation)
  - [Getting Started](https://wiki.melvoridle.com/w/Mod_Creation/Getting_Started)
  - [Creator Toolkit](https://wiki.melvoridle.com/w/Mod_Creation/Creator_Toolkit): official system for loading mods locally instead of uploading each version to mod.io
  - [Enabling DevTools for the Steam and Epic Clients](https://wiki.melvoridle.com/w/Mod_Creation/Enabling_DevTools_for_the_Steam_and_Epic_Clients)
- [pixelcave OneUI](https://pixelcave.com/products/oneui): Melvor 1.3.1 uses OneUI 4.7.0 from 2020
  - (DevTools > Sources > Page > top/melvoridle.com/assets/css/lib/oneui.css > first few lines)
- [Font Awesome 5 icons](https://fontawesome.com/v5/search)
  - `.fa` ruleset includes `font-family: "Font Awesome 5 Free"`
