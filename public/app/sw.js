/* PortableWeb PWA service worker */
const CACHE = 'portableweb-v1';

const SHELL = [
  '/app/',
  '/app/index.html',
  '/app/manifest.json',
  '/app/jszip.min.js',
  '/icons/icon.svg',
];

/* Pre-cache the app shell on install */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

/* Remove old caches on activate */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Serve from cache, fall back to network and cache the response */
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  /* Only handle same-origin requests under /app/ and /icons/ */
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith('/app/') && !url.pathname.startsWith('/icons/')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      });
    })
  );
});
