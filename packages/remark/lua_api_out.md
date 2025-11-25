# 'core' namespace reference

## Utilities

* `core.get_current_modname()`: returns the currently loading mod's name,
  when loading a mod.

* `core.get_modpath(modname)`: returns the directory path for a mod,
  e.g. `"/home/user/.minetest/usermods/modname"`.
  * Returns nil if the mod is not enabled or does not exist (not installed).
  * Works regardless of whether the mod has been loaded yet.
  * Useful for loading additional `.lua` modules or static data from a mod,
    or checking if a mod is enabled.

* `core.get_modnames()`: returns a list of enabled mods, sorted alphabetically.
  * Does not include disabled mods, even if they are installed.

* `core.get_game_info()`: returns a table containing information about the
  current game. Note that other meta information (e.g. version/release number)
  can be manually read from `game.conf` in the game's root directory.

  ```lua
  {
      id = string,
      title = string,
      author = string,
      -- The root directory of the game
      path = string,
  }
  ```

* `core.get_worldpath()`: returns e.g. `"/home/user/.minetest/world"`
  * Useful for storing custom data

* `core.get_mod_data_path()`: returns e.g. `"/home/user/.minetest/mod_data/mymod"`
  * Useful for storing custom data *independently of worlds*.
  * Must be called during mod load time.
  * Can read or write to this directory at any time.
  * It's possible that multiple Luanti instances are running at the same
    time, which may lead to corruption if you are not careful.

* `core.is_singleplayer()`

* `core.features`: Table containing *server-side* API feature flags

  ```lua
  {
      glasslike_framed = true,  -- 0.4.7
      nodebox_as_selectionbox = true,  -- 0.4.7
      get_all_craft_recipes_works = true,  -- 0.4.7
      -- The transparency channel of textures can optionally be used on
      -- nodes (0.4.7)
      use_texture_alpha = true,
      -- Tree and grass ABMs are no longer done from C++ (0.4.8)
      no_legacy_abms = true,
      -- Texture grouping is possible using parentheses (0.4.11)
      texture_names_parens = true,
      -- Unique Area ID for AreaStore:insert_area (0.4.14)
      area_store_custom_ids = true,
      -- add_entity supports passing initial staticdata to on_activate
      -- (0.4.16)
      add_entity_with_staticdata = true,
      -- Chat messages are no longer predicted (0.4.16)
      no_chat_message_prediction = true,
      -- The transparency channel of textures can optionally be used on
      -- objects (ie: players and lua entities) (5.0.0)
      object_use_texture_alpha = true,
      -- Object selectionbox is settable independently from collisionbox
      -- (5.0.0)
      object_independent_selectionbox = true,
      -- Specifies whether binary data can be uploaded or downloaded using
      -- the HTTP API (5.1.0)
      httpfetch_binary_data = true,
      -- Whether formspec_version[<version>] may be used (5.1.0)
      formspec_version_element = true,
      -- Whether AreaStore's IDs are kept on save/load (5.1.0)
      area_store_persistent_ids = true,
      -- Whether core.find_path is functional (5.2.0)
      pathfinder_works = true,
      -- Whether Collision info is available to an objects' on_step (5.3.0)
      object_step_has_moveresult = true,
      -- Whether get_velocity() and add_velocity() can be used on players (5.4.0)
      direct_velocity_on_players = true,
      -- nodedef's use_texture_alpha accepts new string modes (5.4.0)
      use_texture_alpha_string_modes = true,
      -- degrotate param2 rotates in units of 1.5° instead of 2°
      -- thus changing the range of values from 0-179 to 0-240 (5.5.0)
      degrotate_240_steps = true,
      -- ABM supports min_y and max_y fields in definition (5.5.0)
      abm_min_max_y = true,
      -- dynamic_add_media supports passing a table with options (5.5.0)
      dynamic_add_media_table = true,
      -- particlespawners support texpools and animation of properties,
      -- particle textures support smooth fade and scale animations, and
      -- sprite-sheet particle animations can by synced to the lifetime
      -- of individual particles (5.6.0)
      particlespawner_tweenable = true,
      -- allows get_sky to return a table instead of separate values (5.6.0)
      get_sky_as_table = true,
      -- VoxelManip:get_light_data accepts an optional buffer argument (5.7.0)
      get_light_data_buffer = true,
      -- When using a mod storage backend that is not "files" or "dummy",
      -- the amount of data in mod storage is not constrained by
      -- the amount of RAM available. (5.7.0)
      mod_storage_on_disk = true,
      -- "zstd" method for compress/decompress (5.7.0)
      compress_zstd = true,
      -- Sound parameter tables support start_time (5.8.0)
      sound_params_start_time = true,
      -- New fields for set_physics_override: speed_climb, speed_crouch,
      -- liquid_fluidity, liquid_fluidity_smooth, liquid_sink,
      -- acceleration_default, acceleration_air (5.8.0)
      physics_overrides_v2 = true,
      -- In HUD definitions the field `type` is used and `hud_elem_type` is deprecated (5.9.0)
      hud_def_type_field = true,
      -- PseudoRandom and PcgRandom state is restorable
      -- PseudoRandom has get_state method
      -- PcgRandom has get_state and set_state methods (5.9.0)
      random_state_restore = true,
      -- core.after guarantees that coexisting jobs are executed primarily
      -- in order of expiry and secondarily in order of registration (5.9.0)
      after_order_expiry_registration = true,
      -- wallmounted nodes mounted at floor or ceiling may additionally
      -- be rotated by 90° with special param2 values (5.9.0)
      wallmounted_rotate = true,
      -- Availability of the `pointabilities` property in the item definition (5.9.0)
      item_specific_pointabilities = true,
      -- Nodes `pointable` property can be `"blocking"` (5.9.0)
      blocking_pointability_type = true,
      -- dynamic_add_media can be called at startup when leaving callback as `nil` (5.9.0)
      dynamic_add_media_startup = true,
      -- dynamic_add_media supports `filename` and `filedata` parameters (5.9.0)
      dynamic_add_media_filepath = true,
       -- L-system decoration type (5.9.0)
      lsystem_decoration_type = true,
      -- Overridable pointing range using the itemstack meta key `"range"` (5.9.0)
      item_meta_range = true,
      -- Allow passing an optional "actor" ObjectRef to the following functions:
      -- core.place_node, core.dig_node, core.punch_node (5.9.0)
      node_interaction_actor = true,
      -- "new_pos" field in entity moveresult (5.9.0)
      moveresult_new_pos = true,
      -- Allow removing definition fields in `core.override_item` (5.9.0)
      override_item_remove_fields = true,
      -- The predefined hotbar is a Lua HUD element of type `hotbar` (5.10.0)
      hotbar_hud_element = true,
      -- Bulk LBM support (5.10.0)
      bulk_lbms = true,
      -- ABM supports field without_neighbors (5.10.0)
      abm_without_neighbors = true,
      -- biomes have a weight parameter (5.11.0)
      biome_weights = true,
      -- Particles can specify a "clip" blend mode (5.11.0)
      particle_blend_clip = true,
      -- The `match_meta` optional parameter is available for `InvRef:remove_item()` (5.12.0)
      remove_item_match_meta = true,
      -- The HTTP API supports the HEAD and PATCH methods (5.12.0)
      httpfetch_additional_methods = true,
      -- objects have get_guid method (5.13.0)
      object_guids = true,
      -- The NodeTimer `on_timer` callback is passed additional `node` and `timeout` args (5.14.0)
      on_timer_four_args = true,
      -- `ParticleSpawner` definition supports `exclude_player` field (5.14.0)
      particlespawner_exclude_player = true,
      -- core.generate_decorations() supports `use_mapgen_biomes` parameter (5.14.0)
      generate_decorations_biomes = true,
      -- 'chunksize' mapgen setting can be a vector, instead of a single number (5.15.0)
      chunksize_vector = true,
      -- Item definition fields `inventory_image`, `inventory_overlay`, `wield_image`
      -- and `wield_overlay` accept a table containing animation definitions. (5.15.0)
      item_image_animation = true,
  }
  ```

* `core.has_feature(arg)`: returns `boolean, missing_features`
  * checks for *server-side* feature availability
  * `arg`: string or table in format `{foo=true, bar=true}`
  * `missing_features`: `{foo=true, bar=true}`

* `core.get_player_information(player_name)`: Table containing information
  about a player. Example return value:

  ```lua
  {
      address = "127.0.0.1",     -- IP address of client
      ip_version = 4,            -- IPv4 / IPv6
      connection_uptime = 200,   -- seconds since client connected
      protocol_version = 32,     -- protocol version used by client
      formspec_version = 2,      -- supported formspec version
      lang_code = "fr",          -- Language code used for translation

      -- the following keys can be missing if no stats have been collected yet
      min_rtt = 0.01,            -- minimum round trip time
      max_rtt = 0.2,             -- maximum round trip time
      avg_rtt = 0.02,            -- average round trip time
      min_jitter = 0.01,         -- minimum packet time jitter
      max_jitter = 0.5,          -- maximum packet time jitter
      avg_jitter = 0.03,         -- average packet time jitter

      -- The version information is provided by the client and may be spoofed
      -- or inconsistent in engine forks. You must not use this for checking
      -- feature availability of clients. Instead, do use the fields
      -- `protocol_version` and `formspec_version` where it matters.
      -- Use `core.protocol_versions` to map Luanti versions to protocol versions.
      -- This version string is only suitable for analysis purposes.
      version_string = "0.4.9-git",   -- full version string

      -- the following information is available in a debug build only!!!
      -- DO NOT USE IN MODS
      --serialization_version = 26,     -- serialization version used by client
      --major = 0,                      -- major version number
      --minor = 4,                      -- minor version number
      --patch = 10,                     -- patch version number
      --state = "Active"                -- current client state
  }
  ```

* `core.protocol_versions`:

  * Table mapping Luanti versions to corresponding protocol versions for modder convenience.
  * For example, to check whether a client has at least the feature set
    of Luanti 5.8.0 or newer, you could do:
    `core.get_player_information(player_name).protocol_version >= core.protocol_versions["5.8.0"]`
  * (available since 5.11)

  ```lua
  {
      [version string] = protocol version at time of release
      -- every major and minor version has an entry
      -- patch versions only for the first release whose protocol version is not already present in the table
  }
  ```

* `core.get_player_window_information(player_name)`:

  ```lua
  -- Will only be present if the client sent this information (requires v5.7+)
  --
  -- Note that none of these things are constant, they are likely to change during a client
  -- connection as the player resizes the window and moves it between monitors
  --
  -- real_gui_scaling and real_hud_scaling can be used instead of DPI.
  -- OSes don't necessarily give the physical DPI, as they may allow user configuration.
  -- real_*_scaling is just OS DPI / 96 but with another level of user configuration.
  {
      -- Current size of the in-game render target (pixels).
      --
      -- This is usually the window size, but may be smaller in certain situations,
      -- such as side-by-side mode.
      size = {
          x = 1308,
          y = 577,
      },

      -- Estimated maximum formspec size before Luanti will start shrinking the
      -- formspec to fit. For a fullscreen formspec, use the size returned by
      -- this table  and `padding[0,0]`. `bgcolor[;true]` is also recommended.
      max_formspec_size = {
          x = 20,
          y = 11.25
      },

      -- GUI Scaling multiplier
      -- Equal to the setting `gui_scaling` multiplied by `dpi / 96`
      real_gui_scaling = 1,

      -- HUD Scaling multiplier
      -- Equal to the setting `hud_scaling` multiplied by `dpi / 96`
      real_hud_scaling = 1,

      -- Whether the touchscreen controls are enabled.
      -- Usually (but not always) `true` on Android.
      -- Requires at least version 5.9.0 on the client. For older clients, it
      -- is always set to `false`.
      touch_controls = false,
  }
  ```

* `core.path_exists(path)`: returns true if the given path exists else false
  * `path` is the path that will be tested can be either a directory or a file

* `core.mkdir(path)`: returns success.
  * Creates a directory specified by `path`, creating parent directories
    if they don't exist.

* `core.rmdir(path, recursive)`: returns success.
  * Removes a directory specified by `path`.
  * If `recursive` is set to `true`, the directory is recursively removed.
    Otherwise, the directory will only be removed if it is empty.
  * Returns true on success, false on failure.

* `core.cpdir(source, destination)`: returns success.
  * Copies a directory specified by `path` to `destination`
  * Any files in `destination` will be overwritten if they already exist.
  * Returns true on success, false on failure.

* `core.mvdir(source, destination)`: returns success.
  * Moves a directory specified by `path` to `destination`.
  * If the `destination` is a non-empty directory, then the move will fail.
  * Returns true on success, false on failure.

* `core.get_dir_list(path, [is_dir])`: returns list of entry names
  * is\_dir is one of:
    * nil: return all entries,
    * true: return only subdirectory names, or
    * false: return only file names.

* `core.safe_file_write(path, content)`: returns boolean indicating success
  * Replaces contents of file at path with new contents in a safe (atomic)
    way. Use this instead of below code when writing e.g. database files:
    `local f = io.open(path, "wb"); f:write(content); f:close()`

