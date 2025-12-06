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
- ACorp's Discord requests
  - https://irc.luanti.org/luanti-docs/2025-12-01#i_6301129
  - > personally, i'm hoping a really detailed spec down to what number types/ranges are valid, typing ids (e.g. node ids are a subtype of strings), complete defined defaults (opposed to current undefined defaults), making distinctions on runtime vs startup vs on_mods_loaded vs async env vs mapgen env, making distinctions on engine's prefilled outputs vs inputs (e.g. getting sky parameters are prefilled with default values meaning you don't need to check. compare with setting sky parameters where all properties are optional)
  - > number types would be integer and/or floats. most of luanti API can use both. but some have restrictions on integer size (i.e. u8 or i16) or specifically need integers (i.e. position hashing and voxelmanip/list indexing through API instead of table[i]) or has restrictions on acceptable ranges (i.e. light being between 0..LIGHT_MAX which is 0..14)

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

Enforce strict "Markdown schema" and integrate with LuaLS

1. Define a Markdown schema that allows doc writers to easily include additional info in a consistent format
   - Additional info fields
     - Function arg types
     - Function return values
     - Sample usage
     - ...more, probably
   - Consistent format
     - Should be lightweight (closer to TOML than XML, minimal "markup" characters)
     - Should match or nearly match existing Lua ecosystem formats (EmmyLua, LuaLS)
1. Publish a Markdown parser to validate and enforce the consistent format
   - Doc writers can run e.g. `node parse-core-ref.js` while in the folder of a draft version of `lua_api.md` to get results
   - Parser should ignore anything outside the "core namespace reference" section
   - Include informative error messages
     - Start and end position of problematic characters
     - Expected token type (e.g. arg type, return type)
   - [Early POCs](https://github.com/mark-wiemer/hello-hello/blob/3a7ec587e27b2bcd468712f080849c86a0bc40f7/packages/remark/core_namespace_ref_transformed.md) are using `remark`, a JS package. See [Luanti docs chat](https://irc.luanti.org/luanti-docs/2025-11-30#i_6300991) for details.
1. Update `lua_api.md#core-namespace-reference` to include additional info in a consistent format
   - If additional info isn't known, it can be left blank or explicitly marked as "unknown" in some way
1. Add a status check to PRs in the `luanti` repo to enforce new Markdown schema
   - GitHub Actions workflow that uses the Markdown parser and a comment action in case of errors
1. Transform `lua_api.md#core-namespace-reference` into a [LuaLS definition file](https://luals.github.io/wiki/definition-files)
1. Publish the add-on under [LLS-Addons](https://github.com/LuaLS/LLS-Addons/tree/main/addons/luanti)
1. Validate that everything works
1. Share with the world :)
