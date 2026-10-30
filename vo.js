/* Texte original à côté de la traduction : bouton dans « Le texte » */
(function(){
function init(){
 var tx=document.querySelector('details.tx .txb');if(!tx)return;
 var vo=tx.querySelector('.vo');if(!vo)return;
 var fr=[].slice.call(tx.children).filter(function(e){return e!==vo});
 var en=[].slice.call(vo.children);
 if(!fr.length||!en.length)return;
 var langName=vo.getAttribute('data-lang')||'original';
 var lc=vo.getAttribute('lang')||'en';
 var st=document.createElement('style');
 st.textContent='.vo-btn{margin:0 0 1rem;font:700 .92rem/1.2 system-ui,-apple-system,sans-serif;color:inherit;background:transparent;border:1.5px solid currentColor;border-radius:999px;padding:.5rem .95rem;cursor:pointer}.vo-btn[aria-pressed="true"]{background:var(--ink,currentColor);color:var(--bg,#fff)}.vo-rows{display:none}.txb.bi .vo-rows{display:block}.txb.bi > :not(.vo-rows):not(.vo-btn){display:none}.vo-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 2rem;border-top:1px solid var(--line,rgba(128,128,128,.3));padding:.2rem 0}.vo-row > div > *{margin-top:.6rem;margin-bottom:.6rem}.vo-head{font:700 .78rem/1 system-ui,-apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--muted,inherit);border-top:0;padding-bottom:.4rem}@media(max-width:760px){.vo-row{grid-template-columns:minmax(0,1fr);gap:0}.vo-row > div+div{border-left:3px solid var(--line,rgba(128,128,128,.4));padding-left:.8rem;margin-bottom:.8rem}}';
 document.head.appendChild(st);
 var rows=document.createElement('div');rows.className='vo-rows';
 function cell(nodes,lang){var d=document.createElement('div');if(lang){d.setAttribute('lang',lang);if(/^(he|ar|fa)/.test(lang))d.setAttribute('dir','rtl')}nodes.forEach(function(n){d.appendChild(n.cloneNode(true))});return d}
 function row(a,b,cls){var r=document.createElement('div');r.className='vo-row'+(cls?' '+cls:'');r.appendChild(a);r.appendChild(b);return r}
 var h1=document.createElement('div');h1.textContent='Traduction';var h2=document.createElement('div');h2.textContent=langName.charAt(0).toUpperCase()+langName.slice(1);
 rows.appendChild(row(h1,h2,'vo-head'));
 var same=fr.length===en.length&&fr.every(function(n,i){return n.tagName===en[i].tagName});
 if(same){fr.forEach(function(n,i){rows.appendChild(row(cell([n]),cell([en[i]],lc)))})}
 else{rows.appendChild(row(cell(fr),cell(en,lc)))}
 var btn=document.createElement('button');btn.type='button';btn.className='vo-btn';btn.setAttribute('aria-pressed','false');
 var on='Masquer le texte original',off='Voir le texte original ('+langName+') à côté de la traduction';
 btn.textContent=off;
 btn.addEventListener('click',function(){var p=tx.classList.toggle('bi');btn.setAttribute('aria-pressed',p?'true':'false');btn.textContent=p?on:off});
 tx.insertBefore(btn,tx.firstChild);tx.appendChild(rows);vo.setAttribute('hidden','');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
