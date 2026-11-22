/* Ouverture en haut de page (sauf lien avec ancre) */
(function(){if(location.hash)return;function top(){if(!location.hash&&window.scrollY>0)window.scrollTo(0,0)}top();document.addEventListener('DOMContentLoaded',top);window.addEventListener('load',function(){top();setTimeout(top,150)});window.addEventListener('pageshow',function(e){if(!e.persisted)top()})})();
/* Menu hamburger : accès à toutes les rubriques depuis chaque page */
(function(){
var ITEMS=[["Accueil", "rubriques.html"], ["Mon carnet de suivi", "carnet.html"], ["L’Agora des vignettes", "album.html"], ["Le bestiaire des sophismes", "bestiaire-sophismes.html"], ["Mes favoris", "rubriques.html#favoris"], ["Les parcours guidés", null], ["Réviser un thème", "parcours-notion.html"], ["Préparer une dissertation", "parcours-dissertation.html"], ["Préparer une explication", "parcours-explication.html"], ["Les essentiels", null], ["Les thèmes", "rubrique-themes.html"], ["Repères et méthodes", "rubrique-reperes.html"], ["Plans de cours", "rubrique-plans.html"], ["Le bac", "rubrique-bac.html"], ["Les outils", null], ["La Joute Philosophique", "joute.html"], ["La carte des notions", "carte-notions.html"], ["Les flashcards", "flashcards.html"], ["Comparer deux auteurs", "comparer.html"], ["La frise des philosophes", "frise-philosophes.html"], ["Les approfondissements", null], ["Culture générale", "rubrique-culture.html"], ["Pour aller plus loin", "rubrique-approfondir.html"], ["Philosophie et spécialités", "rubrique-specialites.html"], ["La philo en BD", "rubrique-bd.html"], ["EMC", "rubrique-emc.html"]];
var SUB={"g-themes": [["Art : série générale et technologiques", "n-art-serie-generale-et-technologiques"], ["Bonheur : série générale", "n-bonheur-serie-generale"], ["Conscience : série générale", "n-conscience-serie-generale"], ["Devoir : série générale", "n-devoir-serie-generale"], ["État : série générale", "n-etat-serie-generale"], ["Inconscient : série générale", "n-inconscient-serie-generale"], ["Justice : série générale et technologiques", "n-justice-serie-generale-et-technologiques"], ["Langage : série générale", "n-langage-serie-generale"], ["Liberté : série générale et technologiques", "n-liberte-serie-generale-et-technologiques"], ["Nature : série générale et technologiques", "n-nature-serie-generale-et-technologiques"], ["Religion : série générale et technologiques", "n-religion-serie-generale-et-technologiques"], ["Technique : série générale et technologiques", "n-technique-serie-generale-et-technologiques"], ["Temps : série générale", "n-temps-serie-generale"], ["Travail : série générale", "n-travail-serie-generale"], ["Vérité : série générale et technologiques", "n-verite-serie-generale-et-technologiques"]], "g-reperes": [["Repères conceptuels", "n-reperes-conceptuels"], ["Méthodologies", "n-methodologies"]], "g-bac": [["Pour se préparer : série générale et technologiques", "n-pour-se-preparer-serie-generale-et-technologiques"], ["Pour s’entraîner", "n-pour-s-entrainer"]], "g-culture": [["Œuvres d’art", "n-uvres-d-art"], ["Podcasts, cours et conférences", "n-podcasts-cours-et-conferences"], ["Vidéos", "n-videos"], ["Ouvrages à lire", "n-ouvrages-a-lire"], ["Textes dans leur langue d’origine", "n-textes-dans-leur-langue-d-origine"]], "g-specialites": [["Philosophie et HGGSP", "n-philosophie-et-hggsp"], ["Philosophie et SES", "n-philosophie-et-ses"], ["Philosophie et mathématiques", "n-philosophie-et-mathematiques"]], "g-approfondir": [["Sociologie", "n-sociologie"], ["Démocratie et sciences", "n-democratie-et-sciences"], ["Préparer le concours commun du réseau ScPo", "n-preparer-le-concours-commun-du-reseau-scpo"]], "g-emc": [["Démocratie", "n-democratie"], ["Anarchie", "n-anarchie"]]};
function init(){
 if(document.getElementById('mnu-btn'))return;
 var st=document.createElement('style');
 st.textContent='.mnu-btn{display:inline-flex;align-items:center;gap:.5rem;font:600 .88rem/1 system-ui,-apple-system,sans-serif;color:var(--ink,#111);background:var(--surface,var(--paper,var(--bg,#fff)));border:1.5px solid var(--ink,#111);border-radius:999px;padding:.55rem .95rem;cursor:pointer}.mnu-btn:hover{background:var(--ink,#111);color:var(--surface,var(--paper,var(--bg,#fff)))}.mnu-btn:focus-visible{outline:3px solid var(--focus,#06c);outline-offset:2px}.mnu-fx{position:fixed;top:.7rem;left:.7rem;z-index:70}'+
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
 var cur=location.pathname.split('/').pop()||'index.html';if(cur==='index.html')cur='index.html';
 var h='<nav class="mnu" role="dialog" aria-modal="true" aria-label="Menu principal"><div class="mnu-h"><b>Menu</b><button type="button" class="mnu-x">Fermer</button></div>',open=false;
 ITEMS.forEach(function(it){if(!it[1]){if(open)h+='</ul>';h+='<h2>'+it[0]+'</h2><ul>';open=true}else{if(!open){h+='<ul>';open=true}var gm=/^rubrique-([a-z]+)\.html$/.exec(it[1]),gid=gm?'g-'+gm[1]:null,sub=gid&&SUB[gid];
  if(sub){h+='<li><button type="button" class="mnu-t" aria-expanded="false" aria-controls="s-'+gid+'" data-g="'+gid+'"><span>'+it[0]+'</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button><ul class="mnu-s" id="s-'+gid+'" hidden><li><a class="mnu-all" href="'+it[1]+'">Toute la rubrique</a></li>'+sub.map(function(x){return '<li><a href="rubrique-'+gid.slice(2)+'.html#'+x[1]+'" title="'+x[0]+'">'+x[0].split(' : ')[0]+'</a></li>'}).join('')+'</ul></li>'}
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

/*FAV-START*/
/* Favoris : bouton « Ajouter aux favoris » sur les pages de contenu ; la liste s'affiche sur la page des rubriques. */
(function(){
var f=location.pathname.split('/').pop()||'index.html';
if(!/\.html$/.test(f)||/^(index|accueil|accueil-proposition|rubriques|rubrique-[a-z]+|carnet|album)\.html$/.test(f))return;
var K='favoris';
function L(){try{var v=JSON.parse(localStorage.getItem(K)||'[]');return Array.isArray(v)?v:[]}catch(e){return []}}
function S(v){try{localStorage.setItem(K,JSON.stringify(v));return true}catch(e){return false}}
function has(){return L().some(function(x){return x.f===f})}
function init(){
 if(document.getElementById('fav-btn'))return;
 var m=document.getElementById('mnu-btn');if(!m)return;
 var b=document.createElement('button');b.type='button';b.id='fav-btn';b.className=m.className.replace('mnu-fx','').trim();
 var t=document.title||(document.querySelector('h1')||{}).textContent||f;t=t.replace(/\s+/g,' ').trim();
 function draw(){var on=has();b.setAttribute('aria-pressed',on?'true':'false');b.title=on?'Retirer des favoris':'Ajouter aux favoris';
  b.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="'+(on?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg><span>'+(on?'Dans mes favoris':'Ajouter aux favoris')+'</span>'}
 b.addEventListener('click',function(){var v=L();if(has())v=v.filter(function(x){return x.f!==f});else v.unshift({f:f,t:t,d:Date.now()});S(v);draw()});
 draw();
 var st=document.createElement('style');st.textContent='@media(max-width:600px){#fav-btn span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}#fav-btn{padding-inline:.75rem}}';document.head.appendChild(st);
 if(m.classList.contains('mnu-fx')){b.style.cssText='position:fixed;top:.7rem;left:calc(.7rem + '+(m.offsetWidth+8)+'px);z-index:70'}
 m.parentNode.insertBefore(b,m.nextSibling);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
/*FAV-END*/

/*FICHE-START*/
/* Fiches de révision : bouton « Ajouter à ma fiche » sur les pages de cours ; les fiches s’ouvrent dans ma-fiche.html. */
(function(){
var P={"art-hume-sentiment.html":["Hume : opinion et sentiment","L’art"],"art-bourdieu.html":["Bourdieu : l’idéologie charismatique","L’art"],"art-kant.html":["Kant : le jugement de goût","L’art"],"art-arendt.html":["Arendt : l’œuvre d’art","L’art"],"art-hume-delicatesse.html":["Hume : la délicatesse du goût","L’art"],"bonheur-kant-difficulte.html":["Kant : la difficulté de définir le bonheur","Le bonheur"],"bonheur-callicles.html":["Calliclès et Socrate : l’image des tonneaux","Le bonheur"],"bonheur-epicure.html":["Épicure : les différents désirs","Le bonheur"],"bonheur-rousseau.html":["Rousseau : les désirs et les facultés","Le bonheur"],"bonheur-epictete.html":["Épictète : les opinions troublent les hommes","Le bonheur"],"epictete.html":["Épictète : ce qui dépend de nous","Le bonheur"],"bonheur-descartes-epictete.html":["Épictète et Descartes : acceptation et grandeur d’âme","Le bonheur"],"bonheur-kant-digne.html":["Kant : se rendre digne du bonheur","Le bonheur"],"bonheur-aristophane.html":["Aristophane : le mythe des moitiés séparées","Le bonheur"],"bonheur-bergson.html":["Bergson : la joie, signe de la création","Le bonheur"],"descartes-du-doute-au-cogito.html":["Descartes : du doute au cogito","La conscience"],"conscience-hobbes.html":["Hobbes : objection au cogito de Descartes","La conscience"],"conscience-hume.html":["Hume : le moi n’est qu’un faisceau de perceptions","La conscience"],"conscience-sartre.html":["Sartre : condamné à être libre","La conscience"],"le-devoir.html":["Le devoir","Le devoir"],"devoir-kant.html":["Kant : la bonne volonté et le devoir","Le devoir"],"devoir-rousseau-pitie.html":["Rousseau : la pitié, sentiment naturel","Le devoir"],"devoir-rousseau-conscience.html":["Rousseau : la conscience, instinct divin","Le devoir"],"devoir-holbach.html":["D’Holbach : fonder la morale sur la nature","Le devoir"],"devoir-durkheim.html":["Durkheim : le devoir comme fait social","Le devoir"],"devoir-nietzsche.html":["Nietzsche : morale du troupeau et mauvaise conscience","Le devoir"],"devoir-kropotkine.html":["Kropotkine : pourquoi serais-je moral ?","Le devoir"],"devoir-sartre.html":["Sartre : le dilemme moral d’un jeune homme","Le devoir"],"devoir-eichmann.html":["Arendt : Eichmann et l’impératif catégorique","Le devoir"],"etat-hobbes.html":["Hobbes : l’état de nature, guerre de tous contre tous","L’État"],"etat-nietzsche.html":["Nietzsche : l’État, le plus froid des monstres froids","L’État"],"etat-chapoutot.html":["Chapoutot : les nazis, ennemis de l’État ?","L’État"],"inconscient-leibniz.html":["Leibniz : les petites perceptions","L’inconscient"],"inconscient-freud.html":["Freud : l’hypothèse de l’inconscient","L’inconscient"],"inconscient-freud-elisabeth.html":["Freud : le cas d’Élisabeth","L’inconscient"],"justice-platon-gyges.html":["Platon : le mythe de l’anneau de Gygès","La justice"],"justice-platon-lois.html":["Platon : pourquoi avoir des lois ?","La justice"],"justice-hobbes.html":["Hobbes : qu’est-ce qu’une bonne loi ?","La justice"],"justice-smith.html":["Smith : la justice et la négligence","La justice"],"justice-rawls.html":["Rawls : l’intuitionnisme en matière de justice","La justice"],"langage-descartes.html":["Descartes : le langage, propre de l’homme","Le langage"],"langage-saussure.html":["Saussure : l’arbitraire du signe","Le langage"],"langage-wittgenstein.html":["Wittgenstein : usage et signification","Le langage"],"langage-austin.html":["Austin : la performativité","Le langage"],"langage-klemperer.html":["Klemperer : la langue du Troisième Reich","Le langage"],"ane-de-buridan.html":["L’âne de Buridan","La liberté"],"determinisme-social.html":["Le déterminisme social","La liberté"],"spinoza-lettre-a-schuller.html":["Spinoza : l’ignorance des causes déterminantes","La liberté"],"les-stereotypes.html":["Les stéréotypes","La liberté"],"nature-genese.html":["Genèse : la domination de l’homme sur la nature","La nature"],"nature-aristote.html":["Aristote : voix, parole et langage animal","La nature"],"nature-pascal.html":["Pascal : ruches et hommes","La nature"],"nature-descartes.html":["Descartes : maîtres et possesseurs de la nature","La nature"],"nature-galilee.html":["Galilée : l’univers, un livre écrit en langue mathématique","La nature"],"nature-mill.html":["Mill : faut-il suivre la nature ?","La nature"],"nature-jacob.html":["Jacob : le refus de la finalité comme principe explicatif","La nature"],"nature-descola.html":["Descola : la nature des Modernes","La nature"],"religion-preuves-dieu.html":["Les principales preuves et réfutations de l’existence de Dieu","La religion"],"religion-kant.html":["Kant : l’existence de Dieu comme nécessité morale","La religion"],"religion-marx.html":["Marx : la religion est l’opium du peuple","La religion"],"religion-nietzsche.html":["Nietzsche : la mort de Dieu","La religion"],"religion-definition.html":["Les difficultés pour définir la religion","La religion"],"technique-bacon.html":["Bacon : vaincre la nature en lui obéissant","La technique"],"technique-heidegger.html":["Heidegger : le Rhin, de fleuve à ressource","La technique"],"technique-hoelderlin.html":["Hölderlin : le Rhin, fleuve libre","La technique"],"technique-arendt.html":["Arendt : animal laborans et homo faber","La technique"],"technique-levinas.html":["Lévinas : défendre l’homme contre la technique ?","La technique"],"temps-bergson.html":["Bergson : l’exemple de l’eau sucrée","Le temps"],"temps-proust.html":["Proust : l’extra-temporalité","Le temps"],"temps-einstein.html":["Einstein : temps du physicien et temps psychologique","Le temps"],"temps-sartre.html":["Sartre : passé et présent","Le temps"],"travail-alienation-emancipation.html":["Le travail : aliénation ou émancipation ?","Le travail"],"le-travail.html":["Le travail","Le travail"],"travail-genese.html":["Genèse 3 : le travail comme punition","Le travail"],"travail-aristote.html":["Aristote : citoyen et travail","Le travail"],"travail-hegel.html":["Hegel : le maître et le serviteur","Le travail"],"travail-marx-specificite.html":["Marx : la spécificité du travail humain","Le travail"],"travail-marx-alienation.html":["Marx : l’aliénation par le travail","Le travail"],"travail-russell.html":["Russell : éloge de l’oisiveté","Le travail"],"croyance-certitude-conviction.html":["Croyance, certitude, connaissance, conviction","La vérité"],"verite-platon.html":["Platon : le mythe de la caverne","La vérité"],"pascal.html":["Pascal : le cœur et le pari","La vérité"],"verite-hume.html":["Hume : croyance raisonnable","La vérité"],"verite-russell.html":["Russell : la poule inductiviste","La vérité"],"verite-james.html":["James : le pragmatisme","La vérité"],"verite-rousseau.html":["Rousseau : dire faux et mentir","La vérité"],"verite-kant.html":["Kant : mensonge et devoir","La vérité"]};
var f=location.pathname.split('/').pop()||'index.html';if(!P[f])return;
var K='mes-fiches';
function L(){var d;try{d=JSON.parse(localStorage.getItem(K)||'null')}catch(e){}if(!d||!d.f||!d.f.length)d={c:'f1',f:[{id:'f1',t:'Ma fiche',it:[]}]};return d}
function cur(d){return d.f.filter(function(x){return x.id===d.c})[0]||d.f[0]}
function has(){return cur(L()).it.some(function(x){return x.s==='page'&&x.p===f})}
function init(){
 if(document.getElementById('fiche-btn'))return;
 var m=document.getElementById('mnu-btn');if(!m)return;
 var b=document.createElement('button');b.type='button';b.id='fiche-btn';b.className=m.className.replace('mnu-fx','').trim();
 function draw(){var on=has(),t=cur(L()).t||'Ma fiche';b.setAttribute('aria-pressed',on?'true':'false');b.title=on?'Déjà dans « '+t+' » : ouvrir mes fiches':'Ajouter cette page à « '+t+' »';
  b.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/>'+(on?'<path d="M9 14l2 2 4-4"/>':'<path d="M12 10v6M9 13h6"/>')+'</svg><span>'+(on?'Dans ma fiche':'Ajouter à ma fiche')+'</span>'}
 var tst=document.createElement('div');tst.className='fiche-toast';tst.setAttribute('role','status');document.body.appendChild(tst);
 b.addEventListener('click',function(){if(has()){location.href='ma-fiche.html';return}
  var d=L(),F=cur(d);F.it.push({id:'i'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),s:'page',p:f,t:P[f][0],n:P[f][1]});
  try{localStorage.setItem(K,JSON.stringify(d))}catch(e){}draw();
  tst.innerHTML='Page ajoutée à « '+String(F.t||'Ma fiche').replace(/&/g,'&amp;').replace(/</g,'&lt;')+' ». <a href="ma-fiche.html">Ouvrir mes fiches</a>';tst.classList.add('on');clearTimeout(tst._t);tst._t=setTimeout(function(){tst.classList.remove('on')},4500)});
 draw();window.addEventListener('storage',function(e){if(e.key===K)draw()});
 var st=document.createElement('style');st.textContent='@media(max-width:600px){#fiche-btn span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}#fiche-btn{padding-inline:.75rem}}.fiche-toast{position:fixed;left:50%;bottom:max(1rem,env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:2147483000;background:#1a1a1a;color:#fff;border:1.5px solid #fff;border-radius:12px;padding:.7rem 1rem;font:600 .92rem/1.4 system-ui,-apple-system,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.35);display:none;max-width:calc(100% - 2rem)}.fiche-toast.on{display:block}.fiche-toast a{color:#ffe27a}@media print{#fiche-btn,.fiche-toast{display:none!important}}';document.head.appendChild(st);
 var ref=document.getElementById('fav-btn')||m;
 if(m.classList.contains('mnu-fx')){var x=ref.getBoundingClientRect();b.style.cssText='position:fixed;top:.7rem;left:'+(x.right+8)+'px;z-index:70'}
 ref.parentNode.insertBefore(b,ref.nextSibling);
}
function go(){setTimeout(init,0)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
/*FICHE-END*/

/* « etc. », locutions et mots latins en italique, y compris dans les contenus affichés par script */
(function(){
var RE=/(^|[^0-9A-Za-zÀ-ɏ_])(etc\.|a priori|a posteriori|cf\.|ad hominem|ad hoc|conditio sine qua non|sine qua non|ex nihilo|cogito|homo faber|animal laborans|habitus|jus ad bellum|jus in bello|sufficientia vitae|otium|negotium|tripalium)(?![0-9A-Za-zÀ-ɏ_])/i;
var SK='script,style,textarea,option,em,i,code,pre,cite,title,svg,input,select,[contenteditable],.vo,[lang]:not([lang="fr"])';
function fix(t){
 var p=t.parentElement;if(!p||p.closest(SK))return;
 var s=t.data;if(!RE.test(s))return;
 var g=new RegExp(RE.source,'gi'),f=document.createDocumentFragment(),last=0,m;
 while((m=g.exec(s))){var a=m.index+m[1].length;f.appendChild(document.createTextNode(s.slice(last,a)));var e=document.createElement('em');e.textContent=m[2];f.appendChild(e);last=a+m[2].length}
 f.appendChild(document.createTextNode(s.slice(last)));p.replaceChild(f,t);
}
function walk(root){
 if(root.nodeType===3){fix(root);return}
 if(root.nodeType!==1||root.closest&&root.closest(SK))return;
 var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),l=[],n;
 while((n=w.nextNode()))if(RE.test(n.data))l.push(n);
 l.forEach(fix);
}
function init(){
 walk(document.body);
 new MutationObserver(function(ms){ms.forEach(function(m){[].forEach.call(m.addedNodes,walk)})}).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* Un seul bouton « Menu » qui regroupe : navigation, favoris, ma fiche, accessibilité, PDF */
(function(){
var st=document.createElement('style');
st.textContent='.grp{position:relative;display:inline-block}'+
'.grp-p{position:absolute;right:0;top:calc(100% + .45rem);z-index:61;width:max-content;min-width:15rem;max-width:calc(100vw - 2rem);background:var(--bg,var(--paper,#fff));color:var(--ink,#111);border:1.5px solid var(--ink,#111);border-radius:14px;padding:.45rem;box-shadow:0 10px 28px rgba(0,0,0,.22);display:flex;flex-direction:column;align-items:stretch;gap:.35rem;text-shadow:none}'+
'.grp-p[hidden]{display:none}'+
'.grp-p>*{margin:0!important;position:relative}'+
'.grp-p button{width:100%;justify-content:flex-start;text-align:left}'+
'.grp-p .a11y{display:block!important;margin:0!important}.grp-p .a11y>button{width:100%}'+
'.grp-p .a11y-menu{position:static!important;margin-top:.35rem;box-shadow:none;min-width:0!important}'+
'.grp-p #fav-btn>span,.grp-p #fiche-btn>span{position:static!important;width:auto!important;height:auto!important;overflow:visible!important;clip:auto!important;white-space:normal!important}'+
'@media print{.grp{display:none!important}}';
document.head.appendChild(st);
function setup(){
 var m=document.getElementById('mnu-btn');if(!m||document.getElementById('grp-btn'))return;
 if(getComputedStyle(m).display==='none')return;
 var host=m.parentElement;
 var wrap=document.createElement('span');wrap.className='grp';
 var gb=document.createElement('button');gb.type='button';gb.id='grp-btn';gb.className='mnu-btn grp-btn';
 gb.setAttribute('aria-expanded','false');gb.setAttribute('aria-controls','grp-p');
 gb.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span>Menu</span>';
 var pn=document.createElement('div');pn.id='grp-p';pn.className='grp-p';pn.hidden=true;pn.setAttribute('role','group');pn.setAttribute('aria-label','Menu de la page');
 wrap.appendChild(gb);wrap.appendChild(pn);host.insertBefore(wrap,m);
 if(m.classList.contains('mnu-fx')){m.classList.remove('mnu-fx');wrap.style.cssText='position:fixed;top:.7rem;right:.7rem;z-index:70'}
 var sp=m.querySelector('span');if(sp)sp.textContent='Naviguer dans le site';
 function put(el){if(el&&!pn.contains(el)&&!el.contains(wrap))pn.appendChild(el)}
 function collect(){
  put(m);put(document.getElementById('fav-btn'));put(document.getElementById('fiche-btn'));
  var ab=document.getElementById('a11y-btn');
  if(ab){var box=ab.closest('.a11y');if(box&&!box.contains(wrap))put(box);else{put(ab);put(document.getElementById('a11y-menu'))}}
  var pdf=document.querySelector('button[onclick*="print"]');if(pdf&&pdf.closest('nav,header,.tsbar,.a11y,span'))put(pdf);
 }
 collect();
 var mo=new MutationObserver(collect);mo.observe(document.body,{childList:true,subtree:true});
 window.addEventListener('load',function(){setTimeout(function(){collect();mo.disconnect()},1500)});
 function place(){if(pn.hidden)return;pn.style.left='';pn.style.right='';
  var vw=document.documentElement.clientWidth,m=12,wr=wrap.getBoundingClientRect(),r=pn.getBoundingClientRect();
  if(r.left<m||r.right>vw-m){var w=Math.min(r.width,vw-2*m),l=Math.max(m,Math.min(wr.right-w,vw-m-w));pn.style.right='auto';pn.style.left=(l-wr.left)+'px'}}
 function set(o){pn.hidden=!o;gb.setAttribute('aria-expanded',o);place()}
 window.addEventListener('resize',place);pn.addEventListener('click',function(){setTimeout(place,0)});
 gb.addEventListener('click',function(e){e.stopPropagation();set(pn.hidden)});
 pn.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(b.id==='a11y-btn'||b.closest('#a11y-menu'))return;setTimeout(function(){set(false)},0)});
 document.addEventListener('click',function(e){if(!pn.hidden&&!wrap.contains(e.target))set(false)});
 wrap.addEventListener('focusout',function(e){if(!pn.hidden&&e.relatedTarget&&!wrap.contains(e.relatedTarget))set(false)});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!pn.hidden){var am=document.getElementById('a11y-menu');if(am&&!am.hidden)return;set(false);gb.focus()}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(setup,0)});else setTimeout(setup,0);
})();

/* Lien d’évitement « Aller au contenu » et zones défilantes accessibles au clavier */
(function(){
function skip(){
 if(document.getElementById('aller-contenu'))return;
 var m=document.querySelector('main');if(!m)return;
 if(!m.id)m.id='contenu';if(!m.hasAttribute('tabindex'))m.setAttribute('tabindex','-1');
 var st=document.createElement('style');
 st.textContent='#aller-contenu{position:absolute;left:.6rem;top:-4rem;z-index:100;font:600 .95rem/1 system-ui,-apple-system,sans-serif;background:var(--ink,#111);color:var(--surface,var(--paper,var(--bg,#fff)));padding:.7rem 1rem;border-radius:10px;text-decoration:none;transition:top .15s}#aller-contenu:focus{top:.6rem;outline:3px solid var(--focus,#06c);outline-offset:2px}main:focus{outline:none}@media print{#aller-contenu{display:none}}';
 document.head.appendChild(st);
 var a=document.createElement('a');a.id='aller-contenu';a.href='#'+m.id;a.textContent='Aller au contenu';
 document.body.insertBefore(a,document.body.firstChild);
}
function scrollers(){
 [].forEach.call(document.querySelectorAll('body *'),function(e){
  if(e.hasAttribute('tabindex')||e.offsetParent===null&&getComputedStyle(e).position!=='fixed')return;
  var s=getComputedStyle(e);
  if(!/(auto|scroll)/.test(s.overflowY+' '+s.overflowX))return;
  if(e.scrollHeight<=e.clientHeight+2&&e.scrollWidth<=e.clientWidth+2)return;
  if(e.querySelector('a[href],button,input,select,textarea,[tabindex]'))return;
  e.setAttribute('tabindex','0');
  if(!e.getAttribute('role'))e.setAttribute('role','region');
  if(!e.getAttribute('aria-label')&&!e.getAttribute('aria-labelledby'))e.setAttribute('aria-label','Zone à faire défiler');
 });
}
function init(){skip();scrollers();setTimeout(scrollers,1500);window.addEventListener('resize',function(){clearTimeout(init.t);init.t=setTimeout(scrollers,400)});document.addEventListener('toggle',function(){setTimeout(scrollers,50)},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
