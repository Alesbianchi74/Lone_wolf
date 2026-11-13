// Lupo Solitario Companion: cache per l'uso offline
const VERSION='lwc-2026-11-13h';
const SHELL=['./','index.html','manifest.webmanifest','icons/apple-touch-icon.png','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/favicon-64.png','fonts/vollkorn.woff2','fonts/vollkorn-italic.woff2','fonts/alegreyasans-400.woff2','fonts/alegreyasans-400i.woff2','fonts/alegreyasans-500.woff2','fonts/alegreyasans-700.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // pagina: prima la rete (per ricevere gli aggiornamenti), poi la cache se offline
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put('index.html',cp));return r}).catch(()=>caches.match('index.html')));return}
  // risorse: prima la cache
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const cp=n.clone();caches.open(VERSION).then(c=>c.put(e.request,cp));return n})));
});
