/* MAMLKAT AL-OTOR PWA service worker
 * Keep HTML network-first so visitors receive storefront updates.
 * Cache successful same-origin static assets for offline revisits.
 */
const CACHE_NAME = "mamlakat-al-otor-shell-v26-live-assets";
const BASE_PATH = new URL("./", self.location.href).pathname;
const APP_SHELL = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "manifest.webmanifest",
  BASE_PATH + "assets/images/app-icon-192.svg",
  BASE_PATH + "assets/images/app-icon-512.svg",
  BASE_PATH + "assets/images/app-icon-192.png",
  BASE_PATH + "assets/images/app-icon-512.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("mamlakat-al-otor-") && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(BASE_PATH + "index.html", response.clone()));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match(BASE_PATH + "index.html")) || Response.error()));
    return;
  }
  if (url.pathname.startsWith(BASE_PATH)) {
      const isCodeOrStyle = /\.(?:js|css)$/i.test(url.pathname);
    event.respondWith((async () => {
      if (isCodeOrStyle) {
        try {
          const fresh = await fetch(request, { cache: "no-store" });
          if (fresh && fresh.ok && fresh.type === "basic") {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(request, fresh.clone());
          }
          return fresh;
        } catch (error) {
          return (await caches.match(request)) || Response.error();
        }
      }
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok && fresh.type === "basic") caches.open(CACHE_NAME).then(cache => cache.put(request, fresh.clone()));
        return fresh;
      } catch (error) {
        return Response.error();
      }
    })());
  }
});
