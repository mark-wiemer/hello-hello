/*
This is my first web worker! It's a service worker that was originally
AI-generated. Some concepts new to me:
- `caches` is a `window` property like `localStorage` but built specifically
  for caching HTTPS requests
*/

// Cache version identifier. Bump this (e.g. "markwiemer-v2") to invalidate
// all cached resources and force users to download fresh copies.
const cacheName = "markwiemer-v1";

//* Install: Fired when the browser detects a new or updated service worker file.
// skipWaiting() tells the new service worker to activate immediately instead of
// waiting for all open tabs using the old version to close. Without this, users
// would have to close every tab before the update takes effect.
self.addEventListener("install", () => {
  self.skipWaiting();
});

//* Activate: Fired after install, when the new service worker takes control.
// This is the place to clean up old caches. We delete every cache whose name
// doesn't match the current cache name, so stale resources from previous
// versions don't linger and waste storage.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((name) => name !== cacheName).map((name) => caches.delete(name))),
      ),
  );
});

//* Fetch: Intercepts every network request the page makes.
// Strategy: "network-first with cache fallback"
//   1. Try to fetch from the network.
//   2. If the network succeeds, store a copy in the cache, then return the response.
//   3. If the network fails (e.g. user is offline), serve the cached copy instead.
// Only GET requests are cached; POST/PUT/DELETE are passed through as-is.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    caches.open(cacheName).then((cache) =>
      fetch(request)
        // Clone the response because a Response body can only be consumed once:
        // one copy goes into the cache, the original is returned to the browser.
        .then((response) => cache.put(request, response.clone()).then(() => response))
        // Network failed — try to serve from cache so the site works offline.
        .catch(() => cache.match(request)),
    ),
  );
});
