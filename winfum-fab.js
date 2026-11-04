/* WINFUM — icônes flottantes déplaçables qui remplacent le bouton WhatsApp : panier (si non vide) et notifications (paiement validé / nouveau message). */
(function(){
var URL_='https://cxobpfaffgevxblnbwft.supabase.co',KEY_='sb_publishable_bA-89TIqjkUhoA5NIlf7uQ_UUbb8oSB';
var css=document.createElement('style');css.textContent='.wf-fab{position:fixed;z-index:9000;width:62px;height:62px;border-radius:50%;border:0;display:none;place-items:center;color:#fff;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;box-shadow:0 10px 26px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.25)}.wf-fab.on{display:grid;animation:wfin .4s cubic-bezier(.2,1.4,.4,1)}.wf-fab.drag{cursor:grabbing;transform:scale(1.12);transition:none}.wf-fab svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}.wf-cart{background:linear-gradient(145deg,#8b1730,#5c0c1e)}.wf-n-pay{background:linear-gradient(145deg,#2f9a5b,#1e6b3d)}.wf-n-msg{background:linear-gradient(145deg,#b8883a,#8a5f1c)}.wf-n-pay.on,.wf-n-msg.on{animation:wfin .4s cubic-bezier(.2,1.4,.4,1),wfb 1.6s .5s infinite}.wf-b{position:absolute;top:-4px;right:-4px;min-width:22px;height:22px;padding:0 6px;border-radius:12px;background:#f2c14e;color:#3a2600;font:700 12px/22px Inter,sans-serif;text-align:center;border:2px solid #fff;pointer-events:none}.wf-pop{position:fixed;z-index:9001;max-width:230px;background:#fff;color:#1c1a17;padding:11px 14px;border-radius:14px;font:500 13.5px/1.35 Inter,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.28);display:none}.wf-pop.on{display:block;animation:wfin .35s}@keyframes wfin{from{opacity:0;transform:scale(.4)}}@keyframes wfb{0%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}';
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
var nf=mk('wf-n','wf_pos_notif',240,function(){var n=cur();ls('wf_notif',null);ls('wf_seen',new Date().toISOString());refresh();if(/espace\.html/.test(location.pathname)){var r=document.getElementById('wo-root');if(r)r.scrollIntoView({behavior:'smooth'});}else location.href='espace.html#'+(n&&n.k==='pay'?'commandes':'support');});
var pop=document.createElement('div');pop.className='wf-pop';document.body.appendChild(pop);
function cur(){try{return JSON.parse(ls('wf_notif')||'null');}catch(e){return null;}}
function count(){try{return JSON.parse(ls('winfum_cart')||'[]').reduce(function(a,c){return a+(+c.qty||0);},0);}catch(e){return 0;}}
var isEsp=/\/espace(\.html)?\/?$/.test(location.pathname);
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
  var key=n?n.k+n.t:'';if(hid)pop.classList.remove('on');if(n&&!hid&&key!==lastN){var r=nf.getBoundingClientRect();pop.textContent=n.t;pop.style.top=Math.max(8,r.top-8)+'px';pop.style.left=Math.max(8,Math.min(innerWidth-240,r.left-170))+'px';pop.classList.add('on');setTimeout(function(){pop.classList.remove('on');},6000);}
  lastN=key;
}
function notify(k,t){ls('wf_notif',JSON.stringify({k:k,t:t}));refresh();}
setInterval(refresh,800);addEventListener('storage',refresh);refresh();
function withSB(cb){if(window.supabase&&window.supabase.createClient)return cb();var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=cb;document.head.appendChild(s);}
function start(){
  var sb=window.supabase.createClient(URL_,KEY_);
  function go(uid){
    var seen=ls('wf_seen')||'1970-01-01T00:00:00Z';
    sb.from('order_messages').select('id').eq('customer_id',uid).eq('sender','equipe').gt('created_at',seen).limit(1).then(function(r){if(r.data&&r.data.length&&!cur())notify('msg','Vous avez un nouveau message');});
    sb.from('orders').select('id').eq('customer_id',uid).eq('pay_status','verifie').gt('updated_at',seen).limit(1).then(function(r){if(r.data&&r.data.length)notify('pay','Mise à jour de votre commande');});
    sb.channel('wf-fab-'+uid)
     .on('postgres_changes',{event:'UPDATE',schema:'public',table:'orders',filter:'customer_id=eq.'+uid},function(p){if(p.new.pay_status==='verifie'&&(!p.old||p.old.pay_status!=='verifie'))notify('pay','Votre paiement a été validé 🎉');})
     .on('postgres_changes',{event:'INSERT',schema:'public',table:'order_messages',filter:'customer_id=eq.'+uid},function(p){if(p.new.sender==='equipe')notify('msg','Vous avez un nouveau message');}).subscribe();
  }
  sb.auth.getSession().then(function(s){if(s.data.session)go(s.data.session.user.id);});
}
withSB(start);
window.WFFab={notify:notify};
})();
