// main.tsx - entry point: renders the app and registers the service worker.
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { registerServiceWorker } from './serviceWorkerRegistration'

createRoot(document.getElementById('root')!).render(<App />)

registerServiceWorker()
