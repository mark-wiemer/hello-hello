local ____exports = {}
local prefix = "minimal"
-- Register blocks
local node_types = {"stone", "water_source", "river_water_source"}
for ____, node_type in ipairs(node_types) do
    local node_name = "minimal" .. ":" .. node_type
    core.register_node(node_name, {description = ("Essential node for mapgen alias \"mapgen_" .. node_type) .. "\"", tiles = {(prefix .. "_" .. node_type) .. ".png"}, groups = {default = 1}})
    core.register_alias("mapgen_" .. node_type, node_name)
end
-- Register hand
-- Roughly Minecraft dimensions (x = 0.5, y = 1, z = 4)
core.register_item(":", {type = "none", wield_image = prefix .. "_hand.png", wield_scale = {x = 0.5, y = 1, z = 4}, tool_capabilities = {groupcaps = {default = {times = {0}}}}})
return ____exports
