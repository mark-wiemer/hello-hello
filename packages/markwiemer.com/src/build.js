import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import process from "process";

// turn this from npm script into javascript
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRootDir = path.join(__dirname, "..", "pages");
const blogDir = path.join(projectRootDir, "blog");
const projectDirs = [blogDir];

try {
  for (let dir of projectDirs) {
    console.log(`Building ${dir}`);
    process.chdir(dir);
    execSync("npm install", { stdio: "inherit" });
    execSync("npm run build", { stdio: "inherit" });
  }
  console.log("Site build complete");
} catch (err) {
  console.error("Build failed:", err);
  process.exit(1);
}
