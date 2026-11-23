/* Le mode hors connexion a été retiré : ce service worker efface les copies enregistrées,
   se désinstalle et recharge les pages ouvertes pour revenir au site en ligne. */
self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('philo-')===0}).map(function(k){return caches.delete(k)}))})
  .then(function(){return self.registration.unregister()})
  .then(function(){return self.clients.matchAll({type:'window'})})
  .then(function(cs){cs.forEach(function(c){try{c.navigate(c.url)}catch(err){}})}));
});
