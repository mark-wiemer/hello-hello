# Luanti doc DSL lightweight proposal

This document details a proposed DSL for new documentation. It does not provide a reference implementation or technology, though we recommend "unified collective" JavaScript tools given their maturity.

## Overview

This proposal offers two forms:

1. lightweight: focuses on lightweight markup to allow for ease of manually writing long sections
2. tag-based: focuses on tag-based syntax like XML or HTML to allow for ease of machine parsing

In both forms, structured sections introduce a new concept, and then unstructured sections (like `summary`, `notes`, or `remarks`) can detail the concept in any way the contributor sees fit.

Constraint syntax follows [C# pattern matching](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/functional/pattern-matching).

## Sections

### Function

A function section consists of a signature and description.

```md
<!-- lightweight -->

`core.get_modpath(modname: string)`

Returns the directory path for a mod.

- Example: `"/home/user/.minetest/usermods/modname"`
- Returns: `nil` if the mod is not enabled or does not exist (not installed).
- Works regardless of whether the mod has been loaded yet.
- Useful for loading additional `.lua` modules or static data from a mod,
  or checking if a mod is enabled.

---
```

```md
<!-- tag-based -->
<function>
    <namespace>core</namespace>
    <name>get_modpath</name>
    <args>
       <arg type="string">modname</arg>
    </args>
    <summary>
        Returns the directory path for a mod.
        - Works regardless of whether the mod has been loaded yet.
        - Useful for loading additional `.lua` modules or static data from a mod, 
        - or checking if a mod is enabled.
    </summary>
    <returns>`nil` if the mod is not enabled or does not exist (not installed).</returns>
    <example>"/home/user/.minetest/usermods/modname"</example>
</function>
```

#### Requirements

- Code is in backticks (`core` not "core")
- Start with namespace name, e.g. `core.get_modpath`, not `get_modpath`
- Describe return value with `- Returns: ...` list item
- Describe example with `- Example: ...` list item

#### Recommendations

- Functions are their own heading section , not list items
- Content in the `summary` is parsed as dedented multiline markdown for ease of contribution
