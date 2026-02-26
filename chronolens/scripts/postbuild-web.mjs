import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const distIndexPath = resolve(process.cwd(), "dist/index.html");

const source = readFileSync(distIndexPath, "utf8");
const updated = source
  .replace('href="/favicon.ico"', 'href="./favicon.ico"')
  .replaceAll('src="/_expo/', 'src="./_expo/')
  .replaceAll('href="/_expo/', 'href="./_expo/');

if (updated !== source) {
  writeFileSync(distIndexPath, updated, "utf8");
  console.log("postbuild-web: patched dist/index.html for subpath-safe asset URLs");
} else {
  console.log("postbuild-web: no changes needed");
}
