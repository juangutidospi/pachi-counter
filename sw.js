/**
 * Service worker de Pachi's counter. Da soporte offline y arranque rápido:
 *  - precarga el «app shell» al instalar,
 *  - sirve cache-first los recursos propios (y los cachea al vuelo),
 *  - para terceros (fuentes) usa red con recaída a caché.
 * La app funciona sin conexión tras la primera visita; sin las fuentes de
 * Google se usa la tipografía del sistema (degradación elegante).
 */
const VERSION = 'pachi-v1';
const CORE = [
  '.',
  'index.html',
  'css/tokens.css',
  'js/main.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin) {
    // Cache-first para recursos propios; se cachea la primera vez que se piden.
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('index.html')))
    );
  } else {
    // Terceros (fuentes): red con recaída a caché.
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req))
    );
  }
});
