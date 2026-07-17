const CACHE_NAME = 'recettes-cache-v2';
const urlsToCache = [
  'index.html',
  'script.js',
  'style.css',
  'ajouter-recette.html',
  'ajouter-recette.js',
  'ajouter-recette.css',
  'recette.html',
  'manifest.json',
  'logo/1pers.png',
  'logo/2pers.png',
  'logo/3pers.png',
  'logo/4pers.png',
  'logo/5pers.png',
  'logo/6pers.png',
  'logo/icon_fav.png',
  'logo/icon_plus.png',
  'logo/logo détouré.png',
  'logo/logo.png',
  'logo/logo_carre.png',
  'Recette-1/index.html',
  'Recette-1/script.js',
  'Recette-1/style.css',
];

// Installer le service worker et mettre en cache les ressources
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache:', error);
        });
      })
  );
});

// Activer le service worker et nettoyer les anciens caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepter les requêtes et servir les ressources en cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(networkResponse => {
          // Si la ressource est trouvée sur le réseau, la mettre en cache pour les futures requêtes
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(error => {
          console.error('Fetching failed:', error);
          throw error;
        });
      })
  );
});
