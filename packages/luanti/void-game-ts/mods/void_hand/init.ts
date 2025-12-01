import type {} from "@mark-wiemer/luanti-api";

core.register_item(":", {
  type: "none",
  wield_image: "void_hand_hand.png",
  wield_scale: { x: 0.5, y: 1, z: 4 },
  tool_capabilities: { groupcaps: { default: { times: [0] } } },
});
