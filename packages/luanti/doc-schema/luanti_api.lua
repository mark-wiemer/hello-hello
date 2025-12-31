---@meta
-- Handwritten copy of luanti_api.md with LuaCATS

---@class core
---The core namespace
core = {}

-- for deprecation workaround, ref
-- https://github.com/LuaLS/lua-language-server/issues/3074
---@deprecated
---Legacy alias for the core namespace
minetest = nil ---@type core

---When loading a mod, returns the name of that mod
---@return string
function core.get_current_modname() end
