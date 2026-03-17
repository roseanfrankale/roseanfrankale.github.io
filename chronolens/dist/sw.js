const CACHE_NAME = "chronolens-static-v1";
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
    /\.(?:js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2?)$/i.test(requestUrl.pathname);

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
