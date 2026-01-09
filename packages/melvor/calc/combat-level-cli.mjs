import calculateCombatLevel from "./combat-level.mjs";

const SKILL_NAMES = ["attack", "strength", "defence", "ranged", "magic", "prayer", "hitpoints"];

function parseArgs(args) {
  if (args.length < SKILL_NAMES.length) {
    throw new Error(`Expected ${SKILL_NAMES.length} skill levels: ${SKILL_NAMES.join(" ")}`);
  }
  return args.slice(0, SKILL_NAMES.length).map((arg, i) => {
    const num = parseInt(arg, 10);
    if (isNaN(num) || num < 1 || num > 120) {
      throw new Error(`Skill ${SKILL_NAMES[i]} must be an integer between 1 and 120, got: ${arg}`);
    }
    return num;
  });
}

function main(args) {
  try {
    const skillLevels = parseArgs(args);
    const [attack, strength, defence, ranged, magic, prayer, hitpoints] = skillLevels;
    const combatLevel = calculateCombatLevel(
      defence,
      hitpoints,
      prayer,
      attack,
      strength,
      ranged,
      magic,
    );
    console.log(`Combat Level: ${combatLevel}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main(process.argv.slice(2));
