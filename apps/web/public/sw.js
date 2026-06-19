// Jednoduchý service worker pre DAKA Hlas (PWA – inštalovateľnosť + offline shell).
const CACHE = "daka-hlas-v1";
const BASE = "/Plaud";
const PRECACHE = [`${BASE}/`, `${BASE}/login/`, `${BASE}/nahravky/`];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  // network-first, fallback do cache (a do cache ukladáme úspešné odpovede)
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => undefined);
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match(`${BASE}/`))),
  );
});
