/**
 * Calculates the combat level for a player based on their skill levels.
 *
 * Combat level is determined by a base combat level and an offensive combat level:
 * - Base combat level = 0.25 * (defence + hitpoints + floor(0.5 * prayer))
 * - Offensive combat level = max of:
 *   - Melee: attack + strength
 *   - Ranged: floor(1.5 * ranged)
 *   - Magic: floor(1.5 * magic)
 * - Final combat level = floor(base + 0.325 * offensive)
 *
 * All params are skill levels that should be ints between 1 and 120
 * @returns {number} The calculated combat level (int)
 */
function calculateCombatLevel(defence, hitpoints, prayer, attack, strength, ranged, magic) {
  const baseCombatLevel = 0.25 * (defence + hitpoints + Math.floor(0.5 * prayer));

  const meleeCombatLevel = attack + strength;
  const rangedCombatLevel = Math.floor(1.5 * ranged);
  const magicCombatLevel = Math.floor(1.5 * magic);

  const offensiveCombatLevel = Math.max(meleeCombatLevel, rangedCombatLevel, magicCombatLevel);

  return Math.floor(baseCombatLevel + 0.325 * offensiveCombatLevel);
}

export default calculateCombatLevel;
