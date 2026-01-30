# Building Modrinth

This was done on 0.9.0 on Linux Mint 22.1 Cinnamon.

```
git remote add upstream https://github.com/modrinth/code
```

```
git fetch upstream --tags
git push origin --tags
```

1. Tag `v0.9.0` is the [last tag before this issue became critical](https://github.com/modrinth/code/issues/3057#issuecomment-2561992479).
1. I've created branch `0.9.0-linux` on my fork in an effort to build the source and run it.
1. I've `cd`-ed to `./code/apps/app` and read the readme
1. I already have Node.js, pnpm, and Rust installed.
1. I'm installing the [system dependencies for Debian-based Linux machines to use Tauri](https://v2.tauri.app/start/prerequisites/#linux), specifically:

   ```sh
   sudo apt update
   sudo apt install libwebkit2gtk-4.1-dev \
   build-essential \
   curl \
   wget \
   file \
   libxdo-dev \
   libssl-dev \
   libayatana-appindicator3-dev \
   librsvg2-dev
   ```

1. `pnpm install` worked
1. `pnpm app:dev` gave "command not found", looks like `pnpm dev` is what I need
1. `pnpm dev` is taking 30+ seconds to build but is giving several lines of output per second and no obvious errors or warnings. Now that it's building package 724, it's giving a few warnings but noting that appears critical. An app window has launched but an ERROR is also logged in the terminal. The webpage says the app failed to load, and details the same error that's in the console:

```log
   Compiling theseus v0.9.0 (/home/markw/my-stuff/hello-hello/packages/modrinth/code/packages/app-lib)
   Compiling tauri-plugin-single-instance v2.2.0
warning: struct `OfflinePayload` is never constructed
   --> packages/app-lib/src/event/mod.rs:193:12
    |
193 | pub struct OfflinePayload {
    |            ^^^^^^^^^^^^^^
    |
    = note: `#[warn(dead_code)]` (part of `#[warn(unused)]`) on by default

warning: `theseus` (lib) generated 1 warning
warning: unused variable: `window`
   --> apps/app/src/main.rs:238:25
    |
238 |             if let Some(window) = app.get_window("main") {
    |                         ^^^^^^ help: if this is intentional, prefix it with an underscore: `_window`
    |
    = note: `#[warn(unused_variables)]` (part of `#[warn(unused)]`) on by default

warning: `theseus_gui` (bin "theseus_gui") generated 1 warning (run `cargo fix --bin "theseus_gui" -p theseus_gui` to apply 1 suggestion)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 1m 05s
2026-01-30T16:27:36.965746Z  INFO theseus_gui: Initialized tracing subscriber. Loading Modrinth App!
2026-01-30T16:27:36.971731Z  INFO theseus_gui: Initializing app...
@modrinth/app-frontend:dev: Browserslist: browsers data (caniuse-lite) is 14 months old. Please run:
@modrinth/app-frontend:dev:   npx update-browserslist-db@latest
@modrinth/app-frontend:dev:   Why you should do it regularly: https://github.com/browserslist/update-db#readme
2026-01-30T16:27:42.874442Z  INFO initialize_state: theseus_gui: Initializing app event state...
2026-01-30T16:27:42.874653Z  INFO initialize_state:initialize_state: theseus::state: Connecting to app database
2026-01-30T16:27:42.878430Z ERROR theseus_gui::error: error=Error while applying migrations: migration 20250318160526 was previously applied but is missing in the resolved migrations span_trace=   0: theseus::state::initialize_state
             at packages/app-lib/src/state/mod.rs:123
   1: theseus_gui::initialize_state
             at apps/app/src/main.rs:25
@modrinth/app-frontend:dev:  ELIFECYCLE  Command failed.
 ERROR  run failed: command  exited (1)
~/my-stuff/hello-hello/packages/modrinth/code/apps/app (0.9.0-linux) Node v22.21.1
```

1. I've restarted my VS Code window in an effort to clean up my known commands. I don't think it made a difference.
1. I was very careful and deleted `~/.local/share/ModrinthApp/` to ensure my system wasn't trying to fetch irrelevant DB migrations.
1. I ran `pnpm i` again to be safe, it succeeded in a few seconds.
1. I ran `pnpm dev` and a window opened very quickly, the terminal stopped giving output for a few seconds, then gave some output and the window loaded Modrinth :)

At this point, I've recompiled Modrinth 0.9.0 and it seems to work on my Linux Mint machine with an NVIDIA graphics card and an Intel CPU without an integrated graphics card. I'm able to import `mrpack` files, launch Minecraft, and have Minecraft render with my NVIDIA GPU (F3). Modrinth itself is a bit slow, but very usable.

1. I closed the Modrinth app window, which, after a few seconds, automatically killed the terminal process
1. I ran `pnpm build` hoping to get a more performant build. After about 30 seconds it started outputting some warnings at package 846: theseus. Otherwise it gave fast continual build logs multiple times a second. Package 847, `theseus gui(bin)`, gave no output for ~30+ seconds, but eventually finished. The command then started giving `Bundling ...` output. The amd64.appImage bundle didn't give output for 30+ seconds, but did finish without issue. The terminal command ended at that point, no errors. 30 seconds is an arbitrary estimate, and my PC is very fast, it may take 10+ minutes on older machines: be patient!
1. I opened `./code/target/release/bundle/deb/Modrinth App_0.9.0_amd64.deb` from the Files app (not an IDE), which prompted me to install the package
1. I clicked `Install Package` and followed the installation steps. Installation was successful.

I can now launch Modrinth from Cinnamenu on Linux Mint 22.1 Cinnamon, and when viewing settings in Modrinth (bottom left gear icon) it shows that Modrinth is at version 0.9.0. Modrinth is still relatively laggy, probably the same as when running via `pnpm dev`, but it works. Minecraft can be launched, and Minecraft uses my NVIDIA GPU according to F3.
