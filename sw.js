/* Service Worker — Lãi Suất v1.4.7 */
const CACHE = 'laisuat-v1.4.7';

const ASSETS = [
  '/Lai/',
  '/Lai/index.html',
  '/Lai/manifest.json',
  '/Lai/icon-192.png',
  '/Lai/icon-512.png',
  '/Lai/icon-192-maskable.png',
  '/Lai/icon-512-maskable.png'
];

/* ── INSTALL: cache assets ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(ASSETS.map(url =>
        c.add(url).catch(err => console.warn('Skip:', url, err))
      ))
    ).then(() => self.skipWaiting()) // Kích hoạt SW mới NGAY, không chờ tab đóng
  );
});

/* ── ACTIVATE: xóa cache cũ + thông báo client reload ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim()) // Kiểm soát tất cả tab ngay lập tức
     .then(() => {
       // Gửi thông báo tới tất cả tab đang mở → app tự reload
       return self.clients.matchAll({ type: 'window' }).then(clients => {
         clients.forEach(client => {
           client.postMessage({ type: 'SW_UPDATED', version: CACHE });
         });
       });
     })
  );
});

/* ── FETCH: Network first cho HTML, Cache first cho assets ── */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (!url.pathname.startsWith('/Lai/')) return;

  // HTML → luôn lấy từ network trước (để nhận bản mới nhất)
  // nếu offline thì dùng cache
  if (e.request.mode === 'navigate' ||
      e.request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(e.request)
          .then(cached => cached || caches.match('/Lai/index.html'))
        )
    );
    return;
  }

  // Assets (icon, manifest...) → cache first, network fallback
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => null);
    })
  );
});
