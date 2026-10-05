const CACHE='lernhelden-v11-7-0';
const CORE=['./','./index.html','./manifest.webmanifest','./config.js','./written-addition.js','./german-spelling-extra.js','./cube-solver.js','./version.json','./icon-180.png','./icon-192.png','./icon-512.png'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});

function injectModules(html){
  const scripts=[
    ['written-addition.js','11.7.0'],
    ['german-spelling-extra.js','11.7.0'],
    ['cube-solver.js','11.7.0']
  ];
  for(const [file,version] of scripts){
    if(!html.includes(file)) html=html.replace('</body>',`<script src="./${file}?v=${version}"></script></body>`);
  }
  html=html.replace("const VERSION='6.0.0'","const VERSION='11.7.0'");
  return html;
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;

  if(event.request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/')){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(async response=>{
          const type=response.headers.get('content-type')||'';
          if(!type.includes('text/html'))return response;
          const html=injectModules(await response.text());
          const headers=new Headers(response.headers);
          headers.set('Cache-Control','no-store, no-cache, must-revalidate');
          return new Response(html,{status:response.status,statusText:response.statusText,headers});
        })
        .catch(async()=>{
          const response=await caches.match('./index.html');
          if(!response)return new Response('Offline',{status:503});
          const html=injectModules(await response.text());
          return new Response(html,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
        })
    );
    return;
  }

  if(['config.js','written-addition.js','german-spelling-extra.js','cube-solver.js','version.json','sw.js'].some(file=>url.pathname.endsWith('/'+file))){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(response=>{
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy));
          return response;
        })
        .catch(()=>caches.match(event.request))
    );
    return;
  }

  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});