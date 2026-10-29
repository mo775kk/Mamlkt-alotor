/* MAMLKAT AL-OTOR — GitHub Pages PWA shell */
"use strict";
const CACHE_NAME = "mamlakat-al-otor-shell-v106-20261029-galaxy";
const BASE_PATH = new URL("./", self.location.href).pathname;
const SHELL_URLS = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "royal-rebirth.css?v=20261029-galaxy-01",
  BASE_PATH + "theme-persistence.js?v=20261029-admin-clean-01",
  BASE_PATH + "assets/js/site-catalog.bundle.js?v=20261029-admin-clean-01",
  BASE_PATH + "assets/js/site-admin.bundle.js?v=20261029-admin-clean-01",
  BASE_PATH + "assets/js/site-experience.bundle.js?v=20261029-admin-clean-01",
  BASE_PATH + "assets/js/site-sections.bundle.js?v=20261029-admin-clean-01",
  BASE_PATH + "assets/js/site-cloud.bundle.js?v=20261029-admin-clean-01",
  BASE_PATH + "assets/js/site-customer-tools.js?v=20261029-admin-clean-01",
  BASE_PATH + "assets/js/palette-studio.js?v=20261029-palette-studio-04",
  BASE_PATH + "oil-voice-guide.js?v=20261029-admin-clean-01",
  BASE_PATH + "manifest.webmanifest?v=20261028-design-05-clean",
  BASE_PATH + "data/products.json",
  BASE_PATH + "oil-catalog-public.json",
  BASE_PATH + "assets/images/app-icon-192.png",
  BASE_PATH + "assets/images/app-icon-512.png",
  BASE_PATH + "assets/images/app-icon-192.svg",
  BASE_PATH + "assets/images/app-icon-512.svg"
];
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try { await cache.addAll(SHELL_URLS); } catch (error) { console.warn("Some shell files could not be cached:", error); }
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith("mamlakat-al-otor-shell-") && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE_PATH)) return;
  event.respondWith((async () => {
    const isNavigation = request.mode === "navigate";
    try {
      // Network-first prevents old CSS/JS/HTML from hiding newly published changes.
      const response = await fetch(request, { cache: "no-cache" });
      if (response && response.ok && response.type === "basic") {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
        if (isNavigation) await cache.put(BASE_PATH + "index.html", response.clone());
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request) ||
        (isNavigation ? await caches.match(BASE_PATH + "index.html") : null) ||
        (isNavigation ? await caches.match(BASE_PATH) : null);
      if (cached) return cached;
      return new Response("غير متصل بالإنترنت. افتح الموقع مرة أخرى عند توفر الاتصال.", {
        status: 503,
        statusText: "Offline",
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  })());
});
