/* Surlignage personnel : sélectionner un passage, le surligner, le retrouver dans « Mon carnet de suivi ».
   Tout est mémorisé sur cet appareil (localStorage, clé « surlignages »). Chargé par confort.js sur les pages de contenu. */
(function(){
  var KEY='surlignages',MAX=700,MIN=3;
  var page=location.pathname.split('/').pop();
  var main=document.querySelector('main');
  if(!main||!/\.html$/.test(page))return;
  var EXCL='button,input,textarea,select,label,summary,a[role=button],nav,.tts-bar,.tts-now,#a11y-menu,.a11y-menu,.hl-bar,[contenteditable],svg,script,style';

  /* ---------- stockage ---------- */
  function load(){try{var v=JSON.parse(localStorage.getItem(KEY)||'{}');return v&&typeof v==='object'?v:{}}catch(e){return {}}}
  function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}}
  function list(){var d=load();return (d[page]&&d[page].h)||[]}
  function put(h){var d=load();if(!d[page])d[page]={t:cleanTitle(),h:[]};d[page].t=cleanTitle();d[page].h=h;if(!h.length)delete d[page];save(d)}
  function cleanTitle(){return (document.title||page).replace(/\s+/g,' ').trim()}

  /* ---------- texte de la page, hors éléments exclus ---------- */
  function textNodes(){
    var out=[],w=document.createTreeWalker(main,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
      var p=n.parentElement;if(!p)return NodeFilter.FILTER_REJECT;
      if(p.closest('script,style,svg,textarea,.tts-bar,.tts-now,.hl-bar'))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT}});
    var n;while(n=w.nextNode())out.push(n);return out}
  function offsetOf(nodes,node,off){var s=0;for(var i=0;i<nodes.length;i++){if(nodes[i]===node)return s+off;s+=nodes[i].nodeValue.length}return -1}
  function fullText(nodes){return nodes.map(function(n){return n.nodeValue}).join('')}

  /* ---------- poser / retirer les marques ---------- */
  function wrapRange(nodes,s,e,id){
    var pos=0,res=[];
    for(var i=0;i<nodes.length;i++){
      var n=nodes[i],len=n.nodeValue.length,a=pos,b=pos+len;pos=b;
      if(b<=s||a>=e)continue;
      var from=Math.max(s,a)-a,to=Math.min(e,b)-a;
      if(to<=from)continue;
      if(n.parentElement&&n.parentElement.closest('mark.hl'))continue;
      if(!/\S/.test(n.nodeValue.slice(from,to)))continue;
      var mid=n;
      if(from>0)mid=n.splitText(from);
      if(to-from<mid.nodeValue.length)mid.splitText(to-from);
      var m=document.createElement('mark');m.className='hl';m.setAttribute('data-hl',id);
      mid.parentNode.insertBefore(m,mid);m.appendChild(mid);res.push(m)
    }
    return res}
  function unwrap(id){
    [].slice.call(document.querySelectorAll('mark.hl[data-hl="'+id+'"]')).forEach(function(m){
      var p=m.parentNode;while(m.firstChild)p.insertBefore(m.firstChild,m);p.removeChild(m);p.normalize()})}

  /* ---------- retrouver un passage mémorisé ---------- */
  function locate(txt,h){
    if(txt.slice(h.s,h.e)===h.t)return h.s;
    var i=-1,best=-1,from=0;
    while((i=txt.indexOf(h.t,from))>=0){
      var okp=!h.p||txt.slice(Math.max(0,i-h.p.length),i)===h.p,okn=!h.n||txt.slice(i+h.t.length,i+h.t.length+h.n.length)===h.n;
      if(okp&&okn)return i;
      if(best<0&&(okp||okn))best=i;
      from=i+1}
    return best}
  function restore(){
    var hs=list();if(!hs.length)return;
    var changed=false;
    hs.forEach(function(h){
      if(document.querySelector('mark.hl[data-hl="'+h.i+'"]'))return;
      var nodes=textNodes(),txt=fullText(nodes),at=locate(txt,h);
      if(at<0){h.lost=true;return}
      if(h.lost){delete h.lost;changed=true}
      if(h.s!==at){h.s=at;h.e=at+h.t.length;changed=true}
      wrapRange(nodes,at,at+h.t.length,h.i)});
    if(changed)put(hs);
    var m=location.hash.match(/hl=([a-z0-9]+)/i);
    if(m){var el=document.querySelector('mark.hl[data-hl="'+m[1]+'"]');
      if(el){el.scrollIntoView({block:'center'});el.classList.add('hl-flash');setTimeout(function(){el.classList.remove('hl-flash')},2600)}}}

  /* ---------- barre flottante ---------- */
  var css=document.createElement('style');
  css.textContent=
   'mark.hl{background:#ffe27a;color:#1a1a1a;border-radius:3px;padding:.02em .08em;box-decoration-break:clone;-webkit-box-decoration-break:clone;-webkit-print-color-adjust:exact;print-color-adjust:exact;cursor:pointer}'+
   'mark.hl a,mark.hl em,mark.hl i,mark.hl b,mark.hl strong{color:inherit}'+
   '@media (prefers-color-scheme:dark){html:not([data-theme="light"]) mark.hl{background:#6b5a00;color:#fff6cc}}'+
   'html[data-theme="dark"] mark.hl{background:#6b5a00;color:#fff6cc}'+
   'mark.hl.hl-flash{outline:3px solid currentColor;outline-offset:2px}'+
   '.hl-bar{position:fixed;z-index:2147483000;display:none;gap:.35rem;background:#1a1a1a;color:#fff;border:1.5px solid #fff;border-radius:999px;padding:.3rem .35rem;box-shadow:0 4px 14px rgba(0,0,0,.35);font:600 .9rem/1 system-ui,-apple-system,"Segoe UI",sans-serif}'+
   '.hl-bar.on{display:flex}'+
   '.hl-bar button{font:inherit;color:#fff;background:none;border:0;border-radius:999px;padding:.5rem .8rem;cursor:pointer;min-height:2.4rem}'+
   '.hl-bar button:hover{background:rgba(255,255,255,.18)}'+
   '.hl-bar button:focus-visible{outline:3px solid #8cc4ff;outline-offset:1px}'+
   '.hl-bar .hl-dot{display:inline-block;width:.8em;height:.8em;border-radius:50%;background:#ffe27a;margin-right:.45em;vertical-align:-.05em}'+
   '@media print{.hl-bar{display:none!important}}';
  document.head.appendChild(css);
  var bar=document.createElement('div');bar.className='hl-bar';bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Surlignage');
  var btn=document.createElement('button');btn.type='button';
  bar.appendChild(btn);document.body.appendChild(bar);
  var pending=null,pendingId=null;

  function hide(){bar.classList.remove('on');pending=null;pendingId=null}
  var shownAt=0;
  function place(rect,below){
    shownAt=Date.now();bar.classList.add('on');
    var bw=bar.offsetWidth,bh=bar.offsetHeight,vw=document.documentElement.clientWidth;
    var x=Math.min(Math.max(8,rect.left+rect.width/2-bw/2),vw-bw-8);
    var y=below?rect.bottom+10:rect.top-bh-10;
    if(y<8)y=rect.bottom+10;
    if(y+bh>window.innerHeight-8)y=Math.max(8,rect.top-bh-10);
    bar.style.left=x+'px';bar.style.top=y+'px'}
  function coarse(){return window.matchMedia&&matchMedia('(pointer:coarse)').matches}

  function onSelect(){
    var sel=window.getSelection();
    if(!sel||sel.rangeCount===0||sel.isCollapsed){if(!pendingId)hide();return}
    var r=sel.getRangeAt(0);
    if(!main.contains(r.commonAncestorContainer)){hide();return}
    var ca=r.commonAncestorContainer.nodeType===1?r.commonAncestorContainer:r.commonAncestorContainer.parentElement;
    if(ca&&ca.closest(EXCL)){hide();return}
    var t=sel.toString();if(t.replace(/\s+/g,' ').trim().length<MIN||t.length>MAX){hide();return}
    var rc=r.getBoundingClientRect();if(!rc.width&&!rc.height){hide();return}
    pending=r.cloneRange();pendingId=null;
    btn.innerHTML='<span class="hl-dot" aria-hidden="true"></span>Surligner';btn.setAttribute('aria-label','Surligner la sélection');
    place(rc,coarse())}
  var tmr=null;
  document.addEventListener('selectionchange',function(){clearTimeout(tmr);tmr=setTimeout(function(){if(!bar.contains(document.activeElement)||!pending)onSelect()},coarse()?350:150)});
  document.addEventListener('mouseup',function(){setTimeout(onSelect,10)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')hide()});
  window.addEventListener('scroll',function(){if((pending||pendingId)&&Date.now()-shownAt>600)hide()},{passive:true});
  bar.addEventListener('mousedown',function(e){e.preventDefault()});

  btn.addEventListener('click',function(){
    if(pendingId){var id=pendingId,hs=list().filter(function(h){return h.i!==id});unwrap(id);put(hs);hide();return}
    if(!pending)return;
    var nodes=textNodes(),txt=fullText(nodes);
    var s=offsetOf(nodes,pending.startContainer.nodeType===3?pending.startContainer:firstText(pending.startContainer,pending.startOffset),pending.startContainer.nodeType===3?pending.startOffset:0);
    var eNode=pending.endContainer.nodeType===3?pending.endContainer:lastText(pending.endContainer,pending.endOffset);
    var e=offsetOf(nodes,eNode,pending.endContainer.nodeType===3?pending.endOffset:(eNode?eNode.nodeValue.length:0));
    if(s<0||e<=s){hide();return}
    var t=txt.slice(s,e);
    var id=(Date.now().toString(36)+Math.random().toString(36).slice(2,5)).toLowerCase();
    var hs=list();hs.push({i:id,s:s,e:e,t:t,p:txt.slice(Math.max(0,s-24),s),n:txt.slice(e,e+24),d:Date.now()});
    wrapRange(nodes,s,e,id);put(hs);
    var sel=window.getSelection();if(sel)sel.removeAllRanges();hide()});
  function firstText(node,off){var w=document.createTreeWalker(node,NodeFilter.SHOW_TEXT),n,k=0;var base=node.childNodes[off];if(base){var w2=document.createTreeWalker(base.nodeType===3?base.parentNode:base,NodeFilter.SHOW_TEXT);n=base.nodeType===3?base:w2.nextNode();return n}return w.nextNode()}
  function lastText(node,off){var prev=off>0?node.childNodes[off-1]:null,n=null;if(prev){if(prev.nodeType===3)return prev;var w=document.createTreeWalker(prev,NodeFilter.SHOW_TEXT),x;while(x=w.nextNode())n=x;return n}return null}

  /* clic sur un surlignage : proposer de le retirer */
  main.addEventListener('click',function(e){
    var m=e.target.closest&&e.target.closest('mark.hl');
    var sel=window.getSelection();if(sel&&!sel.isCollapsed)return;
    if(!m){return}
    pending=null;pendingId=m.getAttribute('data-hl');
    btn.innerHTML='Retirer le surlignage';btn.setAttribute('aria-label','Retirer ce surlignage');
    place(m.getBoundingClientRect(),false)});
  document.addEventListener('click',function(e){if(!bar.contains(e.target)&&!(e.target.closest&&e.target.closest('mark.hl'))&&pendingId)hide()});

  function init(){restore();setTimeout(restore,900)}
  if(document.readyState==='complete')init();else window.addEventListener('load',init);
  window.addEventListener('storage',function(e){if(e.key===KEY){[].slice.call(document.querySelectorAll('mark.hl')).forEach(function(m){var p=m.parentNode;while(m.firstChild)p.insertBefore(m.firstChild,m);p.removeChild(m);p.normalize()});restore()}});
})();
