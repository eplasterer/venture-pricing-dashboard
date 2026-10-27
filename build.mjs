import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "index.html"), resolve(output, "index.html"));
await cp(resolve(root, "styles.css"), resolve(output, "styles.css"));
await cp(resolve(root, "app.js"), resolve(output, "app.js"));
await cp(resolve(root, "competitor_data.json"), resolve(output, "competitor_data.json"));
await writeFile(resolve(output, ".nojekyll"), "");
console.log("Static production build written to dist/.");
