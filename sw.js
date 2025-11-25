const CACHE = 'profile-card-v2';
const ASSETS = [
  '/', '/profile-card/',
  '/profile-card/index.html',
  '/profile-card/profile-card.css',
  '/profile-card/index.js',
  '/profile-card/projects.html',
  '/profile-card/contact.html',
  '/profile-card/blog.html',
  '/profile-card/gallery.html',
  '/profile-card/skills.html',
  '/profile-card/timeline.html',
  '/profile-card/manifest.json'
];
self.addEventListener('install', (event)=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', (event)=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', (event)=>{
  if(event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached)=>{
      if(cached) return cached;
      return fetch(event.request).then((resp)=>{
        if(!resp || resp.status >= 400 || resp.type === 'opaque') return resp;
        const clone = resp.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request, clone));
        return resp;
      }).catch(()=> caches.match('/profile-card/index.html'));
    })
  );
});
