# LuaCATS findings

1. Install LuaLS into your IDE
1. Add `luanti_api.lua` to the `Lua.workspace.library` setting (use full relative path)
1. Restart extensions
1. Open `my_mod.lua`

`minetest` should render crossed out, and other IntelliSense should be available.

## Limitations of LuaCATS + LuaLS

- Can only officially mark functions as deprecated, nothing else, but a workaround exists
  - [@deprecated is ignored on globals when assigned by another global](https://github.com/LuaLS/lua-language-server/issues/3074)
    - Includes workaround used in sample.lua
  - [Feature Request: Deprecate fields and parameters](https://github.com/LuaLS/lua-language-server/issues/1313)
- Export document
  - might throw errors out of the box, but a workaround exists
    - [Error when exporting Lua language server documentation](https://github.com/LuaLS/lua-language-server/issues/3170)
  - always goes to the log path by default
    - [Feature: add setting to configure default path for exporting documentation (VS Code)](https://github.com/LuaLS/lua-language-server/issues/3311)
  - includes tons of extra types after applying the workaround
    - unclear if the workaround had anything to do with this
    - goal is to export just the `luanti_api.lua` into `doc.md`, unclear where other types are coming from
