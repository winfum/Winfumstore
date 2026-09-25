/* WINFUM — synchronisation favoris & panier avec le compte client (Supabase)
   À inclure en bas de index.html, jbparfumerie.html, funforus.html et espace.html :
   <script src="winfum-account.js"></script>
   Sans connexion, rien ne change : favoris et panier restent sur l'appareil.
   Connecté (compte approuvé) : ils sont enregistrés sur le compte et retrouvés partout. */
(function () {
  'use strict';
  const URL_ = 'https://cxobpfaffgevxblnbwft.supabase.co';
  const KEY = 'sb_publishable_bA-89TIqjkUhoA5NIlf7uQ_UUbb8oSB';
  const FAV_KEYS = ['winfum_favs', 'winfum_favs_home', 'winfum_favs_vin'];
  const CART_KEYS = ['winfum_cart', 'winfum_cart_parfum', 'winfum_cart_vin'];
  const WATCH = FAV_KEYS.concat(CART_KEYS);
  const DOMAIN = { winfum_favs: 'p', winfum_favs_vin: 'v', winfum_favs_home: '*', winfum_cart: '*', winfum_cart_parfum: 'p', winfum_cart_vin: 'v' };
  const ls = window.localStorage, rawSet = Storage.prototype.setItem, rawDel = Storage.prototype.removeItem;
  let sb = null, uid = null, ok = false, timer = null, pushing = false, again = false, inited = null;

  const parse = v => { try { return JSON.parse(v || '[]'); } catch (e) { return []; } };
  const rd = k => parse(ls.getItem(k));
  const wr = (k, v) => rawSet.call(ls, k, JSON.stringify(v));
  const app = (k, id) => DOMAIN[k] === '*' || !/^[pv]\d+$/.test(id) || DOMAIN[k] === id[0];
  const idOf = i => (typeof i === 'string' ? i : i && i.id);

  function canon() {
    const f = new Set(), c = {};
    FAV_KEYS.forEach(k => rd(k).forEach(i => { const id = idOf(i); if (id) f.add(id); }));
    CART_KEYS.forEach(k => rd(k).forEach(it => { if (it && it.id) c[it.id] = Math.max(c[it.id] || 0, it.qty || 1); }));
    return { f, c };
  }
  function writeLocal(t) {
    FAV_KEYS.forEach(k => wr(k, [...t.f].filter(id => app(k, id))));
    CART_KEYS.forEach(k => wr(k, Object.entries(t.c).filter(([id]) => app(k, id)).map(([id, qty]) => ({ id, qty }))));
  }
  const sig = t => JSON.stringify([[...t.f].sort(), Object.entries(t.c).sort()]);

  async function fetchDB() {
    const [f, c] = await Promise.all([
      sb.from('customer_favorites').select('item_id'),
      sb.from('customer_cart').select('item_id,qty')]);
    if (f.error || c.error) { console.warn('Winfum sync :', (f.error || c.error).message); return null; }
    const cart = {}; c.data.forEach(r => cart[r.item_id] = r.qty);
    return { f: new Set(f.data.map(r => r.item_id)), c: cart };
  }
  async function push() {
    if (!ok) return;
    if (pushing) { again = true; return; }
    pushing = true;
    try {
      const { f, c } = canon(), db = await fetchDB(); if (!db) return;
      const now = new Date().toISOString(), jobs = [];
      const upF = [...f].filter(id => !db.f.has(id)).map(id => ({ customer_id: uid, item_id: id }));
      const delF = [...db.f].filter(id => !f.has(id));
      const upC = Object.entries(c).filter(([id, q]) => db.c[id] !== q).map(([id, q]) => ({ customer_id: uid, item_id: id, qty: q, updated_at: now }));
      const delC = Object.keys(db.c).filter(id => !(id in c));
      if (upF.length) jobs.push(sb.from('customer_favorites').upsert(upF));
      if (delF.length) jobs.push(sb.from('customer_favorites').delete().eq('customer_id', uid).in('item_id', delF));
      if (upC.length) jobs.push(sb.from('customer_cart').upsert(upC));
      if (delC.length) jobs.push(sb.from('customer_cart').delete().eq('customer_id', uid).in('item_id', delC));
      await Promise.all(jobs);
    } catch (e) { console.warn('Winfum sync :', e.message); }
    pushing = false;
    if (again) { again = false; push(); }
  }
  const schedule = () => { clearTimeout(timer); timer = setTimeout(push, 400); };

  /* garde les clés locales cohérentes entre elles quand une page en modifie une */
  function onChange(k, oldV, newV) {
    if (FAV_KEYS.includes(k)) {
      const o = new Set(parse(oldV).map(idOf)), n = new Set(parse(newV).map(idOf));
      const set = (id, on) => FAV_KEYS.forEach(k2 => { if (k2 === k || !app(k2, id)) return; const l = rd(k2).filter(x => idOf(x) !== id); if (on) l.push(id); wr(k2, l); });
      n.forEach(id => { if (!o.has(id)) set(id, true); });
      o.forEach(id => { if (!n.has(id)) set(id, false); });
    } else {
      const m = l => { const r = {}; l.forEach(it => { if (it && it.id) r[it.id] = it.qty || 1; }); return r; };
      const o = m(parse(oldV)), n = m(parse(newV));
      new Set(Object.keys(o).concat(Object.keys(n))).forEach(id => {
        if (o[id] === n[id]) return;
        CART_KEYS.forEach(k2 => { if (k2 === k || !app(k2, id)) return; const l = rd(k2).filter(x => x.id !== id); if (n[id]) l.push({ id, qty: n[id] }); wr(k2, l); });
      });
    }
    schedule();
  }
  Storage.prototype.setItem = function (k, v) {
    if (this === ls && uid && ok && WATCH.includes(k)) { const old = this.getItem(k); rawSet.call(this, k, v); try { onChange(k, old, v); } catch (e) {} return; }
    return rawSet.call(this, k, v);
  };

  function ensureClient() {
    return new Promise((res, rej) => {
      if (window.WINFUM_SB) { sb = window.WINFUM_SB; return res(); }
      const make = () => { sb = window.supabase.createClient(URL_, KEY); window.WINFUM_SB = sb; res(); };
      if (window.supabase) return make();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      s.onload = make; s.onerror = rej; document.head.appendChild(s);
    });
  }

  function init(opts) {
    opts = opts || {};
    if (inited) return inited;
    inited = (async () => {
      try {
        await ensureClient();
        const { data: { session } } = await sb.auth.getSession();
        if (!session) return { synced: false, state: 'anon' };
        uid = session.user.id;
        const { data: c } = await sb.from('customers').select('status').eq('id', uid).maybeSingle();
        if (c && c.status !== 'approved') { uid = null; return { synced: false, state: c.status }; }
        const db = await fetchDB(); if (!db) { uid = null; return { synced: false, state: 'error' }; }
        const L = canon(), first = ls.getItem('winfum_synced_uid') !== uid;
        let t;
        if (first) { t = { f: new Set([...L.f, ...db.f]), c: Object.assign({}, db.c) }; Object.entries(L.c).forEach(([id, q]) => t.c[id] = Math.max(t.c[id] || 0, q)); }
        else t = db;
        writeLocal(t); rawSet.call(ls, 'winfum_synced_uid', uid); ok = true;
        if (first) await push();
        const changed = sig(L) !== sig(t);
        if (changed && opts.reload !== false && !sessionStorage.getItem('wf_rl')) { sessionStorage.setItem('wf_rl', '1'); location.reload(); }
        else if (!changed) sessionStorage.removeItem('wf_rl');
        return { synced: true, changed, state: 'ok' };
      } catch (e) { console.warn('Winfum sync :', e.message); return { synced: false, state: 'error' }; }
    })();
    return inited;
  }
  function clearLocal() { WATCH.concat(['winfum_synced_uid']).forEach(k => rawDel.call(ls, k)); uid = null; ok = false; inited = null; }

  window.WinfumAccount = { init, clearLocal, canon };
  if (!window.WINFUM_MANUAL) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
    else init();
  }
})();
