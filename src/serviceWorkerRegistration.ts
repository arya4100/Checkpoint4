// serviceWorkerRegistration.ts - registers the service worker (needed for offline access).

/**
 * Registers /service-worker.js once the page has loaded.
 * Only runs in the production build (npm run build + npm run preview), because
 * a cache-first service worker would get in the way of the dev server.
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => console.log('Service worker registered:', reg.scope))
      .catch((err) => console.error('Service worker registration failed:', err))
  })
}
