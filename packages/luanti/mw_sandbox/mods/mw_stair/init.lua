local ____exports = {}
local prefix = "mw_stair"

-- Register stair node
local node_type = "stair"
local node_id = prefix .. ":" .. node_type
local node_tile = prefix .. "_" .. node_type .. ".png"
local node_name = "Basic stairs"
core.register_node(
    node_id,
    {
        description = node_name,
        drawtype = "nodebox",
        groups = {default = 1},
        node_box = {
			type = "fixed",
			fixed = {
                -- {x1, y1, z1, x2, y2, z2}
                -- Default: {-0.5, -0.5, -0.5, 0.5, 0.5, 0.5},
				{-0.5, -0.5, -0.5, 0.5, 0.0, 0.5}, -- Bottom half
				{-0.5, 0.0, 0.0, 0.5, 0.5, 0.5}, -- Top quarter (north present, south missing)
			},
		},
        paramtype2 = "facedir",
        tiles = {node_tile},
    }
)

-- Register stair crafting recipe
local stair_ingredient = "mw_minimal:stone"
local craft_output = node_id .. " 4"
core.register_craft({
    output = craft_output,
    recipe = {
        {stair_ingredient, "",},
        {stair_ingredient, stair_ingredient},
    }
})
core.register_craft({
    output = craft_output,
    recipe = {
        {"",               stair_ingredient},
        {stair_ingredient, stair_ingredient},
    }
})

return ____exports
