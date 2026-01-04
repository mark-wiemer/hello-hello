# Riseup pad notes

Ref [annotated riseup pad](./2025-12-31%20riseup%20pad%20annotated.md)

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
