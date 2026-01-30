# Hello Modrinth

[Modrinth](https://modrinth.com/) is an open-source client for launching Minecraft and managing mods, shaders, resource packs, and data packs.

The `code` folder is a submodule cloning the client itself, the upstream is [modrinth/code on GitHub](https://github.com/modrinth/code).

There are [longstanding known issues with running Modrinth on Linux](https://github.com/modrinth/code/issues/3057). There are some workarounds published there if your CPU has an integrated graphics card, but mine doesn't. So I plan to build an old version of the code and run that. Wish me luck!

```
git remote add upstream https://github.com/modrinth/code
```

```
git fetch upstream --tags
git push origin --tags
```

1. Tag `v0.9.0` is the [last tag before this issue became critical](https://github.com/modrinth/code/issues/3057#issuecomment-2561992479).
1. I've created branch `0.9.0-linux` in an effort to build the source and run it.
1. I've `cd`-ed to `apps/app` and read the readme
1. I already have Node.js, pnpm, and Rust installed.
1. I'm installing the [system dependencies for Debian-based Linux machines to use Tauri](https://v2.tauri.app/start/prerequisites/#linux)
1. Tauri didn't tell me to install anything else
1. `pnpm install` worked
1. `pnpm app:dev` gave "command not found", looks like `pnpm dev` is what I need
1. `pnpm dev` is taking 30+ seconds to build but is giving several lines of output per second and no obvious errors or warnings. Now that it's building package 724, it's giving a few warnings but noting that appears critical. An app window has launched but an ERROR is also logged in the terminal. The webpage says the app failed to load, and details the same error that's in the console:

```
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

<!-- todo remove Modrinth branding assets (how??) -->
