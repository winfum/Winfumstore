/* WINFUM — gardien de session : garde la connexion vivante tant qu'on n'a pas cliqué sur « Déconnexion ».
   Le client Supabase est unique (window.WINFUM_SB) ; ici on lui demande simplement de renouveler le jeton à temps :
   retour sur l'onglet, retour du réseau, retour arrière du navigateur, et toutes les 4 minutes. */
(function () {
  var last = 0;
  function keep() {
    var c = window.WINFUM_SB;
    if (!c || !c.auth || document.visibilityState === 'hidden') return;
    var n = Date.now(); if (n - last < 20000) return; last = n;
    try { c.auth.getSession().catch(function () {}); } catch (e) {}
  }
  document.addEventListener('visibilitychange', keep);
  window.addEventListener('pageshow', keep);
  window.addEventListener('online', keep);
  window.addEventListener('focus', keep);
  setInterval(keep, 4 * 60 * 1000);
  setTimeout(keep, 3000);
})();
