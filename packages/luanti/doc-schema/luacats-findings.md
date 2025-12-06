# LuaCATS findings

1. Install LuaLS into your IDE
1. Add luanti_api.lua to the `Lua.workspace.library` setting
1. Restart extensions
1. Open `my_mod.lua`

`minetest` should render crossed out, and other IntelliSense should be available.

## Limitations of LuaCATS + LuaLS

- Can only officially mark functions as deprecated, nothing else, but a workaround exists
  - [@deprecated is ignored on globals when assigned by another global](https://github.com/LuaLS/lua-language-server/issues/3074)
    - Includes workaround used in sample.lua
  - [Feature Request: Deprecate fields and parameters](https://github.com/LuaLS/lua-language-server/issues/1313)
