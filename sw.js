const CACHE_NAME = "cric-v1"; // নতুন version প্রতিবার বদলাও
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  // অন্য যেসব ফাইল তোমার দরকার
];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // 👉 নতুন version সঙ্গে সঙ্গে activate হবে
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
