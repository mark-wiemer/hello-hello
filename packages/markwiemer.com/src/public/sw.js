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
// Only GET requests are cached; POST/PUT/DELETE are passed through as-is.
//
// Two strategies based on URL path:
//
// 1. "cache-first" for /_astro/* assets:
//    These files have content hashes in their filenames (e.g. image.abc123.webp)
//    and never change, so we serve from cache when available and skip the network.
//    This works around GitHub Pages' short Cache-Control: max-age=600 header.
//
// 2. "network-first with cache fallback" for everything else:
//    Try the network first, cache the response, fall back to cache if offline.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.pathname.startsWith("/_astro/")) {
    // Cache-first: content-hashed assets never change
    event.respondWith(
      caches.open(cacheName).then((cache) =>
        cache.match(request).then(
          (cached) =>
            cached ||
            fetch(request)
              .then((response) => cache.put(request, response.clone()).then(() => response))
              // Network failed and nothing in cache — let the browser handle it.
              .catch(() => cache.match(request)),
        ),
      ),
    );
  } else {
    // Network-first: always try fresh content, fall back to cache offline
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
  }
});
