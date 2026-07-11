const CACHE_NAME = 'cofre-cache-v2'; // Cambiamos a v2 para forzar la actualización
const urlsToCache = [
  './index.html',
  './manifest.json',
  './logo.png'
];

// Instala la nueva versión y fuerza a que tome el control inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Borra la memoria caché vieja (la v1) para que no haya conflictos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia: "Intenta usar Internet primero, si no hay, usa la memoria"
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
