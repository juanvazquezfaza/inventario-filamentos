const CACHE_NAME = "filament-v17";
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(["./","./index.html","./styles.css","./app.js"])).catch(()=>{}));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET") return; e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
