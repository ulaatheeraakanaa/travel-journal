const CACHE = "utk-meghalaya-v1";
const DOCUMENTS = ["./","./index.html"];
self.addEventListener("install", event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(DOCUMENTS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("utk-meghalaya-")&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener("fetch",event=>{
 const req=event.request;if(req.method!=="GET")return;
 const url=new URL(req.url);
 if(url.origin===self.location.origin && (url.pathname.endsWith("/trips/meghalaya/")||url.pathname.endsWith("/trips/meghalaya/index.html"))){
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}return response}).catch(()=>caches.match("./index.html"))));return;
 }
 if(url.origin===self.location.origin)return;
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{if(response.ok && response.type!=="opaque"){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}return response})));
});