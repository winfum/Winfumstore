/* WINFUM — contenu du site géré depuis l'admin / manager + chargement rapide.
   Chargé dans le <head> des pages publiques. Expose :
     WinfumSite.rest(chemin)        -> lecture directe de l'API (sans attendre la bibliothèque Supabase)
     WinfumSite.content()           -> Promise { cle: valeur } (table site_content)
     WinfumSite.cached()            -> dernier contenu connu, immédiatement (mémorisé à la visite précédente)
     WinfumSite.hero(el, cle)       -> affiche l'affiche du haut sans jamais montrer l'ancienne (skeleton puis fondu)
     WinfumSite.lsGet / lsSet       -> mémoire locale (catalogue, bannières… affichés instantanément à la 2e visite)
     WinfumSite.skelCards(n)        -> cartes « skeleton » pendant le chargement
     WinfumSite.sb()                -> client Supabase (chargé seulement quand il sert : compte, panier…)
   Si l'API est injoignable, le site garde ce qu'il avait en mémoire : rien ne casse. */
(function () {
  var URL_ = 'https://cxobpfaffgevxblnbwft.supabase.co', KEY = 'sb_publishable_bA-89TIqjkUhoA5NIlf7uQ_UUbb8oSB';
  var PATH = location.pathname, PAGE = /jbparfumerie/i.test(PATH) ? 'parfum' : /funforus/i.test(PATH) ? 'vin' : 'home';
  var HERO_KEY = PAGE === 'vin' ? 'vin_poster_url' : PAGE === 'parfum' ? 'parfum_poster_url' : null;

  /* ---------- styles : skeleton, fondu des images, affiche du haut ---------- */
  var css = [
    '@keyframes wfsh{0%{background-position:150% 0}100%{background-position:-50% 0}}',
    '.sk,.mo.sk,.ph.sk,.cat.sk,.ann-card.sk,.card.skel .ph.sk{background:linear-gradient(100deg,rgba(128,128,128,.13) 30%,rgba(255,255,255,.5) 50%,rgba(128,128,128,.13) 70%) 0 0/250% 100%;animation:wfsh 1.4s linear infinite;border-radius:16px;box-shadow:none;cursor:default;pointer-events:none}',
    '[data-theme="dark"] .sk,[data-theme="dark"] .mo.sk,[data-theme="dark"] .ph.sk,[data-theme="dark"] .cat.sk,[data-theme="dark"] .ann-card.sk{background:linear-gradient(100deg,rgba(255,255,255,.05) 30%,rgba(255,255,255,.14) 50%,rgba(255,255,255,.05) 70%) 0 0/250% 100%}',
    '.card.skel{pointer-events:none}.card.skel .ph{aspect-ratio:3/4;width:100%}.card.skel .info{padding:14px 4px 4px;display:grid;gap:10px}',
    '.card.skel .info .sk{height:12px;border-radius:8px}',
    '.ann-card.sk{min-width:240px;aspect-ratio:4/5;flex:none}',
    '.cat.sk{min-height:150px;min-width:150px}',
    /* images : fondu doux à l'arrivée, shimmer tant qu'elles chargent */
    '.ph img.cover,.ann-card img.cover,.mo img.cover{opacity:0;transition:opacity .45s ease}',
    '.ph img.cover.ld,.ann-card img.cover.ld,.mo img.cover.ld{opacity:1}',
    '.ph:has(img.cover:not(.ld)),.ann-card:has(img.cover:not(.ld)),.mo:has(img.cover:not(.ld)){background:linear-gradient(100deg,rgba(128,128,128,.13) 30%,rgba(255,255,255,.5) 50%,rgba(128,128,128,.13) 70%) 0 0/250% 100%;animation:wfsh 1.4s linear infinite}',
    /* affiche du haut : jamais d'ancienne image, shimmer puis fondu */
    '.hero .poster{opacity:0;transition:opacity .7s ease}.hero.img-ready .poster,.hero.has-video .poster{opacity:1}',
    '.hero:not(.img-ready):not(.no-img)::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.13) 50%,transparent 70%) 0 0/250% 100%;animation:wfsh 1.5s linear infinite}',
    '.hs.loading{background:linear-gradient(100deg,rgba(128,128,128,.13) 30%,rgba(255,255,255,.5) 50%,rgba(128,128,128,.13) 70%) 0 0/250% 100%;animation:wfsh 1.4s linear infinite}',
    '.hs.loading .arrow{display:none}',
    '.promo .pbg{opacity:0;transition:opacity .7s ease}.promo.img-ready .pbg{opacity:1}',
    '.promo.loading .pc>*{visibility:hidden}',
    '.promo.loading::after{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.14) 50%,transparent 70%) 0 0/250% 100%;animation:wfsh 1.5s linear infinite}',
    '.logo-img:not([src]){visibility:hidden}',
    '@media (prefers-reduced-motion:reduce){.sk,.mo.sk,.ph.sk,.cat.sk,.ann-card.sk,.hs.loading,.hero::after,.promo::after{animation:none!important}}'
  ].join('\n');
  var st = document.createElement('style'); st.setAttribute('data-wf', 'skeleton'); st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  /* ---------- mémoire locale ---------- */
  function lsGet(k) { try { var v = localStorage.getItem('wf_' + k); return v == null ? null : JSON.parse(v); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem('wf_' + k, JSON.stringify(v)); } catch (e) { /* stockage plein ou bloqué : sans gravité */ } }

  /* ---------- lecture directe de l'API ---------- */
  function rest(path) {
    return fetch(URL_ + '/rest/v1/' + path, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }

  /* ---------- client Supabase complet (chargé à la demande) ---------- */
  var sbP = null;
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

  /* ---------- contenu du site (logo, affiches, images des cartes) ---------- */
  var C0 = lsGet('content') || {}, cP = null;
  function cssVar(name, u) {
    document.documentElement.style.setProperty(name, u ? 'url("' + String(u).replace(/["\\\n\r]/g, '') + '")' : 'none');
  }
  function applyLogo(m) {
    if (!m || !m.logo_url) return;
    var go = function () { document.querySelectorAll('.logo-img').forEach(function (i) { if (i.getAttribute('src') !== m.logo_url) i.src = m.logo_url; }); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
  }
  function content() {
    if (cP) return cP;
    cP = rest('site_content?select=key,value').then(function (rows) {
      var m = {}; (rows || []).forEach(function (x) { if (x && x.key && x.value) m[x.key] = String(x.value).trim(); });
      lsSet('content', m); C0 = m; applyLogo(m); return m;
    }).catch(function () { return C0; });
    return cP;
  }

  /* l'affiche du haut est préchargée dès le <head> si on la connaît déjà (2e visite) */
  if (HERO_KEY && C0[HERO_KEY] && /^(https?:\/\/|\/)/i.test(C0[HERO_KEY])) {
    var lk = document.createElement('link'); lk.rel = 'preload'; lk.as = 'image'; lk.href = C0[HERO_KEY]; lk.setAttribute('fetchpriority', 'high');
    document.head.appendChild(lk);
  }
  applyLogo(C0);

  /* affiche du haut : shimmer tant qu'on n'a pas l'image, puis fondu. L'ancienne image n'apparaît jamais. */
  function showHero(el, u) {
    if (!u) { cssVar('--hero-img', ''); el.classList.add('no-img'); el.classList.remove('img-ready'); return; }
    var done = false, im = new Image();
    function ok() { if (done) return; done = true; cssVar('--hero-img', u); el.classList.remove('no-img'); el.classList.add('img-ready'); }
    im.onload = ok; im.onerror = ok; im.src = u;
    if (im.complete && im.naturalWidth) ok();
  }
  function hero(el, key) {
    if (!el) return;
    var u0 = (C0 && C0[key]) || '';
    if (u0) showHero(el, u0);
    content().then(function (c) { var u = (c && c[key]) || ''; if (u !== u0 || (!u && !el.classList.contains('no-img'))) showHero(el, u); });
    /* sécurité : jamais de shimmer infini si le réseau est très lent */
    setTimeout(function () { if (!el.classList.contains('img-ready') && !el.classList.contains('no-img')) el.classList.add('no-img'); }, 9000);
  }

  /* logo : celui de l'admin dès qu'on le connaît ; le logo par défaut seulement si l'admin n'en a pas (ou si le réseau tarde) */
  function logo(dflt) {
    var set = function (u) { document.querySelectorAll('.logo-img').forEach(function (i) { if (i.getAttribute('src') !== u) i.src = u; }); };
    if (C0 && C0.logo_url) { set(C0.logo_url); return; }
    var done = false;
    content().then(function (c) { if (!done) { done = true; set((c && c.logo_url) || dflt); } });
    setTimeout(function () { if (!done) { done = true; set(dflt); } }, 1500);
  }

  /* ---------- skeleton ---------- */
  function skelCards(n) {
    var h = '', i; for (i = 0; i < (n || 6); i++) h += '<div class="card skel" aria-hidden="true"><div class="ph sk"></div><div class="info"><div class="sk" style="width:35%"></div><div class="sk" style="width:80%;height:16px"></div><div class="sk" style="width:45%"></div><div class="sk" style="width:100%;height:38px;border-radius:30px"></div></div></div>';
    return h;
  }

  /* ---------- images : fondu à l'arrivée (l'événement load ne « bulle » pas : on l'écoute en capture) ---------- */
  function ld(e) { var t = e.target; if (t && t.tagName === 'IMG') t.classList.add('ld'); }
  document.addEventListener('load', ld, true); document.addEventListener('error', ld, true);
  setTimeout(function () { document.querySelectorAll('img.cover:not(.ld)').forEach(function (i) { if (i.complete) i.classList.add('ld'); }); }, 6000);

  function slug(n) { return String(n == null ? '' : n).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'autre'; }
  window.WinfumSite = {
    PAGE: PAGE, sb: sb, rest: rest, content: content, cached: function () { return C0 || {}; },
    logo: logo, hero: hero, lsGet: lsGet, lsSet: lsSet, skelCards: skelCards, slug: slug,
    themeKey: function (n) { return 'theme_' + slug(n) + '_url'; },
    safeLink: function (u, dflt) { u = String(u || '').trim(); return /^(https?:\/\/|\/|#|mailto:|tel:|[a-z0-9_.\-]+\.html(\?[^\s"'<>]*)?(#[^\s"'<>]*)?$)/i.test(u) && !/^javascript:/i.test(u) ? u : (dflt || '#'); },
    safeUrl: function (u) { u = String(u || '').trim(); return /^(https?:\/\/|\/)[^\s"'<>]*$/i.test(u) ? u : ''; },
    /* affiche un résultat mémorisé tout de suite, puis le résultat frais ; ne redessine pas si rien n'a changé */
    swr: function (key, path, paint) {
      var c = lsGet(key), cs = c == null ? null : JSON.stringify(c);
      if (c != null) paint(c, true);
      return rest(path).then(function (d) { var ds = JSON.stringify(d); lsSet(key, d); if (ds !== cs) paint(d, false); return d; });
    }
  };
})();
