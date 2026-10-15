local ____exports = {}
local prefix = "mw_stair"

-- Register stair node
local node_type = "stair"
local node_id = prefix .. ":" .. node_type
local node_name = "Basic stairs"
core.register_node(
    node_id, {
        description = node_name,
        tiles = {(prefix .. "_" .. node_type) .. ".png"},
        groups = {default = 1}
    }
)

-- Register stair crafting recipe
local stair_ingredient = "mw_minimal:stone"
core.register_craft({
    output = node_id .. " 4",
    recipe = {
        {stair_ingredient, "",             },
        {stair_ingredient, stair_ingredient},
    }
})

return ____exports
