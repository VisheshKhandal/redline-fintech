const CACHE = "redline-public-v1";
const PUBLIC = ["/offline.html", "/favicon.svg", "/favicon-32x32.png", "/apple-touch-icon.png", "/icons/redline-mark.svg", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/icon-maskable-512.png"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PUBLIC)));
  // Activate on the next navigation, so an update does not interrupt a session.
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("redline-public-") && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("/offline.html")));
    return;
  }
  // Exact, query-free public asset allowlist. No RSC, API, HTML or billing cache.
  if (!url.search && PUBLIC.includes(url.pathname)) {
    event.respondWith(caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const response = await fetch(event.request);
      if (response.ok && response.type === "basic") await cache.put(event.request, response.clone());
      return response;
    }));
  }
});
