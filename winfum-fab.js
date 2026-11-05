/* WINFUM — icônes flottantes déplaçables qui remplacent le bouton WhatsApp : panier (si non vide) et notifications (paiement validé / nouveau message). */
(function(){
var URL_='https://cxobpfaffgevxblnbwft.supabase.co',KEY_='sb_publishable_bA-89TIqjkUhoA5NIlf7uQ_UUbb8oSB';
var css=document.createElement('style');css.textContent='.wf-fab{position:fixed;z-index:9000;width:62px;height:62px;border-radius:50%;border:0;display:none;place-items:center;color:#fff;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;box-shadow:0 10px 26px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.25)}.wf-fab.on{display:grid;animation:wfin .4s cubic-bezier(.2,1.4,.4,1)}.wf-fab.drag{cursor:grabbing;transform:scale(1.12);transition:none}.wf-fab svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}.wf-cart{background:linear-gradient(145deg,#8b1730,#5c0c1e)}.wf-n-pay{background:linear-gradient(145deg,#2f9a5b,#1e6b3d)}.wf-n-msg{background:linear-gradient(145deg,#b8883a,#8a5f1c)}.wf-n-pay.on,.wf-n-msg.on{animation:wfin .4s cubic-bezier(.2,1.4,.4,1),wfs 3.6s .9s infinite}.wf-fab.drag{animation:none!important}.wf-b{position:absolute;top:-4px;right:-4px;min-width:22px;height:22px;padding:0 6px;border-radius:12px;background:#f2c14e;color:#3a2600;font:700 12px/22px Inter,sans-serif;text-align:center;border:2px solid #fff;pointer-events:none}.wf-pop{position:fixed;z-index:9001;max-width:230px;background:#fff;color:#1c1a17;padding:11px 14px;border-radius:14px;font:500 13.5px/1.35 Inter,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.28);display:none}.wf-pop.on{display:block;animation:wfin .35s}@keyframes wfin{from{opacity:0;transform:scale(.4)}}@keyframes wfs{0%,30%,100%{transform:rotate(0)}4%{transform:rotate(-16deg)}8%{transform:rotate(14deg)}12%{transform:rotate(-12deg)}16%{transform:rotate(9deg)}20%{transform:rotate(-5deg)}24%{transform:rotate(2deg)}}.wf-card{position:fixed;z-index:9002;width:min(300px,calc(100vw - 24px));background:#fff;color:#1c1a17;border-radius:18px;padding:14px;box-shadow:0 16px 40px rgba(0,0,0,.35);display:none;font:14px/1.4 Inter,sans-serif}[data-theme=dark] .wf-card{background:#201d1a;color:#f2ede4}.wf-card.on{display:block;animation:wfin .3s}.wf-ch{display:flex;align-items:center;gap:10px}.wf-ch b{display:block;font-size:14px}.wf-ch small{opacity:.6;font-size:11.5px}.wf-ci{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:#fff;flex:none}.wf-ci svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.wf-cx{margin-left:auto;width:32px;height:32px;border-radius:50%;border:0;background:rgba(128,128,128,.18);color:inherit;display:grid;place-items:center;cursor:pointer;flex:none}.wf-cx svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round}.wf-cb{margin:10px 0 12px;padding:10px 12px;border-radius:12px;background:rgba(128,128,128,.12);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}.wf-ca{display:flex;flex-direction:column;gap:6px}.wf-go{border:0;border-radius:24px;padding:12px;background:#7a1128;color:#fff;font:600 14px Inter,sans-serif;cursor:pointer}.wf-rd{border:0;background:transparent;color:inherit;opacity:.65;font:500 12.5px Inter,sans-serif;padding:6px;cursor:pointer;text-decoration:underline}';
document.head.appendChild(css);
var ICON={cart:'<svg viewBox="0 0 24 24"><path d="M6 8h12l1.2 12H4.8L6 8z"/><path d="M9 8V7a3 3 0 016 0v1"/></svg>',pay:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',msg:'<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.2A8 8 0 1121 12z"/></svg>'};
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){}}
function mk(cls,pos,def,onTap){
  var b=document.createElement('button');b.className='wf-fab '+cls;b.type='button';document.body.appendChild(b);
  function place(x,y){x=Math.max(6,Math.min(innerWidth-68,x));y=Math.max(6,Math.min(innerHeight-68,y));b.style.left=x+'px';b.style.top=y+'px';b.style.right=b.style.bottom='auto';return[x,y];}
  function home(){var p;try{p=JSON.parse(ls(pos)||'null');}catch(e){}if(p&&p.x!=null)place(p.x*innerWidth,p.y*innerHeight);else place(innerWidth-80,innerHeight-def);}
  home();addEventListener('resize',home);
  var sx,sy,ox,oy,mv=false,id=null;
  b.addEventListener('pointerdown',function(e){id=e.pointerId;b.setPointerCapture(id);sx=e.clientX;sy=e.clientY;var r=b.getBoundingClientRect();ox=r.left;oy=r.top;mv=false;});
  b.addEventListener('pointermove',function(e){if(id===null)return;var dx=e.clientX-sx,dy=e.clientY-sy;if(!mv&&Math.hypot(dx,dy)>7){mv=true;b.classList.add('drag');}if(mv)place(ox+dx,oy+dy);});
  function end(){if(id===null)return;id=null;b.classList.remove('drag');if(mv){var r=b.getBoundingClientRect();ls(pos,JSON.stringify({x:r.left/innerWidth,y:r.top/innerHeight}));}else onTap();}
  b.addEventListener('pointerup',end);b.addEventListener('pointercancel',function(){id=null;b.classList.remove('drag');});
  return b;
}
var wa=function(){return document.querySelector('a.wa');};
var cart=mk('wf-cart','wf_pos_cart',160,function(){if(typeof window.openCart==='function')window.openCart();else location.href='paiement.html';});
var nf=mk('wf-n','wf_pos_notif',240,function(){if(card.classList.contains('on'))hideCard();else showCard();});
var card=document.createElement('div');card.className='wf-card';document.body.appendChild(card);
var XI='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function hideCard(){card.classList.remove('on');}
function showCard(){
  var n=cur();if(!n)return;var pay=n.k==='pay';
  card.innerHTML='<div class="wf-ch"><span class="wf-ci wf-n-'+n.k+'">'+ICON[n.k]+'</span><div><b>'+(pay?'Commande mise à jour':'Support Winfum')+'</b><small>'+(n.at?new Date(n.at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}):'À l\'instant')+'</small></div><button class="wf-cx" type="button" aria-label="Fermer">'+XI+'</button></div><div class="wf-cb">'+esc(n.b||n.t)+'</div><div class="wf-ca"><button class="wf-go" type="button">'+(pay?'Voir ma commande':'Ouvrir la discussion')+'</button><button class="wf-rd" type="button">Marquer comme lu</button></div>';
  var r=nf.getBoundingClientRect(),w=Math.min(300,innerWidth-24);card.style.left=Math.max(12,Math.min(innerWidth-w-12,r.right-w))+'px';
  if(r.top>innerHeight/2){card.style.top='auto';card.style.bottom=(innerHeight-r.top+10)+'px';}else{card.style.bottom='auto';card.style.top=(r.bottom+10)+'px';}
  card.classList.add('on');
  card.querySelector('.wf-cx').onclick=hideCard;
  card.querySelector('.wf-rd').onclick=function(){ls('wf_notif',null);ls('wf_seen',new Date().toISOString());hideCard();refresh();};
  card.querySelector('.wf-go').onclick=function(){hideCard();
    if(isEsp){var t=document.getElementById(pay?'wo-root':'wo-support');if(t){t.scrollIntoView({behavior:'smooth'});var i=document.getElementById('wc-i');if(i&&!pay)setTimeout(function(){i.focus({preventScroll:true});},500);}}
    else location.href='espace.html#'+(pay?'commandes':'support');};
}
document.addEventListener('pointerdown',function(e){if(card.classList.contains('on')&&!card.contains(e.target)&&!nf.contains(e.target))hideCard();});
var pop=document.createElement('div');pop.className='wf-pop';document.body.appendChild(pop);
var isEsp=/\/espace(\.html)?\/?$/.test(location.pathname);
function cur(){try{return JSON.parse(ls('wf_notif')||'null');}catch(e){return null;}}
function count(){try{return JSON.parse(ls('winfum_cart')||'[]').reduce(function(a,c){return a+(+c.qty||0);},0);}catch(e){return 0;}}
var last=-1,lastN='';
function blocked(){
  if(document.querySelector('#search-overlay.open,#cart-drawer.open,#cart-overlay.open,#wf-drawer.open,#wf-ov.open,.ov.open'))return true;
  var p=document.getElementById('preloader');
  if(p&&!p.classList.contains('hide')){var cs=getComputedStyle(p);if(cs.display!=='none'&&cs.visibility!=='hidden')return true;}
  return false;
}
function refresh(){
  var c=count(),n=cur(),hid=blocked();
  cart.classList.toggle('on',c>0&&!hid&&!isEsp);cart.innerHTML=ICON.cart+(c>0?'<span class="wf-b">'+c+'</span>':'');cart.setAttribute('aria-label','Panier ('+c+')');
  if(c!==last){if(last>=0&&c>last&&!hid){cart.classList.remove('on');void cart.offsetWidth;cart.classList.add('on');}last=c;}
  nf.className='wf-fab wf-n wf-n-'+(n?n.k:'msg')+(n&&!hid?' on':'');nf.innerHTML=n?ICON[n.k]+'<span class="wf-b">1</span>':'';nf.setAttribute('aria-label',n?n.t:'');
  var w=wa();if(w)w.style.display=((c>0&&!isEsp)||n)?'none':'';
  var key=n?n.k+n.t:'';if(hid)pop.classList.remove('on');if(n&&!hid&&key!==lastN){var r=nf.getBoundingClientRect();pop.textContent=(n.k==='msg'&&n.b)?(n.b.length>70?n.b.slice(0,70)+'…':n.b):n.t;pop.style.top=Math.max(8,r.top-8)+'px';pop.style.left=Math.max(8,Math.min(innerWidth-240,r.left-170))+'px';pop.classList.add('on');setTimeout(function(){pop.classList.remove('on');},6000);}
  lastN=key;
}
function notify(k,t,b,at){ls('wf_notif',JSON.stringify({k:k,t:t,b:b||'',at:at||new Date().toISOString()}));refresh();}
setInterval(refresh,800);addEventListener('storage',refresh);refresh();
function withSB(cb){if(window.supabase&&window.supabase.createClient)return cb();var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=cb;document.head.appendChild(s);}
function start(){
  var sb=window.WINFUM_SB||(window.WINFUM_SB=window.supabase.createClient(URL_,KEY_,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}}));
  function go(uid){
    var seen=ls('wf_seen')||'1970-01-01T00:00:00Z';
    sb.from('order_messages').select('id,body,created_at').eq('customer_id',uid).eq('sender','equipe').gt('created_at',seen).order('created_at',{ascending:false}).limit(1).then(function(r){if(r.data&&r.data.length&&!cur())notify('msg','Vous avez un nouveau message',r.data[0].body,r.data[0].created_at);});
    sb.from('orders').select('id').eq('customer_id',uid).eq('pay_status','verifie').gt('updated_at',seen).limit(1).then(function(r){if(r.data&&r.data.length)notify('pay','Mise à jour de votre commande','Votre commande a été mise à jour.');});
    sb.channel('wf-fab-'+uid)
     .on('postgres_changes',{event:'UPDATE',schema:'public',table:'orders',filter:'customer_id=eq.'+uid},function(p){if(p.new.pay_status==='verifie'&&(!p.old||p.old.pay_status!=='verifie'))notify('pay','Votre paiement a été validé','Votre paiement a été validé. Votre commande passe en préparation.');})
     .on('postgres_changes',{event:'INSERT',schema:'public',table:'order_messages',filter:'customer_id=eq.'+uid},function(p){if(p.new.sender==='equipe')notify('msg','Vous avez un nouveau message',p.new.body,p.new.created_at);}).subscribe();
  }
  sb.auth.getSession().then(function(s){if(s.data.session)go(s.data.session.user.id);});
}
withSB(start);
window.WFFab={notify:notify};
})();
