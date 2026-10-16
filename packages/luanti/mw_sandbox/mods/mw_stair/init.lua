local ____exports = {}
local prefix = "mw_stair"

-- Returns a `facedir` in [0, 1, 2, 3] that matches
-- the provided value, assuming its a yaw in radians in [0, 2*pi)
local function yaw_rad_facedir(yaw_rad)
    local facedir = 0
    local pi = 3.14159265
    -- [0, 360)
    local look_yaw_deg = yaw_rad / pi * 180
    -- primary cardinal direction [0, 1, 2, 3]
    -- 0 = north, [315, 360), [0, 45)
    -- 1 = west, [45, 135)
    -- 2 = south, [135, 225)
    -- 3 = east, [225, 315)
    local look_yaw_norm = math.floor((look_yaw_deg + 45) / 90) % 4
    -- facedir increases clockwise, yaw increases counterclockwise
    facedir = (4 - look_yaw_norm) % 4
    return facedir
end

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
        -- Rotates stair actually based on look yaw, not positions
        -- (https://github.com/mark-wiemer/hello-hello/issues/155).
        -- Stair is facing toward player (player moving north can climb north-facing stair).
        -- All stairs are currently upright.
        on_place = function(itemstack, placer, pointed_thing)
            -- [0, 2*pi)
            local look_yaw_rad = placer:get_look_horizontal()
            -- facedir value for Luanti
            local param2 = yaw_rad_facedir(look_yaw_rad)
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
