const staticCacheName = "app-v1";

const assetUrls = [
  'index.html',
  '/js/main.js',
  '/css/style.css',
  '/img/delete.png',
  '/img/done.png',
  '/img/empty-folder32.png',
  '/img/empty-folder64.png',
  '/img/fact_check.png',
  './img/todo24.png',
  './img/todo64.png',
  './img/todo128.png',
  './img/todo256.png',
  './img/todo512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(cacheAssets());
});

self.addEventListener('activate', event => {
  event.waitUntil(cleanupCache());
});

self.addEventListener('fetch', event => {
  event.respondWith(fetchFromCache(event.request));
});

async function cacheAssets() {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(assetUrls);
}

async function cleanupCache() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName)
      .map(name => caches.delete(name))
  );
}

async function fetchFromCache(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  return fetch(request);
}
