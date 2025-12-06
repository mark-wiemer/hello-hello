# Luanti Doc Schema

Ref [Make API docs parsable](https://github.com/luanti-org/docs.luanti.org/issues/296):

## Current problem

When writing code for a Luanti mod or game, I don't have info about the Luanti API in my IDE

## Current workaround

Use Luanti Tools for VS Code, which hasn't been updated since Luanti 5.11 (Feb 2025. We are in 5.14 as of November 2025)

- Maintained by GreenXenith, who has complained about the high cost of maintenance
- Current control flow for Luanti Tools is lua_api.md -> highly custom transformation code with regex -> smartsnippets.json -> VS Code extension
  - Does not solve core problem: Still missing any info not present in lua_api.md
  - Does not use industry standard LSP: Instead uses custom code and VS Code API
  - Maintenance of highly custom code is expensive, esp. compared to using an existing AST parser like [remark](../remark/readme.md)
  - Extension has minimal unit tests or automated validations

Alternatively, use LuaLS with the Luanti or Luanti Full API addon

- Luanti addon no longer exists in GitHub, only stored within LuaLS extension files
- Luanti Full API uses types from 5.4 or earlier, was never maintained by official Luanti team
- Both addons are handwritten and will not be easy to maintain as Luanti evolves

## Notes

- Luanti Tools is the only source code I've seen that auto-generates IDE functionality
  - All other options appear either handwritten or closed-source as to generating the end result
  - Includes Luanti addon for LuaLS
  - Includes Luanti Full API addon for LuaLS (luanti-ide-helper repo)
- LuaLS plugins work in any IDE
  - easiest to install in VS Code using the LuaLS [addon manager](https://luals.github.io/wiki/addons/#installing-addons)

## Considerations for a solution

- For doc writers to create and maintain it:
  - Consistent format for entire API
    - Enables automated parsing into other formats (EmmyLua, LuaCATS, TypeScript)
    - Removes decision fatigue on how to format things
    - We may start with core namespace reference, but we want to include everything
  - Easy to validate whether updated docs are in correct format or not
    - Ideally a single automated tool exits with 0 or prints detailed errors
  - Do not need to fully rewrite `lua_api.md` by hand
  - Very lightweight for adoption and long-term maintenance
    - Including comments :)
  - Familiar syntax to Lua programmers
  - Should not need to manually do backlinking or other easily-automated tasks
- For end-users to use it:
  - Available in multiple IDEs (at least: VS Code, Zed, emacs, vim)
  - Covers entire core namespace reference
  - Includes sample code with sample output (including hover text and squiggly underlines) to demonstrate most core features
  - Works without any additional setup on most machines
    - Linux Mint or similar "simple" Linux distro, Windows, macOS
    - Shouldn't need to install "luacheck" files or other "random" files to work

## Proposed solution

Manually rewrite `lua_api.md` as `luanti_api.lua` in LuaCATS and integrate with LuaLS:

1. Update `lua_api.md` to `luanti_api.lua` with additional info in LuaCATS
   - If additional info isn't known, it can be left blank or explicitly marked as "unknown" in some way
   - We can test as we go using LuaLS :)
   - Mistakes will happen but should be easy to see, reproduce, and fix.
   - Advanced automated tests are out of scope for now. They are possible but have low ROI.
1. Create a LuaLS addon with the new `luanti_api.lua` under [LLS-Addons](https://github.com/LuaLS/LLS-Addons/tree/main/addons/luanti)
1. Share with the world :)
