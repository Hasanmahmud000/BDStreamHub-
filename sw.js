// ✅ Cache version — যখনই আপডেট আনবে এটা v2 → v3 → v4 করে দিও
const CACHE_NAME = 'cricZone-v2';

// ✅ Install event — অ্যাসেটগুলো cache-এ জমাবে
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/style.css',       // যদি থাকে
        '/script.js',       // যদি থাকে
        '/icon-192.png',
        '/icon-512.png'
      ]);
    })
  );
  self.skipWaiting(); // সঙ্গে সঙ্গে activate করার জন্য
});

// ✅ Activate event — পুরাতন cache গুলো মুছে ফেলবে
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// ✅ Fetch event — cache → না পেলে network থেকে data আনে
self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});

// ✅ Message event — JS থেকে 'SKIP_WAITING' পাঠালে সঙ্গে সঙ্গে নতুন SW active হবে
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
