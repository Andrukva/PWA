const staticCasheName = "app-v1";

const assetUrls = [
    'index.html',
    '/js/main.js',
    '/css/style.css',
    '/img/delete.png',
    '/img/done.png',
    '/img/empty-folder32.png',
    '/img/empty-folder64.png',
    '/img/fact_check.png',
    '/img/todo24.png',
    '/img/todo64.png',
    '/img/todo128.png',
    '/img/todo256.png',
    '/img/todo512.png',
]

self.addEventListener('install', async event => {
   const cache = await caches.open(staticCasheName)
   await cache.addAll(assetUrls)
            
})


self.addEventListener('activate', async event => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames
        .filter(name => name !== staticCasheName)
        .map(name => caches.delete(name))
    )
})

self.addEventListener('fetch', event => {
    
    event.respondWith(cacheFirst(event.request))
})

async function cacheFirst(request) {
    const cached = await caches.match(request)
    return cached ?? await fetch(request)
}