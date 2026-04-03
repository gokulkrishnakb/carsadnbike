const CACHE_NAME = "cab-v1";
const STATIC_ASSETS = ["/", "/main", "/main/listings", "/offline.html"];
const API_BASE = "/api/v1";

// Install — cache static shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch(() => {})
    )
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy:
//   - API calls → Network first, fall through on fail
//   - Images    → Cache first (stale-while-revalidate)
//   - Pages     → Network first, offline fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== "GET") return;

  // API — network only (no caching tokens/data)
  if (url.pathname.startsWith(API_BASE)) return;

  // Images — cache first
  if (request.destination === "image") {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request).then((res) => {
            cache.put(request, res.clone());
            return res;
          });
          return cached ?? network;
        })
      )
    );
    return;
  }

  // Pages/assets — network first with offline fallback
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          caches.open(CACHE_NAME).then((c) => c.put(request, res.clone()));
        }
        return res;
      })
      .catch(() =>
        caches.match(request).then(
          (cached) => cached ?? caches.match("/offline.html")
        )
      )
  );
});

// Background sync — retry failed messages
self.addEventListener("sync", (event) => {
  if (event.tag === "retry-messages") {
    event.waitUntil(retryPendingMessages());
  }
});

async function retryPendingMessages() {
  // No-op placeholder — implement IndexedDB queue as needed
}

// Push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title ?? "CarsAndBikes", {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-72.png",
      data: { url: data.url ?? "/main/notifications" },
      tag: data.tag ?? "cab-notification",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/main";
  event.waitUntil(clients.openWindow(url));
});
