# Architecture decision: IR-hub pipeline

Status: proposed (2026-06-21). Supersedes the linear "Markdown + unified → custom
LSP" framing in [proposal.md](proposal.md) / [misc-notes.md](misc-notes.md#markdown).

## Decision

Build the toolchain around an explicit, schema-validated **intermediate
representation (IR)** as the single source of truth:

```
Markdown front-end ──▶ typed IR (Zod-validated) ──▶ emitters
                                                     ├─ LuaCATS ─▶ LuaLS addon = LSP (VS Code, Zed, vim, emacs)
                                                     ├─ HTML ─▶ api.luanti.org
                                                     ├─ TypeScript bindings
                                                     └─ JSON
```

Two firm corrections to the previous plan:

1. **Do not build an LSP server or a custom VS Code extension.** LuaLS already
   is a mature, multi-editor LSP and already consumes LuaCATS. Emit LuaCATS and
   publish a [LuaLS addon](https://github.com/LuaLS/LLS-Addons); that delivers
   the #1 user goal (IDE support in VS Code/Zed/vim/emacs) in weeks, not years.
2. **The Markdown AST is a front-end, not the source of truth.** It lowers into
   the IR. All validation and every emitter read from the IR, never from heading
   depths and list nesting.

## Why (vs. the alternatives considered)

| Option | Authoring | Semantics from | LSP | Verdict |
| --- | --- | --- | --- | --- |
| A. Markdown schema + unified (current) | Markdown (great) | convention-matched document AST (brittle) | build from scratch (years) | keep the authoring surface, drop the rest |
| B. Lua-first (LuaCATS canonical) + TS pipeline | annotated Lua (ok) | real grammar | **free via LuaLS** | borrow the delivery path |
| C. TS/Zod IR hub + structured front-end | structured + Markdown prose | explicit schema | n/a (IR feeds any target) | adopt as the architecture |

The chosen design is a synthesis: **A's** Markdown authoring + **C's** IR-as-hub
architecture (free validation, JSON Schema autocomplete) + **B's** insight that
LuaCATS → LuaLS gives a multi-editor LSP for free.

The genuinely hard part is not the Markdown container — it is (a) the typed data
model and (b) the embedded **type-expression mini-language** (`(A, B, C)?...`,
`A exclude B`, `core.after.F.@args`). Those need a real schema and a real parser
regardless of the outer format, so they are built first and in isolation.

## What is scaffolded so far

- `src/type-expr/` — dependency-free lexer + recursive-descent parser for the
  type mini-language, producing a typed AST with source offsets for error
  mapping. Covers refs/dotted paths, string literals, unions, `exclude`,
  `?`/`[]`/`...` suffixes, varg groups `( )`, and brace tuples/mappings `{ }`.
  Out of scope for now: generics, structural intersections, value constraints.
- `src/ir/` — the IR as a [Zod](https://zod.dev/) schema (`function`, `method`,
  `enum`, `struct`, `class` entries + params/returns/fields/environments).
  Validation reuses the `type-expr` parser, so a malformed type annotation fails
  with a precise message. `toJsonSchema()` emits JSON Schema for editor tooling.
- `src/md-frontend/` — lowers canonical Markdown into the validated IR. Uses the
  mdast only to segment entries (by heading) and pull disciplined sub-entry rows
  (`Args:`/`Returns:`/`Envs:`/`Values:`/`Fields:`); prose stays opaque. Handles
  function, method, enum, struct, and class entries, including param/field
  attributes (`optional`/`default`/`unit`) parsed from rows. Method headings
  nested under a Class heading (by depth) attach as that class's methods.
- `src/emit-luacats/` — IR → LuaCATS `---@meta` stub (the LuaLS-addon path),
  with a best-effort type-expression → LuaCATS lowering.
- `src/emit-json/` — IR → deterministic, key-sorted JSON backend artifact.
- `src/emit-ts/` — IR → TypeScript declaration sketch (`interface` per class/struct,
  string-literal `type` per enum, `declare function` per function), with a
  `typeToTs` lowering mirroring the LuaCATS one.
- `src/cli/` — testable `runCli(argv, deps)` with `validate`, `build`
  (LuaCATS default, `--json`), and `coverage` commands; thin `bin.ts` wraps it.
  Run via `bun run cli <command> <file.md>`.
- `src/coverage/` — heuristic migration gauge: `coverage(markdown)` reports
  migrated (canonical entry headings) vs passthrough (prose headings + call-shaped
  list items) symbol counts, ignoring obvious filenames (`*.conf`, `*.png`, …).
  On the real `notes/lua_api.md`: 0/907 migrated (163 headings + 744 list items
  still prose; 9 filenames ignored).
- `src/pipeline.test.ts` / `src/e2e.test.ts` — end-to-end guards: one document
  with every entry kind lowered to the IR and fanned out to LuaCATS, TypeScript,
  and JSON, asserting the resulting shapes.

Run the tests: `bun run test:ci` (162 passing). Type-check: `bunx tsc --noEmit`.

Note: the IR uses `import * as z from "zod"` on purpose — see the comment in
`src/ir/schema.ts`.

### Backlog (autonomous build loop)

- ~~md-frontend: param/field attributes (`optional`/`default`/`unit`)~~ — done.
- ~~md-frontend: nested Class→Method ownership by heading depth~~ — done.
- ~~A small CLI (`validate` / `build`)~~ — done.
- ~~A migration `coverage` tool (migrated vs passthrough)~~ — done.
- ~~`emit-ts` (TypeScript bindings)~~ — done (CLI `build --ts`).
- ~~Coverage heuristic: ignore obvious filenames~~ — done (9 ignored on lua_api.md).
- ~~Dedupe CLI source-reading~~ — done (`withSource` helper; behaviour unchanged).
- ~~Edge-case test sweep across all modules~~ — done: type-expr, ir,
  emit-luacats, emit-ts, md-frontend (found+fixed a heading bug), coverage.
  Suite is now 325 tests.

### Notes from the edge-case sweep

- Bug fixed: `readEntryHeading` accumulated heading text *after* the code span
  into the keyword, so `` #### Function `core.x()`: `` (trailing punctuation) or
  `` … `core.x()` (deprecated) `` failed recognition and silently dropped the
  entry. Now only pre-code text forms the keyword.
- Known limitation: an entry uses only the *first* sub-entry list; a second list
  separated by intervening prose (e.g. a Returns list after a paragraph) is not
  merged in. The canonical format keeps Args/Returns/Envs as items of one list.

## Tooling usage

The pipeline at a glance:

```
canonical .md ──▶ md-frontend ──▶ validated IR ──┬─▶ emit-luacats (LuaCATS / LuaLS addon)
                                                  ├─▶ emit-ts (TypeScript .d.ts sketch)
                                                  └─▶ emit-json (stable JSON backend)
```

The IR is the single source of truth; every emitter reads from it. The
`type-expr` parser validates each type annotation and feeds the LuaCATS/TS
lowerings. `coverage` is a side tool that gauges migration progress.

CLI (`runCli` core in `src/cli/index.ts`, thin `bin.ts` wrapper). Exit codes:
0 ok, 1 validation failure, 2 usage / I/O error.

```sh
bun run cli validate <file.md>          # validate; reports issues + warnings
bun run cli build <file.md>             # emit LuaCATS (default) to stdout
bun run cli build <file.md> --json      # emit the stable JSON IR instead
bun run cli build <file.md> --ts        # emit a TypeScript declaration sketch
bun run cli coverage <file.md>          # report migrated vs passthrough symbols
```

Flags may appear before or after the file; unknown flags are ignored by commands
that don't use them. Run the suite with `bun run test:ci`; type-check with
`bunx tsc --noEmit`.

## Next steps (each independently shippable)

1. Lock the IR for `core` functions + `ObjectRef`/`PlayerRef` first; don't model
   the whole API up front.
2. Grow `type-expr` toward ~80% of the misc-notes algebra; keep `todo`/imprecise
   as an escape hatch.
3. Pin the authoring micro-format (recommendation: explicit/tag-leaning spine for
   structured fields, plain Markdown for prose) and write `src/md-frontend` that
   lowers into the IR.
4. Write `src/emit-luacats` and a LuaLS addon; validate by loading the generated
   `luanti_api.lua` against [example/my_mod.lua](../example/my_mod.lua).
5. Add a `coverage` command (migrated symbols vs. opaque passthrough prose) and
   migrate namespace-by-namespace — never a big-bang rewrite of the 11.9k-line
   source.
6. Add `emit-html` / `emit-ts` off the stable IR; add golden-file + upstream
   drift tests.

## Open decisions

- **Authoring micro-format**: explicit tag/`spec` block vs. lightweight lists for
  the structured spine. Recommendation: explicit, for deterministic parsing and
  precise errors; prose stays Markdown.
- **Parameter tables** (e.g. `ABMDefinition`): model as inline anonymous shapes
  on their function, not standalone reusable structs (per GreenXenith's note).
