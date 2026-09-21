//#region Header
// Prepares the game for playing.
// Copy the `mods` folder and the `game.conf` file into a `dist` folder.
// Copies that `dist` folder into a game folder in the default Luanti location.
//#endregion Header

import { cpSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const root = process.cwd();
const mods = join(root, "mods");
const dist = join(root, "dist");
const gameName = "mw-sandbox"
const destination = join(homedir(), ".var", "app", "org.luanti.luanti", ".minetest", "games", gameName);

mkdirSync(dist, { recursive: true });
cpSync(mods, dist, { recursive: true });
copyFileSync(join(root, "game.conf"), join(dist, "game.conf"));

cpSync(dist, destination, { recursive: true });
