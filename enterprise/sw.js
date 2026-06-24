const CACHE_NAME = 'spray-pro-v19';
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
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Página de fallback offline (garante que nunca retornamos null ao Safari)
function offlineFallback() {
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>body{font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0f1418;color:#fff;}
    h2{margin-bottom:8px}p{color:rgba(255,255,255,.6);text-align:center}a{color:#3b82f6}</style></head>
    <body><h2>📶 Sem conexão</h2><p>Você está offline. Acesse o app após conectar à internet,<br>ou <a href="../">volte ao Portal</a> se já tiver feito login antes.</p></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.url.includes('supabase.co') ||
      event.request.url.includes('/rest/v1/') ||
      event.request.url.includes('/auth/v1/')) {
    return;
  }

  const isHtml = (event.request.headers.get('accept') || '').includes('text/html') ||
                 event.request.url.endsWith('.html') ||
                 event.request.url.endsWith('/');

  if (isHtml) {
    // Network-first para HTML: tenta rede, usa cache como fallback, fallback offline
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then(r => r || offlineFallback())
        )
    );
  } else {
    // Cache-first para assets: usa cache, tenta rede, fallback 503
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(netResponse => {
          if (netResponse.status === 200) {
            const clone = netResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return netResponse;
        }).catch(() => new Response('', { status: 503 }));
      })
    );
  }
});
