import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const distIndexPath = resolve(process.cwd(), "dist/index.html");

const mobileWebMeta = [
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />',
  '<meta name="theme-color" content="#1A1917" />',
  '<meta name="apple-mobile-web-app-capable" content="yes" />',
  '<meta name="mobile-web-app-capable" content="yes" />',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
  '<meta name="apple-mobile-web-app-title" content="ChronoLens" />',
  '<meta name="format-detection" content="telephone=no" />',
].join("\n    ");

const mobileWebStyles = [
  '<style id="chronolens-mobile-web">',
  '  html,',
  '  body {',
  '    background: #1A1917;',
  '    overscroll-behavior: none;',
  '  }',
  '',
  '  body {',
  '    min-height: 100dvh;',
  '    -webkit-tap-highlight-color: transparent;',
  '  }',
  '',
  '  #root {',
  '    min-height: 100dvh;',
  '  }',
  '</style>',
].join("\n    ");

const source = readFileSync(distIndexPath, "utf8");
const updated = source
  .replace('href="/favicon.ico"', 'href="./favicon.ico"')
  .replaceAll('src="/_expo/', 'src="./_expo/')
  .replaceAll('href="/_expo/', 'href="./_expo/')
  .replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />',
    mobileWebMeta,
  )
  .replace('</style>', '</style>\n    ' + mobileWebStyles);

if (updated !== source) {
  writeFileSync(distIndexPath, updated, "utf8");
  console.log("postbuild-web: patched dist/index.html for web deployment metadata and asset URLs");
} else {
  console.log("postbuild-web: no changes needed");
}
