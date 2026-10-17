/**
 * NadaVerse Service Worker (v2)
 * Enables 100% offline practice studio (Tanpura drone, Tala metronome, Tuner,
 * and verified Carnatic raga / instrument knowledge base) in temples, green rooms,
 * and low-connectivity venues.
 * 
 * Strict Privacy & Security Invariants:
 * - All /api/ network calls bypass cache entirely.
 * - Authenticated requests and private workspaces are never cached in shared cache storage.
 * - Outdated cache revisions are deleted immediately upon activation.
 */

const CACHE_NAME = 'nadaverse-cache-v2';
const PRECACHE_ASSETS = [
  '/',
  '/site.webmanifest',
  '/logo.png',
  '/logo.webp',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching encountered missing assets, continuing:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log(`[ServiceWorker] Purging outdated cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 1. Ignore non-GET requests or chrome-extension URLs
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // 2. Never cache or intercept authenticated requests with Authorization headers
  if (request.headers.has('authorization')) {
    return;
  }

  // 3. API Bypass: Private data, AI tutor, and auth endpoints must never enter static cache
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            offline: true,
            status: 'offline_unavailable',
            detail: 'Offline Mode: NadaVerse AI Tutor and authenticated endpoints require a live network connection. The Web Audio Practice Studio and local verified knowledge base remain fully operational offline.'
          }),
          {
            status: 503,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, no-cache, must-revalidate, private'
            }
          }
        );
      })
    );
    return;
  }

  // 4. Cache-first for immutable static assets (images, fonts, css, scripts)
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.url.includes('/_next/static/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Stale-while-revalidate for static updates
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 5. Network-first with app-shell fallback for HTML pages
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match('/');
        });
      })
  );
});
