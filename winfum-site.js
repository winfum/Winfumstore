/* WINFUM — contenu du site géré depuis l'admin / manager (table site_content).
   Chargé sur l'accueil, JB Parfumerie et Fun For Us. Expose :
     WinfumSite.sb()        -> client Supabase partagé
     WinfumSite.content()   -> Promise de { cle: valeur } (logo_url, theme_rouge_url, parfum_poster_url…)
     WinfumSite.themeKey(n) -> clé de l'image d'une carte catégorie (ex. "Rosé" -> theme_rose_url)
   Si la table est inaccessible, la promesse renvoie {} : le site garde ses visuels par défaut. */
(function () {
  var URL_ = 'https://cxobpfaffgevxblnbwft.supabase.co', KEY = 'sb_publishable_bA-89TIqjkUhoA5NIlf7uQ_UUbb8oSB';
  var sbP = null, cP = null;
  function sb() {
    if (window.WINFUM_SB) return Promise.resolve(window.WINFUM_SB);
    if (sbP) return sbP;
    sbP = new Promise(function (res, rej) {
      if (window.supabase) return res();
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      s.onload = res; s.onerror = rej; document.head.appendChild(s);
    }).then(function () { return window.WINFUM_SB || (window.WINFUM_SB = window.supabase.createClient(URL_, KEY)); });
    return sbP;
  }
  function content() {
    if (cP) return cP;
    cP = sb().then(function (c) { return c.from('site_content').select('key,value'); }).then(function (r) {
      var m = {}; ((r && r.data) || []).forEach(function (x) { if (x && x.key && x.value) m[x.key] = String(x.value).trim(); });
      /* logo : appliqué partout dès qu'il est connu */
      if (m.logo_url) document.querySelectorAll('.logo-img').forEach(function (i) { i.src = m.logo_url; });
      return m;
    }).catch(function () { return {}; });
    return cP;
  }
  function slug(n) { return String(n == null ? '' : n).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'autre'; }
  window.WinfumSite = { sb: sb, content: content, slug: slug, themeKey: function (n) { return 'theme_' + slug(n) + '_url'; } };
})();
