//installing and add files to cache
let nameOfCache = "v1";
let assets = [
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
    caches.open(nameOfCache).then(function (cache) {
      for (let asset of assets) {
        try {
          cache.add(asset);
          //console.log(`add ${asset} to cache done`);
        } catch (err) {
          console.log(`There error to add ${asset} to cache :${err}`);
        }
      }
    })
  );
});
//fetch files from cache
const putInCache = async (request, response) => {
  const cache = await caches.open(nameOfCache);
  await cache.put(request, response);
};

const cacheFirst = async ({ request, fallbackUrl }) => {
  console.log("cacheFirst");
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
/* self.addEventListener("fetch", (event) => {
 if (navigator.onLine) {
  event.respondWith(
    networkFirst2({
      request: event.request,
      fallbackUrl: "/icon512.png",
    })
  );
 }else{
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: "/icon512.png",
    })
  );
 }
}); */
//network first
/* self.addEventListener('fetch', event => {
 event.respondWith(
   fetch(event.request).then(response => {
     cache.put(event.request, response.clone());
     return response;
   }).catch(_ => {
     return caches.match(event.request);
   }))
  
}); */
//test
/* const networkFirst = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    console.log("network");
    return responseFromNetwork;
  } catch (error) {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      console.log("cache");
      return responseFromCache;
    } else {
      const fallbackResponse = await caches.match(fallbackUrl);
      return fallbackResponse;
    }
  }
  //

  // Next try to get the resource from the network
}; */
//end test
//
const networkFirst2 = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the
  console.log("networkFirst");
  try {
    const responseFromNetwork = await fetch(request);
    if (responseFromNetwork.ok) {
      putInCache(request, responseFromNetwork.clone());
      console.log("network");
      return responseFromNetwork;
    }
  } catch (error) {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      console.log("cache");
      return responseFromCache;
    } else {
      const fallbackResponse = await caches.match(fallbackUrl);
      return fallbackResponse;
    }
  }
  //

  // Next try to get the resource from the network
};

//

/* self.addEventListener(’fetch’, function (event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request)
        })
    )
}) */

////////////////////////////////////////activate

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  console.log("activate");

  const cacheKeepList = [nameOfCache];
  const keyList = await caches.keys();
  //console.log(keyList);
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});
//
/* function updateTest(){
  caches.open(nameOfCache).then(function (cache) {
    for (let asset of assets) {
      try {
        cache.add(asset);
        //console.log(`add ${asset} to cache done`);
      } catch (err) {
        console.log(`There error to add ${asset} to cache :${err}`);
      }
    }
  })
} */
