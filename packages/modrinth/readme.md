# Hello Modrinth

[Modrinth](https://modrinth.com/) is an open-source client for launching Minecraft and managing mods, shaders, resource packs, and data packs.

The `code` folder is a submodule cloning the client itself, the upstream is [modrinth/code on GitHub](https://github.com/modrinth/code).

There are [longstanding known issues with running Modrinth on Linux](https://github.com/modrinth/code/issues/3057). There are some workarounds published there if your CPU has an integrated graphics card, but mine doesn't. So I plan to build an old version of the code and run that. Wish me luck!

```
git remote add upstream https://github.com/modrinth/code
```

```
git fetch upstream --tags
```

0.9.0 is the [last tag before this issue became critical](https://github.com/modrinth/code/issues/3057#issuecomment-2561992479)
