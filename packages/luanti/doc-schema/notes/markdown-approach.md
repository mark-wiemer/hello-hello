# Markdown approach for Luanti doc schema

Markdown is an extremely expressive industry-standard for documentation. Due to its generic nature, making something structured and parsable in Markdown requires a custom parser specific to the application. In our case, we'll need a custom parser that can handle Luanti-specific properties, like the [environment](./glossary.md) in which a symbol is accessed.

## References

- [2025-11-24 Define Markdown schema for API reference docs (GitHub issue 297)](https://github.com/luanti-org/docs.luanti.org/issues/297)
- [2025-12-06 corpserot's notes](https://gist.github.com/corpserot/6f23ae3caca48f31b6b9b460507f23dc)
- [2025-12-31 riseup pad annotated.md](./2025-12-31%20riseup%20pad%20annotated.md): snapshot of community notes
- [2026-01-01 Lars's comments](https://github.com/luanti-org/docs.luanti.org/issues/296#issuecomment-3703936047)

## Lightweight vs tag-based syntax

Markdown is designed as a lightweight alternative markup language to "heavyweight" tag-based languages like XML and HTML. A lightweight syntax is shorter to write and more closely resembles the reader's experience, but a tag-based syntax can provide more structural clarity in complex documents.

In the examples below, we can see the lightweight syntax closely mirrors the existing `lua_api.md`, but it's unclear which properties are enforced. For example, it may not be discoverable to new contributors that the brackets `[` and `]` around `load_order` denote that the parameter is optional. Additionally, it's not clear whether the ``(default: `false`)`` note is an optional or required part of the docs. In a lightweight syntax, the writer relies more on complex tools like IDE IntelliSense to validate in real-time whether their draft is syntactically valid. IDE tools like [snippets](https://code.visualstudio.com/docs/editing/userdefinedsnippets) could mitigate this problem: when the writer writes `## get_modnames([load_order]: boolean)` and starts a newline, the IDE automatically adds the `- load_order (default: ``)` snippet, with the user's cursor between the ` `` ` characters.

In the tag-based example, we see that the result is very verbose but can more easily be checked by a parser. Additionally, writers will have more clarity on where to add structured data vs. non-structured data. However, using Markdown outside of tags would be difficult in multi-line content given the recommended indentation pattern of tag-based systems. Applying a tag-based system to unstructured data like usage notes could result in an unnecessarily verbose syntax that doesn't use the benefits of Markdown, and would essentially be HTML with some [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements).

### Examples

A lightweight syntax would follow traditional Markdown syntax, e.g.

```
## get_modnames([load_order]: boolean)

Returns a list of the mods' names that are loaded or are yet to be loaded during startup.

- load_order (default: `false`): defines the order of the names
  - available since 5.16.0
  - `true`: sorted according to load order
  - `false`: sorted alphabetically
```

A tag-based syntax would use XML-like or HTML-like tags. I've never handwritten XML, but I imagine e.g.

```xml
<method name="get_modnames">
  Returns a list of the mods' names that are loaded or are yet to be loaded during startup.
  <param name="load_order" type="boolean" optional="true" default="false" available-since="5.16.0">
    defines the order of the names
    <value-description value="true">sorted according to load order</value-description>
    <value-description value="false">sorted alphabetically</value-description>
  </param>
</method>
```

### Alternatives

In theory, our schema could accept both, but it'd be easier to support one:

- reduce decision fatigue for doc writers
- simplify code for maintainers
- increase stylistic consistency across documentation

Supporting both has benefits:

- allow greater flexibility in edge cases (examples?)
- allow writers to write in their preferred way

Finally, we could add support for an intermediate program:

- Writer writes in their preferred syntax in a separate document
- Intermediate program translates from preferred syntax to canonical syntax
- Writer pastes canonical syntax into canonical document

The downside here is simply maintenance cost.

For now, we should choose one and go with it, knowing that once we have an unambiguous and complete canonical syntax, we'll be able to make a program that translates from one syntax to the other.

## Backend syntax

Ultimately, whatever canonical syntax we choose will need to be translated into an unambiguous backend syntax for universal translation: "Canonical -> backend -> HTML" and "Canonical -> backend -> LSP server" are the main translations we need, but this approach will also be able to handle "backend -> TypeScript bindings" and "backend -> new canonical" if we ever change between lightweight and tag-based syntaxes.

Why not translate directly from the canonical syntax? Because the canonical syntax is not designed for that, it's designed to be easy to write. A complex program will be necessary to translate from the canonical syntax to the backend syntax. From there, simpler programs will be able to handle translation from the backend syntax to any other desired syntax.

Most systems use JSON as the backend syntax, and that seems fine for our purposes too. We don't want JSON as a canonical syntax, however, because multiline text in JSON is a mess, to say the least.
