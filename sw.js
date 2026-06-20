const CACHE="edogawa-v3";
const ASSETS=["./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  const req=e.request;
  const u=req.url;
  // 外部CDN/APIはSWを通さない
  if(u.includes("api.anthropic.com")||u.includes("unpkg.com")||u.includes("workers.dev")||u.includes("googleapis")){return;}
  // HTML（ページ本体）は常にネットワーク優先（更新を確実に反映）
  if(req.mode==="navigate"||u.endsWith("/")||u.endsWith("index.html")){
    e.respondWith(fetch(req).catch(()=>caches.match("./index.html")));
    return;
  }
  // 静的アセットはキャッシュ優先
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(resp=>{const cp=resp.clone();caches.open(CACHE).then(c=>{try{c.put(req,cp);}catch(x){}});return resp;})));
});