* `core.get_version()`: returns a table containing components of the
  engine version.  Components:
  * `project`: Name of the project, eg, "Luanti"
  * `string`: Simple version, eg, "1.2.3-dev"
  * `proto_min`: The minimum supported protocol version
  * `proto_max`: The maximum supported protocol version
  * `hash`: Full git version (only set if available),
    eg, "1.2.3-dev-01234567-dirty".
  * `is_dev`: Boolean value indicating whether it's a development build
    Use this for informational purposes only. The information in the returned
    table does not represent the capabilities of the engine, nor is it
    reliable or verifiable. Compatible forks will have a different name and
    version entirely. To check for the presence of engine features, test
    whether the functions exported by the wanted features exist. For example:
    `if core.check_for_falling then ... end`.

* `core.sha1(data, [raw])`: returns the sha1 hash of data
  * `data`: string of data to hash
  * `raw`: return raw bytes instead of hex digits, default: false

* `core.sha256(data, [raw])`: returns the sha256 hash of data
  * `data`: string of data to hash
  * `raw`: return raw bytes instead of hex digits, default: false

* `core.colorspec_to_colorstring(colorspec)`: Converts a ColorSpec to a
  ColorString. If the ColorSpec is invalid, returns `nil`.
  * `colorspec`: The ColorSpec to convert

* `core.colorspec_to_bytes(colorspec)`: Converts a ColorSpec to a raw
  string of four bytes in an RGBA layout, returned as a string.
  * `colorspec`: The ColorSpec to convert

* `core.colorspec_to_table(colorspec)`: Converts a ColorSpec into RGBA table
  form. If the ColorSpec is invalid, returns `nil`. You can use this to parse
  ColorStrings.
  * `colorspec`: The ColorSpec to convert

* `core.time_to_day_night_ratio(time_of_day)`: Returns a "day-night ratio" value
  (as accepted by `ObjectRef:override_day_night_ratio`) that is equivalent to
  the given "time of day" value (as returned by `core.get_timeofday`).

* `core.encode_png(width, height, data, [compression])`: Encode a PNG
  image and return it in string form.
  * `width`: Width of the image
  * `height`: Height of the image
  * `data`: Image data, one of:
    * array table of ColorSpec, length must be width\*height
    * string with raw RGBA pixels, length must be width*height*4
  * `compression`: Optional zlib compression level, number in range 0 to 9.
    The data is one-dimensional, starting in the upper left corner of the image
    and laid out in scanlines going from left to right, then top to bottom.
    You can use `colorspec_to_bytes` to generate raw RGBA values.
    Palettes are not supported at the moment.
    You may use this to procedurally generate textures during server init.

