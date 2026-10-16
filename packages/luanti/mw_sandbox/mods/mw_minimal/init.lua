local prefix = "mw_minimal"

-- Register blocks
local node_types = {"stone", "water_source", "river_water_source"}
for _, node_type in ipairs(node_types) do
    local node_name = prefix .. ":" .. node_type
    local mapgen_name = "mapgen_" .. node_type
    core.register_node(
        node_name,
        {
            description = mapgen_name,
            tiles = {(prefix .. "_" .. node_type) .. ".png"},
            groups = {default = 1}
        }
    )
    core.register_alias(mapgen_name, node_name)
end

-- Register hand
-- Roughly Minecraft dimensions (x = 0.5, y = 1, z = 4)
core.register_item(":", {type = "none", wield_image = prefix .. "_hand.png", wield_scale = {x = 0.5, y = 1, z = 4}, tool_capabilities = {groupcaps = {default = {times = {0}}}}})
