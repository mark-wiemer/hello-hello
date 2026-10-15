//#region Header
// Prepares the game for playing.
// Copy the `mods` folder and the `game.conf` file into a cleaned `dist` folder.
// Copies that `dist` folder into a cleaned game folder in the default Luanti location.
//#endregion Header

import { cpSync, mkdirSync, copyFileSync, rmSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const root = process.cwd();
const mods = join(root, "mods");
const dist = join(root, "dist");
const gameName = "mw_sandbox"
const destination = join(homedir(), ".var", "app", "org.luanti.luanti", ".minetest", "games", gameName);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(mods, join(dist, "mods"), { recursive: true });
copyFileSync(join(root, "game.conf"), join(dist, "game.conf"));
copyFileSync(join(root, "readme.md"), join(dist, "readme.md"));

rmSync(destination, { recursive: true, force: true });
cpSync(dist, destination, { recursive: true });
