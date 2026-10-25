/* Confort de lecture : taille du texte, interligne, police. Réglages mémorisés sur l'appareil. */
(function(){
  var K='confort-lecture',r=document.documentElement;
  var S={fs:0,lh:0,ff:0};
  try{var v=JSON.parse(localStorage.getItem(K)||'null');if(v&&typeof v==='object'){S.fs=+v.fs||0;S.lh=+v.lh||0;S.ff=+v.ff||0}}catch(e){}
  var css=document.createElement('style');
  css.textContent=
   'html.fs1{font-size:112.5%}html.fs2{font-size:125%}html.fs3{font-size:140%}'+
   'html.fs1 body.px{zoom:1.12}html.fs2 body.px{zoom:1.25}html.fs3 body.px{zoom:1.4}'+
   'html.fs1 body.px,html.fs2 body.px,html.fs3 body.px{}'+
   'html.lh1 :is(p,li,dd,dt,blockquote,label,td,th,summary,textarea,.lead){line-height:1.9!important}'+
   'html.lh2 :is(p,li,dd,dt,blockquote,label,td,th,summary,textarea,.lead){line-height:2.2!important;letter-spacing:.04em;word-spacing:.12em}'+
   'html.ff body,html.ff body *:not(svg):not(svg *){font-family:Verdana,Tahoma,"Trebuchet MS","Segoe UI",system-ui,sans-serif!important}'+
   '.a11y-menu{min-width:16.5rem}'+
   '.cf-sec{border-top:1px solid currentColor;border-top-color:rgba(127,127,127,.35);margin-top:.35rem;padding:.2rem .35rem .45rem}'+
   '.a11y-menu .cf-sec>p{padding:.55rem .35rem .35rem}'+
   '.cf-row{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin:.1rem 0 .5rem;padding:0 .35rem}'+
   '.cf-lbl{font:600 .85rem/1.2 system-ui,-apple-system,sans-serif}'+
   '.cf-seg{display:inline-flex;border:1.5px solid currentColor;border-radius:999px;overflow:hidden}'+
   '.cf-seg button{font:600 .82rem/1 system-ui,-apple-system,sans-serif;color:inherit;background:none;border:0;padding:.45rem .65rem;cursor:pointer;min-width:2.3rem}'+
   '.cf-seg button+button{border-left:1.5px solid currentColor}'+
   '.cf-seg button[aria-checked="true"]{background:rgba(127,127,127,.28);box-shadow:inset 0 -3px 0 currentColor}'+
   '.cf-seg button:focus-visible{outline:3px solid #06c;outline-offset:-3px}'+
   '.cf-reset{display:block;margin:.1rem .35rem .2rem;font:600 .82rem/1 system-ui,-apple-system,sans-serif;color:inherit;background:none;border:0;padding:.4rem 0;cursor:pointer;text-decoration:underline;text-underline-offset:3px}'+
   '@media print{html.fs1,html.fs2,html.fs3{font-size:100%!important}html.fs1 body.px,html.fs2 body.px,html.fs3 body.px{zoom:1!important}}';
  document.head.appendChild(css);
  function apply(){
    ['fs1','fs2','fs3','lh1','lh2','ff'].forEach(function(c){r.classList.remove(c)});
    if(S.fs)r.classList.add('fs'+S.fs);
    if(S.lh)r.classList.add('lh'+S.lh);
    if(S.ff)r.classList.add('ff');
    try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}
  }
  apply();
  document.addEventListener('DOMContentLoaded',function(){
    if(document.getElementById('sheet'))document.body.classList.add('px');
    var menu=document.getElementById('a11y-menu');if(!menu)return;
    /* garder le menu entièrement visible : l'aligner à gauche s'il dépasse de l'écran */
    var ab=document.getElementById('a11y-btn');
    if(ab)ab.addEventListener('click',function(){
      menu.style.left='';menu.style.right='';
      setTimeout(function(){
        if(menu.hidden)return;
        var r=menu.getBoundingClientRect();
        if(r.left<8){menu.style.right='auto';menu.style.left='0'}
      },0);
    });
    /* regrouper les options d'affichage dans leur propre groupe radio */
    var kids=[].slice.call(menu.children);
    menu.removeAttribute('role');menu.removeAttribute('aria-label');menu.setAttribute('role','group');menu.setAttribute('aria-label','Accessibilité');
    if(kids.length){var g=document.createElement('div');g.setAttribute('role','radiogroup');g.setAttribute('aria-label','Affichage de la page');
      kids.forEach(function(c){g.appendChild(c)});menu.appendChild(g)}
    var sec=document.createElement('div');sec.className='cf-sec';sec.setAttribute('role','group');sec.setAttribute('aria-label','Confort de lecture');
    sec.innerHTML='<p>Confort de lecture</p>';
    function row(label,key,opts){
      var d=document.createElement('div');d.className='cf-row';
      var l=document.createElement('span');l.className='cf-lbl';l.textContent=label;d.appendChild(l);
      var seg=document.createElement('div');seg.className='cf-seg';seg.setAttribute('role','radiogroup');seg.setAttribute('aria-label',label);
      opts.forEach(function(o,i){
        var b=document.createElement('button');b.type='button';b.setAttribute('role','radio');b.setAttribute('aria-label',o[1]);
        b.innerHTML='<span style="'+(o[2]||'')+'">'+o[0]+'</span>';
        b.addEventListener('click',function(e){e.stopPropagation();S[key]=i;apply();sync()});
        seg.appendChild(b);
      });
      d.appendChild(seg);sec.appendChild(d);return seg;
    }
    var segs={
      fs:row('Taille du texte','fs',[['A','Taille normale','font-size:.8rem'],['A','Grande taille','font-size:1rem'],['A','Très grande taille','font-size:1.2rem']]),
      lh:row('Interligne','lh',[['Normal','Interligne normal'],['Large','Interligne large'],['Maxi','Interligne très large']]),
      ff:row('Police','ff',[['Origine','Police d’origine'],['Lisible','Police lisible']])
    };
    var rs=document.createElement('button');rs.type='button';rs.className='cf-reset';rs.textContent='Réinitialiser';
    rs.addEventListener('click',function(e){e.stopPropagation();S={fs:0,lh:0,ff:0};apply();sync()});
    sec.appendChild(rs);menu.appendChild(sec);
    function sync(){
      Object.keys(segs).forEach(function(k){
        [].slice.call(segs[k].children).forEach(function(b,i){b.setAttribute('aria-checked',S[k]===i?'true':'false')});
      });
    }
    sync();
  });
})();
