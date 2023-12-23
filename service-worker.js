const staticDateCache = "date-pray-v1"
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/js.js",
  "/icon192.png",
  "/icon512.png",
  "/manifest.json",
  "/date.json",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDateCache).then(cache => {
      cache.addAll(assets)
    })
  )
})
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})