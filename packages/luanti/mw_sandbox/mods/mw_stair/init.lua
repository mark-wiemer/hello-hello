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
        -- https://github.com/mark-wiemer/hello-hello/issues/155
        on_place = function(itemstack, placer, pointed_thing)
            local param2 = 0
            local look_yaw_rad = placer:get_look_horizontal()
            local look_yaw_deg = look_yaw_rad / 3.14159 * 180
            -- primary cardinal direction
            -- 0 = north, [315, 45)
            -- 1 = west, [45, 135)
            -- 2 = south, [135, 225)
            -- 3 = east, [225, 315)
            local look_yaw_norm = math.floor((look_yaw_deg + 45) / 90) % 4
            -- invert odd numbers for Luanti engine (unclear why)
            if (look_yaw_norm % 2 == 0) then
                param2 = look_yaw_norm
            else
                param2 = 4 - look_yaw_norm
            end
			return core.item_place(itemstack, placer, pointed_thing, param2)
		end,
        paramtype2 = "facedir",
        tiles = {node_tile},
    }
)

-- Register stair crafting recipes
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
