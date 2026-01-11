# Luanti doc schema

When writing code for a Luanti mod or game, I don't have info about the [Luanti API](https://api.luanti.org) in my IDE.

Ref [Make API docs parsable](https://github.com/luanti-org/docs.luanti.org/issues/296)

## Current workaround

Use Luanti Tools for VS Code, which hasn't been updated since Luanti 5.11 (Feb 2025. We are in 5.14 as of November 2025)

- Maintained by GreenXenith, who has complained about the high cost of maintenance
- Current control flow for Luanti Tools is lua_api.md -> highly custom transformation code with regex -> smartsnippets.json -> VS Code extension
  - Does not solve core problem: Still missing any info not present in lua_api.md
  - Does not use industry standard LSP: Instead uses custom code and VS Code API
  - Maintenance of highly custom code is expensive, esp. compared to using an existing AST parser like [remark](../remark/readme.md)
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

## Approaches

Below are some of the ways we could rewrite the docs in a canonical form. Approaches are alphabetical.

- (Scale: Min -> Low -> Medium -> High -> Max)
  - Min indicates no known solution using this approach
  - Max indicates enterprise-grade tooling widely used in the industry.
- Research state: Backlog -> Researching -> Proposed or Rejected
- Type maturity: Maturity of tooling to type a Lua project with this approach.
- Expressiveness: The maximum complexity of types that can be expressed within the approach.
- Ease of use: The "lightweight" factor, e.g. XML has a lot of overhead syntax, but YAML has less.

| Approach    | Research state | Type maturity | Expressiveness | Ease of use | Notes                                                                |
| ----------- | -------------- | ------------- | -------------- | ----------- | -------------------------------------------------------------------- |
| EmmyLua     | Backlog        | Medium        | ??             | ??          | Lua-centric syntax, but may not be mature or expressive enough       |
| JSON        | Rejected       | Max           | Max            | Medium      | Markup language                                                      |
| LuaLS addon | Backlog        | High          | High           | High        | Research shows maturity but limitations in highly-complex scenarios  |
| Luau        | Backlog        | Max           | ??             | ??          | Enterprise-grade and Lua-centric, but might not be expressive enough |
| Markdown    | Proposed       | Min           | Max            | Max         | Extremely expressive but would require custom AST handler            |
| Teal        | Rejected       | High          | Medium         | High        | Not expressive enough                                                |
| TOML        | Rejected       | Min           | Max            | Max         | Markup language                                                      |
| TypeScript  | Backlog        | Max           | High           | Max         | Very expressive but not a Lua-centric syntax                         |
| XML         | Rejected       | Min           | Max            | Medium      | Markup language                                                      |
| YAML        | Rejected       | Min           | Max            | High        | Markup language                                                      |

All markup languages have been rejected as they just aren't the right canonical format for end-user guides.

<a id="emmylua"></a>

### EmmyLua (backlog)

still Lua, decent underlying parser, development recently picked up. Not expressive enough.

<a id="json"></a>

### JSON (rejected)

Rejected: Markup language

tons of tooling support. No clear schema, hard to handwrite.

<a id="luals-addon"></a>

### LuaLS addon (backlog)

Manually rewrite `lua_api.md` as `luanti_api.lua` in LuaCATS and integrate with LuaLS:

1. Update `lua_api.md` to `luanti_api.lua` with additional info in LuaCATS
   - If additional info isn't known, it can be left blank or explicitly marked as "unknown" in some way
   - We can test as we go using LuaLS :)
   - Mistakes will happen but should be easy to see, reproduce, and fix.
   - Advanced automated tests are out of scope for now. They are possible but have low ROI.
1. Create a LuaLS addon with the new `luanti_api.lua` under [LLS-Addons](https://github.com/LuaLS/LLS-Addons/tree/main/addons/luanti)
1. Share with the world :)

<a id="luau"></a>

### Luau (backlog)

A mature, enterprise-grade Lua-centric type system, might not be expressive enough for our needs

<a id="markdown"></a>

### Markdown (proposed)

very expressive, tons of tooling support. No clear schema yet defined, no parser built.

<a id="teal"></a>

### Teal (rejected)

Teal is a typed superset of Lua that's been in active development since 2019.

Its type system is too lightweight to recommend (e.g. doesn't support number ranges, [every type contains nil](https://github.com/teal-language/tl/issues/598))

- [teal-types GH repo](https://github.com/teal-language/teal-types/tree/master/types)
- [Types in Teal doc](https://teal-language.org/book/types_in_teal.html)
- [Teal compiler contributions over time](https://github.com/teal-language/tl/graphs/contributors)

<a id="toml"></a>

### TOML (rejected)

Rejected: Markup language

not explored

<a id="typescript"></a>

### TypeScript (backlog)

extremely complex types supported, tons of tooling support. Not Lua, not used elsewhere in Luanti repo

<a id="xml-xsd"></a>

### XML/XSD (rejected)

Rejected: Markup language

not explored, would be very verbose to handwrite. XSD = XML Schema Definition

<a id="yaml"></a>

### YAML (rejected)

Rejected: Markup language

tons of tooling support. No clear schema, can be easy to make mistakes
