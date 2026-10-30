/* Menu hamburger : accès à toutes les rubriques depuis chaque page */
(function(){
var ITEMS=[
 ['Accueil','accueil.html'],
 ['Que voulez-vous faire ?',null],
 ['Réviser une notion','parcours-notion.html'],
 ['Repères conceptuels','reperes-conceptuels.html'],
 ['Préparer la dissertation','parcours-dissertation.html'],
 ['Préparer l’explication de texte','parcours-explication.html'],
 ['Rubriques',null],
 ['Les thèmes','accueil.html#g-themes'],
 ['Repères et méthodes','accueil.html#g-reperes'],
 ['Plans de cours','accueil.html#g-plans'],
 ['Préparer le bac','accueil.html#g-bac'],
 ['Culture générale','accueil.html#g-culture'],
 ['Philosophie et spécialités','accueil.html#g-specialites'],
 ['Aller plus loin','accueil.html#g-approfondir'],
 ['EMC','accueil.html#g-emc'],
 ['Outils',null],
 ['Rechercher un auteur, une notion','accueil.html#q'],
 ['Mon carnet de suivi','carnet.html']
];
var SUB={"g-themes":[["Art : série générale et technologiques","n-art-serie-generale-et-technologiques"],["Bonheur : série générale","n-bonheur-serie-generale"],["Conscience : série générale","n-conscience-serie-generale"],["Devoir : série générale","n-devoir-serie-generale"],["État : série générale","n-etat-serie-generale"],["Inconscient : série générale","n-inconscient-serie-generale"],["Justice : série générale et technologiques","n-justice-serie-generale-et-technologiques"],["Langage : série générale","n-langage-serie-generale"],["Liberté : série générale et technologiques","n-liberte-serie-generale-et-technologiques"],["Nature : série générale et technologiques","n-nature-serie-generale-et-technologiques"],["Religion : série générale et technologiques","n-religion-serie-generale-et-technologiques"],["Technique : série générale et technologiques","n-technique-serie-generale-et-technologiques"],["Temps : série générale","n-temps-serie-generale"],["Travail : série générale","n-travail-serie-generale"],["Vérité : série générale et technologiques","n-verite-serie-generale-et-technologiques"]],"g-reperes":[["Repères conceptuels","n-reperes-conceptuels"],["Méthodologies","n-methodologies"],["Frise chronologique","n-frise-chronologique"]],"g-bac":[["Pour se préparer : série générale et technologiques","n-pour-se-preparer-serie-generale-et-technologiques"],["Pour s’entraîner","n-pour-s-entrainer"]],"g-culture":[["Œuvres d’art","n-uvres-d-art"],["Podcasts, cours et conférences","n-podcasts-cours-et-conferences"],["Vidéos","n-videos"],["Ouvrages à lire","n-ouvrages-a-lire"],["Textes dans leur langue d’origine","n-textes-dans-leur-langue-d-origine"]],"g-specialites":[["Philosophie et HGGSP","n-philosophie-et-hggsp"],["Philosophie et SES","n-philosophie-et-ses"]],"g-approfondir":[["Sociologie","n-sociologie"],["Démocratie et sciences","n-democratie-et-sciences"],["Préparer le concours commun du réseau ScPo","n-preparer-le-concours-commun-du-reseau-scpo"]],"g-emc":[["Démocratie","n-democratie"],["Anarchie","n-anarchie"]]};
function init(){
 if(document.getElementById('mnu-btn'))return;
 var st=document.createElement('style');
 st.textContent='.mnu-btn{display:inline-flex;align-items:center;gap:.5rem;font:600 .88rem/1 system-ui,-apple-system,sans-serif;color:var(--ink,#111);background:var(--surface,#fff);border:1.5px solid var(--ink,#111);border-radius:999px;padding:.55rem .95rem;cursor:pointer}.mnu-btn:hover{background:var(--ink,#111);color:var(--bg,#fff)}.mnu-btn:focus-visible{outline:3px solid var(--focus,#06c);outline-offset:2px}.mnu-fx{position:fixed;top:.7rem;left:.7rem;z-index:70}'+
 '.mnu-ov{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.45)}.mnu-ov[hidden]{display:none}'+
 '.mnu{position:absolute;top:0;left:0;bottom:0;width:min(22rem,88vw);overflow-y:auto;background:var(--bg,#fff);color:var(--ink,#111);box-shadow:4px 0 24px rgba(0,0,0,.25);padding:1rem 1.1rem 2rem;font:500 1rem/1.3 system-ui,-apple-system,sans-serif;text-shadow:none}'+
 '.mnu-h{display:flex;justify-content:space-between;align-items:center;margin:0 0 .6rem}.mnu-h b{font-size:1.15rem}.mnu-x{font:inherit;color:inherit;background:none;border:1.5px solid currentColor;border-radius:999px;padding:.4rem .8rem;cursor:pointer}.mnu-x:focus-visible,.mnu a:focus-visible{outline:3px solid var(--focus,#06c);outline-offset:2px}'+
 '.mnu h2{margin:1.2rem 0 .3rem;font:800 .74rem/1 system-ui,sans-serif;letter-spacing:.07em;text-transform:uppercase;color:var(--muted,#555)}.mnu ul{list-style:none;margin:0;padding:0}.mnu a{display:block;color:inherit;text-decoration:none;padding:.65rem .6rem;border-radius:8px}.mnu a:hover{background:var(--surface,#eee);text-decoration:underline;text-underline-offset:3px}.mnu a[aria-current]{font-weight:800;border-left:4px solid var(--ink,#111)}'+
 '.mnu-t{display:flex;width:100%;justify-content:space-between;align-items:center;gap:.5rem;font:inherit;color:inherit;background:none;border:0;border-radius:8px;text-align:left;padding:.65rem .6rem;cursor:pointer}.mnu-t:hover{background:var(--surface,#eee)}.mnu-t:focus-visible{outline:3px solid var(--focus,#06c);outline-offset:2px}.mnu-t svg{width:.9rem;height:.9rem;flex:none;transition:transform .15s}.mnu-t[aria-expanded="true"] svg{transform:rotate(180deg)}.mnu-s{margin:0 0 .4rem .6rem!important;padding-left:.5rem!important;border-left:2px solid var(--line,#ccc)}.mnu-s a{padding:.5rem .6rem;font-size:.95rem}.mnu-s[hidden]{display:none}.mnu-all a,.mnu-s .mnu-all{font-weight:700}'+
 '@media print{.mnu-btn,.mnu-ov{display:none!important}}';
 document.head.appendChild(st);
 var b=document.createElement('button');b.type='button';b.id='mnu-btn';b.className='mnu-btn';b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','mnu-ov');
 b.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span>Menu</span>';
 var host=document.querySelector('.tsbar')||document.querySelector('body > nav > span');
 var tn0=null;if(!host){tn0=document.querySelector('body > nav');if(!(tn0&&tn0.style.display==='flex'&&tn0.children.length>1))tn0=null}
 if(tn0){tn0.insertBefore(b,tn0.children[1])}
 else if(host){host.insertBefore(b,host.firstChild);if(host.classList.contains('tsbar')){host.style.display='flex';host.style.justifyContent='flex-end';host.style.gap='.6rem';host.style.flexWrap='wrap'}}
 else{b.classList.add('mnu-fx');document.body.appendChild(b)}
 var ov=document.createElement('div');ov.id='mnu-ov';ov.className='mnu-ov';ov.hidden=true;
 var cur=location.pathname.split('/').pop()||'index.html';if(cur==='index.html')cur='accueil.html';
 var h='<nav class="mnu" role="dialog" aria-modal="true" aria-label="Menu principal"><div class="mnu-h"><b>Menu</b><button type="button" class="mnu-x">Fermer</button></div>',open=false;
 ITEMS.forEach(function(it){if(!it[1]){if(open)h+='</ul>';h+='<h2>'+it[0]+'</h2><ul>';open=true}else{if(!open){h+='<ul>';open=true}var gid=it[1].indexOf('#g-')>0?it[1].split('#')[1]:null,sub=gid&&SUB[gid];
  if(sub){h+='<li><button type="button" class="mnu-t" aria-expanded="false" aria-controls="s-'+gid+'" data-g="'+gid+'"><span>'+it[0]+'</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button><ul class="mnu-s" id="s-'+gid+'" hidden><li><a class="mnu-all" href="'+it[1]+'">Toute la rubrique</a></li>'+sub.map(function(x){return '<li><a href="accueil.html#'+x[1]+'" title="'+x[0]+'">'+x[0].split(' : ')[0]+'</a></li>'}).join('')+'</ul></li>'}
  else h+='<li><a href="'+it[1]+'"'+(it[1]===cur?' aria-current="page"':'')+'>'+it[0]+'</a></li>'}});
 h+='</ul></nav>';ov.innerHTML=h;document.body.appendChild(ov);
 function set(o){ov.hidden=!o;b.setAttribute('aria-expanded',o?'true':'false');document.documentElement.style.overflow=o?'hidden':'';if(o){ov.querySelector('.mnu-x').focus()}else b.focus()}
 function tg(t,o){t.setAttribute('aria-expanded',o);document.getElementById(t.getAttribute('aria-controls')).hidden=!o}
 ov.addEventListener('click',function(e){var t=e.target.closest('.mnu-t');if(t){e.stopPropagation();tg(t,t.getAttribute('aria-expanded')!=='true')}},true);
 b.addEventListener('click',function(){if(ov.hidden){var a=document.querySelector('nav[aria-label="Fil d’Ariane"] a[href*="#g-"]');if(a){var g=a.getAttribute('href').split('#')[1],t=ov.querySelector('.mnu-t[data-g="'+g+'"]');if(t&&t.getAttribute('aria-expanded')!=='true')tg(t,true)}}set(ov.hidden)});
 ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('.mnu-x')||e.target.closest('a'))set(false)});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!ov.hidden)set(false)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
