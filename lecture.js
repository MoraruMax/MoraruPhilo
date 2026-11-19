/* Lecture du texte en plein écran : bouton dans « Le texte » (details.tx) */
(function(){
function init(){
 var det=document.querySelector('details.tx');if(!det)return;
 var tx=det.querySelector('.txb');if(!tx)return;
 var KEY='lecture-taille',size=1.25;try{var v=parseFloat(localStorage.getItem(KEY));if(v>=.9&&v<=2.2)size=v}catch(e){}
 var st=document.createElement('style');
 st.textContent=
 '.lx-btn{margin:0 .5rem 1rem 0;font:700 .92rem/1.2 system-ui,-apple-system,sans-serif;color:inherit;background:transparent;border:1.5px solid currentColor;border-radius:999px;padding:.5rem .95rem;cursor:pointer;display:inline-flex;align-items:center;gap:.45rem}'+
 '.lx-btn svg{flex:none}'+
 '.lx{position:fixed;inset:0;z-index:2147483000;background:var(--paper,var(--bg,#fff));color:var(--ink,#111);display:flex;flex-direction:column;color-scheme:inherit}'+
 '.lx[hidden]{display:none!important}'+
 '.lx-bar{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;padding:.7rem max(16px,env(safe-area-inset-right,0px)) .7rem max(16px,env(safe-area-inset-left,0px));padding-top:max(.7rem,env(safe-area-inset-top,0px));border-bottom:1px solid var(--line,rgba(128,128,128,.35));font:600 .9rem/1.2 system-ui,-apple-system,sans-serif}'+
 '.lx-bar .lx-t{flex:1 1 12rem;min-width:0;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'+
 '.lx-bar button{font:inherit;color:inherit;background:transparent;border:1.5px solid currentColor;border-radius:999px;padding:.4rem .8rem;cursor:pointer;min-height:2.4rem}'+
 '.lx-bar button[aria-pressed="true"]{background:var(--ink,#111);color:var(--paper,var(--bg,#fff))}'+
 '.lx-sc{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:2rem max(16px,env(safe-area-inset-right,0px)) max(3rem,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}'+
 '.lx-tx{max-width:38em;margin:0 auto;font-family:Charter,"Bitstream Charter","Sitka Text",Cambria,Georgia,serif;line-height:1.7;text-align:left;hyphens:auto}'+
 '.lx-tx p{margin:0 0 1em}.lx-tx .tsrc{font-size:.8em;opacity:.8;margin-top:2em}'+
 '.lx-tx .vo-btn,.lx-tx .lx-btn{display:none}'+
 'html.lx-on{overflow:hidden}'+
 '@media(max-width:560px){.lx-bar .lx-t{flex-basis:100%}.lx-bar button[data-a="fermer"]{margin-left:auto}}'+
 '@media print{.lx,.lx-btn{display:none!important}}';
 document.head.appendChild(st);

 var ico='<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
 var btn=document.createElement('button');btn.type='button';btn.className='lx-btn';btn.setAttribute('aria-haspopup','dialog');
 btn.innerHTML=ico+'<span>Lire en plein écran</span>';
 tx.insertBefore(btn,tx.firstChild);

 var ov=document.createElement('div');ov.className='lx';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');ov.setAttribute('aria-label','Lecture du texte en plein écran');ov.hidden=true;
 var h1=document.querySelector('h1');
 ov.innerHTML='<div class="lx-bar"><span class="lx-t"></span><button type="button" data-a="moins" aria-label="Réduire la taille du texte">A−</button><button type="button" data-a="plus" aria-label="Agrandir la taille du texte">A+</button><button type="button" data-a="vo" aria-pressed="false" hidden></button><button type="button" data-a="fermer">Fermer ✕</button></div><div class="lx-sc"><div class="lx-tx"></div></div>';
 document.body.appendChild(ov);
 ov.querySelector('.lx-t').textContent=(h1?h1.textContent.trim():document.title)+' · Le texte';
 var box=ov.querySelector('.lx-tx'),sc=ov.querySelector('.lx-sc'),bvo=ov.querySelector('[data-a="vo"]');

 function kids(root){return [].slice.call(root.children).filter(function(e){return !e.classList.contains('vo')&&!e.classList.contains('vo-btn')&&!e.classList.contains('lx-btn')&&!e.classList.contains('vo-rows')})}
 var vo=tx.querySelector('.vo'),showVo=false;
 if(vo){bvo.hidden=false;bvo.textContent='Texte original ('+(vo.getAttribute('data-lang')||'original')+')'}
 function fill(){
  box.innerHTML='';box.removeAttribute('lang');box.removeAttribute('dir');
  var src=showVo&&vo?[].slice.call(vo.children):kids(tx);
  if(showVo&&vo){var lc=vo.getAttribute('lang');if(lc){box.setAttribute('lang',lc);if(/^(he|ar|fa)/.test(lc))box.setAttribute('dir','rtl')}}
  src.forEach(function(n){var c=n.cloneNode(true);c.removeAttribute('hidden');c.removeAttribute('id');[].forEach.call(c.querySelectorAll('[id]'),function(x){x.removeAttribute('id')});box.appendChild(c)});
  bvo.setAttribute('aria-pressed',showVo?'true':'false');
 }
 function apply(){box.style.fontSize=size+'rem'}
 var last=null;
 function open(){last=document.activeElement;showVo=false;fill();apply();ov.hidden=false;document.documentElement.classList.add('lx-on');sc.scrollTop=0;
  try{if(ov.requestFullscreen&&window.matchMedia('(min-width:700px)').matches)ov.requestFullscreen().catch(function(){})}catch(e){}
  ov.querySelector('[data-a="fermer"]').focus()}
 function close(){ov.hidden=true;document.documentElement.classList.remove('lx-on');try{if(document.fullscreenElement)document.exitFullscreen().catch(function(){})}catch(e){}if(last&&last.focus)last.focus();else btn.focus()}
 btn.addEventListener('click',open);
 ov.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var a=b.getAttribute('data-a');
  if(a==='fermer')close();
  else if(a==='plus'){size=Math.min(2.2,Math.round((size+.1)*100)/100);apply();try{localStorage.setItem(KEY,size)}catch(x){}}
  else if(a==='moins'){size=Math.max(.9,Math.round((size-.1)*100)/100);apply();try{localStorage.setItem(KEY,size)}catch(x){}}
  else if(a==='vo'){showVo=!showVo;fill();sc.scrollTop=0}});
 document.addEventListener('keydown',function(e){if(ov.hidden)return;
  if(e.key==='Escape'){e.preventDefault();close();return}
  if(e.key==='Tab'){var f=[].slice.call(ov.querySelectorAll('button:not([hidden])'));if(!f.length)return;var i=f.indexOf(document.activeElement);
   if(e.shiftKey&&(i<=0)){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
 document.addEventListener('fullscreenchange',function(){if(!document.fullscreenElement&&!ov.hidden){/* l'élève a quitté le plein écran du navigateur : on garde la lecture ouverte */}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
