<!--
exported from https://pad.riseup.net/p/Luanti-Docs/timeslider#35166
then formatted via Prettier,
language added to some code blocks,
inline "lists" turned into multiline valid Markdown lists,
huge comment blocks "unwrapped" (no longer a comment, just text),
proposals wrapped in Markdown code blocks
tiny edits to inline comments for clarity (documenting documentation is hard)
-->

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

#### `player.set_fov(fov, is_multiplier, transition_time)`

Sets the player's Field of View

- **args**
  - fov : {number} {min=0} {max=180} : Field of View to set, 0 = clear any overrides
  - is_multiplier : {bool} {default=false} : If the FOV is a multiplier or not
  - transition_time : {seconds} {default=0} : Smooth FOV transition time in seconds
- **env**
  - server-main
  - server-async
  - client

#### `job = core.after(time, func, ...)`

Calls the function `func` after `time` seconds.

- **args**
  - time : {seconds} : If `0`
- **env**
  - server-main
  - server-async
  - client
  - server-mapgen

#### `translation = core.translate(textdomain, str, ...)`

Returns an annotated string that can be used by the client for translations.

- **args**
  - textdomain : {string} : The text domain to use for the translation.
  - str: {string} : The formatting string to be translated.
  - ...: {string...} : Further arguments to be included in the translation.
- **return**
  - `translation`: {string} : An annotated string that the client can use for translations.
- **env**
  - server-main
  - server-async
```

---

Here's another idea, using a custom Lua type language with Markdown annotations:

I think we ought to stick with markdown as it seems a lot easier to convey descriptions. It's also a lot easier to assign properties compared to the type-oriented lua-like lang. you can see my attempt after yours. Generally, it is harder to expand the syntax too.

```lua
-- A node definition
NodeDef = struct { ... }

-- A node on the map
MapNode = struct {
    -- Name the node was registered with
    name: string,
    -- Usually light, usage depends on `NodeDef::paramtype1` of the associated node
    param1: number,
    -- Something special, usage depends on `NodeDef::paramtype2` of the associated node
    param2: number,
}
...
core: struct {
    ...
    -- Get a map node
    get_node: fn(
        pos: vector, -- position on the map
    ) -> (
        node: MapNode, -- the node at the position
    ),
    ...
    -- (meta) -- unclear how the parameterized type should look
    -- Call a function after a specified amount of time
    after: fn<Ts..., Rs...>(
        duration: number, -- game time to pass in seconds until the function is called
        func: fn(Ts...) -> Rs..., -- function to call
        args: Ts..., -- arguments to pass to func when it is called
    ),
    ...
    -- Annotate string for client translations
    translate: fn(
        textdomain: string, -- text domain for translation
        fmtstr: string, -- format string to be translated
        ...: string, -- further arguments to be included in the translation
    ) -> (
        translation: string, -- An annotated string that the client can use for translations.
    ),
    ...
}
```

Objects like players are trickier. We do not want to conflate them with structs.
We want to mostly describe them by their operations (including potentially e.g. arithmetic operators and such). We want to describe this as an "interface":

```lua
-- A player object
PlayerRef = interface {
    ...,
    -- Set the player's field of view
    set_fov: fn(self, <!-- a first argument of "self" is special (PlayerRef in this case) -->
	    <!-- optional and default syntax up for debate; a default implies an optional -->
	    is_multiplier: bool = false, -- Whether the FOV is a multiplier or not
	    transition_time: number = 0, -- Time during which the FOV is transitioned in seconds,
	  ),
    ...,
}
```

What makes structs and interface different? In EmmyLua and LuaLS they decided to just combine both concepts.

The idea is that struct suggests it's just a table, so you can read, write and list the fields, whereas interface just means that indexing the type (whatever the underlying implementation) yields an object of the given type. There's also the question of overloaded operators, which will need special consideration and don't really fit into a "struct".

That said, it might very well be a good idea to combine them as some sort of "class" like construct. Each field would then be marked as being const or not.
As for "listability" / "reflectability", some way to express whether it's table-based or not might still be valuable?

Some further considerations:

- Possibility to mark errors that can be thrown?
- Possibility to mark whether reference types are mutated (const or mut)?

trying to express more properties within this lua-like lang. it is hard.

<!-- Not a shell section, but some colors are better than none here -->

```sh
core: struct {
    ...
    # i think we can keep the function keyword as in lua
    -- Get a map node
    get_node: function (
        pos: Vector, -- position on the map
    ) returns (
        node: MapNode, -- the node at the position
    ) in environment (
        server-main,
        server-async,
        client,
        server-mapgen,
    ),
    ...
}