* `core.urlencode(str)`: Encodes reserved URI characters by a
  percent sign followed by two hex digits. See
  [RFC 3986, section 2.3](https://datatracker.ietf.org/doc/html/rfc3986#section-2.3).

## Logging

* `core.debug(...)`
  * Equivalent to `core.log(table.concat({...}, "\t"))`
* `core.log([level,] text)`
  * `level` is one of `"none"`, `"error"`, `"warning"`, `"action"`,
    `"info"`, or `"verbose"`.  Default is `"none"`.

## Registration functions

Call these functions only at load time!

### Environment

* `core.register_node(name, nodedef)`
  * register a node with its definition
  * Note: you must pass a clean table that hasn't already been used for
    another registration to this function, as it will be modified.
* `core.register_craftitem(name, itemdef)`
  * register an item with its definition
  * Note: (as above)
* `core.register_tool(name, tooldef)`
  * register a tool item with its definition
  * Note: (as above)
* `core.override_item(name, redefinition, del_fields)`
  * `redefinition` is a table of fields `[name] = new_value`,
    overwriting fields of or adding fields to the existing definition.
  * `del_fields` is a list of field names to be set
    to `nil` ("deleted from") the original definition.
  * Overrides fields of an item registered with register\_node/tool/craftitem.
  * Note: Item must already be defined.
  * Example: `core.override_item("default:mese",
    {light_source=core.LIGHT_MAX}, {"sounds"})`:
    Overwrites the `light_source` field,
    removes the sounds from the definition of the mese block.
* `core.unregister_item(name)`
  * Unregisters the item from the engine, and deletes the entry with key
    `name` from `core.registered_items` and from the associated item table
    according to its nature (e.g. `core.registered_nodes`)
* `core.register_entity(name, entity definition)`
* `core.register_abm(abm definition)`
* `core.register_lbm(lbm definition)`
* `core.register_alias(alias, original_name)`
  * Also use this to set the 'mapgen aliases' needed in a game for the core
    mapgens. See [Mapgen aliases](#mapgen-aliases) section above.
* `core.register_alias_force(alias, original_name)`
* `core.register_ore(ore definition)`
  * Returns an integer object handle uniquely identifying the registered
    ore on success.
  * The order of ore registrations determines the order of ore generation.
* `core.register_biome(biome definition)`
  * Returns an integer object handle uniquely identifying the registered
    biome on success. To get the biome ID, use `core.get_biome_id`.
* `core.unregister_biome(name)`
  * Unregisters the biome from the engine, and deletes the entry with key
    `name` from `core.registered_biomes`.
  * Warning: This alters the biome to biome ID correspondences, so any
    decorations or ores using the 'biomes' field must afterwards be cleared
    and re-registered.
* `core.register_decoration(decoration definition)`
  * Returns an integer object handle uniquely identifying the registered
    decoration on success. To get the decoration ID, use
    `core.get_decoration_id`.
  * The order of decoration registrations determines the order of decoration
    generation.
* `core.register_schematic(schematic definition)`
  * Returns an integer object handle uniquely identifying the registered
    schematic on success.
  * If the schematic is loaded from a file, the `name` field is set to the
    filename.
  * If the function is called when loading the mod, and `name` is a relative
    path, then the current mod path will be prepended to the schematic
    filename.
* `core.clear_registered_biomes()`
  * Clears all biomes currently registered.
  * Warning: Clearing and re-registering biomes alters the biome to biome ID
    correspondences, so any decorations or ores using the 'biomes' field must
    afterwards be cleared and re-registered.
* `core.clear_registered_decorations()`
  * Clears all decorations currently registered.
* `core.clear_registered_ores()`
  * Clears all ores currently registered.
* `core.clear_registered_schematics()`
  * Clears all schematics currently registered.

### Gameplay

* `core.register_craft(recipe)`
  * Check recipe table syntax for different types below.
* `core.clear_craft(recipe)`
  * Will erase existing craft based either on output item or on input recipe.
  * Specify either output or input only. If you specify both, input will be
    ignored. For input use the same recipe table syntax as for
    `core.register_craft(recipe)`. For output specify only the item,
    without a quantity.
  * Returns false if no erase candidate could be found, otherwise returns true.
  * **Warning**! The type field ("shaped", "cooking" or any other) will be
    ignored if the recipe contains output. Erasing is then done independently
    from the crafting method.
* `core.register_chatcommand(cmd, chatcommand definition)`
* `core.override_chatcommand(name, redefinition)`
  * Overrides fields of a chatcommand registered with `register_chatcommand`.
* `core.unregister_chatcommand(name)`
  * Unregisters a chatcommands registered with `register_chatcommand`.
* `core.register_privilege(name, definition)`
  * `definition` can be a description or a definition table (see [Privilege
    definition](#privilege-definition)).
  * If it is a description, the priv will be granted to singleplayer and admin
    by default.
  * To allow players with `basic_privs` to grant, see the `basic_privs`
    minetest.conf setting.
* `core.register_authentication_handler(authentication handler definition)`
  * Registers an auth handler that overrides the builtin one.
  * This function can be called by a single mod once only.

## Global callback registration functions

Call these functions only at load time!

* `core.register_globalstep(function(dtime))`
  * Called every server step, usually interval of 0.1s.
  * `dtime` is the time since last execution in seconds.
* `core.register_on_mods_loaded(function())`
  * Called after all mods have finished loading and before the media is cached
    or aliases are handled.
* `core.register_on_shutdown(function())`
  * Called during server shutdown before players are kicked.
  * **Warning**: If the server terminates abnormally (i.e. crashes), the
    registered callbacks will likely **not run**. Data should be saved at
    semi-frequent intervals as well as on server shutdown.
* `core.register_on_placenode(function(pos, newnode, placer, oldnode, itemstack, pointed_thing))`
  * Called after a node has been placed.
  * If `true` is returned no item is taken from `itemstack`
  * `placer` may be any valid ObjectRef or nil.
  * **Not recommended**; use `on_construct` or `after_place_node` in node
    definition whenever possible.
* `core.register_on_dignode(function(pos, oldnode, digger))`
  * Called after a node has been dug.
  * **Not recommended**; Use `on_destruct` or `after_dig_node` in node
    definition whenever possible.
* `core.register_on_punchnode(function(pos, node, puncher, pointed_thing))`
  * Called when a node is punched
* `core.register_on_generated(function(minp, maxp, blockseed))`
  * Called after a piece of world between `minp` and `maxp` has been
    generated and written into the map.
  * **Avoid using this** whenever possible. As with other callbacks this blocks
    the main thread and is prone to introduce noticeable latency/lag.
    Consider [Mapgen environment](#mapgen-environment) as an alternative.
* `core.register_on_newplayer(function(player))`
  * Called when a new player enters the world for the first time
  * `player`: ObjectRef
* `core.register_on_punchplayer(function(player, hitter, time_from_last_punch, tool_capabilities, dir, damage))`
  * Called when a player is punched
  * Note: This callback is invoked even if the punched player is dead.
  * `player`: ObjectRef - Player that was punched
  * `hitter`: ObjectRef - Player that hit. Can be nil.
  * `time_from_last_punch`: Meant for disallowing spamming of clicks
    (can be nil).
  * `tool_capabilities`: Capability table of used item (can be nil)
  * `dir`: Unit vector of direction of punch. Always defined. Points from
    the puncher to the punched.
  * `damage`: Number that represents the damage calculated by the engine
  * should return `true` to prevent the default damage mechanism
* `core.register_on_rightclickplayer(function(player, clicker))`
  * Called when the 'place/use' key was used while pointing a player
    (not necessarily an actual rightclick)
  * `player`: ObjectRef - Player that is acted upon
  * `clicker`: ObjectRef - Object that acted upon `player`, may or may not be a player
* `core.register_on_player_hpchange(function(player, hp_change, reason), modifier)`
  * Called when the player gets damaged or healed
  * When `hp == 0`, damage doesn't trigger this callback.
  * When `hp == hp_max`, healing does still trigger this callback.
  * `player`: ObjectRef of the player
  * `hp_change`: the amount of change. Negative when it is damage.
    * Historically, the new HP value was clamped to \[0, 65535] before
      calculating the HP change. This clamping has been removed as of
      version 5.10.0
  * `reason`: a PlayerHPChangeReason table.
    * The `type` field will have one of the following values:
      * `set_hp`: A mod or the engine called `set_hp` without
        giving a type - use this for custom damage types.
      * `punch`: Was punched. `reason.object` will hold the puncher, or nil if none.
      * `fall`
      * `node_damage`: `damage_per_second` from a neighboring node.
        `reason.node` will hold the node name or nil.
        `reason.node_pos` will hold the position of the node
      * `drown`
      * `respawn`
    * Any of the above types may have additional fields from mods.
    * `reason.from` will be `mod` or `engine`.
  * `modifier`: when true, the function should return the actual `hp_change`.
    Note: modifiers only get a temporary `hp_change` that can be modified by later modifiers.
    Modifiers can return true as a second argument to stop the execution of further functions.
    Non-modifiers receive the final HP change calculated by the modifiers.
* `core.register_on_dieplayer(function(ObjectRef, reason))`
  * Called when a player dies
  * `reason`: a PlayerHPChangeReason table, see register\_on\_player\_hpchange
  * For customizing the death screen, see `core.show_death_screen`.
* `core.register_on_respawnplayer(function(ObjectRef))`
  * Called when player is to be respawned
  * Called *before* repositioning of player occurs
  * return true in func to disable regular player placement
* `core.register_on_prejoinplayer(function(name, ip))`
  * Called when a client connects to the server, prior to authentication
  * If it returns a string, the client is disconnected with that string as
    reason.
* `core.register_on_joinplayer(function(ObjectRef, last_login))`
  * Called when a player joins the game
  * `last_login`: The timestamp of the previous login, or nil if player is new
* `core.register_on_leaveplayer(function(ObjectRef, timed_out))`
  * Called when a player leaves the game
  * Does not get executed for connected players on shutdown.
  * `timed_out`: True for timeout, false for other reasons.
* `core.register_on_authplayer(function(name, ip, is_success))`
  * Called when a client attempts to log into an account.
  * `name`: The name of the account being authenticated.
  * `ip`: The IP address of the client
  * `is_success`: Whether the client was successfully authenticated
  * For newly registered accounts, `is_success` will always be true
* `core.register_on_auth_fail(function(name, ip))`
  * Deprecated: use `core.register_on_authplayer(name, ip, is_success)` instead.
* `core.register_on_cheat(function(ObjectRef, cheat))`
  * Called when a player cheats
  * `cheat`: `{type=<cheat_type>}`, where `<cheat_type>` is one of:
    * `moved_too_fast`
    * `interacted_too_far`
    * `interacted_with_self`
    * `interacted_while_dead`
    * `finished_unknown_dig`
    * `dug_unbreakable`
    * `dug_too_fast`
* `core.register_on_chat_message(function(name, message))`
  * Called always when a player says something
  * Return `true` to mark the message as handled, which means that it will
    not be sent to other players.
* `core.register_on_chatcommand(function(name, command, params))`
  * Called always when a chatcommand is triggered, before `core.registered_chatcommands`
    is checked to see if the command exists, but after the input is parsed.
  * Return `true` to mark the command as handled, which means that the default
    handlers will be prevented.
* `core.register_on_player_receive_fields(function(player, formname, fields))`
  * Called when the server received input from `player`.
    Specifically, this is called on any of the
    following events:
    \* a button was pressed,
    \* Enter was pressed while the focus was on a text field
    \* a checkbox was toggled,
    \* something was selected in a dropdown list,
    \* a different tab was selected,
    \* selection was changed in a textlist or table,
    \* an entry was double-clicked in a textlist or table,
    \* a scrollbar was moved, or
    \* the form was actively closed by the player.
  * `formname` is the name passed to `core.show_formspec`.
    Special case: The empty string refers to the player inventory
    (the formspec set by the `set_inventory_formspec` player method).
  * Fields are sent for formspec elements which define a field. `fields`
    is a table containing each formspecs element value (as string), with
    the `name` parameter as index for each. The value depends on the
    formspec element type:
    * `animated_image`: Returns the index of the current frame.
    * `button` and variants: If pressed, contains the user-facing button
      text as value. If not pressed, is `nil`
    * `field`, `textarea` and variants: Text in the field
    * `dropdown`: Either the index or value, depending on the `index event`
      dropdown argument.
    * `tabheader`: Tab index, starting with `"1"` (only if tab changed)
    * `checkbox`: `"true"` if checked, `"false"` if unchecked
    * `textlist`: See `core.explode_textlist_event`
    * `table`: See `core.explode_table_event`
    * `scrollbar`: See `core.explode_scrollbar_event`
    * Special case: `["quit"]="true"` is sent when the user actively
      closed the form by mouse click, keypress or through a `button_exit[]`
      element.
    * Special case: `["try_quit"]="true"` is sent when the user tries to
      close the formspec, but the formspec used `allow_close[false]`.
    * Special case: `["key_enter"]="true"` is sent when the user pressed
      the Enter key and the focus was either nowhere (causing the formspec
      to be closed) or on a button. If the focus was on a text field,
      additionally, the index `key_enter_field` contains the name of the
      text field. See also: `field_close_on_enter`.
  * Newest functions are called first
  * If function returns `true`, remaining functions are not called
* `core.register_on_craft(function(itemstack, player, old_craft_grid, craft_inv))`
  * Called when `player` crafts something
  * `itemstack` is the output
  * `old_craft_grid` contains the recipe, is a list of `ItemStack`s (Note: the one in the inventory is
    cleared).
  * `craft_inv` is the inventory with the crafting grid
  * Return either an `ItemStack`, to replace the output, or `nil`, to not
    modify it.
* `core.register_craft_predict(function(itemstack, player, old_craft_grid, craft_inv))`
  * The same as before, except that it is called before the player crafts, to
    make craft prediction, and it should not change anything.
* `core.register_allow_player_inventory_action(function(player, action, inventory, inventory_info))`
  * Determines how much of a stack may be taken, put or moved to a
    player inventory.
  * Function arguments: see `core.register_on_player_inventory_action`
  * Return a numeric value to limit the amount of items to be taken, put or
    moved. A value of `-1` for `take` will make the source stack infinite.
* `core.register_on_player_inventory_action(function(player, action, inventory, inventory_info))`
  * Called after an item take, put or move event from/to/in a player inventory
  * These inventory actions are recognized:
    * move: Item was moved within the player inventory
    * put: Item was put into player inventory from another inventory
    * take: Item was taken from player inventory and put into another inventory
  * `player` (type `ObjectRef`) is the player who modified the inventory
    `inventory` (type `InvRef`).
  * List of possible `action` (string) values and their
    `inventory_info` (table) contents:
    * `move`: `{from_list=string, to_list=string, from_index=number, to_index=number, count=number}`
    * `put`:  `{listname=string, index=number, stack=ItemStack}`
    * `take`: Same as `put`
  * Does not accept or handle any return value.
* `core.register_on_protection_violation(function(pos, name))`
  * Called by `builtin` and mods when a player violates protection at a
    position (eg, digs a node or punches a protected entity).
  * The registered functions can be called using
    `core.record_protection_violation`.
  * The provided function should check that the position is protected by the
    mod calling this function before it prints a message, if it does, to
    allow for multiple protection mods.
* `core.register_on_item_eat(function(hp_change, replace_with_item, itemstack, user, pointed_thing))`
  * Called when an item is eaten, by `core.item_eat`
  * Return `itemstack` to cancel the default item eat response (i.e.: hp increase).
* `core.register_on_item_pickup(function(itemstack, picker, pointed_thing, time_from_last_punch,  ...))`
  * Called by `core.item_pickup` before an item is picked up.
  * Function is added to `core.registered_on_item_pickups`.
  * Oldest functions are called first.
  * Parameters are the same as in the `on_pickup` callback.
  * Return an itemstack to cancel the default item pick-up response (i.e.: adding
    the item into inventory).
* `core.register_on_priv_grant(function(name, granter, priv))`
  * Called when `granter` grants the priv `priv` to `name`.
  * Note that the callback will be called twice if it's done by a player,
    once with granter being the player name, and again with granter being nil.
* `core.register_on_priv_revoke(function(name, revoker, priv))`
  * Called when `revoker` revokes the priv `priv` from `name`.
  * Note that the callback will be called twice if it's done by a player,
    once with revoker being the player name, and again with revoker being nil.
* `core.register_can_bypass_userlimit(function(name, ip))`
  * Called when `name` user connects with `ip`.
  * Return `true` to by pass the player limit
* `core.register_on_modchannel_message(function(channel_name, sender, message))`
  * Called when an incoming mod channel message is received
  * You should have joined some channels to receive events.
  * If message comes from a server mod, `sender` field is an empty string.
* `core.register_on_liquid_transformed(function(pos_list, node_list))`
  * Called after liquid nodes (`liquidtype ~= "none"`) are modified by the
    engine's liquid transformation process.
  * `pos_list` is an array of all modified positions.
  * `node_list` is an array of the old node that was previously at the position
    with the corresponding index in pos\_list.
* `core.register_on_mapblocks_changed(function(modified_blocks, modified_block_count))`
  * Called soon after any nodes or node metadata have been modified. No
    modifications will be missed, but there may be false positives.
  * Will never be called more than once per server step.
  * `modified_blocks` is the set of modified mapblock position hashes. These
    are in the same format as those produced by `core.hash_node_position`,
    and can be converted to positions with `core.get_position_from_hash`.
    The set is a table where the keys are hashes and the values are `true`.
  * `modified_block_count` is the number of entries in the set.
  * Note: callbacks must be registered at mod load time.

## Setting-related

* `core.settings`: Settings object containing all of the settings from the
  main config file (`minetest.conf`). See [`Settings`](#settings).
* `core.setting_get_pos(name)`: Loads a setting from the main settings and
  parses it as a position (in the format `(1,2,3)`). Returns a position or nil. **Deprecated: use `core.settings:get_pos()` instead**

## Authentication

* `core.string_to_privs(str[, delim])`:
  * Converts string representation of privs into table form
  * `delim`: String separating the privs. Defaults to `","`.
  * Returns `{ priv1 = true, ... }`

* `core.privs_to_string(privs[, delim])`:
  * Returns the string representation of `privs`
  * `delim`: String to delimit privs. Defaults to `","`.

* `core.get_player_privs(name) -> {priv1=true,...}`

* `core.check_player_privs(player_or_name, ...)`:
  returns `bool, missing_privs`
  * A quickhand for checking privileges.
  * `player_or_name`: Either a Player object or the name of a player.
  * `...` is either a list of strings, e.g. `"priva", "privb"` or
    a table, e.g. `{ priva = true, privb = true }`.

* `core.check_password_entry(name, entry, password)`
  * Returns true if the "password entry" for a player with name matches given
    password, false otherwise.
  * The "password entry" is the password representation generated by the
    engine as returned as part of a `get_auth()` call on the auth handler.
  * Only use this function for making it possible to log in via password from
    external protocols such as IRC, other uses are frowned upon.

* `core.get_password_hash(name, raw_password)`
  * Convert a name-password pair to a password hash that Luanti can use.
  * The returned value alone is not a good basis for password checks based
    on comparing the password hash in the database with the password hash
    from the function, with an externally provided password, as the hash
    in the db might use the new SRP verifier format.
  * For this purpose, use `core.check_password_entry` instead.

* `core.get_player_ip(name)`: returns an IP address string for the player
  `name`.
  * The player needs to be online for this to be successful.

* `core.get_auth_handler()`: Return the currently active auth handler
  * Must be called *after* load time, to ensure that any custom auth handler was
    already registered.
  * See the [Authentication handler definition](#authentication-handler-definition)
  * Use this to e.g. get the authentication data for a player:
    `local auth_data = core.get_auth_handler().get_auth(playername)`

* `core.notify_authentication_modified(name)`
  * Must be called by the authentication handler for privilege changes.
  * `name`: string; if omitted, all auth data should be considered modified

* `core.set_player_password(name, password_hash)`: Set password hash of
  player `name`.

* `core.set_player_privs(name, privs)`: Set privileges of player `name`.
  * `privs` is a **set** of privileges:
    A table where the keys are names of privileges and the values are `true`.
  * Example: `core.set_player_privs("singleplayer", {interact = true, fly = true})`.
    This **sets** the player privileges to `interact` and `fly`;
    `singleplayer` will only have these two privileges afterwards.

* `core.change_player_privs(name, changes)`: Helper to grant or revoke privileges.
  * `changes`: Table of changes to make.
    A field `[privname] = true` grants a privilege,
    whereas `[privname] = false` revokes a privilege.
  * Example: `core.change_player_privs("singleplayer", {interact = true, fly = false})`
    will grant singleplayer the `interact` privilege
    and revoke singleplayer's `fly` privilege.
    All other privileges will remain unchanged.

* `core.auth_reload()`
  * See `reload()` in authentication handler definition

`core.set_player_password`, `core.set_player_privs`,
`core.get_player_privs` and `core.auth_reload` call the authentication
handler.

## Chat

* `core.chat_send_all(text)`: send chat message to all players
* `core.chat_send_player(name, text)`: send chat message to specific player
  * `name`: Name of the player
* `core.format_chat_message(name, message)`
  * Used by the server to format a chat message, based on the setting `chat_message_format`.
    Refer to the documentation of the setting for a list of valid placeholders.
  * Takes player name and message, and returns the formatted string to be sent to players.
  * Can be redefined by mods if required, for things like colored names or messages.
  * **Only** the first occurrence of each placeholder will be replaced.

## Environment access

* `core.set_node(pos, node)`
  * Set node at position `pos`.
  * Any existing metadata is deleted.
  * `node`: table `{name=string, param1=number, param2=number}`
    If param1 or param2 is omitted, it's set to `0`.
  * e.g. `core.set_node({x=0, y=10, z=0}, {name="default:wood"})`

* `core.add_node(pos, node)`: alias to `core.set_node`

* `core.bulk_set_node({pos1, pos2, pos3, ...}, node)`
  * Set the same node at all positions in the first argument.
  * e.g. `core.bulk_set_node({{x=0, y=1, z=1}, {x=1, y=2, z=2}}, {name="default:stone"})`
  * For node specification or position syntax see `core.set_node` call
  * Faster than set\_node due to single call, but still considerably slower
    than Lua Voxel Manipulators (LVM) for large numbers of nodes.
    Unlike LVMs, this will call node callbacks. It also allows setting nodes
    in spread out positions which would cause LVMs to waste memory.
    For setting a cube, this is 1.3x faster than set\_node whereas LVM is 20
    times faster.

* `core.swap_node(pos, node)`
  * Swap node at position with another.
  * This keeps the metadata intact and will not run con-/destructor callbacks.

* `core.bulk_swap_node({pos1, pos2, pos3, ...}, node)`
  * Equivalent to `core.swap_node` but in bulk.

* `core.remove_node(pos)`: Remove a node
  * Equivalent to `core.set_node(pos, {name="air"})`, but a bit faster.

* `core.get_node(pos)`
  * Returns the node at the given position as table in the same format as `set_node`.
  * This function never returns `nil` and instead returns
    `{name="ignore", param1=0, param2=0}` for unloaded areas.

* `core.get_node_or_nil(pos)`
  * Same as `get_node` but returns `nil` for unloaded areas.
  * Note that even loaded areas can contain "ignore" nodes.

* `core.get_node_raw(x, y, z)`
  * Same as `get_node` but a faster low-level API
  * Returns `content_id`, `param1`, `param2`, and `pos_ok`
  * The `content_id` can be mapped to a name using `core.get_name_from_content_id()`
  * If `pos_ok` is false, the area is unloaded and `content_id == core.CONTENT_IGNORE`

* `core.get_node_light(pos[, timeofday])`
  * Gets the light value at the given position. Note that the light value
    "inside" the node at the given position is returned, so you usually want
    to get the light value of a neighbor.
  * `pos`: The position where to measure the light.
  * `timeofday`: `nil` for current time, `0` for night, `0.5` for day
  * Returns a number between `0` and `15` or `nil`
  * `nil` is returned e.g. when the map isn't loaded at `pos`

* `core.get_natural_light(pos[, timeofday])`
  * Figures out the sunlight (or moonlight) value at pos at the given time of
    day.
  * `pos`: The position of the node
  * `timeofday`: `nil` for current time, `0` for night, `0.5` for day
  * Returns a number between `0` and `15` or `nil`
  * This function tests 203 nodes in the worst case, which happens very
    unlikely

* `core.get_artificial_light(param1)`
  * Calculates the artificial light (light from e.g. torches) value from the
    `param1` value.
  * `param1`: The param1 value of a `paramtype = "light"` node.
  * Returns a number between `0` and `15`
  * Currently it's the same as `math.floor(param1 / 16)`, except that it
    ensures compatibility.

* `core.place_node(pos, node[, placer])`
  * Place node with the same effects that a player would cause
  * `placer`: The ObjectRef that places the node (optional)

* `core.dig_node(pos[, digger])`
  * Dig node with the same effects that a player would cause
  * `digger`: The ObjectRef that digs the node (optional)
  * Returns `true` if successful, `false` on failure (e.g. protected location)

* `core.punch_node(pos[, puncher])`
  * Punch node with the same effects that a player would cause
  * `puncher`: The ObjectRef that punches the node (optional)

* `core.spawn_falling_node(pos)`
  * Change node into falling node
  * Returns `true` and the ObjectRef of the spawned entity if successful, `false` on failure

* `core.find_nodes_with_meta(pos1, pos2)`
  * Get a table of positions of nodes that have metadata within a region
    {pos1, pos2}.

* `core.get_meta(pos)`
  * Get a `NodeMetaRef` at that position

* `core.get_node_timer(pos)`
  * Get `NodeTimerRef`

* `core.add_entity(pos, name, [staticdata])`: Spawn Lua-defined entity at
  position.
  * Returns `ObjectRef`, or `nil` if failed
  * Entities with `static_save = true` can be added also
    to unloaded and non-generated blocks.

* `core.add_item(pos, item)`: Spawn item
  * Returns `ObjectRef`, or `nil` if failed
  * Items can be added also to unloaded and non-generated blocks.

* `core.get_player_by_name(name)`: Get an `ObjectRef` to a player
  * Returns nothing in case of error (player offline, doesn't exist, ...).

* `core.get_objects_inside_radius(center, radius)`
  * returns a list of ObjectRefs
  * `radius`: using a Euclidean metric
  * **Warning**: Any kind of interaction with the environment or other APIs
    can cause later objects in the list to become invalid while you're iterating it.
    (e.g. punching an entity removes its children)
    It is recommended to use `core.objects_inside_radius` instead, which
    transparently takes care of this possibility.

* `core.objects_inside_radius(center, radius)`
  * returns an iterator of valid objects
  * example: `for obj in core.objects_inside_radius(center, radius) do obj:punch(...) end`

* `core.get_objects_in_area(min_pos, max_pos)`
  * returns a list of ObjectRefs
  * `min_pos` and `max_pos` are the min and max positions of the area to search
  * **Warning**: The same warning as for `core.get_objects_inside_radius` applies.
    Use `core.objects_in_area` instead to iterate only valid objects.

* `core.objects_in_area(min_pos, max_pos)`
  * returns an iterator of valid objects

* `core.set_timeofday(val)`: set time of day
  * `val` is between `0` and `1`; `0` for midnight, `0.5` for midday

* `core.get_timeofday()`: get time of day

* `core.get_gametime()`: returns the time, in seconds, since the world was
  created. The time is not available (`nil`) before the first server step.

* `core.get_day_count()`: returns number days elapsed since world was
  created.
  * Time changes are accounted for.

* `core.find_node_near(pos, radius, nodenames, [search_center])`: returns
  pos or `nil`.
  * `radius`: using a maximum metric
  * `nodenames`: e.g. `{"ignore", "group:tree"}` or `"default:dirt"`
  * `search_center` is an optional boolean (default: `false`)
    If true `pos` is also checked for the nodes

* `core.find_nodes_in_area(pos1, pos2, nodenames, [grouped])`
  * `pos1` and `pos2` are the min and max positions of the area to search.
  * `nodenames`: e.g. `{"ignore", "group:tree"}` or `"default:dirt"`
  * If `grouped` is true the return value is a table indexed by node name
    which contains lists of positions.
  * If `grouped` is false or absent the return values are as follows:
    first value: Table with all node positions
    second value: Table with the count of each node with the node name
    as index
  * Area volume is limited to 150,000,000 nodes

* `core.find_nodes_in_area_under_air(pos1, pos2, nodenames)`: returns a
  list of positions.
  * `nodenames`: e.g. `{"ignore", "group:tree"}` or `"default:dirt"`
  * Return value: Table with all node positions with a node air above
  * Area volume is limited to 150,000,000 nodes

* `core.get_value_noise(noiseparams)`
  * Return world-specific value noise.
  * The actual seed used is the noiseparams seed plus the world seed.
  * **Important**: Requires the mapgen environment to be initalized, do not use at load time.

* `core.get_value_noise(seeddiff, octaves, persistence, spread)`
  * Deprecated: use `core.get_value_noise(noiseparams)` instead.

* `core.get_perlin(noiseparams)`
  * Deprecated: renamed to `core.get_value_noise` in version 5.12.0.

* `core.get_perlin(seeddiff, octaves, persistence, spread)`
  * Deprecated: renamed to `core.get_value_noise` in version 5.12.0.

* `core.get_voxel_manip([pos1, pos2])`
  * Return voxel manipulator object.
  * Loads the manipulator from the map if positions are passed.

* `core.set_gen_notify(flags, [deco_ids], [custom_ids])`
  * Set the types of on-generate notifications that should be collected.
  * `flags`: flag field, see [`gennotify`](#gennotify) for available generation notification types.
  * The following parameters are optional:
  * `deco_ids` is a list of IDs of decorations which notification
    is requested for.
  * `custom_ids` is a list of user-defined IDs (strings) which are
    requested. By convention these should be the mod name with an optional
    colon and specifier added, e.g. `"default"` or `"default:dungeon_loot"`

* `core.get_gen_notify()`
  * Returns a flagstring, a table with the `deco_id`s and a table with
    user-defined IDs.

* `core.get_decoration_id(decoration_name)`
  * Returns the decoration ID number for the provided decoration name string,
    or `nil` on failure.

* `core.get_mapgen_object(objectname)`
  * Return requested mapgen object if available (see [Mapgen objects](#mapgen-objects))

* `core.get_heat(pos)`
  * Returns the heat at the position, or `nil` on failure.

* `core.get_humidity(pos)`
  * Returns the humidity at the position, or `nil` on failure.

* `core.get_biome_data(pos)`
  * Returns a table containing:
    * `biome` the biome id of the biome at that position
    * `heat` the heat at the position
    * `humidity` the humidity at the position
  * Or returns `nil` on failure.

* `core.get_biome_id(biome_name)`
  * Returns the biome id, as used in the biomemap Mapgen object and returned
    by `core.get_biome_data(pos)`, for a given biome\_name string.

* `core.get_biome_name(biome_id)`
  * Returns the biome name string for the provided biome id, or `nil` on
    failure.
  * If no biomes have been registered, such as in mgv6, returns `default`.

* `core.get_mapgen_params()`
  * Deprecated: use `core.get_mapgen_setting(name)` instead.
  * Returns a table containing:
    * `mgname`
    * `seed`
    * `chunksize`
    * `water_level`
    * `flags`

* `core.set_mapgen_params(MapgenParams)`
  * Deprecated: use `core.set_mapgen_setting(name, value, override)`
    instead.
  * Set map generation parameters.
  * Function cannot be called after the registration period.
  * Takes a table as an argument with the fields:
    * `mgname`
    * `seed`
    * `chunksize`
    * `water_level`
    * `flags`
  * Leave field unset to leave that parameter unchanged.
  * `flags` contains a comma-delimited string of flags to set, or if the
    prefix `"no"` is attached, clears instead.
  * `flags` is in the same format and has the same options as `mg_flags` in
    `minetest.conf`.

* `core.get_mapgen_edges([mapgen_limit[, chunksize]])`
  * Returns the minimum and maximum possible generated node positions
    in that order.
  * `mapgen_limit` is an optional number. If it is absent, its value is that
    of the *active* mapgen setting `"mapgen_limit"`.
  * `chunksize` is an optional number or vector. If it is absent, its value is that
    of the *active* mapgen setting `"chunksize"`.

* `core.get_mapgen_chunksize()`
  * Returns the currently active chunksize of the mapgen, as a vector.
    The size is specified in blocks.

* `core.get_mapgen_setting(name)`
  * Gets the *active* mapgen setting (or nil if none exists) in string
    format with the following order of precedence:
    1. Settings loaded from map\_meta.txt or overrides set during mod
       execution.
    2. Settings set by mods without a metafile override
    3. Settings explicitly set in the user config file, minetest.conf
    4. Settings set as the user config default

* `core.get_mapgen_setting_noiseparams(name)`
  * Same as above, but returns the value as a NoiseParams table if the
    setting `name` exists and is a valid NoiseParams.

* `core.set_mapgen_setting(name, value, [override_meta])`
  * Sets a mapgen param to `value`, and will take effect if the corresponding
    mapgen setting is not already present in map\_meta.txt.
  * `override_meta` is an optional boolean (default: `false`). If this is set
    to true, the setting will become the active setting regardless of the map
    metafile contents.
  * Note: to set the seed, use `"seed"`, not `"fixed_map_seed"`.

* `core.set_mapgen_setting_noiseparams(name, value, [override_meta])`
  * Same as above, except value is a NoiseParams table.

* `core.set_noiseparams(name, noiseparams, set_default)`
  * Sets the noiseparams setting of `name` to the noiseparams table specified
    in `noiseparams`.
  * `set_default` is an optional boolean (default: `true`) that specifies
    whether the setting should be applied to the default config or current
    active config.

* `core.get_noiseparams(name)`
  * Returns a table of the noiseparams for name.

* `core.generate_ores(vm[, pos1, pos2])`
  * Generate all registered ores within the VoxelManip `vm` and in the area
    from `pos1` to `pos2`.
  * `pos1` and `pos2` are optional and default to mapchunk minp and maxp.

* `core.generate_decorations(vm[, pos1, pos2, [use_mapgen_biomes]])`
  * Generate all registered decorations within the VoxelManip `vm` and in the
    area from `pos1` to `pos2`.
  * `pos1` and `pos2` are optional and default to mapchunk minp and maxp.
  * `use_mapgen_biomes` (optional boolean). For use in on\_generated callbacks only.
    If set to true, decorations are placed in respect to the biome map of the current chunk.
    `pos1` and `pos2` must match the positions of the current chunk, or an error will be raised.
    default: `false`

* `core.clear_objects([options])`
  * Clear all objects in the environment
  * Takes an optional table as an argument with the field `mode`.
    * mode = `"full"`: Load and go through every mapblock, clearing
      objects (default).
    * mode = `"quick"`: Clear objects immediately in loaded mapblocks,
      clear objects in unloaded mapblocks only when the
      mapblocks are next activated.

* `core.load_area(pos1[, pos2])`
  * Load the mapblocks containing the area from `pos1` to `pos2`.
    `pos2` defaults to `pos1` if not specified.
  * This function does not trigger map generation.

* `core.emerge_area(pos1, pos2, [callback], [param])`
  * Queue all blocks in the area from `pos1` to `pos2`, inclusive, to be
    asynchronously fetched from memory, loaded from disk, or if inexistent,
    generates them.
  * If `callback` is a valid Lua function, this will be called for each block
    emerged.
  * The function signature of callback is:
    `function EmergeAreaCallback(blockpos, action, calls_remaining, param)`
    * `blockpos` is the *block* coordinates of the block that had been
      emerged.
    * `action` could be one of the following constant values:
      * `core.EMERGE_CANCELLED`
      * `core.EMERGE_ERRORED`
      * `core.EMERGE_FROM_MEMORY`
      * `core.EMERGE_FROM_DISK`
      * `core.EMERGE_GENERATED`
    * `calls_remaining` is the number of callbacks to be expected after
      this one.
    * `param` is the user-defined parameter passed to emerge\_area (or
      nil if the parameter was absent).

* `core.delete_area(pos1, pos2)`
  * delete all mapblocks in the area from pos1 to pos2, inclusive

* `core.line_of_sight(pos1, pos2)`: returns `boolean, pos`
  * Checks if there is anything other than air between pos1 and pos2.
  * Returns false if something is blocking the sight.
  * Returns the position of the blocking node when `false`
  * `pos1`: First position
  * `pos2`: Second position

* `core.raycast(pos1, pos2, objects, liquids, pointabilities)`: returns `Raycast`
  * Creates a `Raycast` object.
  * `pos1`: start of the ray
  * `pos2`: end of the ray
  * `objects`: if false, only nodes will be returned. Default is `true`.
  * `liquids`: if false, liquid nodes (`liquidtype ~= "none"`) won't be
    returned. Default is `false`.
  * `pointabilities`: Allows overriding the `pointable` property of
    nodes and objects. Uses the same format as the `pointabilities` property
    of item definitions. Default is `nil`.

* `core.find_path(pos1, pos2, searchdistance, max_jump, max_drop, algorithm)`
  * returns table containing path that can be walked on
  * returns a table of 3D points representing a path from `pos1` to `pos2` or
    `nil` on failure.
  * Reasons for failure:
    * No path exists at all
    * No path exists within `searchdistance` (see below)
    * Start or end pos is buried in land
  * `pos1`: start position
  * `pos2`: end position
  * `searchdistance`: maximum distance from the search positions to search in.
    In detail: Path must be completely inside a cuboid. The minimum
    `searchdistance` of 1 will confine search between `pos1` and `pos2`.
    Larger values will increase the size of this cuboid in all directions
  * `max_jump`: maximum height difference to consider walkable
  * `max_drop`: maximum height difference to consider droppable
  * `algorithm`: One of `"A*_noprefetch"` (default), `"A*"`, `"Dijkstra"`.
    Difference between `"A*"` and `"A*_noprefetch"` is that
    `"A*"` will pre-calculate the cost-data, the other will calculate it
    on-the-fly

* `core.spawn_tree(pos, treedef)`
  * spawns L-system tree at given `pos` with definition in `treedef` table

* `core.spawn_tree_on_vmanip(vmanip, pos, treedef)`
  * analogous to `core.spawn_tree`, but spawns a L-system tree onto the specified
    VoxelManip object `vmanip` instead of the map.

* `core.transforming_liquid_add(pos)`
  * add node to liquid flow update queue

* `core.get_node_max_level(pos)`
  * get max available level for leveled node

* `core.get_node_level(pos)`
  * get level of leveled node (water, snow)

* `core.set_node_level(pos, level)`
  * set level of leveled node, default `level` equals `1`
  * if `totallevel > maxlevel`, returns rest (`total-max`).

* `core.add_node_level(pos, level)`
  * increase level of leveled node by level, default `level` equals `1`
  * if `totallevel > maxlevel`, returns rest (`total-max`)
  * `level` must be between -127 and 127

* `core.get_node_boxes(box_type, pos, [node])`
  * `box_type` must be `"node_box"`, `"collision_box"` or `"selection_box"`.
  * `pos` must be a node position.
  * `node` can be a table in the form `{name=string, param1=number, param2=number}`.
    If `node` is `nil`, the actual node at `pos` is used instead.
  * Resolves any facedir-rotated boxes, connected boxes and the like into
    actual boxes.
  * Returns a list of boxes in the form
    `{{x1, y1, z1, x2, y2, z2}, {x1, y1, z1, x2, y2, z2}, ...}`. Coordinates
    are relative to `pos`.
  * See also: [Node boxes](#node-boxes)

* `core.fix_light(pos1, pos2)`: returns `true`/`false`
  * resets the light in a cuboid-shaped part of
    the map and removes lighting bugs.
  * Loads the area if it is not loaded.
  * `pos1` is the corner of the cuboid with the least coordinates
    (in node coordinates), inclusive.
  * `pos2` is the opposite corner of the cuboid, inclusive.
  * The actual updated cuboid might be larger than the specified one,
    because only whole map blocks can be updated.
    The actual updated area consists of those map blocks that intersect
    with the given cuboid.
  * However, the neighborhood of the updated area might change
    as well, as light can spread out of the cuboid, also light
    might be removed.
  * returns `false` if the area is not fully generated,
    `true` otherwise

* `core.check_single_for_falling(pos)`
  * causes an unsupported `group:falling_node` node to fall and causes an
    unattached `group:attached_node` node to fall.
  * does not spread these updates to neighbors.

* `core.check_for_falling(pos)`
  * causes an unsupported `group:falling_node` node to fall and causes an
    unattached `group:attached_node` node to fall.
  * spread these updates to neighbors and can cause a cascade
    of nodes to fall.

* `core.get_spawn_level(x, z)`
  * Returns a player spawn y coordinate for the provided (x, z)
    coordinates, or `nil` for an unsuitable spawn point.
  * For most mapgens a 'suitable spawn point' is one with y between
    `water_level` and `water_level + 16`, and in mgv7 well away from rivers,
    so `nil` will be returned for many (x, z) coordinates.
  * The spawn level returned is for a player spawn in unmodified terrain.
  * The spawn level is intentionally above terrain level to cope with
    full-node biome 'dust' nodes.

## Mod channels

You can find mod channels communication scheme in `doc/mod_channels.png`.

* `core.mod_channel_join(channel_name)`
  * Server joins channel `channel_name`, and creates it if necessary. You
    should listen for incoming messages with
    `core.register_on_modchannel_message`
  * This returns a [ModChannel](#modchannel) object.

## Inventory

`core.get_inventory(location)`: returns an `InvRef`

* `location` = e.g.
  * `{type="player", name="celeron55"}`
  * `{type="node", pos={x=, y=, z=}}`
  * `{type="detached", name="creative"}`
* `core.create_detached_inventory(name, callbacks, [player_name])`: returns
  an `InvRef`.
  * `callbacks`: See [Detached inventory callbacks](#detached-inventory-callbacks)
  * `player_name`: Make detached inventory available to one player
    exclusively, by default they will be sent to every player (even if not
    used).
    Note that this parameter is mostly just a workaround and will be removed
    in future releases.
  * Creates a detached inventory. If it already exists, it is cleared.
* `core.remove_detached_inventory(name)`
  * Returns a `boolean` indicating whether the removal succeeded.
* `core.do_item_eat(hp_change, replace_with_item, itemstack, user, pointed_thing)`:
  returns leftover ItemStack or nil to indicate no inventory change
  * See `core.item_eat` and `core.register_on_item_eat`

## Formspec functions

* `core.show_formspec(playername, formname, formspec)`
  * `playername`: name of player to show formspec
  * `formname`: name passed to `on_player_receive_fields` callbacks.
    * It should follow the `"modname:<whatever>"` naming convention.
    * If empty: Shows a custom, temporary inventory formspec.
      * An inventory formspec shown this way will also be updated if
        `ObjectRef:set_inventory_formspec` is called.
      * Use `ObjectRef:set_inventory_formspec` to change the player's
        inventory formspec for future opens.
      * Supported if server AND client are both of version >= 5.13.0.
  * `formspec`: formspec to display
  * See also: `core.register_on_player_receive_fields`
* `core.close_formspec(playername, formname)`
  * `playername`: name of player to close formspec
  * `formname`: has to exactly match the one given in `show_formspec`, or the
    formspec will not close.
  * calling `show_formspec(playername, formname, "")` is equal to this
    expression.
  * to close a formspec regardless of the formname, call
    `core.close_formspec(playername, "")`.
    **USE THIS ONLY WHEN ABSOLUTELY NECESSARY!**
* `core.formspec_escape(string)`: returns a string
  * escapes the characters "\[", "]", "", "," and ";", which cannot be used
    in formspecs.
* `core.hypertext_escape(string)`: returns a string
  * escapes the characters "", "<", and ">" to show text in a hypertext element.
  * not safe for use with tag attributes.
  * this function does not do formspec escaping, you will likely need to do
    `core.formspec_escape(core.hypertext_escape(string))` if the hypertext is
    not already being formspec escaped.
* `core.explode_table_event(string)`: returns a table
  * returns e.g. `{type="CHG", row=1, column=2}`
  * `type` is one of:
    * `"INV"`: no row selected
    * `"CHG"`: selected
    * `"DCL"`: double-click
* `core.explode_textlist_event(string)`: returns a table
  * returns e.g. `{type="CHG", index=1}`
  * `type` is one of:
    * `"INV"`: no row selected
    * `"CHG"`: selected
    * `"DCL"`: double-click
* `core.explode_scrollbar_event(string)`: returns a table
  * returns e.g. `{type="CHG", value=500}`
  * `type` is one of:
    * `"INV"`: something failed
    * `"CHG"`: has been changed
    * `"VAL"`: not changed
* `core.show_death_screen(player, reason)`
  * Called when the death screen should be shown.
  * `player` is an ObjectRef, `reason` is a PlayerHPChangeReason table or nil.
  * By default, this shows a simple formspec with the option to respawn.
    Respawning is done via `ObjectRef:respawn`.
  * You can override this to show a custom death screen.
  * For general death handling, use `core.register_on_dieplayer` instead.

## Item handling

* `core.inventorycube(img1, img2, img3)`
  * Returns a string for making an image of a cube (useful as an item image)

* `core.get_pointed_thing_position(pointed_thing, above)`
  * Returns the position of a `pointed_thing` or `nil` if the `pointed_thing`
    does not refer to a node or entity.
  * If the optional `above` parameter is true and the `pointed_thing` refers
    to a node, then it will return the `above` position of the `pointed_thing`.

* `core.dir_to_facedir(dir[, is6d])`
  * Convert a vector to a facedir value, used in `param2` for
    `paramtype2="facedir"`.
  * passing something non-`nil`/`false` for the optional second parameter
    causes it to take the y component into account.

* `core.facedir_to_dir(facedir)`
  * Convert a facedir back into a vector aimed directly out the "back" of a
    node.

* `core.dir_to_fourdir(dir)`
  * Convert a vector to a 4dir value, used in `param2` for
    `paramtype2="4dir"`.

* `core.fourdir_to_dir(fourdir)`
  * Convert a 4dir back into a vector aimed directly out the "back" of a
    node.

* `core.dir_to_wallmounted(dir)`
  * Convert a vector to a wallmounted value, used for
    `paramtype2="wallmounted"`.

* `core.wallmounted_to_dir(wallmounted)`
  * Convert a wallmounted value back into a vector aimed directly out the
    "back" of a node.

* `core.dir_to_yaw(dir)`
  * Convert a vector into a yaw (angle)

* `core.yaw_to_dir(yaw)`
  * Convert yaw (angle) to a vector

* `core.is_colored_paramtype(ptype)`
  * Returns a boolean. Returns `true` if the given `paramtype2` contains
    color information (`color`, `colorwallmounted`, `colorfacedir`, etc.).

* `core.strip_param2_color(param2, paramtype2)`
  * Removes everything but the color information from the
    given `param2` value.
  * Returns `nil` if the given `paramtype2` does not contain color
    information.

* `core.get_node_drops(node[, toolname, tool, digger, pos])`
  * Returns list of itemstrings that are dropped by `node` when dug with the
    item `toolname` (not limited to tools). The default implementation doesn't
    use `tool`, `digger`, and `pos`, but these are provided by `core.node_dig`
    since 5.12.0 for games/mods implementing customized drops.
  * `node`: node as table or node name
  * `toolname`: name of the item used to dig (can be `nil`)
  * `tool`: `ItemStack` used to dig (can be `nil`)
  * `digger`: the ObjectRef that digs the node (can be `nil`)
  * `pos`: the pos of the dug node (can be `nil`)

* `core.get_craft_result(input)`: returns `output, decremented_input`
  * `input.method` = `"normal"` or `"cooking"` or `"fuel"`
  * `input.width` = for example `3`
  * `input.items` = for example
    `{stack1, stack2, stack3, stack4, stack 5, stack 6, stack 7, stack 8, stack 9}`
  * `output.item` = `ItemStack`, if unsuccessful: empty `ItemStack`
  * `output.time` = a number, if unsuccessful: `0`
  * `output.replacements` = List of replacement `ItemStack`s that couldn't be
    placed in `decremented_input.items`. Replacements can be placed in
    `decremented_input` if the stack of the replaced item has a count of 1.
  * `decremented_input` = like `input`

* `core.get_craft_recipe(output)`: returns input
  * returns last registered recipe for output item (node)
  * `output` is a node or item type such as `"default:torch"`
  * `input.method` = `"normal"` or `"cooking"` or `"fuel"`
  * `input.width` = for example `3`
  * `input.items` = for example
    `{stack1, stack2, stack3, stack4, stack 5, stack 6, stack 7, stack 8, stack 9}`
    * `input.items` = `nil` if no recipe found

* `core.get_all_craft_recipes(query item)`: returns a table or `nil`
  * returns indexed table with all registered recipes for query item (node)
    or `nil` if no recipe was found.
  * recipe entry table:
    * `method`: 'normal' or 'cooking' or 'fuel'
    * `width`: 0-3, 0 means shapeless recipe
    * `items`: indexed \[1-9] table with recipe items
    * `output`: string with item name and quantity
  * Example result for `"default:gold_ingot"` with two recipes:
    ```lua
    {
        {
            method = "cooking", width = 3,
            output = "default:gold_ingot", items = {"default:gold_lump"}
        },
        {
            method = "normal", width = 1,
            output = "default:gold_ingot 9", items = {"default:goldblock"}
        }
    }
    ```

* `core.handle_node_drops(pos, drops, digger)`
  * `drops`: list of itemstrings
  * Handles drops from nodes after digging: Default action is to put them
    into digger's inventory.
  * Can be overridden to get different functionality (e.g. dropping items on
    ground)

* `core.itemstring_with_palette(item, palette_index)`: returns an item
  string.
  * Creates an item string which contains palette index information
    for hardware colorization. You can use the returned string
    as an output in a craft recipe.
  * `item`: the item stack which becomes colored. Can be in string,
    table and native form.
  * `palette_index`: this index is added to the item stack

* `core.itemstring_with_color(item, colorstring)`: returns an item string
  * Creates an item string which contains static color information
    for hardware colorization. Use this method if you wish to colorize
    an item that does not own a palette. You can use the returned string
    as an output in a craft recipe.
  * `item`: the item stack which becomes colored. Can be in string,
    table and native form.
  * `colorstring`: the new color of the item stack

## Rollback

* `core.rollback_get_node_actions(pos, range, seconds, limit)`:
  returns `{{actor, pos, time, oldnode, newnode}, ...}`
  * Find who has done something to a node, or near a node
  * `actor`: `"player:<name>"`, also `"liquid"`.
* `core.rollback_revert_actions_by(actor, seconds)`: returns
  `boolean, log_messages`.
  * Revert latest actions of someone
  * `actor`: `"player:<name>"`, also `"liquid"`.

## Defaults for the `on_place` and `on_drop` item definition functions

* `core.item_place_node(itemstack, placer, pointed_thing[, param2, prevent_after_place])`
  * Place item as a node
  * `param2` overrides `facedir` and wallmounted `param2`
  * `prevent_after_place`: if set to `true`, `after_place_node` is not called
    for the newly placed node to prevent a callback and placement loop
  * returns `itemstack, position`
    * `position`: the location the node was placed to. `nil` if nothing was placed.
* `core.item_place_object(itemstack, placer, pointed_thing)`
  * Place item as-is
  * returns the leftover itemstack
  * **Note**: This function is deprecated and will never be called.
* `core.item_place(itemstack, placer, pointed_thing[, param2])`
  * Wrapper that calls `core.item_place_node` if appropriate
  * Calls `on_rightclick` of `pointed_thing.under` if defined instead
  * **Note**: is not called when wielded item overrides `on_place`
  * `param2` overrides facedir and wallmounted `param2`
  * returns `itemstack, position`
    * `position`: the location the node was placed to. `nil` if nothing was placed.
* `core.item_pickup(itemstack, picker, pointed_thing, time_from_last_punch, ...)`
  * Runs callbacks registered by `core.register_on_item_pickup` and adds
    the item to the picker's `"main"` inventory list.
  * Parameters and return value are the same as `on_pickup`.
  * **Note**: is not called when wielded item overrides `on_pickup`
* `core.item_secondary_use(itemstack, user)`
  * Global secondary use callback. Does nothing.
  * Parameters and return value are the same as `on_secondary_use`.
  * **Note**: is not called when wielded item overrides `on_secondary_use`
* `core.item_drop(itemstack, dropper, pos)`
  * Converts `itemstack` to an in-world Lua entity.
  * `itemstack` (`ItemStack`) is modified (cleared) on success.
    * In versions < 5.12.0, `itemstack` was cleared in all cases.
  * `dropper` (`ObjectRef`) is optional.
  * Returned values on success:
    1. leftover itemstack
    2. `ObjectRef` of the spawned object (provided since 5.12.0)
* `core.item_eat(hp_change[, replace_with_item])`
  * Returns `function(itemstack, user, pointed_thing)` as a
    function wrapper for `core.do_item_eat`.
  * `replace_with_item` is the itemstring which is added to the inventory.
    If the player is eating a stack and `replace_with_item` doesn't fit onto
    the eaten stack, then the remainings go to a different spot, or are dropped.

## Defaults for the `on_punch` and `on_dig` node definition callbacks

* `core.node_punch(pos, node, puncher, pointed_thing)`
  * Calls functions registered by `core.register_on_punchnode()`
* `core.node_dig(pos, node, digger)`
  * Checks if node can be dug, puts item into inventory, removes node
  * Calls functions registered by `core.register_on_dignode()`

## Sounds

* `core.sound_play(spec, parameters, [ephemeral])`: returns a handle
  * `spec` is a `SimpleSoundSpec`
  * `parameters` is a sound parameter table
  * `ephemeral` is a boolean (default: false)
    Ephemeral sounds will not return a handle and can't be stopped or faded.
    It is recommend to use this for short sounds that happen in response to
    player actions (e.g. door closing).
* `core.sound_stop(handle)`
  * `handle` is a handle returned by `core.sound_play`
* `core.sound_fade(handle, step, gain)`
  * `handle` is a handle returned by `core.sound_play`
  * `step` determines how fast a sound will fade.
    The gain will change by this much per second,
    until it reaches the target gain.
    Note: Older versions used a signed step. This is deprecated, but old
    code will still work. (the client uses abs(step) to correct it)
  * `gain` the target gain for the fade.
    Fading to zero will delete the sound.

## Timing

* `core.after(time, func, ...)`: returns job table to use as below.
  * Call the function `func` after `time` seconds, may be fractional
  * Optional: Variable number of arguments that are passed to `func`
  * Jobs set for earlier times are executed earlier. If multiple jobs expire
    at exactly the same time, then they are executed in registration order.
  * `time` is a lower bound. The job is executed in the first server-step that
    started at least `time` seconds after the last time a server-step started,
    measured with globalstep dtime.
  * If `time` is `0`, the job is executed in the next step.

* `job:cancel()`
  * Cancels the job function from being called

## Async environment

The engine allows you to submit jobs to be ran in an isolated environment
concurrently with normal server operation.
A job consists of a function to be ran in the async environment, any amount of
arguments (will be serialized) and a callback that will be called with the return
value of the job function once it is finished.

The async environment does *not* have access to the map, entities, players or any
globals defined in the 'usual' environment. Consequently, functions like
`core.get_node()` or `core.get_player_by_name()` simply do not exist in it.

Arguments and return values passed through this can contain certain userdata
objects that will be seamlessly copied (not shared) to the async environment.
This allows you easy interoperability for delegating work to jobs.

* `core.handle_async(func, callback, ...)`:
  * Queue the function `func` to be ran in an async environment.
    Note that there are multiple persistent workers and any of them may
    end up running a given job. The engine will scale the amount of
    worker threads automatically.
  * When `func` returns the callback is called (in the normal environment)
    with all of the return values as arguments.
  * Optional: Variable number of arguments that are passed to `func`
  * Returns an `AsyncJob` async job.
* `core.register_async_dofile(path)`:
  * Register a path to a Lua file to be imported when an async environment
    is initialized. You can use this to preload code which you can then call
    later using `core.handle_async()`.

### List of APIs available in an async environment

Classes:

* `AreaStore`
* `ItemStack`
* `ValueNoise`
* `ValueNoiseMap`
* `PseudoRandom`
* `PcgRandom`
* `SecureRandom`
* `VoxelArea`
* `VoxelManip`
  * only if transferred into environment; can't read/write to map
* `Settings`

Class instances that can be transferred between environments:

* `ItemStack`
* `ValueNoise`
* `ValueNoiseMap`
* `VoxelManip`

Functions:

* Standalone helpers such as logging, filesystem, encoding,
  hashing or compression APIs
* `core.register_portable_metatable`
* IPC

Variables:

* `core.settings`
* `core.registered_items`, `registered_nodes`, `registered_tools`,
  `registered_craftitems` and `registered_aliases`
  * with all functions and userdata values replaced by `true`, calling any
    callbacks here is obviously not possible

## Mapgen environment

The engine runs the map generator on separate threads, each of these also has
a Lua environment. Its primary purpose is to allow mods to operate on newly
generated parts of the map to e.g. generate custom structures.
Internally it is referred to as "emerge environment".

Refer to [Async environment](#async-environment) for the usual disclaimer on what environment isolation entails.

The map generator threads, which also contain the above mentioned Lua environment,
are initialized after all mods have been loaded by the server. After that the
registered scripts (not all mods!) - see below - are run during initialization of
the mapgen environment. After that only callbacks happen. The mapgen env
does not have a global step or timer.

* `core.register_mapgen_script(path)`:
  * Register a path to a Lua file to be imported when a mapgen environment
    is initialized. Run in order of registration.

### List of APIs exclusive to the mapgen env

* `core.register_on_generated(function(vmanip, minp, maxp, blockseed))`
  * Called after the engine mapgen finishes a chunk but before it is written to
    the map.
  * Chunk data resides in `vmanip`. Other parts of the map are not accessible.
    The area of the chunk if comprised of `minp` and `maxp`, note that is smaller
    than the emerged area of the VoxelManip.
    Note: calling `read_from_map()` or `write_to_map()` on the VoxelManipulator object
    is not necessary and is disallowed.
  * `blockseed`: 64-bit seed number used for this chunk
* `core.save_gen_notify(id, data)`
  * Saves data for retrieval using the gennotify mechanism (see [Mapgen objects](#mapgen-objects)).
  * Data is bound to the chunk that is currently being processed, so this function
    only makes sense inside the `on_generated` callback.
  * `id`: user-defined ID (a string)
    By convention these should be the mod name with an optional
    colon and specifier added, e.g. `"default"` or `"default:dungeon_loot"`
  * `data`: any Lua object (will be serialized, no userdata allowed)
  * returns `true` if the data was remembered. That is if `core.set_gen_notify`
    was called with the same user-defined ID before.

### List of APIs available in the mapgen env

Classes:

* `AreaStore`
* `ItemStack`
* `ValueNoise`
* `ValueNoiseMap`
* `PseudoRandom`
* `PcgRandom`
* `SecureRandom`
* `VoxelArea`
* `VoxelManip`
  * only given by callbacks; cannot access rest of map
* `Settings`

Functions:

* Standalone helpers such as logging, filesystem, encoding,
  hashing or compression APIs
* `core.get_biome_id`, `get_biome_name`, `get_heat`, `get_humidity`,
  `get_biome_data`, `get_mapgen_object`, `get_mapgen_params`, `get_mapgen_edges`,
  `get_mapgen_setting`, `get_noiseparams`, `get_decoration_id` and more
* `core.get_node`, `set_node`, `find_node_near`, `find_nodes_in_area`,
  `spawn_tree` and similar
  * these only operate on the current chunk (if inside a callback)
* IPC

Variables:

* `core.settings`
* `core.registered_items`, `registered_nodes`, `registered_tools`,
  `registered_craftitems` and `registered_aliases`
  * with all functions and userdata values replaced by `true`, calling any
    callbacks here is obviously not possible
* `core.registered_biomes`, `registered_ores`, `registered_decorations`

Note that node metadata does not exist in the mapgen env, we suggest deferring
setting any metadata you need to the `on_generated` callback in the regular env.
You can use the gennotify mechanism to transfer this information.

## Server

* `core.request_shutdown([message],[reconnect],[delay])`: request for
  server shutdown. Will display `message` to clients.
  * `reconnect` == true displays a reconnect button
  * `delay` adds an optional delay (in seconds) before shutdown.
    Negative delay cancels the current active shutdown.
    Zero delay triggers an immediate shutdown.
* `core.cancel_shutdown_requests()`: cancel current delayed shutdown
* `core.get_server_status(name, joined)`
  * Returns the server status string when a player joins or when the command
    `/status` is called. Returns `nil` or an empty string when the message is
    disabled.
  * `joined`: Boolean value, indicates whether the function was called when
    a player joined.
  * This function may be overwritten by mods to customize the status message.
* `core.get_server_uptime()`: returns the server uptime in seconds
* `core.get_server_max_lag()`: returns the current maximum lag
  of the server in seconds or nil if server is not fully loaded yet
* `core.remove_player(name)`: remove player from database (if they are not
  connected).
  * As auth data is not removed, `core.player_exists` will continue to
    return true. Call the below method as well if you want to remove auth
    data too.
  * Returns a code (0: successful, 1: no such player, 2: player is connected)
* `core.remove_player_auth(name)`: remove player authentication data
  * Returns boolean indicating success (false if player nonexistent)
* `core.dynamic_add_media(options, callback)`
  * `options`: table containing the following parameters
    * `filename`: name the media file will be usable as
      (optional if `filepath` present)
    * `filepath`: path to the file on the filesystem \[\*]
    * `filedata`: the data of the file to be sent \[\*]
    * `to_player`: name of the player the media should be sent to instead of
      all players (optional)
    * `ephemeral`: if true the server will create a copy of the file and
      forget about it once delivered (optional boolean, default false)
    * `client_cache`: hint whether the client should save the media in its cache
      (optional boolean, default `!ephemeral`, added in 5.14.0)
    * Exactly one of the parameters marked \[\*] must be specified.
  * `callback`: function with arguments `name`, which is a player name
  * Pushes the specified media file to client(s) as detailed below.
    The file must be a supported image, sound or model format.
    Dynamically added media is not persisted between server restarts.
  * Returns false on error, true if the request was accepted
  * The given callback will be called for every player as soon as the
    media is available on the client.
  * Details/Notes:
    * If `ephemeral`=false and `to_player` is unset the file is added to the media
      sent to clients on startup, this means the media will appear even on
      old clients (<5.3.0) if they rejoin the server.
    * If `ephemeral`=false the file must not be modified, deleted, moved or
      renamed after calling this function. This is allowed otherwise.
    * Adding media files with the same name twice is not possible.
      An exception to this is the use of `to_player` to send the same,
      already existent file to multiple chosen players (`ephemeral`=false only).
    * You can also call this at startup time. In that case `callback` MUST
      be `nil` and you cannot use `ephemeral` or `to_player`, as these logically
      do not make sense.
  * Clients will attempt to fetch files added this way via remote media,
    this can make transfer of bigger files painless (if set up).

## IPC

The engine provides a generalized mechanism to enable sharing data between the
different Lua environments (main, mapgen and async).
It is essentially a shared in-memory key-value store.

* `core.ipc_get(key)`:
  * Read a value from the shared data area.
  * `key`: string, should use the `"modname:thing"` convention to avoid conflicts.
  * returns an arbitrary Lua value, or `nil` if this key does not exist
* `core.ipc_set(key, value)`:
  * Write a value to the shared data area.
  * `key`: as above
  * `value`: an arbitrary Lua value, cannot be or contain userdata.

Interacting with the shared data will perform an operation comparable to
(de)serialization on each access.
For that reason modifying references will not have any effect, as in this example:

```lua
core.ipc_set("test:foo", {})
core.ipc_get("test:foo").subkey = "value" -- WRONG!
core.ipc_get("test:foo") -- returns an empty table
```

**Advanced**:

* `core.ipc_cas(key, old_value, new_value)`:
  * Write a value to the shared data area, but only if the previous value
    equals what was given.
    This operation is called Compare-and-Swap and can be used to implement
    synchronization between threads.
  * `key`: as above
  * `old_value`: value compared to using `==` (`nil` compares equal for non-existing keys)
  * `new_value`: value that will be set
  * returns: true on success, false otherwise
* `core.ipc_poll(key, timeout)`:
  * Do a blocking wait until a value (other than `nil`) is present at the key.
  * **IMPORTANT**: You usually don't need this function. Use this as a last resort
    if nothing else can satisfy your use case! None of the Lua environments the
    engine has are safe to block for extended periods, especially on the main
    thread any delays directly translate to lag felt by players.
  * `key`: as above
  * `timeout`: maximum wait time, in milliseconds (positive values only)
  * returns: true on success, false on timeout

## Bans

* `core.get_ban_list()`: returns a list of all bans formatted as string
* `core.get_ban_description(ip_or_name)`: returns list of bans matching
  IP address or name formatted as string
* `core.ban_player(name)`: ban the IP of a currently connected player
  * Returns boolean indicating success
* `core.unban_player_or_ip(ip_or_name)`: remove ban record matching
  IP address or name
* `core.kick_player(name[, reason[, reconnect]])`: disconnect a player with an optional
  reason.
  * Returns boolean indicating success (false if player nonexistent)
  * If `reconnect` is true, allow the user to reconnect.
* `core.disconnect_player(name[, reason[, reconnect]])`: disconnect a player with an
  optional reason, this will not prefix with 'Kicked: ' like kick\_player.
  If no reason is given, it will default to 'Disconnected.'
  * Returns boolean indicating success (false if player nonexistent)

## Particles

* `core.add_particle(particle definition)`
  * Spawn a single particle
  * Deprecated: `core.add_particle(pos, velocity, acceleration,
    expirationtime, size, collisiondetection, texture, playername)`

* `core.add_particlespawner(particlespawner definition)`
  * Add a `ParticleSpawner`, an object that spawns an amount of particles
    over `time` seconds.
  * Returns an `id`, and -1 if adding didn't succeed
  * Deprecated: `core.add_particlespawner(amount, time,
    minpos, maxpos,
    minvel, maxvel,
    minacc, maxacc,
    minexptime, maxexptime,
    minsize, maxsize,
    collisiondetection, texture, playername)`

* `core.delete_particlespawner(id, player)`
  * Delete `ParticleSpawner` with `id` (return value from
    `core.add_particlespawner`).
  * If playername is specified, only deletes on the player's client,
    otherwise on all clients.

## Schematics

* `core.create_schematic(p1, p2, probability_list, filename, slice_prob_list)`
  * Create a schematic from the volume of map specified by the box formed by
    p1 and p2.
  * Apply the specified probability and per-node force-place to the specified
    nodes according to the `probability_list`.
    * `probability_list` is an array of tables containing two fields, `pos`
      and `prob`.
      * `pos` is the 3D vector specifying the absolute coordinates of the
        node being modified,
      * `prob` is an integer value from `0` to `255` that encodes
        probability and per-node force-place. Probability has levels
        0-127, then 128 may be added to encode per-node force-place.
        For probability stated as 0-255, divide by 2 and round down to
        get values 0-127, then add 128 to apply per-node force-place.
      * If there are two or more entries with the same pos value, the
        last entry is used.
      * If `pos` is not inside the box formed by `p1` and `p2`, it is
        ignored.
      * If `probability_list` equals `nil`, no probabilities are applied.
  * Apply the specified probability to the specified horizontal slices
    according to the `slice_prob_list`.
    * `slice_prob_list` is an array of tables containing two fields, `ypos`
      and `prob`.
      * `ypos` indicates the y position of the slice with a probability
        applied, the lowest slice being `ypos = 0`.
      * If slice probability list equals `nil`, no slice probabilities
        are applied.
  * Saves schematic in the Luanti Schematic format to filename.

* `core.place_schematic(pos, schematic, rotation, replacements, force_placement, flags)`
  * Place the schematic specified by schematic (see [Schematic specifier](#schematic-specifier)) at
    `pos`.
  * `rotation` can equal `"0"`, `"90"`, `"180"`, `"270"`, or `"random"`.
  * If the `rotation` parameter is omitted, the schematic is not rotated.
  * `replacements` = `{["old_name"] = "convert_to", ...}`
  * `force_placement` is a boolean indicating whether nodes other than `air`
    and `ignore` are replaced by the schematic.
  * Returns nil if the schematic could not be loaded.
  * **Warning**: Once you have loaded a schematic from a file, it will be
    cached. Future calls will always use the cached version and the
    replacement list defined for it, regardless of whether the file or the
    replacement list parameter have changed. The only way to load the file
    anew is to restart the server.
  * `flags` is a flag field with the available flags:
    * place\_center\_x
    * place\_center\_y
    * place\_center\_z

* `core.place_schematic_on_vmanip(vmanip, pos, schematic, rotation, replacement, force_placement, flags)`:
  * This function is analogous to core.place\_schematic, but places a
    schematic onto the specified VoxelManip object `vmanip` instead of the
    map.
  * Returns false if any part of the schematic was cut-off due to the
    VoxelManip not containing the full area required, and true if the whole
    schematic was able to fit.
  * Returns nil if the schematic could not be loaded.
  * After execution, any external copies of the VoxelManip contents are
    invalidated.
  * `flags` is a flag field with the available flags:
    * place\_center\_x
    * place\_center\_y
    * place\_center\_z

* `core.serialize_schematic(schematic, format, options)`
  * Return the serialized schematic specified by schematic
    (see [Schematic specifier](#schematic-specifier))
  * in the `format` of either "mts" or "lua".
  * "mts" - a string containing the binary MTS data used in the MTS file
    format.
  * "lua" - a string containing Lua code representing the schematic in table
    format.
  * `options` is a table containing the following optional parameters:
    * If `lua_use_comments` is true and `format` is "lua", the Lua code
      generated will have (X, Z) position comments for every X row
      generated in the schematic data for easier reading.
    * If `lua_num_indent_spaces` is a nonzero number and `format` is "lua",
      the Lua code generated will use that number of spaces as indentation
      instead of a tab character.

* `core.read_schematic(schematic, options)`
  * Returns a Lua table representing the schematic (see: [Schematic specifier](#schematic-specifier))
  * `schematic` is the schematic to read (see: [Schematic specifier](#schematic-specifier))
  * `options` is a table containing the following optional parameters:
    * `write_yslice_prob`: string value:
      * `none`: no `write_yslice_prob` table is inserted,
      * `low`: only probabilities that are not 254 or 255 are written in
        the `write_ylisce_prob` table,
      * `all`: write all probabilities to the `write_yslice_prob` table.
      * The default for this option is `all`.
      * Any invalid value will be interpreted as `all`.

## HTTP Requests

* `core.request_http_api()`:
  * returns `HTTPApiTable` containing http functions if the calling mod has
    been granted access by being listed in the `secure.http_mods` or
    `secure.trusted_mods` setting, otherwise returns `nil`.
  * The returned table contains the functions `fetch`, `fetch_async` and
    `fetch_async_get` described below.
  * Only works at init time and must be called from the mod's main scope
    (not from a function).
  * Function only exists if Luanti server was built with cURL support.
  * **DO NOT ALLOW ANY OTHER MODS TO ACCESS THE RETURNED TABLE, STORE IT IN
    A LOCAL VARIABLE!**
* `HTTPApiTable.fetch(HTTPRequest req, callback)`
  * Performs given request asynchronously and calls callback upon completion
  * callback: `function(HTTPRequestResult res)`
  * Use this HTTP function if you are unsure, the others are for advanced use
* `HTTPApiTable.fetch_async(HTTPRequest req)`: returns handle
  * Performs given request asynchronously and returns handle for
    `HTTPApiTable.fetch_async_get`
* `HTTPApiTable.fetch_async_get(handle)`: returns HTTPRequestResult
  * Return response data for given asynchronous HTTP request

## Storage API

* `core.get_mod_storage()`:
  * returns reference to mod private `StorageRef`
  * must be called during mod load time

## Misc.

* `core.get_connected_players()`: returns list of `ObjectRefs`

* `core.is_player(obj)`: boolean, whether `obj` is a player

* `core.player_exists(name)`: boolean, whether player exists
  (regardless of online status)

* `core.is_valid_player_name(name)`: boolean, whether the given name
  could be used as a player name (regardless of whether said player exists).

* `core.hud_replace_builtin(name, hud_definition)`
  * Replaces definition of a builtin hud element
  * `name`: `"breath"`, `"health"`, `"minimap"` or `"hotbar"`
  * `hud_definition`: definition to replace builtin definition

* `core.parse_relative_number(arg, relative_to)`: returns number or nil
  * Helper function for chat commands.
  * For parsing an optionally relative number of a chat command
    parameter, using the chat command tilde notation.
  * `arg`: String snippet containing the number; possible values:
    * `"<number>"`: return as number
    * `"~<number>"`: return `relative_to + <number>`
    * `"~"`: return `relative_to`
    * Anything else will return `nil`
  * `relative_to`: Number to which the `arg` number might be relative to
  * Examples:
    * `core.parse_relative_number("5", 10)` returns 5
    * `core.parse_relative_number("~5", 10)` returns 15
    * `core.parse_relative_number("~", 10)` returns 10

* `core.send_join_message(player_name)`
  * This function can be overridden by mods to change the join message.

* `core.send_leave_message(player_name, timed_out)`
  * This function can be overridden by mods to change the leave message.

* `core.hash_node_position(pos)`: returns a 48-bit integer
  * `pos`: table {x=number, y=number, z=number},
  * Gives a unique numeric encoding for a node position (16+16+16=48bit)
  * Despite the name, this is not a hash function (so it doesn't mix or produce collisions).

* `core.get_position_from_hash(hash)`: returns a position
  * Inverse transform of `core.hash_node_position`

* `core.get_item_group(name, group)`: returns a rating
  * Get rating of a group of an item. (`0` means: not in group)

* `core.get_node_group(name, group)`: returns a rating
  * Deprecated: An alias for the former.

* `core.raillike_group(name)`: returns a rating
  * Returns rating of the connect\_to\_raillike group corresponding to name
  * If name is not yet the name of a connect\_to\_raillike group, a new group
    id is created, with that name.

* `core.get_content_id(name)`: returns an integer
  * Gets the internal content ID of `name`

* `core.get_name_from_content_id(content_id)`: returns a string
  * Gets the name of the content with that content ID

* `core.parse_json(string[, nullvalue, return_error])`: returns something
  * Convert a string containing JSON data into the Lua equivalent
  * `nullvalue`: returned in place of the JSON null; defaults to `nil`
  * On success returns a table, a string, a number, a boolean or `nullvalue`
  * On failure: If `return_error` is not set or is `false`,
    outputs an error message and returns `nil`.
    Otherwise returns `nil, err` (error message).
  * Example: `parse_json("[10, {\"a\":false}]")`, returns `{10, {a = false}}`

* `core.write_json(data[, styled])`: returns a string or `nil` and an error
  message.
  * Convert a Lua table into a JSON string
  * styled: Outputs in a human-readable format if this is set, defaults to
    false.
  * Unserializable things like functions and userdata will cause an error.
  * **Warning**: JSON is more strict than the Lua table format.
    1. You can only use strings and positive integers of at least one as
       keys.
    2. You cannot mix string and integer keys.
       This is due to the fact that JSON has two distinct array and object
       values.
  * Example: `write_json({10, {a = false}})`,
    returns `'[10, {"a": false}]'`

* `core.serialize(table)`: returns a string
  * Convert a value into string form readable by `core.deserialize`.
  * Supports tables, strings, numbers, booleans and `nil`.
  * Support for dumping function bytecode is **deprecated**.
  * Note: To obtain a human-readable representation of a value, use `dump` instead.
  * Example: `serialize({foo="bar"})`, returns `'return { ["foo"] = "bar" }'`

* `core.deserialize(string[, safe])`: returns a table
  * Convert a string returned by `core.serialize` into a table
  * `string` is loaded in an empty sandbox environment.
  * Will load functions if `safe` is `false` or omitted.
    Although these functions cannot directly access the global environment,
    they could bypass this restriction with maliciously crafted Lua bytecode
    if mod security is disabled.
  * Will silently strip functions embedded via calls to `loadstring`
    (typically bytecode dumped by `core.serialize`) if `safe` is `true`.
    You should not rely on this if possible.
    * Example: `core.deserialize("return loadstring('')", true)` will be `nil`.
  * This function should not be used on untrusted data, regardless of the
    value of `safe`. It is fine to serialize then deserialize user-provided
    data, but directly providing user input to deserialize is always unsafe.
  * Example: `deserialize('return { ["foo"] = "bar" }')`,
    returns `{foo="bar"}`
  * Example: `deserialize('print("foo")')`, returns `nil`
    (function call fails), returns
    `error:[string "print("foo")"]:1: attempt to call global 'print' (a nil value)`

* `core.compress(data, method, ...)`: returns `compressed_data`
  * Compress a string of data.
  * `method` is a string identifying the compression method to be used.
  * Supported compression methods:
    * Deflate (zlib): `"deflate"`
    * Zstandard: `"zstd"`
  * `...` indicates method-specific arguments. Currently defined arguments
    are:
    * Deflate: `level` - Compression level, `0`-`9` or `nil`.
    * Zstandard: `level` - Compression level. Integer or `nil`. Default `3`.
      Note any supported Zstandard compression level could be used here,
      but these are subject to change between Zstandard versions.

* `core.decompress(compressed_data, method, ...)`: returns data
  * Decompress a string of data using the algorithm specified by `method`.
  * See documentation on `core.compress()` for supported compression
    methods.
  * `...` indicates method-specific arguments. Currently, no methods use this

* `core.rgba(red, green, blue[, alpha])`: returns a string
  * Each argument is an 8 Bit unsigned integer
  * Returns the ColorString from rgb or rgba values
  * Example: `core.rgba(10, 20, 30, 40)`, returns `"#0A141E28"`

* `core.encode_base64(string)`: returns string encoded in base64
  * Encodes a string in base64.

* `core.decode_base64(string)`: returns string or nil on failure
  * Padding characters are only supported starting at version 5.4.0, where
    5.5.0 and newer perform proper checks.
  * Decodes a string encoded in base64.

* `core.is_protected(pos, name)`: returns boolean
  * Returning `true` restricts the player `name` from modifying (i.e. digging,
    placing) the node at position `pos`.
  * `name` will be `""` for non-players or unknown players.
  * This function should be overridden by protection mods. It is highly
    recommended to grant access to players with the `protection_bypass` privilege.
  * Cache and call the old version of this function if the position is
    not protected by the mod. This will allow using multiple protection mods.
  * Example:
    ```lua
    local old_is_protected = core.is_protected
    function core.is_protected(pos, name)
        if mymod:position_protected_from(pos, name) then
            return true
        end
        return old_is_protected(pos, name)
    end
    ```

* `core.record_protection_violation(pos, name)`
  * This function calls functions registered with
    `core.register_on_protection_violation`.

* `core.is_creative_enabled(name)`: returns boolean
  * Returning `true` means that Creative Mode is enabled for player `name`.
  * `name` will be `""` for non-players or if the player is unknown.
  * This function should be overridden by Creative Mode-related mods to
    implement a per-player Creative Mode.
  * By default, this function returns `true` if the setting
    `creative_mode` is `true` and `false` otherwise.

* `core.is_area_protected(pos1, pos2, player_name, interval)`
  * Returns the position of the first node that `player_name` may not modify
    in the specified cuboid between `pos1` and `pos2`.
  * Returns `false` if no protections were found.
  * Applies `is_protected()` to a 3D lattice of points in the defined volume.
    The points are spaced evenly throughout the volume and have a spacing
    similar to, but no larger than, `interval`.
  * All corners and edges of the defined volume are checked.
  * `interval` defaults to 4.
  * `interval` should be carefully chosen and maximized to avoid an excessive
    number of points being checked.
  * Like `core.is_protected`, this function may be extended or
    overwritten by mods to provide a faster implementation to check the
    cuboid for intersections.

* `core.rotate_and_place(itemstack, placer, pointed_thing[, infinitestacks,
  orient_flags, prevent_after_place])`
  * Attempt to predict the desired orientation of the facedir-capable node
    defined by `itemstack`, and place it accordingly (on-wall, on the floor,
    or hanging from the ceiling).
  * `infinitestacks`: if `true`, the itemstack is not changed. Otherwise the
    stacks are handled normally.
  * `orient_flags`: Optional table containing extra tweaks to the placement code:
    * `invert_wall`:   if `true`, place wall-orientation on the ground and
      ground-orientation on the wall.
    * `force_wall`:    if `true`, always place the node in wall orientation.
    * `force_ceiling`: if `true`, always place on the ceiling.
    * `force_floor`:   if `true`, always place the node on the floor.
    * `force_facedir`: if `true`, forcefully reset the facedir to north
      when placing on the floor or ceiling.
    * The first four options are mutually-exclusive; the last in the list
      takes precedence over the first.
  * `prevent_after_place` is directly passed to `core.item_place_node`
  * Returns the new itemstack after placement

* `core.rotate_node(itemstack, placer, pointed_thing)`
  * calls `rotate_and_place()` with `infinitestacks` set according to the state
    of the creative mode setting, checks for "sneak" to set the `invert_wall`
    parameter and `prevent_after_place` set to `true`.

* `core.calculate_knockback(player, hitter, time_from_last_punch,
  tool_capabilities, dir, distance, damage)`
  * Returns the amount of knockback applied on the punched player.
  * Arguments are equivalent to `register_on_punchplayer`, except the following:
    * `distance`: distance between puncher and punched player
  * This function can be overridden by mods that wish to modify this behavior.
  * You may want to cache and call the old function to allow multiple mods to
    change knockback behavior.

* `core.forceload_block(pos[, transient[, limit]])`
  * forceloads the position `pos`.
  * this means that the mapblock containing `pos` will always be kept in the
    `"active"` state, regardless of nearby players or server settings.
  * returns `true` if area could be forceloaded
  * If `transient` is `false` or absent, the forceload will be persistent
    (saved between server runs). If `true`, the forceload will be transient
    (not saved between server runs).
  * `limit` is an optional limit on the number of blocks that can be
    forceloaded at once. If `limit` is negative, there is no limit. If it is
    absent, the limit is the value of the setting `"max_forceloaded_blocks"`.
    If the call would put the number of blocks over the limit, the call fails.

* `core.forceload_free_block(pos[, transient])`
  * stops forceloading the position `pos`
  * If `transient` is `false` or absent, frees a persistent forceload.
    If `true`, frees a transient forceload.

* `core.compare_block_status(pos, condition)`
  * Checks whether the mapblock at position `pos` is in the wanted condition.
  * `condition` may be one of the following values:
    * `"unknown"`: not in memory
    * `"emerging"`: in the queue for loading from disk or generating
    * `"loaded"`: in memory but inactive (no ABMs are executed)
    * `"active"`: in memory and active
    * Other values are reserved for future functionality extensions
  * Return value, the comparison status:
    * `false`: Mapblock does not fulfill the wanted condition
    * `true`: Mapblock meets the requirement
    * `nil`: Unsupported `condition` value

* `core.request_insecure_environment()`: returns an environment containing
  insecure functions if the calling mod has been listed as trusted in the
  `secure.trusted_mods` setting or security is disabled, otherwise returns
  `nil`.
  * Only works at init time and must be called from the mod's main scope
    (ie: the init.lua of the mod, not from another Lua file or within a function).
  * **DO NOT ALLOW ANY OTHER MODS TO ACCESS THE RETURNED ENVIRONMENT, STORE
    IT IN A LOCAL VARIABLE!**

* `core.global_exists(name)`
  * Checks if a global variable has been set, without triggering a warning.

* `core.register_portable_metatable(name, mt)`:
  * Register a metatable that should be preserved when Lua data is transferred
    between environments (via IPC or `handle_async`).
  * `name` is a string that identifies the metatable. It is recommended to
    follow the `modname:name` convention for this identifier.
  * `mt` is the metatable to register.
  * Note that the same metatable can be registered under multiple names,
    but multiple metatables must not be registered under the same name.
  * You must register the metatable in both the main environment
    and the async environment for this mechanism to work.

## Global objects

* `core.env`: `EnvRef` of the server environment and world.
  * Any function in the `core` namespace can be called using the syntax
    `core.env:somefunction(somearguments)`
    instead of `core.somefunction(somearguments)`
  * Deprecated, but support is not to be dropped soon
* `minetest`: alias for the `core` namespace
  * Deprecated, but support is not to be dropped soon

## Global tables

### Registered definition tables

* `core.registered_items`
  * Map of registered items, indexed by name
* `core.registered_nodes`
  * Map of registered node definitions, indexed by name
* `core.registered_craftitems`
  * Map of registered craft item definitions, indexed by name
* `core.registered_tools`
  * Map of registered tool definitions, indexed by name
* `core.registered_entities`
  * Map of registered entity prototypes, indexed by name
  * Values in this table may be modified directly.
    Note: changes to initial properties will only affect entities spawned afterwards,
    as they are only read when spawning.
* `core.objects_by_guid`
  * Map of active object references, indexed by object GUID
* `core.object_refs`
  * **Obsolete:** Use `core.objects_by_guid` instead.
    GUIDs are strictly more useful than active object IDs.
  * Map of active object references, indexed by active object id
* `core.luaentities`
  * Map of Lua entities, indexed by active object id
* `core.registered_abms`
  * List of ABM definitions
* `core.registered_lbms`
  * List of LBM definitions
* `core.registered_aliases`
  * Map of registered aliases, indexed by name
* `core.registered_ores`
  * Map of registered ore definitions, indexed by the `name` field.
  * If `name` is nil, the key is the object handle returned by
    `core.register_ore`.
* `core.registered_biomes`
  * Map of registered biome definitions, indexed by the `name` field.
  * If `name` is nil, the key is the object handle returned by
    `core.register_biome`.
* `core.registered_decorations`
  * Map of registered decoration definitions, indexed by the `name` field.
  * If `name` is nil, the key is the object handle returned by
    `core.register_decoration`.
* `core.registered_chatcommands`
  * Map of registered chat command definitions, indexed by name
* `core.registered_privileges`
  * Map of registered privilege definitions, indexed by name
  * Registered privileges can be modified directly in this table.

### Registered callback tables

All callbacks registered with [Global callback registration functions](#global-callback-registration-functions) are added
to corresponding `core.registered_*` tables.

For historical reasons, the use of an -s suffix in these names is inconsistent.

* `core.registered_on_chat_messages`
* `core.registered_on_chatcommands`
* `core.registered_globalsteps`
* `core.registered_on_punchnodes`
* `core.registered_on_placenodes`
* `core.registered_on_dignodes`
* `core.registered_on_generateds`
* `core.registered_on_newplayers`
* `core.registered_on_dieplayers`
* `core.registered_on_respawnplayers`
* `core.registered_on_prejoinplayers`
* `core.registered_on_joinplayers`
* `core.registered_on_leaveplayers`
* `core.registered_on_player_receive_fields`
* `core.registered_on_cheats`
* `core.registered_on_crafts`
* `core.registered_craft_predicts`
* `core.registered_on_item_eats`
* `core.registered_on_item_pickups`
* `core.registered_on_punchplayers`
* `core.registered_on_authplayers`
* `core.registered_on_player_inventory_actions`
* `core.registered_allow_player_inventory_actions`
* `core.registered_on_rightclickplayers`
* `core.registered_on_mods_loaded`
* `core.registered_on_shutdown`
* `core.registered_on_protection_violation`
* `core.registered_on_priv_grant`
* `core.registered_on_priv_revoke`
* `core.registered_can_bypass_userlimit`
* `core.registered_on_modchannel_message`
* `core.registered_on_liquid_transformed`
* `core.registered_on_mapblocks_changed`
