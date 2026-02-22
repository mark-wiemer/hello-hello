# Luanti doc schema glossary

## Luanti-specific

This section is highly variable!

- environment: place within Luanti where a symbol can be accessed during runtime. Currently four options: server-main, server-async, client, and server-mapgen. Proposed by corpserot on 2025-12-06.

### Notes

From 2025-12-31 riseup pad:

> We have Environment, Struct, Class, Enumeration, Namespace, Function, Method, Callback, Constructor entries. I'll refer to Function, Method, Callback, Constructor entries simply as callable entries, for brevity. TODO WIP are Value, maybe more??? entries.

## General

- canon: The primary form of a document, e.g., a page may be written canonically in Markdown, then transformed into HTML for viewing in a web browser
- checker: program that accepts a Markdown snippet and a schema, and returns whether that snippet matches the schema. Returns detailed error messages.
- documentation writers: people that change the contents of `lua_api.md`, either by fixing typos or adding new information
- [DSL](https://en.wikipedia.org/wiki/Domain-specific_language): domain-specific language. DSLs specific to a single application, like a Luanti API docs DSL, are sometimes called mini-languages.
- [LOP](https://en.wikipedia.org/wiki/Language-oriented_programming): language-oriented programming. Consists of defining a language first, and solving the problem using the created language. The language is updated as-needed during problem-solving.
- LSP: Language Server Protocol, an IDE-agnostic way to communicate information about an API
- [Markdown](https://en.wikipedia.org/wiki/Markdown): A lightweight markup language. The original definition was slightly ambiguous, and now many "flavors" or dialects of Markdown are common, including [CommonMark](https://commonmark.org/) and [GitHub-flavored Markdown (GFM)](https://github.github.com/gfm/).
- [MDX](https://mdxjs.com/): A superset of Markdown that can include dynamic components. MDX is not short for anything.
- schema: an outline or description of the structure of data. See [JSON Schema](https://json-schema.org/) and [database schema](https://en.wikipedia.org/wiki/Database_schema) as examples. A DSL can be thought of as an unambiguous schema. [From Ancient Greek "form, shape"](https://en.wiktionary.org/wiki/schema).
- snippet: section of text in a specific language. Could be an entire document or just a few characters.
- transformer: program that accepts a valid snippet, a schema, and an output schema. It returns the snippet transformed to match the output schema.
- unified collective: a group of people maintaining remark, MDX, and other content-processing tools
- valid: a snippet is valid for a schema if it matches the schema
