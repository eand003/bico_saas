const CACHE_NAME = 'spray-pro-v12';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Tenta fazer o cache, mas não falha a instalação se um arquivo faltar (útil enquanto estão testando logo.png)
        return cache.addAll(urlsToCache).catch(err => console.log('Aviso (cache parcial):', err));
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se achou no cache (offline), retorna. Senão, vai para a rede.
        return response || fetch(event.request);
      })
  );
});
