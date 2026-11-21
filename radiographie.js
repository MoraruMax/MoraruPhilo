/* Radiographie d'un texte : calques (connecteurs, thèse, exemple, arguments, mots clés, structure),
   mode « Squelette » et colonne d'aide (question, légende, à retenir). Données : window.RXD. */
(function(){
var D=window.RXD;if(!D)return;
var CON=['il n’en est pas de même','non seulement','mais encore','mais aussi','par conséquent','c’est pourquoi','c’est-à-dire','autrement dit','par exemple','en effet','de sorte que','en sorte que','si bien que','parce que','parce qu’','puisque','puisqu’','bien que','bien qu’','quoique','quoiqu’','cependant','pourtant','toutefois','néanmoins','en revanche','au contraire','d’abord','ensuite','enfin','premièrement','deuxièmement','troisièmement','d’une part','d’autre part','de même','dès lors','en outre','de plus','d’ailleurs','certes','tandis que','alors que','ainsi','donc','mais','car','or'];
function esc(c){return c.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
var CRE=new RegExp('(^|[^\\p{L}’\'])((?:'+CON.filter(function(c){return !/’$/.test(c)}).map(esc).join('|')+')(?=$|[^\\p{L}])|(?:'+CON.filter(function(c){return /’$/.test(c)}).map(esc).join('|')+'))','giu');
var LT=/\p{L}/u;
var LAYERS=[['co','Connecteurs'],['th','Thèse'],['ex','Exemple'],['ar','Arguments'],['k','Mots clés'],['op','Structure']];
var F='system-ui,-apple-system,"Segoe UI",sans-serif';
var st=document.createElement('style');
st.textContent=
':root{--rx-th:#FFDB70;--rx-ex:#D6ECFF;--rx-ar:#E3F4EC;--rx-co:#B3124F;--rx-acc:#4A3C9C}'+
'@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--rx-th:#3A2F08;--rx-ex:#12324F;--rx-ar:#123528;--rx-co:#FF8FB5;--rx-acc:#B3A6FF}}'+
':root[data-theme="dark"],html.dark,body.dark{--rx-th:#3A2F08;--rx-ex:#12324F;--rx-ar:#123528;--rx-co:#FF8FB5;--rx-acc:#B3A6FF}'+
'.rx-btn{margin:0 0 1rem .5rem;font:700 .92rem/1.2 '+F+';color:inherit;background:transparent;border:1.5px solid currentColor;border-radius:999px;padding:.5rem .95rem;cursor:pointer}.rx-btn:first-child{margin-left:0}.rx-btn[aria-expanded="true"]{background:var(--ink,currentColor);color:var(--bg,#fff)}'+
'.txb.bi > .rx-btn{display:inline-block!important}'+
'.txb.rx-on{max-width:none!important}.txb.rx-on>button{justify-self:start}'+
'@media (min-width:1060px){.txb.rx-on{display:grid;grid-template-columns:minmax(0,1fr) 250px;column-gap:20px;align-items:start}.txb.rx-on>*{grid-column:1}.txb.rx-on>.rx-side{grid-column:2;grid-row:1 / span 80}}'+
'.rx-layers{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}'+
'.rx-layers button{font:600 .88rem/1.2 '+F+';color:inherit;background:transparent;border:1.5px solid var(--line,rgba(128,128,128,.5));border-radius:999px;padding:7px 13px;cursor:pointer}'+
'.rx-layers button:hover{border-color:var(--rx-acc)}'+
'.rx-layers button[aria-pressed="true"]{background:var(--rx-acc);border-color:var(--rx-acc);color:var(--surface,var(--bg,#fff))}'+
'.rx-layers button:focus-visible,.rx-btn:focus-visible{outline:3px solid var(--focus,currentColor);outline-offset:2px}'+
'.on-th .rx-th{background:var(--rx-th)}.on-ex .rx-ex{background:var(--rx-ex)}.on-ar .rx-ar{background:var(--rx-ar)}'+
'.on-co .rx-co{color:var(--rx-co);font-weight:700;text-decoration:underline;text-underline-offset:3px}'+
'.on-k .rx-k{font-weight:700;font-variant:small-caps;letter-spacing:.02em}'+
'.rx-n{display:none;font:700 .7rem/1 '+F+';color:var(--rx-acc);margin-right:2px}.on-ar .rx-n{display:inline}'+
'.rx-part{display:none}.on-op .rx-part{display:block;font:700 .75rem/1.3 '+F+';text-transform:uppercase;letter-spacing:.06em;color:var(--rx-acc);margin:.6em 0 .2em}'+
'.rx-skel{display:none}.mode-skel>.rx-skel{display:block}.mode-skel>p:not(.tsrc){display:none}'+
'.rx-skel ol{list-style:none;padding:0;margin:0 0 1rem;font:500 .98rem/1.5 '+F+'}'+
'.rx-skel li.it{border-left:3px solid var(--rx-acc);padding:6px 12px;margin:0 0 4px;background:color-mix(in srgb,var(--rx-acc) 8%,transparent);border-radius:0 8px 8px 0}'+
'.rx-skel li.lk{font:700 .9rem/1.3 '+F+';color:var(--rx-co);padding:2px 0 2px 14px;margin:0 0 4px}'+
'.rx-skel .rl{font:700 .72rem/1.3 '+F+';text-transform:uppercase;letter-spacing:.05em;color:var(--muted,inherit);display:block}'+
'.rx-side{font:500 .88rem/1.45 '+F+'}'+
'.rx-box{border:1px solid var(--line,rgba(128,128,128,.4));border-radius:10px;padding:12px;margin-bottom:12px}'+
'.rx-box h3{font:700 .95rem/1.3 '+F+';margin:0 0 6px;color:var(--rx-acc)}'+
'.rx-box p{margin:0}.rx-box ul{margin:0;padding-left:18px}.rx-box li{margin:4px 0}'+
'.rx-lg span{display:inline-block;padding:0 6px;border-radius:4px;margin:2px 0}'+
'.rx-lg .l-co{color:var(--rx-co);font-weight:700;text-decoration:underline}.rx-lg .l-th{background:var(--rx-th)}.rx-lg .l-ex{background:var(--rx-ex)}.rx-lg .l-ar{background:var(--rx-ar)}.rx-lg .l-k{font-weight:700;font-variant:small-caps}'+
'@media print{.rx-btn,.rx-layers,.rx-side{display:none}}';
document.head.appendChild(st);

function paras(tx){return [].slice.call(tx.children).filter(function(e){return e.tagName==='P'&&!e.classList.contains('tsrc')})}
function index(tx){
 var s='',map=[];
 paras(tx).forEach(function(p,i){if(i)s+='\n';var w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);var n;while((n=w.nextNode())){map.push([s.length,n]);s+=n.data.replace(/[  ]/g,' ')}});
 return {s:s,map:map};
}
function find(ix,an){
 an=an.replace(/[  ]/g,' ');var parts=an.split(' … ');var a=ix.s.indexOf(parts[0]);if(a<0)return null;
 if(parts.length===1)return [a,a+parts[0].length];
 var b=ix.s.indexOf(parts[1],a+parts[0].length);if(b<0)return null;return [a,b+parts[1].length];
}
function wrap(tx,a,b,cls){
 if(b<=a)return;var ix=index(tx),todo=[];
 ix.map.forEach(function(e){var s0=e[0],n=e[1],en=s0+n.data.length;var x=Math.max(a,s0)-s0,y=Math.min(b,en)-s0;if(y>x)todo.push([n,x,y])});
 todo.reverse().forEach(function(t){var n=t[0];if(t[2]<n.data.length)n.splitText(t[2]);if(t[1]>0)n=n.splitText(t[1]);
  var sp=document.createElement('span');sp.className=cls;sp.setAttribute('data-rx','');n.parentNode.insertBefore(sp,n);sp.appendChild(n)});
}
function insertAt(tx,pos,el){
 var ix=index(tx),m=ix.map,lo=0,hi=m.length-1;if(!m.length)return;
 while(lo<hi){var mid=(lo+hi+1)>>1;if(m[mid][0]<=pos)lo=mid;else hi=mid-1}
 var n=m[lo][1],off=pos-m[lo][0];
 if(off>=n.data.length){n.parentNode.insertBefore(el,n.nextSibling);return}
 if(off>0)n=n.splitText(off);
 n.parentNode.insertBefore(el,n);
}
function unwrap(tx){
 [].forEach.call(tx.querySelectorAll('.rx-n,.rx-part'),function(e){e.remove()});
 [].forEach.call(tx.querySelectorAll('span[data-rx]'),function(s){while(s.firstChild)s.parentNode.insertBefore(s.firstChild,s);s.remove()});
 paras(tx).forEach(function(p){p.normalize()});
}
function stepTitle(d,i){var a=(d.ar||[])[i];if(a&&typeof a==='object'&&a.t)return a.t;var h=document.querySelectorAll('#stp li')[i];return h&&h.querySelector('h3')?h.querySelector('h3').textContent:'Étape '+(i+1)}
function stepSummary(d,i){var a=(d.ar||[])[i];if(a&&typeof a==='object')return '';var h=document.querySelectorAll('#stp li')[i];return h&&h.querySelector('p')?h.querySelector('p').textContent:''}
function esch(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;')}

function analyse(b){
 var d=b.d,ix=index(b.tx),R={th:[],ex:[],st:[],k:[],co:[],pt:[]};
 (d.th||[]).forEach(function(an){var r=find(ix,an);if(r)R.th.push(r)});
 (d.ex||[]).forEach(function(an){var r=find(ix,an);if(r)R.ex.push(r)});
 (d.ar||[]).forEach(function(an){if(!an){R.st.push(null);return}R.st.push(find(ix,typeof an==='string'?an:an.s))});
 (d.k||[]).forEach(function(w){var i=0,j;while((j=ix.s.indexOf(w,i))>-1){if(!LT.test(ix.s.charAt(j-1)||' ')&&!LT.test(ix.s.charAt(j+w.length)||' '))R.k.push([j,j+w.length]);i=j+w.length}});
 var m,nco=d.nco||[];CRE.lastIndex=0;while((m=CRE.exec(ix.s))){var a=m.index+m[1].length;if(nco.indexOf(m[2].toLowerCase())<0)R.co.push([a,a+m[2].length,m[2]])}
 var ix2={s:ix.s.replace(/\n/g,' ')};(d.pt||[]).forEach(function(p){if(!p.a)return;var r=find(ix2,p.a);if(r)R.pt.push([r[0],p.t])});
 var role=[],n=0;
 R.st.forEach(function(s){
  if(!s){role.push(null);return}
  if(R.th.some(function(t){return t[0]>=s[0]&&t[0]<s[1]})){role.push(['th','Thèse']);return}
  var ov=0;R.ex.forEach(function(e){ov+=Math.max(0,Math.min(e[1],s[1])-Math.max(e[0],s[0]))});
  if(ov>=(s[1]-s[0])/2){role.push(['ex','Exemple']);return}
  n++;role.push(['ar','Argument '+n,n]);
 });
 R.role=role;R.s=ix.s;return R;
}
function render(b){
 var tx=b.tx,R=b.R;
 unwrap(tx);
 R.st.forEach(function(s,i){if(s&&R.role[i]&&R.role[i][0]==='ar')wrap(tx,s[0],s[1],'rx-ar')});
 R.ex.forEach(function(r){wrap(tx,r[0],r[1],'rx-ex')});
 R.th.forEach(function(r){wrap(tx,r[0],r[1],'rx-th')});
 R.k.forEach(function(r){wrap(tx,r[0],r[1],'rx-k')});
 R.co.forEach(function(r){wrap(tx,r[0],r[1],'rx-co')});
 var ins=[];
 R.st.forEach(function(s,i){if(s&&R.role[i]&&R.role[i][0]==='ar'){var e=document.createElement('sup');e.className='rx-n';e.textContent=R.role[i][2];ins.push([s[0],e])}});
 R.pt.forEach(function(p){var e=document.createElement('span');e.className='rx-part';e.textContent=p[1];ins.push([p[0],e])});
 ins.sort(function(x,y){return y[0]-x[0]}).forEach(function(x){insertAt(tx,x[0],x[1])});
}
function skeleton(b){
 var R=b.R,d=b.d,h='<ol>',first=true;
 R.st.forEach(function(s,i){
  if(!first&&s){var cs=[];R.co.forEach(function(c){if(c[0]>=s[0]&&c[0]<s[0]+45)cs.push(c[2])});
   if(cs.length)h+='<li class="lk">'+esch(cs.join('… '))+' ↓</li>'}
  first=false;
  var r=R.role[i]||['','Étape '+(i+1)],t=stepTitle(d,i),su=stepSummary(d,i);
  h+='<li class="it"><span class="rl">'+r[1]+'</span><b>'+esch(t)+'</b>'+(su?' — '+esch(su):'')+'</li>';
 });
 return h+'</ol>';
}
function side(b){
 var h='',q=null;
 if(b.n===0){[].forEach.call(document.querySelectorAll('h3'),function(e){if(!q&&e.textContent.trim()==='La question'&&e.nextElementSibling)q=e.nextElementSibling.textContent})}
 if(q)h+='<div class="rx-box"><h3>Question du texte</h3><p>'+esch(q)+'</p></div>';
 h+='<div class="rx-box rx-lg"><h3>Légende</h3>';
 if(b.av.co)h+='<span class="l-co">connecteur</span><br>';
 if(b.av.th)h+='<span class="l-th">thèse</span><br>';
 if(b.av.ex)h+='<span class="l-ex">exemple</span><br>';
 if(b.av.ar)h+='<span class="l-ar">argument</span><br>';
 if(b.av.k)h+='<span class="l-k">mot clé</span>';
 h+='</div>';
 var rc=b.n===0?document.querySelector('ul.recap'):null;
 if(rc)h+='<div class="rx-box"><h3>À retenir</h3><ul>'+rc.innerHTML+'</ul></div>';
 return h;
}
function one(tx,d,n){
 var b={tx:tx,d:d,n:n,open:false};
 var btn=document.createElement('button');btn.type='button';btn.className='rx-btn';btn.setAttribute('aria-expanded','false');btn.textContent='Radiographie du texte';
 var vb0=tx.querySelector('.vo-btn');if(vb0)vb0.insertAdjacentElement('afterend',btn);else tx.insertBefore(btn,tx.firstChild);
 var bar=null,sk=null,sd=null;
 function build(){
  b.R=analyse(b);var R=b.R;
  b.av={co:R.co.length>0,th:R.th.length>0,ex:R.ex.length>0,ar:R.role.some(function(r){return r&&r[0]==='ar'}),k:R.k.length>0,op:R.pt.length>0};
  bar=document.createElement('div');bar.className='rx-layers';bar.setAttribute('role','group');bar.setAttribute('aria-label','Calques de la radiographie');
  var h='';LAYERS.forEach(function(l){if(b.av[l[0]])h+='<button type="button" data-l="'+l[0]+'" aria-pressed="false">'+l[1]+'</button>'});
  h+='<button type="button" data-all aria-pressed="false">Tout afficher</button>';
  if(R.st.some(Boolean))h+='<button type="button" data-sk aria-pressed="false">Squelette</button>';
  bar.innerHTML=h;
  sk=document.createElement('div');sk.className='rx-skel';sk.innerHTML=skeleton(b);
  sd=document.createElement('aside');sd.className='rx-side';sd.setAttribute('aria-label','Aide à la lecture du texte');sd.innerHTML=side(b);
  bar.addEventListener('click',function(e){
   var t=e.target.closest('button');if(!t)return;
   if(t.hasAttribute('data-all')){var all=t.getAttribute('aria-pressed')!=='true';t.setAttribute('aria-pressed',all);[].forEach.call(bar.querySelectorAll('[data-l]'),function(x){x.setAttribute('aria-pressed',all);tx.classList.toggle('on-'+x.getAttribute('data-l'),all)});return}
   if(t.hasAttribute('data-sk')){var on=t.getAttribute('aria-pressed')!=='true';t.setAttribute('aria-pressed',on);tx.classList.toggle('mode-skel',on);return}
   var k=t.getAttribute('data-l'),v=t.getAttribute('aria-pressed')!=='true';t.setAttribute('aria-pressed',v);tx.classList.toggle('on-'+k,v);
  });
 }
 btn.addEventListener('click',function(){
  b.open=!b.open;btn.setAttribute('aria-expanded',b.open);
  var vb=tx.querySelector('.vo-btn');
  if(b.open){
   if(tx.classList.contains('bi')&&vb)vb.click();
   if(vb)vb.hidden=true;
   if(!bar)build();
   btn.insertAdjacentElement('afterend',bar);bar.insertAdjacentElement('afterend',sd);sd.insertAdjacentElement('afterend',sk);
   render(b);tx.classList.add('rx-on');
  }else{
   unwrap(tx);[bar,sk,sd].forEach(function(e){if(e&&e.parentNode)e.parentNode.removeChild(e)});
   ['rx-on','mode-skel','on-co','on-th','on-ex','on-ar','on-k','on-op'].forEach(function(c){tx.classList.remove(c)});
   [].forEach.call(bar.querySelectorAll('[aria-pressed]'),function(x){x.setAttribute('aria-pressed','false')});
   if(vb)vb.hidden=false;
  }
 });
}
function init(){[].forEach.call(document.querySelectorAll('details.tx .txb'),function(t,i){if(D[i])one(t,D[i],i)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,0)});else setTimeout(init,0);
})();
