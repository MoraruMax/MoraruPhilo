/* Radiographie d'un texte : calques (connecteurs, thèse, exemples, étapes, notions) et plan cliquable.
   Les passages sont repérés par des ancres (window.RXD) ; le texte n'est jamais modifié (API CSS Custom Highlight). */
(function(){
var D=window.RXD;if(!D)return;
var HL=!!(window.CSS&&CSS.highlights&&window.Highlight);
var CON=['il n’en est pas de même','non seulement','mais encore','mais aussi','par conséquent','c’est pourquoi','c’est-à-dire','autrement dit','par exemple','en effet','de sorte que','en sorte que','si bien que','parce que','parce qu’','puisque','puisqu’','bien que','bien qu’','quoique','quoiqu’','cependant','pourtant','toutefois','néanmoins','en revanche','au contraire','d’abord','ensuite','enfin','premièrement','deuxièmement','troisièmement','d’une part','d’autre part','de même','dès lors','en outre','de plus','d’ailleurs','certes','tandis que','alors que','ainsi','donc','mais','car','or'];
function esc(c){return c.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
var CRE=new RegExp('(^|[^\\p{L}’\'])((?:'+CON.filter(function(c){return !/’$/.test(c)}).map(esc).join('|')+')(?=$|[^\\p{L}])|(?:'+CON.filter(function(c){return /’$/.test(c)}).map(esc).join('|')+'))','giu');
var L=[['co','Connecteurs'],['th','Thèse'],['ex','Exemples'],['ar','Étapes'],['k','Notions']];
var st=document.createElement('style');
st.textContent='.rx-btn{margin:0 0 1rem .5rem;font:700 .92rem/1.2 system-ui,-apple-system,sans-serif;color:inherit;background:transparent;border:1.5px solid currentColor;border-radius:999px;padding:.5rem .95rem;cursor:pointer}.rx-btn:first-child{margin-left:0}.rx-btn[aria-expanded="true"]{background:var(--ink,currentColor);color:var(--bg,#fff)}'+
'.txb.bi > .rx-btn{display:inline-block!important}.txb.bi > .rx-bar:not([hidden]){display:block!important}.rx-bar{margin:0 0 1.2rem;padding:.8rem .9rem;border:1px solid var(--line,rgba(128,128,128,.35));border-radius:12px;font:500 .9rem/1.4 system-ui,-apple-system,sans-serif}.rx-bar[hidden]{display:none}'+
'.rx-ls{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 .6rem}.rx-ls button{font:600 .85rem/1.2 system-ui,-apple-system,sans-serif;color:inherit;background:transparent;border:1.5px solid var(--line,rgba(128,128,128,.5));border-radius:999px;padding:.35rem .75rem;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem}.rx-ls button[aria-pressed="true"]{border-color:currentColor}.rx-ls i{display:inline-block;width:.85rem;height:.85rem;border-radius:3px}.rx-ls button[aria-pressed="false"] i{opacity:.45}'+
'.rx-plan{margin:.2rem 0 0;padding:0;list-style:none;counter-reset:rx}.rx-plan li{counter-increment:rx}.rx-plan button{all:unset;cursor:pointer;display:block;padding:.3rem .5rem;border-radius:8px}.rx-plan button::before{content:counter(rx) ". ";font-weight:700}.rx-plan button:hover,.rx-plan button:focus-visible{background:rgba(128,128,128,.15)}.rx-plan button:focus-visible{outline:2px solid currentColor}.rx-plan button[aria-current="true"]{background:var(--rx-ar1)}'+
'.rx-h{font:700 .75rem/1 system-ui,-apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--muted,inherit);margin:.4rem 0 .3rem}.rx-q{margin:0 0 .5rem}'+
':root{--rx-th:#FFD966;--rx-ex:#BFE0FF;--rx-ar1:#D3EFD9;--rx-ar2:#E2E6F7;--rx-co:#B3124F;--rx-k:#4A3C9C;--rx-f:#FFB37A}'+
'@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--rx-th:#6B5410;--rx-ex:#164266;--rx-ar1:#1C4A2E;--rx-ar2:#2A3354;--rx-co:#FF8FB5;--rx-k:#C4B8FF;--rx-f:#8A4A16}}'+
':root[data-theme="dark"],body.dark,html.dark{--rx-th:#6B5410;--rx-ex:#164266;--rx-ar1:#1C4A2E;--rx-ar2:#2A3354;--rx-co:#FF8FB5;--rx-k:#C4B8FF;--rx-f:#8A4A16}'+
'::highlight(rx-ar1){background-color:var(--rx-ar1)}::highlight(rx-ar2){background-color:var(--rx-ar2)}::highlight(rx-ex){background-color:var(--rx-ex)}::highlight(rx-th){background-color:var(--rx-th)}'+
'::highlight(rx-co){color:var(--rx-co);text-decoration:underline 2px;text-underline-offset:3px}::highlight(rx-k){color:var(--rx-k);text-decoration:underline dotted 2px;text-underline-offset:3px}::highlight(rx-f){background-color:var(--rx-f)}';
document.head.appendChild(st);
var blocks=[];
function paras(tx){
 if(tx.classList.contains('bi'))return [].slice.call(tx.querySelectorAll('.vo-row:not(.vo-head) > div:first-child > p:not(.tsrc)'));
 return [].slice.call(tx.children).filter(function(e){return e.tagName==='P'&&!e.classList.contains('tsrc')});
}
function index(tx){/* texte concaténé + table des nœuds */
 var s='',map=[];
 paras(tx).forEach(function(p,i){if(i){s+='\n'}var w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);var n;while((n=w.nextNode())){map.push([s.length,n]);s+=n.data.replace(/[\u00a0\u202f]/g,' ')}});
 return {s:s,map:map};
}
function pos(ix,o){var m=ix.map,lo=0,hi=m.length-1;while(lo<hi){var mid=(lo+hi+1)>>1;if(m[mid][0]<=o)lo=mid;else hi=mid-1}var e=m[lo];return [e[1],Math.min(o-e[0],e[1].data.length)]}
function range(ix,a,b){var r=document.createRange(),p=pos(ix,a),q=pos(ix,b);try{r.setStart(p[0],p[1]);r.setEnd(q[0],q[1])}catch(e){return null}return r}
function find(ix,an,from){/* « début … fin » ou extrait exact */
 an=an.replace(/[\u00a0\u202f]/g,' ');var parts=an.split(' … ');var a=ix.s.indexOf(parts[0],from||0);if(a<0)return null;
 if(parts.length===1)return [a,a+parts[0].length];
 var b=ix.s.indexOf(parts[1],a+parts[0].length);if(b<0)return null;return [a,b+parts[1].length];
}
function spans(ix,list){var out=[];(list||[]).forEach(function(an){var r=find(ix,an);if(r)out.push(r)});return out}
function steps(b){
 var ix=b.ix,d=b.d,res=[];
 (d.ar||[]).forEach(function(an,i){if(!an){res.push(null);return}var r=find(ix,typeof an==='string'?an:an.s);res.push(r)});
 return res;
}
var LT=/\p{L}/u;
var PR={ar1:1,ar2:1,ex:2,th:3,f:4,k:5,co:6};
function rebuild(){
 if(!HL)return;
 var H={co:[],th:[],ex:[],ar1:[],ar2:[],k:[],f:[]};
 blocks.forEach(function(b){
  if(!b.open)return;b.ix=index(b.tx);var ix=b.ix,on=b.on;
  if(on.co){var m,ex=(b.d.nco||[]);CRE.lastIndex=0;while((m=CRE.exec(ix.s))){var a=m.index+m[1].length,w=m[2];if(ex.indexOf(w.toLowerCase())>-1)continue;var r=range(ix,a,a+w.length);if(r)H.co.push(r)}}
  if(on.th)spans(ix,b.d.th).forEach(function(x){var r=range(ix,x[0],x[1]);if(r)H.th.push(r)});
  if(on.ex)spans(ix,b.d.ex).forEach(function(x){var r=range(ix,x[0],x[1]);if(r)H.ex.push(r)});
  if(on.k)(b.d.k||[]).forEach(function(w){var i=0,j;while((j=ix.s.indexOf(w,i))>-1){if(!LT.test(ix.s.charAt(j-1)||' ')&&!LT.test(ix.s.charAt(j+w.length)||' ')){var r=range(ix,j,j+w.length);if(r)H.k.push(r)}i=j+w.length}});
  var S=steps(b);
  if(on.ar)S.forEach(function(x,i){if(x){var r=range(ix,x[0],x[1]);if(r)H[i%2?'ar2':'ar1'].push(r)}});
  if(b.f!=null&&S[b.f]){var r=range(ix,S[b.f][0],S[b.f][1]);if(r)H.f.push(r)}
 });
 Object.keys(H).forEach(function(k){if(H[k].length){var h=new Highlight();h.priority=PR[k];H[k].forEach(function(r){h.add(r)});CSS.highlights.set('rx-'+k,h)}else CSS.highlights.delete('rx-'+k)});
}
var SW={co:'background:var(--rx-co)',th:'background:var(--rx-th)',ex:'background:var(--rx-ex)',ar:'background:linear-gradient(90deg,var(--rx-ar1) 50%,var(--rx-ar2) 50%)',k:'background:var(--rx-k)'};
function one(tx,d,n){
 var b={tx:tx,d:d,on:{},open:false,f:null};blocks.push(b);
 var titles=[];
 var stp=document.querySelectorAll('#stp h3');
 (d.ar||[]).forEach(function(an,i){titles.push(an&&typeof an==='object'&&an.t?an.t:(stp[i]?stp[i].textContent:'Étape '+(i+1)))});
 var btn=document.createElement('button');btn.type='button';btn.className='rx-btn';btn.setAttribute('aria-expanded','false');btn.textContent='Radiographie du texte';
 var bar=document.createElement('div');bar.className='rx-bar';bar.hidden=true;bar.id='rx-bar-'+n;btn.setAttribute('aria-controls',bar.id);
 var h='';
 if(!HL)h+='<p class="rx-q">Votre navigateur ne permet pas de colorer le texte ; le plan reste disponible.</p>';
 else{h+='<div class="rx-ls" role="group" aria-label="Calques">';L.forEach(function(l){if(l[0]==='ex'&&!(d.ex||[]).length)return;if(l[0]==='k'&&!(d.k||[]).length)return;if(l[0]==='th'&&!(d.th||[]).length)return;if(l[0]==='co'){CRE.lastIndex=0;if(!CRE.test(index(tx).s))return}h+='<button type="button" data-l="'+l[0]+'" aria-pressed="false"><i style="'+SW[l[0]]+'"></i>'+l[1]+'</button>'});h+='<button type="button" data-all aria-pressed="false">Tout</button></div>'}
 if(titles.length){h+='<p class="rx-h">Le plan du texte</p><ol class="rx-plan">';titles.forEach(function(t,i){h+='<li><button type="button" data-s="'+i+'">'+t.replace(/</g,'&lt;')+'</button></li>'});h+='</ol>'}
 bar.innerHTML=h;
 btn.addEventListener('click',function(){b.open=!b.open;btn.setAttribute('aria-expanded',b.open);bar.hidden=!b.open;if(!b.open){b.on={};b.f=null;[].forEach.call(bar.querySelectorAll('[aria-pressed]'),function(x){x.setAttribute('aria-pressed','false')})}rebuild()});
 bar.addEventListener('click',function(e){
  var t=e.target.closest('button');if(!t)return;
  if(t.hasAttribute('data-all')){var all=t.getAttribute('aria-pressed')!=='true';t.setAttribute('aria-pressed',all);[].forEach.call(bar.querySelectorAll('[data-l]'),function(x){x.setAttribute('aria-pressed',all);b.on[x.getAttribute('data-l')]=all});rebuild();return}
  if(t.hasAttribute('data-l')){var k=t.getAttribute('data-l'),v=t.getAttribute('aria-pressed')!=='true';t.setAttribute('aria-pressed',v);b.on[k]=v;rebuild();return}
  if(t.hasAttribute('data-s')){var i=+t.getAttribute('data-s');b.f=b.f===i?null:i;[].forEach.call(bar.querySelectorAll('[data-s]'),function(x){x.setAttribute('aria-current',+x.getAttribute('data-s')===b.f?'true':'false')});rebuild();
   if(b.f!=null&&HL){b.ix=index(tx);var S=steps(b);if(S[i]){var r=range(b.ix,S[i][0],S[i][0]+1);var el=r&&r.startContainer.parentElement;if(el&&el.scrollIntoView)el.scrollIntoView({block:'center',behavior:'smooth'})}}}
 });
 var first=tx.querySelector('.vo-btn');
 if(first)first.insertAdjacentElement('afterend',btn);else tx.insertBefore(btn,tx.firstChild);
 btn.insertAdjacentElement('afterend',bar);
 new MutationObserver(function(){if(b.open)rebuild()}).observe(tx,{attributes:true,attributeFilter:['class']});
}
function init(){var tx=document.querySelectorAll('details.tx .txb');[].forEach.call(tx,function(t,i){if(D[i])one(t,D[i],i)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,0)});else setTimeout(init,0);
})();
