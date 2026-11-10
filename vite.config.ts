// vite.config.ts - Vite configuration for the School Students Registration app (PWA)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Requests to /api are forwarded to the Express server (server/index.js)
const apiProxy = { '/api': 'http://localhost:4000' }

export default defineConfig({
  plugins: [react()],
  // Files in /public (service-worker.js, manifest.json, icon.svg) are copied
  // untouched to the build root so the service worker is served from "/".
  publicDir: 'public',
  build: { outDir: 'dist', sourcemap: false },
  server: { port: 5173, proxy: apiProxy },
  preview: { port: 4173, proxy: apiProxy },
})
