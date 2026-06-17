const CACHE_NAME = 'spray-pro-v18';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Tenta fazer o cache, mas não falha a instalação se um arquivo faltar (útil enquanto estão testando logo.png)
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
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Ignorar requisições que não sejam GET (evita problemas com POST/PUT/DELETE)
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar requisições para a API do Supabase ou outras APIs dinâmicas para evitar cache indesejado
  if (event.request.url.includes('supabase.co') || event.request.url.includes('/rest/v1/') || event.request.url.includes('/auth/v1/')) {
    return;
  }

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
