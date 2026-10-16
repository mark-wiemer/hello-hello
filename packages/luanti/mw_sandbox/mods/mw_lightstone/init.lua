local prefix = "mw_lightstone"
local node_name = "Lightstone"
local node_local_id = "lightstone"
local node_id = prefix .. ":" .. node_local_id
local node_tile = prefix .. "_" .. node_local_id .. ".png"

-- Register block
core.register_node(
    node_id,
    {
        description = node_name,
        groups = {default = 1},
        light_source = core.LIGHT_MAX,
        tiles = {node_tile},
    }
)

-- Register crafting recipes
local stone_id = "mw_minimal:stone"
core.register_craft({
    output = node_id,
    recipe = {
        {stone_id},
    }
})
core.register_craft({
    output = stone_id,
    recipe = {
        {node_id},
    }
})
