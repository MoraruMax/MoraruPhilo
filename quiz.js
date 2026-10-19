(function(){
var box=document.getElementById('qz'),dn=document.getElementById('quizdata');if(!box||!dn)return;
var Q;try{Q=JSON.parse(dn.textContent)}catch(e){return}
var root=document.getElementById('quiz'),i=0,score=0,order;
function bgOf(el){while(el){var c=getComputedStyle(el).backgroundColor;if(c&&c!=='transparent'&&!/rgba\(\s*0,\s*0,\s*0,\s*0\)/.test(c))return c;el=el.parentElement}return '#fff'}
function lum(c){var m=c.match(/\d+(\.\d+)?/g);if(!m)return 1;var r=[+m[0],+m[1],+m[2]].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r[0]+.7152*r[1]+.0722*r[2]}
function theme(){var bg=bgOf(document.body),fg=getComputedStyle(document.body).color,dark=lum(bg)<.4;
 root.style.setProperty('--qbg',bg);root.style.setProperty('--qfg',fg);
 root.style.setProperty('--qok',dark?'#6fd18b':'#1b7f3b');root.style.setProperty('--qko',dark?'#ff8a80':'#b3261e');
 var cs=getComputedStyle(document.documentElement),n=['--acc','--accent','--doubt','--a','--brand','--ab','--attr'],a='';
 for(var k=0;k<n.length;k++){var v=cs.getPropertyValue(n[k]).trim();if(v){a=v;break}}
 if(a)root.style.setProperty('--qa',a);else root.style.removeProperty('--qa')}
function sh(a){var r=a.map(function(x,k){return{t:x,c:k===0}});for(var j=r.length-1;j>0;j--){var k=Math.floor(Math.random()*(j+1)),t=r[j];r[j]=r[k];r[k]=t}return r}
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function focusLegend(){var l=box.querySelector('legend');if(l)l.focus({preventScroll:true})}
function show(){theme();
 if(i>=Q.length){var m=score===Q.length?'Parfait : vous avez tout retenu.':score>=Q.length-1?'Très bien. Relisez le point qui vous a échappé.':score>=Math.ceil(Q.length/2)?'Bien. Relisez les passages des questions manquées.':'Relisez la fiche, puis recommencez.';
  box.innerHTML='<p class="qmeta"><span>Terminé</span></p><div class="qbar"><i style="width:100%"></i></div><p class="score" tabindex="-1">'+score+' / '+Q.length+'</p><p>'+m+'</p><div class="qact"><button type="button" id="rs">Recommencer</button></div>';
  box.querySelector('.score').focus({preventScroll:true});
  try{var pg=location.pathname.split('/').pop();if(pg){var ob=JSON.parse(localStorage.getItem('carnet-quiz')||'null')||{};ob[pg]=[score,Q.length];localStorage.setItem('carnet-quiz',JSON.stringify(ob))}}catch(e){}
  document.getElementById('rs').onclick=function(){i=0;score=0;show();focusLegend()};return}
 var q=Q[i];order=sh(q.a);
 var h='<p class="qmeta"><span>Question '+(i+1)+' sur '+Q.length+'</span><span>Score : '+score+'</span></p><div class="qbar"><i style="width:'+(i/Q.length*100)+'%"></i></div><fieldset><legend tabindex="-1">'+esc(q.q)+'</legend>';
 order.forEach(function(o,k){h+='<label class="opt"><input type="radio" name="r" value="'+k+'"><span>'+esc(o.t)+'</span></label>'});
 h+='</fieldset><div id="fb" aria-live="polite"></div><div class="qact"><button type="button" id="ok" disabled>Valider</button></div>';
 box.innerHTML=h;
 var ok=document.getElementById('ok');
 [].forEach.call(box.querySelectorAll('input'),function(x){x.onchange=function(){ok.disabled=false}});
 ok.onclick=function(){var v=box.querySelector('input:checked');if(!v)return;
  var k=+v.value,good=order[k].c;if(good)score++;
  [].forEach.call(box.querySelectorAll('.opt'),function(l,n){l.querySelector('input').disabled=true;l.classList.add('dis');
   if(order[n].c){l.classList.add('ok');l.insertAdjacentHTML('beforeend','<span class="tag">✓ Bonne réponse</span>')}
   else if(n===k){l.classList.add('ko');l.insertAdjacentHTML('beforeend','<span class="tag">✗ Votre réponse</span>')}});
  document.getElementById('fb').innerHTML='<p class="expl"><strong>'+(good?'Exact. ':'Pas tout à fait. ')+'</strong>'+esc(q.e)+'</p>';
  ok.outerHTML='<button type="button" id="nx">'+(i+1<Q.length?'Question suivante':'Voir mon score')+'</button>';
  var nx=document.getElementById('nx');nx.focus();nx.onclick=function(){i++;show();focusLegend()}}}
show();
if(window.matchMedia)try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',theme)}catch(e){}
})();
