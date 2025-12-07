// Service Worker minimale per PWA
// Richiesto per l'installabilità su Chrome

const CACHE_NAME = 'prompto-v1';

// Install event - attivazione immediata
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch event - pass through (no caching)
self.addEventListener('fetch', (event) => {
  // Non intercettiamo le richieste, passiamo tutto alla rete
  // Questo SW serve solo per rendere l'app installabile
});
