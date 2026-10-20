/* MAMLKAT AL-OTOR — GitHub Pages PWA shell */
"use strict";
const CACHE_NAME = "mamlakat-al-otor-shell-v9";
const BASE_PATH = new URL("./", self.location.href).pathname;
const SHELL_URLS = [
  BASE_PATH,
  BASE_PATH + "index.html",
  BASE_PATH + "manifest.webmanifest",
  BASE_PATH + "theme-persistence.js?v=20261020-theme-persist1",
  BASE_PATH + "assets/images/app-icon-192.png",
  BASE_PATH + "assets/images/app-icon-512.png"
];
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL_URLS);
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
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(BASE_PATH + "index.html", response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match(BASE_PATH + "index.html")) || (await caches.match(BASE_PATH));
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === "basic") {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      return new Response("", {status: 503, statusText: "Offline"});
    }
  })());
});
