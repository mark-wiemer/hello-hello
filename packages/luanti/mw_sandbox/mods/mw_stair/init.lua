local ____exports = {}
local prefix = "mw_stair"
-- Register stair
local node_type = "stair"
local node_id = prefix .. ":" .. node_type
local node_alias = "Basic stairs"

core.register_node(
    node_id, {
        description = "node_alias",
        tiles = {(prefix .. "_" .. node_type) .. ".png"},
        groups = {default = 1}
    }
)

return ____exports
