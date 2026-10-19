/* MAMLKAT AL-OTOR PWA service worker — resilient update strategy */
const CACHE_NAME = "mamlakat-al-otor-shell-v27-unified";
const BASE_PATH = new URL("./", self.location.href).pathname;
const APP_SHELL = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "manifest.webmanifest"
];
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Optional shell entries must never prevent the service worker from installing.
    await Promise.all(APP_SHELL.map(async url => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (response && response.ok) await cache.put(url, response);
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("mamlakat-al-otor-") && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith(BASE_PATH)) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request, { cache: "no-store" });
      if (response && response.ok && response.type === "basic") {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      return (await caches.match(request)) || (url.pathname.endsWith("/") ? (await caches.match(BASE_PATH + "index.html")) : null) || Response.error();
    }
  })());
});
