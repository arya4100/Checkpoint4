// service-worker.js - caches static files so the app shell works offline.

const CACHE_NAME = 'students-app-cache-v1'

// App shell: files cached as soon as the service worker is installed
const STATIC_FILES = ['/', '/index.html', '/manifest.json', '/icon.svg']

// INSTALL: pre-cache the static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_FILES))
  )
  self.skipWaiting()
})

// ACTIVATE: delete old caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// FETCH: cache-first strategy, falling back to the network.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Never cache API calls: login/profile data must always come from the server
  if (event.request.method !== 'GET' || url.pathname.startsWith('/api')) return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request)
        .then((response) => {
          // Cache successful responses (e.g. the hashed JS/CSS bundles) too
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
          }
          return response
        })
        .catch(() => caches.match('/index.html')) // offline fallback
    })
  )
})
