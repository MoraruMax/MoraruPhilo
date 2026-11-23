/* Service worker : site installable et fiches lisibles hors connexion.
   - En ligne : tout vient du site, rien n’est enregistré ni mis à jour automatiquement.
   - Les copies hors connexion ne sont créées (ou remplacées) que par le bouton « Lire les fiches sans connexion ».
   - Sans réseau : la copie enregistrée est servie, avec la date de téléchargement, pendant 20 jours. */
var V=/*SWV*/"20261123115447";
var PAGES='philo-pages',ASSETS='philo-assets';
var CORE=['hors-ligne.html','favicon.svg'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(PAGES).then(function(c){return Promise.all(CORE.map(function(u){var url=new URL(u,self.registration.scope).href;return fetch(url,{cache:'no-cache'}).then(function(res){if(!res.ok)return;return /\.html$/.test(u)?stamp(res).then(function(x){return c.put(url,x)}):c.put(url,res)}).catch(function(){})}))}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  /* Une seule copie par fichier : on garde la plus récente (numéro de version le plus élevé) */
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf('philo-assets-')===0}).map(function(k){return caches.delete(k)}))}).then(function(){
    return caches.open(ASSETS).then(function(c){return c.keys().then(function(ks){
      var best={};ks.forEach(function(r){var u=new URL(r.url),v=+(u.searchParams.get('v')||0);if(!best[u.pathname]||v>best[u.pathname].v)best[u.pathname]={v:v,r:r}});
      return Promise.all(ks.filter(function(r){var u=new URL(r.url);return best[u.pathname].r!==r&&u.searchParams.get('v')}).map(function(r){return c.delete(r)}));
    })});
  }).then(function(){return self.clients.claim()}));
});

function pageKey(url){var u=new URL(url);u.search='';u.hash='';return u.href}
/* Copie d’une page avec la date de téléchargement */
function stamp(res){return res.blob().then(function(b){var h=new Headers(res.headers);h.set('X-Telecharge',String(Date.now()));return new Response(b,{status:res.status,statusText:res.statusText,headers:h})})}
/* Page servie hors connexion : bandeau avec la date de téléchargement */
var EXPIRE=20*24*3600*1000; /* 20 jours : au-delà, la copie n’est plus proposée */
function expired(m){var t=+m.headers.get('X-Telecharge');return !!t&&Date.now()-t>EXPIRE}
var MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
function banner(m){
  var t=+m.headers.get('X-Telecharge');if(!t||/hors-ligne\.html$/.test(m.url))return m;
  var d=new Date(t),txt='Fiche téléchargée le '+(d.getDate()===1?'1er':d.getDate())+' '+MOIS[d.getMonth()]+' '+d.getFullYear();
  var div='<div role="status" style="position:relative;z-index:90;margin:0;padding:.55rem max(16px,env(safe-area-inset-left,0px));background:#FFF4C2;color:#1B1430;border-bottom:2px solid #1B1430;font:600 .92rem/1.4 system-ui,-apple-system,sans-serif;text-align:center;text-shadow:none">'+txt+'</div>';
  return m.text().then(function(h){h=h.replace(/<script id="maj-auto">[\s\S]*?<\/script>/,'').replace(/<body[^>]*>/i,function(x){return x+div});return new Response(h,{headers:{'Content-Type':'text/html; charset=utf-8'}})});
}
function skip(u){return /\.(mp4|mp3|webm|m4a|ogg|wav|zip|pdf)$/i.test(u.pathname)||/version\.txt$/.test(u.pathname)||/\/sw\.js$/.test(u.pathname)}

/* Une page téléchargée (et de moins de 20 jours) est toujours lue depuis l’appareil, même avec du réseau :
   le mode hors connexion ne consomme aucune donnée. Sinon, la page vient du site. */
function copyOf(url){return caches.open(PAGES).then(function(c){var k=pageKey(url);return c.match(k).then(function(m){
  if(m&&expired(m)){c.delete(k);return null}return m&&m.headers.get('X-Telecharge')?m:null})})}
function offlinePage(){return caches.open(PAGES).then(function(c){return c.match(new URL('hors-ligne.html',self.registration.scope).href)})}
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);if(u.origin!==location.origin)return;
  if(/version\.txt$/.test(u.pathname)||/\/sw\.js$/.test(u.pathname))return;
  var html=r.mode==='navigate'||(r.headers.get('accept')||'').indexOf('text/html')>=0||/\.html$/.test(u.pathname)||/\/$/.test(u.pathname);
  if(html){
    e.respondWith(copyOf(r.url).then(function(m){
      if(m)return banner(m);
      return fetch(r).catch(function(){return offlinePage()});
    }));
    return;
  }
  /* Fichiers d’une page lue depuis l’appareil : uniquement la copie, jamais le réseau */
  e.respondWith((r.referrer?copyOf(r.referrer):Promise.resolve(null)).then(function(fromCopy){
    if(fromCopy||skip(u))return caches.match(r,{ignoreSearch:true}).then(function(x){
      if(x)return x;if(fromCopy)return new Response('',{status:504,statusText:'Hors connexion'});return fetch(r)});
    return fetch(r).catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(x){return x||new Response('',{status:504})})});
  }));
});

/* Téléchargement de toutes les fiches à la demande (bouton « Lire les fiches sans connexion ») */
self.addEventListener('message',function(e){
  var d=e.data||{};if(d.type!=='fiches'||!Array.isArray(d.urls))return;
  var port=e.ports&&e.ports[0],n=d.urls.length,i=0,done=0,fail=0;
  var assets=Array.isArray(d.assets)?d.assets:[];
  e.waitUntil(Promise.all([caches.open(PAGES),caches.open(ASSETS)]).then(function(cs){
    var c=cs[0],ca=cs[1];
    var prep=Promise.all(assets.map(function(a){var url=new URL(a,self.registration.scope).href;return fetch(url,{cache:'no-cache'}).then(function(res){if(res.ok)return ca.put(url,res)}).catch(function(){})}));
    function next(){if(i>=n)return Promise.resolve();var url=new URL(d.urls[i++],self.registration.scope).href;
      return fetch(url,{cache:'no-cache'}).then(function(res){if(res.ok)return stamp(res).then(function(x){return c.put(pageKey(url),x)});fail++}).catch(function(){fail++}).then(function(){done++;if(port)port.postMessage({done:done,total:n,fail:fail});return next()})}
    return prep.then(function(){return Promise.all([next(),next(),next(),next()])});
  }));
});
