/* MAMLKAT AL-OTOR — GitHub Pages PWA shell */
"use strict";
const CACHE_NAME = "mamlakat-al-otor-shell-v57-20261023-image-resilience";
const BASE_PATH = new URL("./", self.location.href).pathname;
const SHELL_URLS = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "manifest.webmanifest?v=20261022-no-gold2",
  BASE_PATH + "site-unified.css?v=20261023-realistic-catalog-v2",
  BASE_PATH + "theme-persistence.js?v=20261022-premium-v5",
  BASE_PATH + "ai-service.js?v=20261016-ai-bridge1",
  BASE_PATH + "app.js?v=20261023-realistic-catalog-v2",
  BASE_PATH + "oil-voice-guide.js?v=20261021-oil-mentor2",
  BASE_PATH + "royal-gold-gate.js?v=20261017-gold-gate1",
  BASE_PATH + "reference-library.js?v=20261020-settings-only3",
  BASE_PATH + "settings.js?v=20261023-editorial-v1",
  BASE_PATH + "mamlaka-full-editor.js?v=20261020-live-single-source1",
  BASE_PATH + "enhancements.js?v=20261015-voice-guide1",
  BASE_PATH + "supplier-catalog.js?v=20261014-public-oils1",
  BASE_PATH + "catalog-editor.js?v=20261019-current-blend-prices1",
  BASE_PATH + "site-upgrades.js?v=20261016-note-coverage3",
  BASE_PATH + "royal-gift-planner.js?v=20261015-gift1",
  BASE_PATH + "inventory-accounting.js?v=20261015-json-restore1",
  BASE_PATH + "royal-interactions.js?v=20261017-static-home1",
  BASE_PATH + "royal-finish.js?v=20261020-css-single-source2",
  BASE_PATH + "section-folds.js?v=20261020-index-always-open1",
  BASE_PATH + "blending-atelier.js?v=20261019-current-blend-prices1",
  BASE_PATH + "section-pages.js?v=20261022-layout2",
  BASE_PATH + "supabase-config.js?v=20261022-cloud2",
  BASE_PATH + "supabase-cloud.js?v=20261022-unified-v4",
  BASE_PATH + "data/products.json",
  BASE_PATH + "oil-catalog-public.json",
  BASE_PATH + "assets/images/app-icon-192.png",
  BASE_PATH + "assets/images/app-icon-512.png"
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