PlayerRef: interface inherits ObjectRef {
    ...
    # we can shortcut the self parameter with method instead of just function
    -- Set the player's field of view
    set_fov: method (
        is_multiplier: bool = false, -- Whether the FOV is a multiplier or not
        # the first thing in the tuple must be the type, followed by other properties
        transition_time: (number, unit=seconds) = 0, -- Time during which the FOV is transitioned,
    ) in environment (
        server-main,
        server-async,
        client,
    ),
    ...
}
```

---

I think the markdown syntax shows more promise. We don't really "need" to "limit" ourselves to markdown, but it sure makes reading and previewing them nice. I think retaining this property is desirable for writers and readers. Of course, markdown will still need to be processed like lua_api.md into HTML e.g. turning references into links. if there's any strong opinions objecting this, i'd like to hear it.

i'll quickly propose a simple type system here.

we have the lua simple primitives: `number`, `string`, `boolean` and `nil` which are easily defined.

we also have complex primitives: `table`, `function`, userdata, lightuserdata. userdata and lightuserdata are not needed as it is considered a hidden implementation detail of classes. that leaves us `table` and `function` complex primitives we can use. let's also have the special type `any` which is defined as union of all types.

'tuples' are curly braces `{a, b, c}` and `{a, b, c...}`. lists are `type[]`. mappings are `{key_type: value_type}`. `table` descendents are tuples, lists, mappings and structs. Classes are considered their own types not descendant from any primitive.

Unions/type OR are expressed as `A | B`. The special keyword `?` can be placed at the end of a type expression `A?` to indicate `(A | nil)`. Absences are not covered in the type system. Exclusion/type NOT are expressed as `A exclude B`, and unions can be affected e.g. `(A | B | C) exclude B` equals `A | C`. You can express "anything but string" like so: `any exclude string`. Struct and class inheritence can be interpreted as a way to expand the parent's type into a union, e.g. `Circle`, `Triangle` and `Square` inherits `Shape` which expands `Shape` to include `Circle | Triangle | Square`. Now every time `Shape` is referenced, it's actually referencing `Shape | Circle | Triangle | Square` (without recursing into `Shape`).

The `never` special type is what happens when a type operation fails e.g. `string exclude number` equals `never`. `never` is NOT absence, but an unwanted type deemed illegal so it fails type validation early. these are all illegal: `never` itself, `{A, never, B}`, `never[]`, `{A: never}`, `never | A`, `A exclude never`.

Type expression doesn't have structural analysis of structs and classes, meaning you won't be able to do things like forming a new struct without field `f` without using markdown schema. This also means there's no struct intersections, where `ABC | CDE` doesn't match a table `{C = ...}`, where `ABC` is defined as table with fields `A`, `B` and `C` while `CDE` is defined as table with fields `C`, `D` and `E`. Despite them both sharing a field, you won't be able to pass in a table with only `C` field.

There's no generics/parameterizable types yet.

If you can't sufficiently express a type just use `todo` or settle for imprecision.

That's "all" folks! (not really) My proposed foundation of the type system. i already have a proposal for how to express variadic arguments and functions which i placed at the end. For now, imagine that variadic arguments are expressed `(any...)`; imagine that functions in type expressions are simply `function` that accepts `(any...)` arguments and returns `(any...)`.

for how we can express restrictions, assertions and bounds i think ideas from rust's traits are good. generics would need to incorporate this. for defining exact and/or imprecise value constraints, we can write it in lua. but ultimately, i think we don't need to explore this yet.

NOTE: if anyone is interested, they can pursue further in refining the type system into giving it more expressive power. But this foundation should fulfill like 80% of our objectives, completeness can come later. heck, personally i'm pretty satisfied if the type system stalls here.

incomplete idea: NodeName is a trait for `string`s where the value must fulfill assertion below.

```lua
-- this refers to The Hand™
if v == ':' then return end
local start, colon = v:find('^[%w_]+:')
assert(start)
local _, stop = v:find(':[%w_]+$', start)
assert(stop)
```

making a custom type system sounds pretty dreadful right? An idea is to utilize typescript snippets as a way to define types of things. Theoretically, the work would be easier since typescript already has a type system and comes with its own checker. of course, we will be stuck within its limitation instead of carving our own. i picked typescript because how powerful it is compared to emmylua, luacats and python type hinting. if such approach is taken, then perhaps going full on typescript with extra information in comments may be better than markdown. note how it would parallel the lua-like type language proposal.

TODO: i have not yet conceived a way to describe machine-parseable examples in the description of things, or decided if examples should just be lumped as part of the description.
TODO: i have not yet conceived a way to make admonitions in the description of things.
TODO: the API specification should ideally absorb most if not all of the Lua API docs inside lua_api.md and docs.luanti.org.
TODO: i have not yet considered how to define things outside of Lua stuff, i.e. formspec syntax, texture modifiers, l-system trees, schemas (world format, settings/confs, schematics), networking, file structures, etc.
TODO: we can use mermaid diagrams or any of its similar friends. i have not explored that.

---

The markdown schema creates and uses types, but also attaches many kinds of information to things outside of types.

An entry uses markdown heading. Shallower/Lower heading level entries own deeper/higher heading level entries e.g. Class `MetaDataRef` owns Method `get(key)`. Function `core.log(level, text)` owns Enumeration `Level`. Function `core.after(time, func, args...)` owns Function `F(args...)`. Examples after this section better illustrate the syntax.

We have Environment, Struct, Class, Enumeration, Namespace, Function, Method, Callback, Constructor entries. I'll refer to Function, Method, Callback, Constructor entries simply as callable entries, for brevity. TODO WIP are Value, maybe more??? entries.

Sub-entries attaches information to an entry using lists. The motivation for sub-entries vs entries is to reduce heading-level spam for "simpler" things. There's WIP sub-entries too, but i don't list them here.

- Environment has Contains.
- Callables have Args, Returns, Envs.
- Enumeration have Values.
- Struct have Fields.
- Class have Fields, Envs.
  Notably, i don't think there's any classes that uses fields instead of getters.

TODO i'm not yet confident choosing any solutions for how to group things together e.g. grouping together translation functions inside the `core` kitchen sink namespace. Some ideas: - A Tags sub-entry for each entry. Very inelegant, duplicative and erroneous. Not a big fan, even if it fulfills predictable locality. - An optional Category sub-entry for Namespace, Class, Struct entries which groups together owned Fields and callable entries. A bit annoying to maintain. Perhaps validation can help with that; "Entries with Category sub-entry must have all Fields and callables categorized to pass validation". - Any other ideas?

TODO i have not yet define how reference to things will work in descriptions. it needs to follow a scheme so the static site HTML generator can auto-link references. ideally, it should be natural to read or figure out.

An important idea that i want to incorporate is a healthy balance of predictable locality of information and simple source of truth. When i look at an entry, i should not need to jump to places i don't immediately expect. a thing's information should be close and if it isn't, it should be predictable where it is. The source of truth should avoid being 'hard to reason', 'easy to blunder' and duplicitous. I accept that these ideas aren't always possible, but they are good to follow within reason.

---

In Environment entries, the Contains sub-entry lists what is accessible in the environment. TODO i'm not yet confident about how we can associate environments with callables and classes; and the inverse. Quite a hard relationship to express naturally.

Current environments. Yes, Luanti have many hence why it's awkward. There's also `all`, `server` and `client` many environment specifiers. `server` works on all server environments, `cilent` works on all client environments. TODO i have not yet define how to associate an environment with a specifier. - server startup/load; general and before mods have loaded - server main - server async - server async mapgen - client CSM - (future) client SSCSM - (future) main menu (it would be nice if we can cover the main menu API too)

I propose that Contains sub-entry should be merely the view to the truth. The truth is defined at Envs sub-entries of callables and classes so it's easy to see what environment it can be used in. I'm suggesting that Contains sub-entry should be auto-generated by the processor so it's easier to verify by writers.

TODO i have yet to define how to express limitations of being available in an environment i.e. `VoxelManip` is not fully useable in async as it has limitations.
-->

## Environment `server-load`

This is the startup environment before the main thread enters. Includes the `server-mods-before-loaded` environment.

- Contains:
  - Namespace `core`:
    - Function `core.register_node()`
  - TODO... other globals, functions and namespaces
- TODO... maybe there's more sub-entries/information an environment can have? like Category?

## Environment `server-before-mods-loaded`

This is the startup environment before all mods are loaded, which is also before entering the main thread.

- Contains: - Namespace `core`: - Function `core.get_current_modname()`
  ...

## Environment `server-main`

This is the main thread of the server. I don't know what other notable things to describe here.

- Contains: - Namespace `core`: - Function `core.get_node(pos)`
  ...

<!-- TODO define other environments -->

<!-- Structs refer to plain data structures unlike classes -->

## Struct `MapNode`

A node on the map.

- Fields:
    <!-- Notably, in markdown this is "just" a list item paragraph -->
    <!-- the colon as separators syntax is inherited from exe_virus(i think?) markdown format. it's arbitrary -->
  - `name` : `string` : Name the node was registered with.
  <!-- so there's some formatting leniency assuming insignificant whitespaces outside of descriptions -->
  - `param1`:`number`:Light, usage depends on `NodeDef.paramtype1`
  - `param2` : `number` :
    Something special, usage depends on `NodeDef.paramtype2` of the associated node.

## Struct `ABMDefinition`

An active block modifier (ABM) is used to define a function that is continously
and randomly called for specific nodes (defined by `nodenames` and other conditions)
in active mapblocks.

- Fields:
  - `label` : `string?`, default = `""` :
    Descriptive label for profiling purposes (optional).
    Definitions with identical labels will be listed as one.

  - `nodenames` : `string[]` :
    Apply `action` function to these nodes.
    `group:groupname` can also be used here.

  - `neighbors` : `string[]?`, default `nil` :
    Only apply `action` to nodes that have one of, or any
    combination of, these neighbors.
    If left out or empty, any neighbor will do.
    `group:groupname` can also be used here.

  - `without_neighbors` : `string[]?`, default `nil` :
    Only apply `action` to nodes that have no one of these neighbors.
    If left out or empty, it has no effect.
    `group:groupname` can also be used here.

  - `interval` : `number?`, default `TODO` :
    Operation interval in seconds

  - `chance` : `integer?`, default `TODO` :
    Probability of triggering `action` per-node per-interval is 1.0 / chance (integers only)

  - `min_y` : `integer?`, default `-32768` :
    min and max height levels where ABM will be processed (inclusive)
    can be used to reduce CPU usage

  - `max_y` : `integer?`, default `32768` :
    min and max height levels where ABM will be processed (inclusive)
    can be used to reduce CPU usage

  - `catch_up` : `boolean?`, default `false` :
    If true, catch-up behavior is enabled: The `chance` value is
    temporarily reduced when returning to an area to simulate time lost
    by the area being unattended. Note that the `chance` value can often
    be reduced to 1.

We can put functions in Lua structs, not just primitives. What does code/implementation as a piece of struct data distinct from class methods implies? i believe it means that it's a callback, hence why i chose to name struct functions specifically Callback instead of Function. It does have a big difference compared to normal functions, where content/game/mod devs are the ones defining what it does. the spec merely tells you at most expectations of what it should do and at least about when it is triggered.

are there any struct functions that luanti doesn't tell you when it is triggered? as if content devs are also the ones to define when it is triggered. that's would still make it a callback i think.

### Callback `action(pos, node, active_object_count, active_object_count_wider)`

Function triggered for each qualifying node.

- Args:
  <!-- also, i'm introducing description-less args. --> - `pos` : `Vector` - `node` : `MapNode` - `active_object_count` : `number` : Number of active objects in the node's mapblock. - `active_object_count_wider` : `number` : Number of active objects in the node's mapblock plus all 26 neighboring mapblocks. If any neighboring mapblocks are unloaded an estimate is calculated for them based on loaded mapblocks.
  <!-- TODO should Callbacks get a sub-entry specifying when it is triggered? -->
- Envs: <!-- TODO how should this work? what can we say about this? should it be here at all? -->

TODO relationship between ItemDef and NodeDef. generally, structs subtypes need to be able to override fields including overiding existence of parent struct fields and callbacks. some ItemDef fields are no-ops or behave differently for NodeDefs. classes should similarly get this ability, most notably ObjectRef, PlayerRef and EntityRef. ItemDef should not need to be aware of NodeDef in its definition.

note: making parent fields absent doesn't fully break the type system because type expressions never had the ability to analyze structures of structs and classes in the first place. e.g. if `Shape` (erroneously) defines a field `side_count`; `Circle` inheriting `Shape` and declaring `side_count` absent doesn't affect `Shape` even now as it expands to `Shape | Circle | (other Shape subtypes...)`. it does break field existance guerantees though which is the main issue to be aware of.

hmm dunno... perhaps we can provide an explicit structural intersection type maker. something like `intersect<A | B | C | ...>`. that way, we can explicitly say that an arg or field works with an intersection and not a union. the distinction here is that e.g. a function that check for each type of a union vs a function that expect the intersection of all types. in the former case `arg: ObjectRef`, the function would diligently check if its an ObjectRef, PlayerRef or EntityRef. in the latter case `arg: intersect<ObjectRef>`, the function would simply use the common methods between all 3 types (recall that ObjectRef is expanded to `ObjectRef | PlayerRef | EntityRef` due to inheritence).
-->

## Class `ObjectRef`

Moving things in the game are generally these.
This is basically a reference to a C++ `ServerActiveObject`.

<!-- TODO the rest of the owl description -->

<!-- if ObjectRef has indexable fields, Fields sub-entry would be here. too bad. -->

<!-- i don't have strong opinions on is_valid() vs ObjectRef:is_valid(), but it shouldn't have self in the heading. Method already implies that. -->

### Method `is_valid()`

Returns whether the object is valid.

<!-- `self` argument is implied here, but can be explicit -->

- Returns:
    <!-- named returns, even if it has no effect in Lua code. it allows reference to which return since lua allows multi-returns. -->
  - `validity` : `boolean`
- Envs:
  - `server-main`
  - `server-async`
  - `client`

<!-- TODO find other notable methods -->

<!-- ObjectRef is one of the few classes with subclass, and thusly having polymorphism rules alongside with it. -->

## Class `PlayerRef` inherits `ObjectRef`

<!-- TODO unique description of PlayerRef -->

### Method `set_fov(fov, is_multiplier, transition_time)`

Sets the player's Field of View

- Args:
    <!-- `self` is implied here, but can be explicit -->
  - `fov` : `number` : Field of View to set, `0` clears any overrides
  - `is_multiplier` : `bool`, default `false` : If the FOV is a multiplier or not
  <!-- units are not only useable for numbers, but also vectors. e.g. to indicate a Rotation is in degree or radians. -->
  - `transition_time` : `number`, default `0`, unit `seconds` : Smooth FOV transition time in seconds
- Envs:
  - `server-main`
  - `client`

<!-- TODO other methods -->

## Class `EntityRef` inherits `ObjectRef`

<!-- TODO unique description of EntityRef -->
<!-- TODO methods -->

<!-- TODO WIP Special values... still drafting this idea -->

## Value `NodeIgnore` instance of `MapNode`

<!-- TODO description -->

- Fields:
    <!-- not types, but values that meets the type restrictions -->
  - `name` = `"ignore"`
  - `param1` = undefined
  - `param1` = undefined

<!--
namespaces are actually kinda special. it's a lua global table with contents defined like a struct or class. most importantly, it needs to declare itself as a namespace regardless. This is why i don't think it can be trivially described as a global defined struct, interface or class.
-->

## Namespace `core`

The namespace containing almost the entirety of Luanti API.

<!-- maybe simply `get_node(pos)`? -->

### Function `core.get_node(pos)`

Returns the node at the given position.

- Args:
  - `pos` : `Vector`
- Returns: - `node` : `MapNode`
<!--
TODO WIP an idea is that Case doesn't just cover errors/exceptions, but any kind of irregular/deviating behaviour. Some comments on this would be nice.
-->
- Case `accessing-unloaded-chunks`:
  - Condition: Accessing node in unloaded mapchunks.
  - Returns:
    - `node` : value `IgnoreNode`
- Envs:
  - `server-main`
  - `server-async`
  - `server-mapgen` <!-- TODO there's a map read limitation specifically about unloaded chunks. need to relate this somehow to the Case above -->
  - `client`

### Function `core.log(level, text)`

Logs `text` with logging `level` if provided.

- Args:
  <!--
  		`optional` argument attribute is different than saying the type is nillable if the argument isn't the last one. e.g. `level` being absent/unspecified means a default value will take its place.
  
  		TODO decide if accessing certain entries owned by an entry require a special access syntax so it's less confusing. i dunno, maybe `core.log::Level`?
      --> - `level` : `core.log.Level`, optional, default `"none"` - `text` : `string`
  <!-- If this returns `nil`, then it must specifically say it returns `nil` because it matters in Lua -->

#### Enumeration `Level`

<!-- TODO description -->

- Values:
  - `"none"` : <!-- TODO description -->
  - `"error"` : <!-- TODO description -->
  - `"warning"` : <!-- TODO description -->
  - `"action"` : <!-- TODO description -->
  - `"info"` : <!-- TODO description -->
  - `"verbose"` : <!-- TODO description -->

as promised, vargs and functions in the type system. I'll also include some extra stuff.

type accesses generally work like this: `namespace.a`, `MyStruct.a` and `MyClass.a` refers to the type of accessing `a` for that namespace or instance of said type. it could be a callable, field, element, etc. A notable case can be seen below where we access a Function owned by a Function (which is owned by Namespace `core`). A stranger case could be accessing a Function owned by a Method owned by a Class.

type of items inside tuples, lists and mappings can be accessed like so `tuple.2`, `list.elm`, `mapping.key`, `mapping.value`. unions don't have any indexable way to access its types.

(i have retracted the idea of expressing literal function types through the type system. it has no benefits compared to just re-using markdown schema to create callable types)

Next, functions can only be defined through callable entries in markdown schema. We can reference Args and Returns sub-entries e.g. `core.get_node.pos` refers to the argument `pos` type `Vector` and `core.get_node.node` refers to the returned `node` type `MapNode`. the special access `@args` refers to the collective arguments as a varg and `@returns` refers to the collective returns as a varg.

TODO decide if accessing certain entries owned by an entry require a special access syntax so it's less confusing. i dunno, maybe `core.after::F`?

TODO i have not yet define how function overloads work.

Variadic expressions (varg) are defined with many types inside parenthesis `(a, b, c)`. `(a, b, c...)` means the rest must match `c` type i.e. `(a, b, c, c, c, repeating)`. type of items inside vargs can be accessed like a tuple i.e. `varg.3` gets you type `c`.

introduction of vargs means the necessity of resolving combinations possible with other type expressions rules. vargs have special rules stemming from lua rules for variadic expressions/`...`. this should also illustrate how unions work with notable types.

- `(D, (A, B, C))` equals `(D, A, B, C)`
- `(D, (A, B, C)?)` equals `(D, ((A, B, C)|nil))` equals `(D, A, B, C)|(D, nil)`
- `(D, (A, B, C)...)` equals `(D, A, B, C, A, B, C, repeating)`.
- `?` is illegal to use after `...` inside vargs and tuples.
- `(D, (A, B, C)?...)` equals `(D, ((A, B, C)|nil)...)` equals `(D, (A, B, C)...)|(D, nil...)`
- `{D, (A, B, C)}` equals `{D, A, B, C}`
- `{D, (A, B, C)?}` equals `{D, ((A, B, C)|nil)}` equals `{D, A, B, C}|{D, nil}`
- `{D, (A, B, C)...}` equals `{D, A, B, C, A, B, C, repeating}`.
- `{D, (A, B, C)?...}` equals `{D, ((A, B, C)|nil)...}` equals `{D, (A, B, C)...}|{D, nil...}`
- `(A, B, C)[]` equals `{(A, B, C)...}` equals `{A, B, C, A, B, C, repeating}`.
- `(A, B, C)?[]` equals `{(A, B, C)?...}` equals `{(A, B, C)...}|{nil...}`.
- `(A, B, C)[]?` equals `{(A, B, C)...}|nil`.
- `(A, B, C)` is illegal to use standalone as key or value types in mapping `{K: V}`

### Function `core.after(time, func, args...)`

Calls the function `func` after `time` seconds, returning a job handle.

Jobs set for earlier times are executed earlier. If multiple jobs expire at exactly the same time, then they are executed in registration order.

`time` is a lower bound. The job is executed in the first server-step that started at least `time` seconds after the last time a server-step started, measured with globalstep dtime.

- Args:
  - `time` : `number`, unit `seconds` : If `0`, the job is executed in the next step.
  - `fn` : `core.after.F`
  - `args` : `core.after.F.@args`
- Envs:
  - `server-main`
  - `server-async`
  - `server-mapgen`
  - `client`

#### Function `F(args...)`

<!-- TODO `args` should be `(T...)` if we want to be correct. I have not define generics yet. I also think we don't need to explore generics just yet. it is a pretty ugly can of worms -->

- Args: - `args` : `(any...)`
<!-- again, no Returns ~= Returns `nil` -->

### Function `core.translate(textdomain, str, args...)`

Translates the string `str` with the given `textdomain` for disambiguation. The textdomain must match the textdomain specified in the translation file in order to get the string translated. This can be used so that a string is translated differently in different contexts. It is advised to use the name of the mod as textdomain whenever possible, to avoid clashes with other mods.

- Args:
  - `textdomain` : `string` : The text domain to use for the translation.
  - `str` : `string` : The formatting string to be translated.
  - `args` : `(string...)` : Further arguments to be included in the translation.
  <!-- TODO `args` type could be `(string...#TranslateArgsSize)` but i have no idea how i'd define TranslateArgsSize but it probably needs to involve `value`. Again, varg, tuple, list size/arity can be explored later. -->
- Returns:
  - `msgid` : `string` : Translation key used by the client to determine the translated string.
