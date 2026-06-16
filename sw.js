const CACHE_NAME = 'spray-pro-v25';
const urlsToCache = [
  './',
  './index.html',
  './sales_playbook.html',
  './apresentacao_consultores.html',
  './manifest.json',
  './logo.png',
  './bg_premium.png',
  './seletor-bico/index.html',
  './diagnostico-vazao-manual/index.html',
  './diagnostico-vazao-manual/app.js',
  './diagnostico-vazao-manual/styles.css',
  './diagnostico-vazao-manual/js/calculations.js',
  './diagnostico-vazao-manual/js/supabaseClient.js',
  './diagnostico-vazao-manual/js/dbService.js',
  './diagnostico-vazao-manual/js/voiceService.js'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Força o Service Worker pendente a se tornar ativo imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => console.log('Aviso (cache parcial):', err));
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume controle das páginas imediatamente sem precisar recarregar
  );
});

self.addEventListener('fetch', event => {
  const isHtml = event.request.headers.get('accept')?.includes('text/html') || event.request.url.endsWith('.html') || event.request.url.endsWith('/');
  if (isHtml) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request).then(netResponse => {
            if (netResponse.status === 200) {
              const responseClone = netResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return netResponse;
          });
        })
    );
  }
});
