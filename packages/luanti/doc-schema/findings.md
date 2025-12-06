# Findings from experimentation

- Can only officially mark functions as deprecated, nothing else, but a workaround exists
  - [@deprecated is ignored on globals when assigned by another global](https://github.com/LuaLS/lua-language-server/issues/3074)
    - Includes workaround used in sample.lua
  - [Feature Request: Deprecate fields and parameters](https://github.com/LuaLS/lua-language-server/issues/1313)
