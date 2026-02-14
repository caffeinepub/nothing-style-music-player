const CACHE_NAME = 'nothing-player-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Sample audio tracks to cache for offline playback
const AUDIO_ASSETS = [
  '/assets/audio/sample-track-1.mp3',
  '/assets/audio/sample-track-2.mp3',
  '/assets/audio/sample-track-3.mp3',
];

// Install event - cache static assets and audio
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([...STATIC_ASSETS, ...AUDIO_ASSETS]).catch((error) => {
        console.error('Failed to cache assets:', error);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Skip canister API calls and external requests
  if (
    url.hostname.includes('icp0.io') ||
    url.hostname.includes('ic0.app') ||
    (url.hostname.includes('localhost') && url.port === '4943')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Only cache successful responses from same origin
        if (
          response.status === 200 &&
          url.origin === self.location.origin
        ) {
          // Cache JS, CSS, images, audio, and fonts
          const shouldCache = 
            url.pathname.endsWith('.js') ||
            url.pathname.endsWith('.css') ||
            url.pathname.endsWith('.png') ||
            url.pathname.endsWith('.jpg') ||
            url.pathname.endsWith('.jpeg') ||
            url.pathname.endsWith('.svg') ||
            url.pathname.endsWith('.webp') ||
            url.pathname.endsWith('.mp3') ||
            url.pathname.endsWith('.wav') ||
            url.pathname.endsWith('.ogg') ||
            url.pathname.endsWith('.woff') ||
            url.pathname.endsWith('.woff2') ||
            url.pathname.endsWith('.ttf');

          if (shouldCache) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
        }
        return response;
      }).catch((error) => {
        console.error('Fetch failed:', error);
        // Return cached response if available, even if stale
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          throw error;
        });
      });
    })
  );
});
