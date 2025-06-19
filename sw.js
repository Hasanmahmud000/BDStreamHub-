const CACHE_NAME = 'cricstreamzone-v2';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        // যদি আলাদা ফাইল থাকে, সেগুলো এখানে যোগ করুন
        // '/style.css',
        // '/script.js',
        '/icon-192.png',
        '/icon-512.png',
        // CDN ফাইলগুলোও ক্যাশ করতে পারেন
        'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.4/lottie.min.js',
        'https://raw.githubusercontent.com/Hasanmahmud000/HasanTv/refs/heads/main/live-icon.json',
        'https://i.postimg.cc/BvWg87Rd/videocam-24dp-E3-E3-E3-FILL0-wght400-GRAD0-opsz24.png',
        'https://i.postimg.cc/K8JDvvxs/live-tv-24dp-E3-E3-E3-FILL0-wght400-GRAD0-opsz24.png',
        'https://i.postimg.cc/YC472jwd/radio-24dp-E3-E3-E3-FILL0-wght400-GRAD0-opsz24.png'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // API কল network-first
  if (requestUrl.href.startsWith('https://script.google.com/macros/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // অন্য সব ফাইল cache-first
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
