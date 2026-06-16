const CACHE_NAME = 'spray-pro-v23';
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
  './diagnostico-vazao-manual/styles.css'
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
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
