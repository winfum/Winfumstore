/* WINFUM — images légères : compression à l'envoi + chargement différé sur tout le site. */
window.WFImg={
  async compress(file,max,q){
    max=max||1600;q=q||.82;
    try{
      if(!file||!/^image\/(jpeg|png|webp)$/i.test(file.type||''))return file;
      if(file.size<250*1024)return file;
      const bmp=await createImageBitmap(file);
      const r=Math.min(1,max/Math.max(bmp.width,bmp.height)),w=Math.round(bmp.width*r),h=Math.round(bmp.height*r);
      const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(bmp,0,0,w,h);
      let b=await new Promise(res=>c.toBlob(res,'image/webp',q));
      if(!b||b.type!=='image/webp')b=await new Promise(res=>c.toBlob(res,'image/jpeg',q));
      if(!b||b.size>=file.size)return file;
      return new File([b],file.name.replace(/\.[^.]+$/,'')+(b.type==='image/webp'?'.webp':'.jpg'),{type:b.type});
    }catch(e){return file;}
  }
};
(function(){
  function fix(i){
    if(!i||i.tagName!=='IMG'||i.dataset.wfi)return;i.dataset.wfi=1;i.decoding='async';
    if(!i.hasAttribute('loading')&&!i.classList.contains('logo-img')&&!i.closest('[id^="hero"],.hero'))i.loading='lazy';
  }
  function all(r){(r.querySelectorAll?r.querySelectorAll('img'):[]).forEach(fix);}
  function go(){
    all(document);
    new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){fix(n);all(n);}});});}).observe(document.documentElement,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
