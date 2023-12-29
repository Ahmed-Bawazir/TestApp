//installing and add files to cache
let nameOfCache = "v1";
const addResourcesToCache = async (resources) => {
  const cache = await caches.open(nameOfCache);
  await cache.addAll(resources);
};
let asset = [
  "/",
  "index.html",
  "style.css",
  "js.js",
  "manifest.json",
  "date.json",
  "icon192.png",
  "icon512.png",
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(nameOfCache).then( function (cache) {
      for (let ass of asset)
      {
        try {
           cache.add(ass);
        } catch (err) {
          console.warn('sw: cache.add',err);
        }
      }}
    )
  );
});
/* //installing and add files to cache 
let nameOfCache="v1";
const addResourcesToCache = async (resources) => {
  const cache = await caches.open(nameOfCache);
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/style.css",
      "/js.js",
      "/manifest.json",
      "/date.json",
      "/icon192.png",
      "/icon512.png",
     
    ]),
  );
}); */
//fetch files from cache
const putInCache = async (request, response) => {
  const cache = await caches.open(nameOfCache);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: "/icon512.png",
    })
  );
});
//activate
/* 
const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  console.log("dfdf");
  const cacheKeepList = ["v5"];
  const keyList = await caches.keys();
  console.log(keyList);
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});  */
