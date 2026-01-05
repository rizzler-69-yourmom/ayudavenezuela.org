// ============================================
// Service Worker - Offline Support
// Version 1.0.0
// ============================================

const CACHE_NAME = 'ayudavenezuela-v1';
const RUNTIME_CACHE = 'ayudavenezuela-runtime';

// Files to cache immediately on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/map.js',
    '/manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching essential files');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        // Cache external resources (like Leaflet CDN) for offline use
        if (url.hostname.includes('unpkg.com') || url.hostname.includes('openstreetmap.org')) {
            event.respondWith(cacheFirst(request));
        }
        return;
    }

    // Use cache-first strategy for local resources
    event.respondWith(cacheFirst(request));
});

// Cache-first strategy
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
        // Return cached version and update in background
        updateCache(request);
        return cached;
    }

    // Not in cache, fetch from network
    try {
        const response = await fetch(request);

        // Cache successful responses
        if (response.ok) {
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.error('Fetch failed:', error);

        // Return offline page if available
        if (request.mode === 'navigate') {
            const offlinePage = await cache.match('/index.html');
            if (offlinePage) {
                return offlinePage;
            }
        }

        // Return a basic offline response
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

// Update cache in background
async function updateCache(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response);
        }
    } catch (error) {
        // Silently fail - we're already serving cached content
    }
}

// Network-first strategy (for API calls)
async function networkFirst(request) {
    const cache = await caches.open(RUNTIME_CACHE);

    try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        throw error;
    }
}

// Listen for messages from the main app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

// Background sync for form submissions (when back online)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-submissions') {
        event.waitUntil(syncSubmissions());
    }
});

async function syncSubmissions() {
    // Get pending submissions from IndexedDB or localStorage
    // Send to server when online
    console.log('Syncing pending submissions...');
}

// Push notifications support (for future alerts)
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};

    const options = {
        body: data.body || 'Nueva actualización disponible',
        icon: '/images/icon-192.png',
        badge: '/images/badge-72.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'AyudaVenezuela', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

console.log('Service Worker loaded');
