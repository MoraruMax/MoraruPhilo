/* Bouton « Accessibilité » pour les pages qui n'en ont pas : ouvre le menu de confort de lecture (confort.js). */
(function(){
  var nav=document.querySelector('body > nav');
  if(!nav||document.getElementById('a11y-btn')||!nav.querySelector('a[href="accueil.html"]'))return;
  var st=document.createElement('style');
  st.textContent=
   '.a11y{position:relative;display:inline-block;margin-left:auto}'+
   '.a11y+.pdfbtn,.a11y~.pdfbtn{margin-left:.6rem}'+
   '.a11y-b{display:inline-flex;align-items:center;gap:.5rem;font:600 .88rem/1 system-ui,-apple-system,sans-serif;color:var(--ink,#111);background:var(--surface,var(--paper,#fff));border:1.5px solid var(--ink,#111);border-radius:999px;padding:.55rem .95rem;cursor:pointer}'+
   '.a11y-b:focus-visible,.a11y-menu button:focus-visible{outline:3px solid var(--focus,#06c);outline-offset:2px}'+
   '.a11y-menu{position:absolute;right:0;top:calc(100% + .4rem);z-index:60;min-width:16.5rem;background:var(--bg,var(--paper,#fff));color:var(--ink,#111);border:1.5px solid var(--ink,#111);border-radius:14px;padding:.35rem;box-shadow:0 8px 24px rgba(0,0,0,.18);text-shadow:none;font:500 .92rem/1.3 system-ui,-apple-system,sans-serif}'+
   '.a11y-menu[hidden]{display:none}'+
   '.a11y-menu .cf-sec{border-top:0;margin-top:0}'+
   '.a11y-menu .cf-sec>p{margin:0;font:700 .75rem/1 system-ui,-apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;opacity:.75}'+
   '@media print{.a11y{display:none}}';

  var plan=!!(document.getElementById('tog')&&document.querySelector('.part'));
  if(plan){st.textContent+=
   '.a11y-menu p.a11y-t{margin:0;padding:.45rem .7rem .3rem;font:700 .72rem/1 system-ui,-apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;opacity:.65}'+
   '.a11y-opt{display:flex;align-items:center;gap:.6rem;width:100%;text-align:left;font:600 .92rem/1.2 system-ui,-apple-system,sans-serif;color:inherit;background:none;border:0;border-radius:9px;padding:.6rem .7rem;cursor:pointer}'+
   '.a11y-opt:hover{background:var(--surface,rgba(127,127,127,.12))}'+
   '.a11y-opt .dot{flex:none;width:1rem;height:1rem;border:2px solid currentColor;border-radius:50%;position:relative}'+
   '.a11y-opt[aria-checked="true"] .dot::after{content:"";position:absolute;inset:2px;background:currentColor;border-radius:50%}'+
   '.a11y-opt small{display:block;font-weight:500;opacity:.7;font-size:.78rem;margin-top:.15rem}'+
   'html.lect .nav,html.lect #tog,html.lect .pn,html.lect .hero .sub{display:none!important}'+
   'html.lect .wrap{width:min(40rem,100% - 2.5rem)}'+
   'html.lect body{font-size:1.12rem;line-height:1.75}'+
   'html.lect .hero{padding:1.4rem 0 .4rem}html.lect h1{font-size:clamp(1.9rem,5vw,2.6rem)}'+
   'html.lect .part{padding:1.2rem 0;border:0}html.lect h2{font-size:1.4rem;margin-bottom:.6rem}'+
   'html.lect details.br{background:none;border:0;padding:0;border-radius:0}'+
   'html.lect details.br>summary{pointer-events:none;cursor:default;padding:.3rem 0;list-style:none;font:600 1.12rem/1.75 var(--serif,Georgia,serif)}'+
   'html.lect details.br>summary::before,html.lect details.br>summary::-webkit-details-marker{display:none!important}'+
   'html.lect details.br summary .sl{display:inline;margin:0 .4rem 0 0}html.lect details.br summary .sl::after{content:" :"}'+
   'html.lect .branches,html.lect .branches.nest{display:block;margin:.3rem 0 .6rem .4rem;padding-left:.9rem;border-left:2px solid var(--line)}'+
   'html.lect .branches>details,html.lect .branches>ol{margin-bottom:.6rem}'+
   'html.lect ol.st{padding:0 0 .3rem}'+
   'html.lect .s{display:block;background:none!important;border:0!important;padding:.15rem 0;margin:0 0 .4rem}'+
   'html.lect .s .lb{display:inline;margin:0 .35rem 0 0;font-size:.78rem;text-transform:uppercase;letter-spacing:.04em}html.lect .s .lb::after{content:" :"}'+
   'html.lect .s .t{display:inline}'+
   'html.lect .final{background:none;border:0;border-left:3px solid var(--b);border-radius:0;padding:.2rem 0 .2rem .9rem;font-size:1.15rem}'+
   'html.lect .bridge{border:0;padding:0;font-size:1rem}';}
  document.head.appendChild(st);
  var w=document.createElement('span');w.className='a11y';
  w.innerHTML='<button type="button" class="a11y-b" id="a11y-btn" aria-haspopup="true" aria-expanded="false" aria-controls="a11y-menu"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.5" r="1.6"/><path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M8.5 21l3.5-6.5 3.5 6.5"/></svg><span>Accessibilité</span></button><div class="a11y-menu" id="a11y-menu" hidden>'+(plan?'<p class="a11y-t">Affichage</p><button type="button" role="radio" class="a11y-opt" data-mode="orig" aria-checked="true"><span class="dot"></span><span>Page d’origine<small>Branches repliables et couleurs</small></span></button><button type="button" role="radio" class="a11y-opt" data-mode="lect" aria-checked="false"><span class="dot"></span><span>Mode lecture<small>Texte continu, sans cadres ni boutons</small></span></button>':'')+'</div>';
  var pdf=nav.querySelector('.pdfbtn');
  if(pdf)nav.insertBefore(w,pdf);else nav.appendChild(w);
  var btn=w.querySelector('#a11y-btn'),menu=w.querySelector('#a11y-menu');
  function open(on){menu.hidden=!on;btn.setAttribute('aria-expanded',on?'true':'false')}
  btn.addEventListener('click',function(e){e.stopPropagation();open(menu.hidden)});
  document.addEventListener('click',function(e){if(!menu.hidden&&!menu.contains(e.target)&&e.target!==btn)open(false)});

  if(plan){
    var r=document.documentElement,opts=[].slice.call(menu.querySelectorAll('.a11y-opt')),closed=[],KL='mode-lecture';
    function apply(m){
      var lc=m==='lect',was=r.classList.contains('lect');
      r.classList.toggle('lect',lc);
      if(lc&&!was){closed=[];[].slice.call(document.querySelectorAll('details.br')).forEach(function(d){if(!d.open){closed.push(d);d.open=true}})}
      if(!lc&&was){closed.forEach(function(d){d.open=false});closed=[]}
      opts.forEach(function(o){o.setAttribute('aria-checked',o.getAttribute('data-mode')===m?'true':'false')});
      try{localStorage.setItem(KL,lc?'1':'0')}catch(e){}
    }
    opts.forEach(function(o){o.addEventListener('click',function(){apply(o.getAttribute('data-mode'));open(false);btn.focus()})});
    try{if(localStorage.getItem(KL)==='1')apply('lect')}catch(e){}
  }
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden){open(false);btn.focus()}});
})();
