const CACHE='lernhelden-v11-4-written-addition-rows';
const CORE=['./','./index.html','./manifest.webmanifest','./config.js','./written-addition.js','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET') return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin) return;
 if(e.request.mode==='navigate'||u.pathname.endsWith('/index.html')){
   e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{
     const ct=r.headers.get('content-type')||'';
     if(!ct.includes('text/html')) return r;
     let html=await r.text();
     if(!html.includes('written-addition.js')) html=html.replace('</body>','<script src="./written-addition.js?v=11.4.0"></script></body>');
     return new Response(html,{status:r.status,statusText:r.statusText,headers:r.headers});
   }).catch(()=>caches.match('./index.html')));
 } else if(u.pathname.endsWith('/config.js')||u.pathname.endsWith('/written-addition.js')){
   e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request)));
 } else {
   e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const x=r.clone();caches.open(CACHE).then(k=>k.put(e.request,x));return r;})));
 }
});