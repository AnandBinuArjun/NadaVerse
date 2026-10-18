/**
 * NadaVerse Service Worker (v3 - Security & Privacy Hardened)
 * Enables 100% offline practice studio (Tanpura drone, Tala metronome, Tuner,
 * and verified Carnatic raga / instrument knowledge base) in temples, green rooms,
 * and low-connectivity venues.
 * 
 * Strict Privacy & Security Invariants:
 * 1. Zero Cache for API: All /api/ network calls bypass cache entirely.
 * 2. Zero Private Cache: Never cache responses with 'private' or 'no-store' Cache-Control.
 * 3. Zero Credentialed Cache: Never cache requests with Authorization, Cookie, or Set-Cookie headers.
 * 4. Zero RSC Cache: Next.js Server Components (_rsc, next-action, next-router-state-tree) are never cached.
 * 5. Strict Public HTML Allowlist: Only predefined static public routes are eligible for offline HTML caching.
 * 6. Instant Stale Purge: Outdated cache revisions are deleted immediately upon activation.
 */

const CACHE_NAME = 'nadaverse-cache-v3';

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
  '/robots.txt',
  '/sitemap.xml',
  '/privacy',
  '/terms',
];

// Explicit allowlist of public HTML routes that may be cached for offline access
const PUBLIC_HTML_ALLOWLIST = new Set([
  '/',
  '/index.html',
  '/privacy',
  '/terms',
]);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Pre-caching encountered missing assets, continuing:', err);
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
  const url = new URL(request.url);

  // 1. Only process GET requests over HTTP(S)
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // Cross-origin boundary: Never cache external third-party requests into the app shell
  if (url.origin !== self.location.origin) {
    return;
  }

  // 2. Strict Privacy Guard: Never cache or intercept authenticated requests with credentials or auth headers
  if (
    request.headers.has('authorization') ||
    request.headers.has('cookie')
  ) {
    return;
  }

  // 3. Next.js RSC Guard: Never cache React Server Component navigation streams or actions
  if (
    url.searchParams.has('_rsc') ||
    request.headers.has('rsc') ||
    request.headers.has('next-router-state-tree') ||
    request.headers.has('next-url') ||
    request.headers.has('next-action')
  ) {
    return;
  }

  // 4. API Bypass: Private data, AI tutor, and auth endpoints must NEVER enter cache
  if (url.pathname.startsWith('/api/')) {
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

  // 5. Cache-first for immutable static assets (images, fonts, css, scripts, Next.js static chunks)
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Background revalidation
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && isCacheableResponse(networkResponse)) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && isCacheableResponse(networkResponse)) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 6. Navigation / HTML pages: Strict Public Allowlist Network-First
  const isHtmlNavigation = request.mode === 'navigate' || request.destination === 'document' || (request.headers.get('accept') || '').includes('text/html');

  if (isHtmlNavigation) {
    // Check if the requested pathname is on the explicit public allowlist and has no private query strings
    const isAllowedPublicRoute = url.origin === self.location.origin && PUBLIC_HTML_ALLOWLIST.has(url.pathname) && !url.search;

    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Only cache if public allowlisted route and strictly cacheable (no Set-Cookie, no private/no-store)
          if (
            isAllowedPublicRoute &&
            networkResponse &&
            networkResponse.status === 200 &&
            isCacheableResponse(networkResponse)
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback only for allowed public routes
          if (isAllowedPublicRoute) {
            return caches.match(request).then((cached) => {
              return cached || caches.match('/');
            });
          }
          // Do not serve cached app shell for unallowed / private routes while offline
          return new Response(
            '<!DOCTYPE html><html><head><title>Offline - NadaVerse</title></head><body><h1>Offline</h1><p>This page is not available offline. Please connect to the internet.</p></body></html>',
            {
              status: 503,
              headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }
            }
          );
        })
    );
    return;
  }
});

/**
 * Validates that a response contains no private, credential, or no-store directives.
 */
function isCacheableResponse(response) {
  if (!response || response.status !== 200) return false;
  if (response.headers.has('set-cookie')) return false;

  const cacheControl = (response.headers.get('cache-control') || '').toLowerCase();
  if (cacheControl.includes('no-store') || cacheControl.includes('private')) {
    return false;
  }

  return true;
}
