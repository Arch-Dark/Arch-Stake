const CACHE_NAME = "ultradouble-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // Ne pas intercepter les requêtes Supabase
  if (event.request.url.includes("supabase.co")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
