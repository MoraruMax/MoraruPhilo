/* Transfert de progression entre appareils, par code (sans serveur). */
(function(){
var SALT='carnet-philo-2026',PFX='PHILO',EXCL=/^(texte-seul|mode-lecture|confort|derniere-page|voix|vo-)/;
function fnv(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0}return h}
function b64(u8){var s='';for(var i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function unb64(t){t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';var s=atob(t),u=new Uint8Array(s.length);for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
function pipe(u8,Stream){var cs=new Stream('deflate-raw');var w=cs.writable.getWriter();w.write(u8);w.close();return new Response(cs.readable).arrayBuffer().then(function(b){return new Uint8Array(b)})}
var HAS=typeof CompressionStream!=='undefined'&&typeof DecompressionStream!=='undefined';
function collect(){var o={};for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&!EXCL.test(k))o[k]=localStorage.getItem(k)}return o}
function exportCode(){var data;try{data=collect()}catch(e){return Promise.reject(e)}
 var json=JSON.stringify(data),u8=new TextEncoder().encode(json);
 var p=HAS?pipe(u8,CompressionStream).then(function(z){return 'Z'+b64(z)}):Promise.resolve('J'+b64(u8));
 return p.then(function(body){var c=(fnv(SALT+body)%1679616).toString(36).toUpperCase();while(c.length<4)c='0'+c;return PFX+'-'+c+'-'+body})}
function parseCode(code){code=String(code||'').replace(/\s+/g,'');var m=code.match(/^PHILO-([0-9A-Z]{4})-([ZJ])([A-Za-z0-9_-]+)$/);
 if(!m)return Promise.reject(new Error('format'));var body=m[2]+m[3],c=(fnv(SALT+body)%1679616).toString(36).toUpperCase();while(c.length<4)c='0'+c;
 if(c!==m[1])return Promise.reject(new Error('controle'));
 var u8=unb64(m[3]);var p=m[2]==='Z'?(HAS?pipe(u8,DecompressionStream):Promise.reject(new Error('navigateur'))):Promise.resolve(u8);
 return p.then(function(r){return JSON.parse(new TextDecoder().decode(r))})}
function idOf(x){return x&&typeof x==='object'?(x.k!=null?'k:'+x.k:x.i!=null?'i:'+x.i:JSON.stringify(x)):JSON.stringify(x)}
function merge(a,b){
 if(Array.isArray(a)&&Array.isArray(b)){var seen={},out=a.slice();a.forEach(function(x){seen[idOf(x)]=1});b.forEach(function(x){var id=idOf(x);if(!seen[id]){seen[id]=1;out.push(x)}});return out}
 if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){
  if(Array.isArray(a.slice)){} var o={},k;for(k in a)o[k]=a[k];for(k in b)o[k]=(k in a)?merge(a[k],b[k]):b[k];return o}
 if(typeof a==='number'&&typeof b==='number')return Math.max(a,b);
 if(typeof a==='boolean'||typeof b==='boolean')return !!(a||b);
 if(a==null||a==='')return b;return a}
function bestScore(a,b){var o={},k;for(k in a)o[k]=a[k];for(k in b){var x=a[k],y=b[k];if(!x){o[k]=y;continue}if(!y)continue;
 var rx=x[1]?x[0]/x[1]:0,ry=y[1]?y[0]/y[1]:0;o[k]=ry>rx?y:x}return o}
function importData(data){var n=0;Object.keys(data).forEach(function(k){if(EXCL.test(k))return;var nv=data[k],ov=localStorage.getItem(k),res;
  if(ov==null)res=nv;else{var A,B,ok=true;try{A=JSON.parse(ov);B=JSON.parse(nv)}catch(e){ok=false}
   if(!ok)res=ov||nv;
   else if(/^carnet-quiz/.test(k)&&A&&B&&typeof A==='object')res=JSON.stringify(bestScore(A,B));
   else res=JSON.stringify(merge(A,B))}
  if(res!==ov){localStorage.setItem(k,res);n++}});return n}

/* ---- Code court : données essentielles, encodage binaire compact (bits) ---- */
var CAT={"Q":["anarchie.html","ane-de-buridan.html","art-arendt.html","art-bourdieu.html","art-et-verite.html","art-hume-delicatesse.html","art-hume-sentiment.html","art-kant.html","bonheur-aristophane.html","bonheur-bergson.html","bonheur-callicles.html","bonheur-descartes-epictete.html","bonheur-epictete.html","bonheur-epicure.html","bonheur-kant-difficulte.html","bonheur-kant-digne.html","bonheur-rousseau.html","conscience-hobbes.html","conscience-hume.html","conscience-sartre.html","descartes-du-doute-au-cogito.html","determinisme-social.html","devoir-durkheim.html","devoir-eichmann.html","devoir-holbach.html","devoir-kant.html","devoir-kropotkine.html","devoir-nietzsche.html","devoir-rousseau-conscience.html","devoir-rousseau-pitie.html","devoir-sartre.html","epictete.html","etat-chapoutot.html","etat-hobbes.html","etat-nietzsche.html","inconscient-freud-elisabeth.html","inconscient-freud.html","inconscient-leibniz.html","justice-hobbes.html","justice-platon-gyges.html","justice-platon-lois.html","justice-rawls.html","justice-smith.html","langage-austin.html","langage-descartes.html","langage-klemperer.html","langage-saussure.html","langage-wittgenstein.html","le-devoir.html","le-travail.html","les-stereotypes.html","methode-dissertation.html","methode-explication-de-texte.html","methode-explication-texte.html","nature-aristote.html","nature-descartes.html","nature-descola.html","nature-galilee.html","nature-genese.html","nature-jacob.html","nature-mill.html","nature-pascal.html","pascal.html","religion-kant.html","religion-marx.html","religion-nietzsche.html","spinoza-lettre-a-schuller.html","technique-arendt.html","technique-bacon.html","technique-heidegger.html","technique-hoelderlin.html","technique-levinas.html","temps-bergson.html","temps-einstein.html","temps-proust.html","temps-sartre.html","textes-democratie.html","travail-alienation-emancipation.html","travail-aristote.html","travail-genese.html","travail-hegel.html","travail-marx-alienation.html","travail-marx-specificite.html","travail-russell.html","verite-kant.html","verite-platon.html","verite-rousseau.html"],"L":["accueil.html","album.html","anarchie.html","ane-de-buridan.html","argumentation.html","art-arendt.html","art-bourdieu.html","art-et-verite.html","art-hume-delicatesse.html","art-hume-sentiment.html","art-kant.html","atelier-dissertation-tech.html","atelier-dissertation.html","atelier-explication-tech.html","atelier-explication.html","atelier-introduction.html","auto-evaluation-dissertation.html","auto-evaluation-explication-tech.html","auto-evaluation-explication.html","bd-augustin-temps.html","bd-caverne-platon.html","bd-descartes-doute.html","bd-descola-nature.html","bd-epicure-jardin.html","bd-etat-de-nature.html","bd-gyges.html","bd-imperatif-categorique.html","bd-marx-table.html","bd-mort-de-dieu.html","bd-promethee.html","bd-sartre-choix.html","bd-zhuangzi.html","bonheur-aristophane.html","bonheur-bergson.html","bonheur-callicles.html","bonheur-descartes-epictete.html","bonheur-epictete.html","bonheur-epicure.html","bonheur-kant-difficulte.html","bonheur-kant-digne.html","bonheur-rousseau.html","carnet.html","comprendre-la-consigne.html","conscience-hobbes.html","conscience-hume.html","conscience-sartre.html","construire-le-plan.html","construire-une-problematique.html","croyance-certitude-conviction.html","descartes-du-doute-au-cogito.html","determinisme-social.html","devoir-durkheim.html","devoir-eichmann.html","devoir-holbach.html","devoir-kant.html","devoir-kropotkine.html","devoir-nietzsche.html","devoir-rousseau-conscience.html","devoir-rousseau-pitie.html","devoir-sartre.html","dissertation-a-completer.html","dissertation-commentee.html","epictete.html","etat-chapoutot.html","etat-hobbes.html","etat-nietzsche.html","fiche-aron-penser-la-guerre-clausewitz.html","fiche-badie-art-de-la-paix.html","fiche-benjamin-critique-de-la-violence.html","fiche-callon-agir-monde-incertain.html","fiche-durkheim-le-suicide.html","fiche-fanon-damnes-de-la-terre.html","fiche-fraser-justice-sociale.html","fiche-freud-einstein-pourquoi-la-guerre.html","fiche-kant-paix-perpetuelle.html","fiche-lefranc-sortir-de-la-violence.html","fiche-mbembe-politiques-inimitie.html","fiche-michaud-la-violence.html","fiche-rosa-alienation-acceleration.html","fiche-walzer-guerres-justes-injustes.html","frise-philosophes.html","inconscient-freud-elisabeth.html","inconscient-freud.html","inconscient-leibniz.html","joute.html","justice-hobbes.html","justice-platon-gyges.html","justice-platon-lois.html","justice-rawls.html","justice-smith.html","langage-austin.html","langage-descartes.html","langage-klemperer.html","langage-saussure.html","langage-wittgenstein.html","le-devoir.html","le-jour-de-l-epreuve.html","le-travail.html","les-stereotypes.html","methode-dissertation.html","methode-explication-de-texte.html","methode-explication-texte.html","nature-aristote.html","nature-descartes.html","nature-descola.html","nature-galilee.html","nature-genese.html","nature-jacob.html","nature-mill.html","nature-pascal.html","oeuvre-d-art.html","ouvrages-a-lire.html","parcours-dissertation.html","parcours-explication.html","parcours-notion.html","pascal.html","philosophie-et-mathematiques.html","plan-bonheur.html","plan-conscience.html","plan-devoir.html","plan-etat.html","plan-inconscient.html","plan-justice.html","plan-langage.html","plan-liberte.html","plan-nature.html","plan-religion.html","plan-technique.html","plan-temps.html","plan-travail.html","plan-verite.html","podcasts-cours-conferences.html","rediger-conclusion.html","rediger-introduction.html","rediger-transitions.html","religion-kant.html","religion-marx.html","religion-nietzsche.html","reperes-conceptuels.html","sociologie-bourdieu.html","sociologie-durkheim.html","sociologie-mauss.html","sociologie-weber.html","specialites-hggsp.html","specialites-ses.html","specialites-sti2d.html","spinoza-lettre-a-schuller.html","technique-arendt.html","technique-bacon.html","technique-heidegger.html","technique-hoelderlin.html","technique-levinas.html","temps-bergson.html","temps-einstein.html","temps-proust.html","temps-sartre.html","textes-allemand.html","textes-anglais.html","textes-democratie.html","textes-grec.html","textes-hebreu.html","travail-alienation-emancipation.html","travail-aristote.html","travail-genese.html","travail-hegel.html","travail-marx-alienation.html","travail-marx-specificite.html","travail-russell.html","utiliser-un-exemple.html","verite-hume.html","verite-kant.html","verite-platon.html","verite-rousseau.html","videos-documentaires.html","carte-notions.html","flashcards.html","comparer.html"],"A":["arendt","aristophane","aristote","bacon","bergson","bourdieu","chapoutot","descartes","descola","durkheim","holbach","einstein","freud","galilee","hegel","heidegger","hobbes","hume","holderlin","jacob","kant","klemperer","kropotkine","leibniz","levinas","marx","mill","nietzsche","pascal","platon","proust","rawls","rousseau","russell","sartre","saussure","smith","spinoza","wittgenstein","epictete","epicure","socrate","la-genese"],"J":["devoir","bonheur","technique","art","conscience","etat","inconscient","justice","langage","nature","religion","temps","travail","verite","liberte","boss"],"SP":["cours","explication","dissertation","dialecticien","argumentation","difficile"],"TD":[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,5,4,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4,4,4,4,4,4,4,4]};/*cat*/
var C32='0123456789ABCDEFGHJKMNPQRSTVWXYZ',B32='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function L(k,d){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v&&typeof v==='object'?v:d}catch(e){return d}}
function BW(){var b=[];function bits(v,n){for(var k=n-1;k>=0;k--)b.push(Math.floor(v/Math.pow(2,k))%2)}
 function gam(n){n=n+1;var l=Math.floor(Math.log2(n));for(var k=0;k<l;k++)b.push(0);bits(n,l+1)}
 return{b:b,bits:bits,gam:gam,rice:function(v,k){var q=Math.floor(v/Math.pow(2,k));for(var j=0;j<q;j++)b.push(1);b.push(0);bits(v%Math.pow(2,k),k)}}}
function BR(b){var p=0;function bit(){if(p>=b.length)throw new Error('format');return b[p++]}
 function bits(n){var v=0;for(var k=0;k<n;k++)v=v*2+bit();return v}
 return{bits:bits,gam:function(){var l=0;while(bit()===0){l++;if(l>40)throw new Error('format')}var v=1;for(var k=0;k<l;k++)v=v*2+bit();return v-1},
  rice:function(k){var q=0;while(bit()===1){q++;if(q>4000)throw new Error('format')}return q*Math.pow(2,k)+bits(k)}}}
function bestK(d){var best=0,bl=1e9;for(var k=0;k<8;k++){var l=0;d.forEach(function(x){l+=Math.floor(x/Math.pow(2,k))+1+k});if(l<bl){bl=l;best=k}}return best}
function wList(w,idx,vals,vb){var o=idx.map(function(x,n){return [x,vals?vals[n]:0]}).sort(function(a,b){return a[0]-b[0]});
 w.gam(o.length);if(!o.length)return;var p=-1,d=o.map(function(x){var r=x[0]-p-1;p=x[0];return r}),k=bestK(d);w.bits(k,3);
 o.forEach(function(x,n){w.rice(d[n],k);if(vb)w.bits(x[1],vb)})}
function rList(r,vb){var n=r.gam(),o=[];if(!n)return o;var k=r.bits(3),p=-1;for(var j=0;j<n;j++){p=p+1+r.rice(k);o.push([p,vb?r.bits(vb):0])}return o}
function keysIn(list,obj,f){var I=[],V=[];Object.keys(obj||{}).forEach(function(k){var i=list.indexOf(k);if(i>-1){var v=f(obj[k]);if(v!=null&&v!==false){I.push(i);V.push(v===true?0:v)}}});return [I,V]}
var CNT=['album-recues','album-donnees','album-shiny-recues','album-shiny-donnees','album-prof'];
function sections(){var Qb=keysIn(CAT.Q,L('carnet-quiz',{}),function(v){return Array.isArray(v)&&v[1]?Math.min(5,Math.round(v[0]*5/v[1])):null});
 var Qd=keysIn(CAT.Q,L('carnet-quiz-defi',{}),function(v){return Array.isArray(v)&&v[1]?Math.min(7,v[0]):null});
 var Lu=keysIn(CAT.L,L('carnet-lues',{}),function(v){return v?true:null});
 var Sh=keysIn(CAT.A,L('album-shiny',{}),function(v){return v?true:null});
 var Cn=CNT.map(function(k){return keysIn(CAT.A,L(k,{}),function(v){return v>0?Math.min(7,v):null})});
 var X=L('album-special',{}),sp=0;CAT.SP.forEach(function(k,i){var v=X[k]||{};if(v.n>0)sp+=Math.pow(2,2*i);if(v.s>0)sp+=2*Math.pow(2,2*i)});
 var J=L('joute',{}),Jw=keysIn(CAT.J,J,function(v){return v&&v.win?(v.flaw?1:0):null});
 var U=L('album-codes-utilises',[]).filter(function(c){return /^[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(c)});
 return {Qb:Qb,Qd:Qd,Lu:Lu,Sh:Sh,Cn:Cn,sp:sp,Jw:Jw,U:U}}
function packShort(){var S=sections(),w=BW();w.bits(1,3);
 var pres=[S.Qb[0].length,S.Qd[0].length,S.Lu[0].length,S.Sh[0].length].concat(S.Cn.map(function(c){return c[0].length})).concat([S.sp,S.Jw[0].length,S.U.length]).map(function(x){return x?1:0});
 pres.forEach(function(x){w.bits(x,1)});var n=0;
 if(pres[n++])wList(w,S.Qb[0],S.Qb[1],3);
 if(pres[n++])wList(w,S.Qd[0],S.Qd[1],3);
 if(pres[n++])wList(w,S.Lu[0]);
 if(pres[n++])wList(w,S.Sh[0]);
 S.Cn.forEach(function(c){if(pres[n++])wList(w,c[0],c[1],3)});
 if(pres[n++])w.gam(S.sp);
 if(pres[n++])wList(w,S.Jw[0],S.Jw[1],1);
 if(pres[n++]){w.gam(S.U.length);S.U.forEach(function(c){var t=c.replace('-','');for(var k=0;k<8;k++)w.bits(B32.indexOf(t[k]),5)})}
 while(w.b.length%5)w.b.push(0);var h=fnv(SALT+w.b.join(''))%1024;w.bits(h,10);
 var o='';for(var i=0;i<w.b.length;i+=5)o+=C32[parseInt(w.b.slice(i,i+5).join(''),2)];
 return o.match(/.{1,4}/g).join('-')}
function unpackShort(code){var t=String(code).toUpperCase().replace(/[\s-]+/g,'').replace(/O/g,'0').replace(/[IL]/g,'1').replace(/U/g,'V');
 if(t.length<3||/[^0-9A-Z]/.test(t))throw new Error('format');var b=[];for(var i=0;i<t.length;i++){var j=C32.indexOf(t[i]);if(j<0)throw new Error('format');for(var k=4;k>=0;k--)b.push((j>>k)&1)}
 var body=b.slice(0,-10),h=parseInt(b.slice(-10).join(''),2);if(fnv(SALT+body.join(''))%1024!==h)throw new Error('controle');
 var r=BR(body);if(r.bits(3)!==1)throw new Error('format');var pres=[];for(var j=0;j<12;j++)pres.push(r.bits(1));var n=0,d={};
 var o={};if(pres[n++])rList(r,3).forEach(function(x){if(CAT.Q[x[0]])o[CAT.Q[x[0]]]=[x[1],5]});d['carnet-quiz']=o;
 o={};if(pres[n++])rList(r,3).forEach(function(x){var p=CAT.Q[x[0]];if(p)o[p]=[x[1],(CAT.TD&&CAT.TD[x[0]])||4]});d['carnet-quiz-defi']=o;
 o={};if(pres[n++])rList(r).forEach(function(x){if(CAT.L[x[0]])o[CAT.L[x[0]]]=1});d['carnet-lues']=o;
 o={};if(pres[n++])rList(r).forEach(function(x){if(CAT.A[x[0]])o[CAT.A[x[0]]]=1});d['album-shiny']=o;
 CNT.forEach(function(k){var o={};if(pres[n++])rList(r,3).forEach(function(x){if(CAT.A[x[0]])o[CAT.A[x[0]]]=x[1]});d[k]=o});
 var sp=pres[n++]?r.gam():0,X={};CAT.SP.forEach(function(k,i){var v=Math.floor(sp/Math.pow(2,2*i))%4;if(v)X[k]={n:v&1?1:0,s:v&2?1:0}});d['album-special']=X;
 var J={};if(pres[n++])rList(r,1).forEach(function(x){if(CAT.J[x[0]])J[CAT.J[x[0]]]=x[1]?{win:1,flaw:1}:{win:1}});d['joute']=J;
 var U=[];if(pres[n++]){var m=r.gam();for(var j=0;j<m;j++){var c='';for(var k=0;k<8;k++)c+=B32[r.bits(5)];U.push(c.slice(0,4)+'-'+c.slice(4))}}d['album-codes-utilises']=U;
 var out={};Object.keys(d).forEach(function(k){var v=d[k];if(Array.isArray(v)?v.length:Object.keys(v).length)out[k]=JSON.stringify(v)});return out}
window.Sauvegarde={exportCode:exportCode,parseCode:parseCode,importData:importData,packShort:packShort,unpackShort:unpackShort};
/* Interface (si présente sur la page) */
function $(id){return document.getElementById(id)}
function msg(id,t,c){var m=$(id);if(m){m.textContent=t;m.className='sv-msg '+(c||'')}}
document.addEventListener('DOMContentLoaded',function(){
 var bx=$('sv-make');if(!bx)return;
 bx.addEventListener('click',function(){msg('sv-out-msg','Préparation du code…');var full=$('sv-full')&&$('sv-full').checked;(full?exportCode():new Promise(function(ok,ko){try{ok(packShort())}catch(e){ko(e)}})).then(function(c){$('sv-out').value=c;$('sv-out-w').hidden=false;msg('sv-out-msg',full?'Code complet prêt ('+c.length+' caractères). Copiez-le, puis collez-le sur votre autre appareil.':'Code prêt ('+c.replace(/-/g,'').length+' caractères). Recopiez-le ou copiez-le sur votre autre appareil.','ok');$('sv-out').rows=full?4:2;$('sv-out').focus();$('sv-out').select()}).catch(function(){msg('sv-out-msg','Impossible de lire vos données sur cet appareil.','ko')})});
 $('sv-copy').addEventListener('click',function(){var t=$('sv-out');t.select();var done=function(){msg('sv-out-msg','Code copié. Vous pouvez le coller dans un message ou un document pour le retrouver sur l’autre appareil.','ok')};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t.value).then(done,function(){try{document.execCommand('copy');done()}catch(e){}});else{try{document.execCommand('copy');done()}catch(e){}}});
 $('sv-go').addEventListener('click',function(){var v=$('sv-in').value.trim();if(!v){msg('sv-in-msg','Collez d’abord le code.','ko');return}
  (/^PHILO-/i.test(v.replace(/\s+/g,''))?parseCode(v):new Promise(function(ok,ko){try{ok(unpackShort(v))}catch(e){ko(e)}})).then(function(d){var n=importData(d);$('sv-in').value='';msg('sv-in-msg',n?'Progression récupérée et fusionnée avec celle de cet appareil. La page va se recharger.':'Rien de nouveau : cet appareil était déjà à jour.','ok');if(n)setTimeout(function(){location.reload()},1800)})
  .catch(function(e){msg('sv-in-msg',e.message==='controle'?'Ce code a été modifié ou mal copié : copiez-le en entier, sans rien changer.':e.message==='navigateur'?'Ce navigateur est trop ancien pour lire ce code. Mettez-le à jour.':'Ce code n’est pas reconnu. Vérifiez qu’il commence par PHILO- et qu’il est complet.','ko')})});
});
})();
