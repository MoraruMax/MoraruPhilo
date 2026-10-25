/* Lecture à voix haute : synthèse vocale du navigateur, sans compte ni envoi de données. */
(function(){
  if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return;
  var SEL='h1,h2,h3,h4,p,li,blockquote,figcaption,summary,dt,dd,.lead,.t,.lb';
  var syn=window.speechSynthesis,K='voix-vitesse',RATES=[.85,1,1.2],rateI=1,blocks=[],idx=0,state='stop',cur=null,voice=null,bar,lbl,bPause;
  try{var v=+localStorage.getItem(K);if(v>=0&&v<=2&&localStorage.getItem(K)!==null)rateI=v}catch(e){}

  function visible(el){
    if(!el.getClientRects().length)return false;
    var cs=getComputedStyle(el);return cs.visibility!=='hidden'&&cs.display!=='none';
  }
  function collect(){
    var root=document.querySelector('main')||document.body,hero=document.querySelector('.hero,header');
    var nodes=[].slice.call(root.querySelectorAll(SEL));
    if(hero&&!root.contains(hero))nodes=[].slice.call(hero.querySelectorAll(SEL)).concat(nodes);
    var out=[],seen=[];
    nodes.forEach(function(el){
      if(el.closest('nav,button,select,textarea,input,form,script,style,svg,[hidden],[aria-hidden="true"],#quiz,.pn,.som,.a11y,.tts-bar,.lc-skip,dialog,table'))return;
      if(!visible(el))return;
      var c=el.cloneNode(true);
      [].slice.call(c.querySelectorAll(SEL+',button,svg,script,style,[aria-hidden="true"],.sl,small')).forEach(function(x){x.remove()});
      var txt=(c.textContent||'').replace(/\s+/g,' ').trim();
      if(el.matches('summary,.lb')&&false)return;
      if(txt.length<2)return;
      if(el.tagName==='SUMMARY'){var sl=el.querySelector('.sl');if(sl&&!txt)return}
      out.push({el:el,txt:txt});
    });
    return out;
  }
  function pickVoice(){
    var vs=syn.getVoices()||[];
    voice=vs.filter(function(x){return /^fr[-_]FR/i.test(x.lang)})[0]||vs.filter(function(x){return /^fr/i.test(x.lang)})[0]||null;
  }
  if(syn.onvoiceschanged!==undefined)syn.onvoiceschanged=pickVoice;pickVoice();

  function chunks(t){
    var parts=t.match(/[^.!?;:…]+[.!?;:…]*\s*/g)||[t],out=[],s='';
    parts.forEach(function(p){if((s+p).length>220&&s){out.push(s);s=p}else s+=p});
    if(s)out.push(s);return out;
  }
  function mark(el){
    if(cur)cur.classList.remove('tts-now');
    cur=el;if(el){el.classList.add('tts-now');
      var r=el.getBoundingClientRect();
      if(r.top<80||r.bottom>innerHeight-120){el.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})}}
  }
  function speak(){
    if(state!=='play')return;
    if(idx>=blocks.length){stop(true);return}
    var b=blocks[idx];mark(b.el);setLabel();
    var cs=chunks(b.txt),i=0,my=idx;
    (function next(){
      if(state!=='play'||my!==idx)return;
      if(i>=cs.length){idx++;speak();return}
      var u=new SpeechSynthesisUtterance(cs[i++]);
      u.lang='fr-FR';if(voice)u.voice=voice;u.rate=RATES[rateI];
      u.onend=next;u.onerror=function(e){if(e&&(e.error==='canceled'||e.error==='interrupted'))return;next()};
      syn.speak(u);
    })();
  }
  function firstVisibleIndex(){
    for(var i=0;i<blocks.length;i++){var r=blocks[i].el.getBoundingClientRect();if(r.bottom>60)return i}
    return 0;
  }
  function start(){
    syn.cancel();blocks=collect();if(!blocks.length)return;
    idx=firstVisibleIndex();state='play';showBar(true);setBtns();speak();
  }
  function pause(){if(state!=='play')return;state='pause';syn.cancel();setBtns();setLabel()}
  function resume(){if(state!=='pause')return;state='play';setBtns();speak()}
  function stop(){state='stop';syn.cancel();mark(null);showBar(false);setBtns()}
  function setLabel(){if(lbl)lbl.textContent=state==='pause'?'Lecture en pause':'Lecture en cours ('+Math.min(idx+1,blocks.length)+' / '+blocks.length+')'}
  function showBar(on){if(bar)bar.hidden=!on}
  var mainBtn;
  function setBtns(){
    if(bPause)bPause.textContent=state==='pause'?'Reprendre':'Pause';
    if(mainBtn)mainBtn.textContent=state==='stop'?'Lire la page':'Relire depuis ici';
  }

  function init(){
    var st=document.createElement('style');
    st.textContent=
     '.tts-now{outline:3px solid var(--focus,#06c);outline-offset:4px;border-radius:4px;background:color-mix(in srgb,var(--focus,#06c) 10%,transparent)}'+
     '.tts-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:max(.8rem,env(safe-area-inset-bottom));z-index:70;display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;justify-content:center;max-width:calc(100vw - 1.6rem);padding:.55rem .8rem;border-radius:22px;background:var(--bg,#fff);color:var(--ink,#111);border:1.5px solid var(--ink,#111);box-shadow:0 6px 20px rgba(0,0,0,.25);font:600 .88rem/1.2 system-ui,-apple-system,sans-serif}'+
     '.tts-bar[hidden]{display:none}.tts-bar span{white-space:nowrap}@media(max-width:700px){.tts-bar{bottom:calc(4.3rem + env(safe-area-inset-bottom))}}'+
     '.tts-bar button{font:inherit;color:inherit;background:none;border:1.5px solid currentColor;border-radius:999px;padding:.4rem .8rem;cursor:pointer}'+
     '.tts-bar button:focus-visible,.tts-run:focus-visible{outline:3px solid var(--focus,#06c);outline-offset:2px}'+
     '.tts-run{display:block;margin:.1rem .35rem .5rem;font:700 .88rem/1 system-ui,-apple-system,sans-serif;color:var(--bg,#fff);background:var(--ink,#111);border:0;border-radius:999px;padding:.6rem 1rem;cursor:pointer}'+
     '@media print{.tts-bar{display:none}.tts-now{outline:0;background:none}}';
    document.head.appendChild(st);
    bar=document.createElement('div');bar.className='tts-bar';bar.hidden=true;bar.setAttribute('role','region');bar.setAttribute('aria-label','Lecture à voix haute');
    bar.innerHTML='<span id="tts-lbl" aria-live="polite">Lecture en cours</span><button type="button" id="tts-p">Pause</button><button type="button" id="tts-s">Arrêter</button>';
    document.body.appendChild(bar);
    lbl=bar.querySelector('#tts-lbl');bPause=bar.querySelector('#tts-p');
    bPause.addEventListener('click',function(){state==='pause'?resume():pause()});
    bar.querySelector('#tts-s').addEventListener('click',stop);
    var menu=document.getElementById('a11y-menu');
    if(menu){
      var sec=document.createElement('div');sec.className='cf-sec';sec.setAttribute('role','group');sec.setAttribute('aria-label','Lecture à voix haute');
      sec.innerHTML='<p>Lecture à voix haute</p>';
      mainBtn=document.createElement('button');mainBtn.type='button';mainBtn.className='tts-run';mainBtn.textContent='Lire la page';
      mainBtn.addEventListener('click',function(e){e.stopPropagation();menu.hidden=true;var b=document.getElementById('a11y-btn');if(b)b.setAttribute('aria-expanded','false');start()});
      sec.appendChild(mainBtn);
      var row=document.createElement('div');row.className='cf-row';row.innerHTML='<span class="cf-lbl">Vitesse</span>';
      var seg=document.createElement('div');seg.className='cf-seg';seg.setAttribute('role','radiogroup');seg.setAttribute('aria-label','Vitesse de lecture');
      [['Lente','Vitesse lente'],['Normale','Vitesse normale'],['Rapide','Vitesse rapide']].forEach(function(o,i){
        var b=document.createElement('button');b.type='button';b.setAttribute('role','radio');b.setAttribute('aria-label',o[1]);b.textContent=o[0];
        b.addEventListener('click',function(e){e.stopPropagation();rateI=i;try{localStorage.setItem(K,i)}catch(_){}sync();if(state==='play'){syn.cancel();setTimeout(speak,60)}});
        seg.appendChild(b)});
      row.appendChild(seg);sec.appendChild(row);menu.appendChild(sec);
      function sync(){[].slice.call(seg.children).forEach(function(b,i){b.setAttribute('aria-checked',i===rateI?'true':'false')})}
      sync();
    }
    window.addEventListener('pagehide',function(){syn.cancel()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&state!=='stop'&&bar.contains(document.activeElement))stop()});
  }
  if(document.readyState==='complete')init();else window.addEventListener('load',init);
})();
