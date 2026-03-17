import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");
const distIndexPath = resolve(process.cwd(), "dist/index.html");
const manifestPath = resolve(distDir, "manifest.webmanifest");
const serviceWorkerPath = resolve(distDir, "sw.js");
const pwaIconsDir = resolve(distDir, "pwa-icons");

const sourceIcon = resolve(process.cwd(), "assets/images/icon.png");
const sourceMaskableIcon = resolve(process.cwd(), "assets/images/android-icon-foreground.png");
const distIcon = resolve(pwaIconsDir, "icon-1024.png");
const distMaskableIcon = resolve(pwaIconsDir, "icon-maskable-1024.png");

const mobileWebMeta = [
  '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />',
  '<meta name="theme-color" content="#1A1917" />',
  '<meta name="apple-mobile-web-app-capable" content="yes" />',
  '<meta name="mobile-web-app-capable" content="yes" />',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
  '<meta name="apple-mobile-web-app-title" content="ChronoLens" />',
  '<meta name="format-detection" content="telephone=no" />',
].join("\n    ");

const mobileWebStyles = [
  '<style id="chronolens-mobile-web">',
  '  :root {',
  '    --safe-area-bottom: env(safe-area-inset-bottom);',
  '    --safe-area-left: env(safe-area-inset-left);',
  '    --safe-area-right: env(safe-area-inset-right);',
  '    --safe-area-top: env(safe-area-inset-top);',
  '  }',
  '',
  '  html,',
  '  body {',
  '    background: #1A1917;',
  '    overscroll-behavior: none;',
  '    position: fixed;',
  '    overflow: hidden;',
  '    width: 100%;',
  '    height: 100%;',
  '  }',
  '',
  '  body {',
  '    min-height: 100dvh;',
  '    -webkit-tap-highlight-color: transparent;',
  '  }',
  '',
  '  #root {',
  '    min-height: 100dvh;',
  '    padding-bottom: var(--safe-area-bottom);',
  '  }',
  '</style>',
].join("\n    ");

const pwaMeta = [
  '<link rel="manifest" href="./manifest.webmanifest" />',
  '<link rel="apple-touch-icon" href="./pwa-icons/icon-1024.png" />',
].join("\n    ");

const pwaRegistrationScript = [
  '<script id="chronolens-sw-register">',
  '  if ("serviceWorker" in navigator) {',
  '    window.addEventListener("load", () => {',
  '      navigator.serviceWorker.register("./sw.js").catch((error) => {',
  '        console.warn("Service worker registration failed", error);',
  '      });',
  '    });',
  '  }',
  '</script>',
].join("\n  ");

const manifest = {
  name: "ChronoLens",
  short_name: "ChronoLens",
  description: "ChronoLens helps preserve, explore, and archive photo memories through time.",
  start_url: ".",
  scope: ".",
  display: "standalone",
  orientation: "portrait",
  theme_color: "#1A1917",
  background_color: "#1A1917",
  icons: [
    {
      src: "./pwa-icons/icon-1024.png",
      sizes: "1024x1024",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "./pwa-icons/icon-1024.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "./pwa-icons/icon-maskable-1024.png",
      sizes: "1024x1024",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "./pwa-icons/icon-maskable-1024.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};

const serviceWorker = `const CACHE_NAME = "chronolens-static-v1";
const PRECACHE_URLS = ["./", "./index.html", "./manifest.webmanifest", "./favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => Promise.resolve()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isStaticAsset =
    requestUrl.pathname.startsWith("/_expo/") ||
    /\\.(?:js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2?)$/i.test(requestUrl.pathname);

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", cloned));
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match("./index.html");
          return cachedPage || Response.error();
        }),
    );
    return;
  }

  if (isSameOrigin && isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
            }
            return response;
          })
          .catch(() => cached);

        return cached || networkFetch;
      }),
    );
    return;
  }

  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
`;

const source = readFileSync(distIndexPath, "utf8");
const updated = source
  .replace('href="/favicon.ico"', 'href="./favicon.ico"')
  .replaceAll('src="/_expo/', 'src="./_expo/')
  .replaceAll('href="/_expo/', 'href="./_expo/')
  .replace(
    '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />',
    mobileWebMeta,
  )
  .replace('</style>', '</style>\n    ' + mobileWebStyles)
  .replace('</head>', `    ${pwaMeta}\n</head>`)
  .replace('</body>', `  ${pwaRegistrationScript}\n</body>`);

mkdirSync(pwaIconsDir, { recursive: true });
copyFileSync(sourceIcon, distIcon);
copyFileSync(sourceMaskableIcon, distMaskableIcon);

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
writeFileSync(serviceWorkerPath, serviceWorker, "utf8");

if (updated !== source) {
  writeFileSync(distIndexPath, updated, "utf8");
  console.log("postbuild-web: patched dist/index.html and generated PWA artifacts");
} else {
  console.log("postbuild-web: generated PWA artifacts (no index changes needed)");
}
