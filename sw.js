// Version erhöhen, wenn du eine neue Spielversion hochlädst
const CACHE = 'filder-defense-v9';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png','./assets/castle.png','./assets/tile_03.png','./assets/tile_04.png','./assets/tile_17.png','./assets/tile_18.png','./assets/tile_31.png','./assets/tile_32.png','./assets/tile_42.png','./assets/tile_44.png','./assets/tile_46.png','./assets/tile_47.png','./assets/tile_48.png','./assets/tile_50.png','./assets/tile_52.png','./assets/tile_57.png','./assets/tile_58.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Erst Netz (neueste Version), bei Offline aus dem Cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
