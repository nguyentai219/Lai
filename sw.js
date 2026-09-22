/* Service Worker — Lãi Suất v1.3.2 */
const CACHE = 'laisuat-v1.3.2';

// Chỉ cache những file CHẮC CHẮN tồn tại
// Không cache font Google vì có thể fail khi offline
const ASSETS = [
  '/Lai/',
  '/Lai/index.html',
  '/Lai/manifest.json',
  '/Lai/icon-192.png',
  '/Lai/icon-512.png',
  '/Lai/icon-192-maskable.png',
  '/Lai/icon-512-maskable.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => {
        // addAll từng file riêng, nếu 1 file lỗi không làm fail toàn bộ
        return Promise.allSettled(
          ASSETS.map(url => c.add(url).catch(err => console.warn('Cache skip:', url, err)))
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Chỉ handle request trong scope /Lai/
  const url = new URL(e.request.url);
  if (!url.pathname.startsWith('/Lai/')) return;

  e.respondWith(
    caches.match(e.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(response => {
          // Cache response hợp lệ
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return response;
        }).catch(() => {
          // Offline fallback
          if (e.request.mode === 'navigate') {
            return caches.match('/Lai/index.html');
          }
        });
      })
  );
});
