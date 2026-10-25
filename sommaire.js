/* « Sur cette page » : sommaire flottant pour les pages longues */
(function(){
  var main=document.querySelector('main'); if(!main) return;
  var hs=[].slice.call(main.querySelectorAll('h2[id]')).filter(function(h){return h.textContent.trim()&&!h.closest('dialog,[hidden]')});
  if(hs.length<4) return;
  var st=document.createElement('style');
  st.textContent=
  '.som{position:fixed;left:max(.8rem,env(safe-area-inset-left));bottom:max(.8rem,env(safe-area-inset-bottom));z-index:40;font:600 .9rem/1.3 var(--sans,system-ui,sans-serif);color:var(--ink,#111)}'+
  '.som-b{display:inline-flex;align-items:center;gap:.5rem;cursor:pointer;font:inherit;color:inherit;background:var(--bg,#fff);border:1.5px solid var(--ink,#111);border-radius:999px;padding:.6rem 1rem;box-shadow:0 4px 16px rgba(0,0,0,.18)}'+
  '.som-b:focus-visible,.som a:focus-visible{outline:3px solid var(--focus,#06c);outline-offset:2px}'+
  '.som-b svg{width:1rem;height:1rem;flex:none}'+
  '.som-p{display:none;position:absolute;left:0;bottom:calc(100% + .5rem);width:min(22rem,calc(100vw - 1.6rem));max-height:min(60vh,26rem);overflow:auto;background:var(--bg,#fff);border:1.5px solid var(--ink,#111);border-radius:16px;padding:.5rem;box-shadow:0 10px 30px rgba(0,0,0,.25)}'+
  '.som.open .som-p{display:block}'+
  '.som-t{margin:.3rem .6rem .4rem;font:700 .75rem/1 var(--sans,system-ui);letter-spacing:.06em;text-transform:uppercase;color:var(--muted,#666)}'+
  '.som ol{list-style:none;margin:0;padding:0}'+
  '.som a{display:block;padding:.55rem .7rem;border-radius:10px;color:inherit;text-decoration:none;border-left:4px solid transparent}'+
  '.som-ud{display:flex;gap:.3rem;margin-top:.35rem;border-top:1px solid var(--line,#ddd);padding-top:.35rem}'+
  '.som .som-go{flex:1;display:flex;align-items:center;justify-content:center;gap:.4rem;border-left:0;text-align:center}'+
  '.som a:hover{background:var(--surface,#f3f3f3)}'+
  '.som a[aria-current="true"]{background:var(--surface,#f3f3f3);border-left-color:var(--focus,#06c);font-weight:800}'+
  '@media (min-width:1500px){.som{left:max(1rem,calc(50% - 490px - 17rem));top:7rem;bottom:auto}.som-b{display:none}.som-p{display:block;position:static;width:15rem;max-height:calc(100vh - 10rem);border:0;box-shadow:none;background:transparent;padding:0}}'+
  '@media print{.som{display:none}}';
  document.head.appendChild(st);
  var box=document.createElement('nav'); box.className='som'; box.setAttribute('aria-label','Sur cette page');
  var ol=hs.map(function(h){return '<li><a href="#'+h.id+'">'+h.textContent.trim().replace(/</g,'&lt;')+'</a></li>'}).join('');
  box.innerHTML='<button type="button" class="som-b" aria-expanded="false" aria-controls="som-p"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg><span>Sur cette page</span></button><div class="som-p" id="som-p"><p class="som-t">Sur cette page</p><ol>'+ol+'</ol><div class="som-ud"><a class="som-go som-up" href="#">↑ <span>Haut</span></a><a class="som-go som-down" href="#">↓ <span>Bas</span></a></div></div>';
  document.body.appendChild(box);
  var btn=box.querySelector('.som-b'),links=[].slice.call(box.querySelectorAll('ol a')),up=box.querySelector('.som-up'),down=box.querySelector('.som-down');
  function go(a,fn){a.addEventListener('click',function(e){e.preventDefault();set(false);var r=window.matchMedia('(prefers-reduced-motion:reduce)').matches;window.scrollTo({top:fn(),behavior:r?'auto':'smooth'});try{history.replaceState(null,'',location.pathname+location.search)}catch(_){}})}
  go(up,function(){return 0});go(down,function(){return document.documentElement.scrollHeight});
  function set(o){box.classList.toggle('open',o);btn.setAttribute('aria-expanded',o)}
  btn.addEventListener('click',function(){set(!box.classList.contains('open'))});
  links.forEach(function(a){a.addEventListener('click',function(){set(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&box.classList.contains('open')){set(false);btn.focus()}});
  document.addEventListener('click',function(e){if(!box.contains(e.target))set(false)});
  function spy(){var y=window.innerHeight*.3,cur=0;hs.forEach(function(h,i){if(h.getBoundingClientRect().top<=y)cur=i});
    links.forEach(function(a,i){if(i===cur)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
    btn.querySelector('span').textContent=hs[cur].textContent.trim().length<30?hs[cur].textContent.trim():'Sur cette page'}
  var t;window.addEventListener('scroll',function(){cancelAnimationFrame(t);t=requestAnimationFrame(spy)},{passive:true});spy();
})();
