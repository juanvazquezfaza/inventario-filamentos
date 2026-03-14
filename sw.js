
const CACHE = "filamentos-definitivo-v3";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./","./index.html","./styles.css","./app.js","./data/config.json","./data/inventario.json"])));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
