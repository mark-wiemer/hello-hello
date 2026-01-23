# Luanti doc schema

When writing code for a Luanti mod or game, I don't have info about the [Luanti API](https://api.luanti.org) in my IDE.

Ref [Make API docs parsable](https://github.com/luanti-org/docs.luanti.org/issues/296)

## Current workaround

Use Luanti Tools for VS Code, which hasn't been updated since Luanti 5.11 (Feb 2025. We are in 5.14 as of November 2025)

- Maintained by GreenXenith, who has complained about the high cost of maintenance
- Current control flow for Luanti Tools is lua_api.md -> highly custom transformation code with regex -> smartsnippets.json -> VS Code extension
  - Does not solve core problem: Still missing any info not present in lua_api.md
  - Does not use industry standard LSP: Instead uses custom code and VS Code API
  - Maintenance of highly custom code is expensive, esp. compared to using an existing AST parser like [remark](../unified/readme.md)
  - Extension has minimal unit tests or automated validations

Alternatively, use LuaLS with the "Luanti" or "Luanti Full API" addon:

- "Luanti" addon no longer exists in GitHub, only stored within LuaLS extension files
- "Luanti Full API" addon uses types from 5.4 or earlier, was never maintained by official Luanti team
- Both addons are handwritten and will not be easy to maintain as Luanti evolves

## Considerations for a solution

- For doc writers to create and maintain it:
  - Consistent format for entire API
    - Enables automated parsing into other formats (EmmyLua, LuaCATS, TypeScript)
    - Removes decision fatigue on how to format things
  - Easy to validate whether updated docs are in correct format or not
    - Ideally a single automated tool exits with 0 or prints detailed errors
  - Very lightweight for adoption and long-term maintenance
    - Including comments :)
  - Familiar syntax to Lua programmers
  - Should not need to manually do backlinking or other easily-automated tasks
- For end-users to use it:
  - Available in multiple IDEs (at least: VS Code, Zed, emacs, vim)
  - Includes sample code with sample output (including hover text and squiggly underlines) to demonstrate most core features
  - Works without any additional setup on most machines
    - Linux Mint or similar "simple" Linux distro, Windows, macOS
    - Shouldn't need to install "luacheck" files or other "random" files to work

## Notes

- Luanti Tools is the only source code I've seen that auto-generates IDE functionality
  - All other options appear either handwritten or closed-source as to generating the end result
  - Includes Luanti addon for LuaLS
  - Includes Luanti Full API addon for LuaLS (luanti-ide-helper repo)
- LuaLS plugins work in any IDE
  - easiest to install in VS Code using the LuaLS [addon manager](https://luals.github.io/wiki/addons/#installing-addons)
- Expressiveness
  - Artifacts
    - 2025-12-06: [corpserot's notes](https://gist.github.com/corpserot/6f23ae3caca48f31b6b9b460507f23dc)
    - 2025-12-31: [Riseup pad](https://pad.riseup.net/p/Luanti-Docs)
      - todo read this and its chat (bottom right)
    - 2026-01-01: [Lars's comments](https://github.com/luanti-org/docs.luanti.org/issues/296#issuecomment-3703936047)
  - Requests (not requirements!)
    - number subtypes like `u16`
    - enum values
    - complex string values: "\<adjective\>\<color\>" -> "lightred", "darkblue", etc.
    - default values for arguments:
    - `nil` value vs value not provided behaves differently
    - "environment" in which the function works: startup, main, async, async mapgen, maybe more
      - some symbols can be written to in certain environments but read in others
    - operator overloading (e.g. arithmetic operators are defined for vectors)
    - whether something mutates an object (const)
- Canonical document
  - Needs five levels of headings
    - Current doc has multiple h1 elements, which is not good for accessibility
      - Each h1 element corresponds to its own webpage though
      - 39 h1 elements in total
    - Current doc has 55 h4 elements, so we can't change the depth.
    - Current doc has 0 h5 elements.

<a id="approaches"></a>
Approaches are now documented in [approaches.md](notes/approaches.md)
