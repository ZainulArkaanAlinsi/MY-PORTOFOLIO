// No-op service worker.
// A stale Firebase Messaging service worker (registered earlier on this
// localhost port by a different app) keeps requesting this file, producing a
// 404. This empty worker returns 200 and unregisters itself so the stale
// registration is cleaned up. This project does not use Firebase Messaging.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        await self.registration.unregister();
        const clients = await self.clients.matchAll();
        clients.forEach((client) => client.navigate(client.url));
      } catch {
        /* ignore */
      }
    })()
  );
});
