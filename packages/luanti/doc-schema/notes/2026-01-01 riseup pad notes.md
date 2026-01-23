# Riseup pad notes

Ref [annotated riseup pad](./2025-12-31%20riseup%20pad%20annotated.md)

## GreenXenith's notes

First notes:

- userdata is not always hidden and may be important (such as player objects).
- Lua tables are arrays and/or hash maps. Specifically defining tuples as a type, and using "lists" and "mappings" - instead of either the official designation or something familiar (list is ok, but "mapping" is out of place when it is usually just "maps" or "dictionaries"), seems odd. This is mostly semantics.
- I assume the practical reason for Unions is when multiple types are allowed, or type casting (such as strings/numbers).
- I would avoid getting into things like traits. Rust is cool but complex. KISS.
- Examples should definitely be separate from descriptions as items. Some parsers may opt to omit examples (such as IDEs).
- Organization and scope is a discussion that does need to happen

And I am only 55 lines in 😩

Next note: (Not necessarily a fault of your proposition) I strongly dislike defining things like ABMDefintion as a standalone struct. NodeJS has a bad habit of doing this as well. ABMDefinition will NEVER be used anywhere else. It is not really a struct, its a parameter table

## Defining Markdown doc format

This section seems to define a detailed Markdown doc format:

```md
#### `node = core.get_node(pos)`

Returns the node at the given position.

- **args**
  - pos : {Vector} : position of the node on the map
- **return**
  - node : {MapNode} : name is "ignore" for unloaded chunks
- **env**
  - server-main
  - server-async
  - client
  - server-mapgen
```

I don't think we're at this point yet, I am focusing still on gathering expressiveness requirements. But this is good to have for later reference!

## Custom Lua type language

> Here's another idea, using a custom Lua type language with Markdown annotations

- concerns around reinventing the wheel too much
- if the file type is `.md`, we should use a Markdown parser and rely on the Markdown AST as much as possible
- if the file type is `.lua`, we'll have to compare against LuaLS and LuaCATS and consider forking that
  - budget time for:
    - learning and documenting the codebase
    - adding tests
    - cleaning up
    - making extensible
    - adding our own features (e.g. advanced types)
