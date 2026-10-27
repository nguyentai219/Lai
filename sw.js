/* Service Worker — Lãi Suất v1.4.9 */
const CACHE = 'laisuat-v1.4.9';

const ASSETS = [
  '/Lai/',
  '/Lai/index.html',
  '/Lai/manifest.json',
  '/Lai/icon-192.png',
  '/Lai/icon-512.png',
  '/Lai/icon-192-maskable.png',
  '/Lai/icon-512-maskable.png',
  '/Lai/favicon-32.png',
  '/Lai/apple-touch-icon.png',
  '/Lai/fonts/be-vietnam-pro.css',
  '/Lai/fonts/bvp-00.woff2',
  '/Lai/fonts/bvp-01.woff2',
  '/Lai/fonts/bvp-02.woff2',
  '/Lai/fonts/bvp-03.woff2',
  '/Lai/fonts/bvp-04.woff2',
  '/Lai/fonts/bvp-05.woff2',
  '/Lai/fonts/bvp-06.woff2',
  '/Lai/fonts/bvp-07.woff2',
  '/Lai/fonts/bvp-08.woff2',
  '/Lai/fonts/bvp-09.woff2',
  '/Lai/fonts/bvp-10.woff2',
  '/Lai/fonts/bvp-11.woff2',
  '/Lai/fonts/bvp-12.woff2',
  '/Lai/fonts/bvp-13.woff2',
  '/Lai/fonts/bvp-14.woff2',
  '/Lai/fonts/bvp-15.woff2',
  '/Lai/fonts/bvp-16.woff2',
  '/Lai/fonts/bvp-17.woff2'
];

/* ── INSTALL: cache assets ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(ASSETS.map(url =>
        c.add(new Request(url, { cache: 'reload' })).catch(err => console.warn('Skip:', url, err))
      ))
    ).then(() => self.skipWaiting()) // Kích hoạt SW mới NGAY, không chờ tab đóng
  );
});

/* ── ACTIVATE: CHỈ xóa cache cũ CỦA APP NÀY (tiền tố 'laisuat-'). Bộ nhớ cache dùng chung cả tên miền
   nguyentai219.github.io — xoá hết sẽ làm mất bản offline của app khác (Mủ Cao Su, Quản Lý Heo...). ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('laisuat-') && k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── FETCH: Network first cho HTML, Cache first cho assets ── */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith('/Lai/')) return;

  // HTML → luôn lấy từ network trước (để nhận bản mới nhất), offline thì dùng cache
  if (e.request.mode === 'navigate' ||
      (e.request.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return response;
        })
        .catch(() => caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true })
          .then(cached => cached || c.match('/Lai/index.html')))
        )
    );
    return;
  }

  // Assets (icon, phông chữ, manifest...) → cache first, network fallback
  e.respondWith(
    caches.open(CACHE).then(c => c.match(e.request)).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => Response.error());
    })
  );
});
