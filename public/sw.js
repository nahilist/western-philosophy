const CACHE_VERSION = "v1";
const OFFLINE_CACHE = `philosophy-offline-${CACHE_VERSION}`;
const PAGE_CACHE = `philosophy-pages-${CACHE_VERSION}`;
const ASSET_CACHE = `philosophy-assets-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline";
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(OFFLINE_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("philosophy-") && ![OFFLINE_CACHE, PAGE_CACHE, ASSET_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      caches.open(PAGE_CACHE).then(async (cache) => {
        try {
          const response = await fetch(request);
          if (response.ok && !url.pathname.startsWith("/account")) {
            await cache.put(request, response.clone());
          }
          return response;
        } catch {
          return (await cache.match(request)) || (await caches.match(OFFLINE_URL));
        }
      }),
    );
    return;
  }

  if (["image", "font"].includes(request.destination)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const fresh = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || fresh;
      }),
    );
  }
});
