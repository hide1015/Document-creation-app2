const CACHE="edogawa-v4";
const ASSETS=["./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  const req=e.request;
  const u=req.url;
  if(u.includes("api.anthropic.com")||u.includes("unpkg.com")||u.includes("workers.dev")||u.includes("googleapis")){return;}
  // HTML（ページ本体）はネットワーク優先、失敗時のみキャッシュ
  if(req.mode==="navigate"){
    e.respondWith(
      fetch(req).catch(()=>caches.match("./index.html").then(r=>r||new Response("オフラインです",{status:503,headers:{"Content-Type":"text/plain;charset=utf-8"}})))
    );
    return;
  }
  // 静的アセットはキャッシュ優先
  e.respondWith(caches.match(req).then(r=>r||fetch(req)));
});
