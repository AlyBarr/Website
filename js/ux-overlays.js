
/* ═══════════════════════════════════════════
   js/ux-overlays.js — Art Bar, CmdK, Pro View, SFX, Portals
═══════════════════════════════════════════ */
(function initUX(){
  const body = document.body;

  // ---------- Pro View ----------
  const proBtn = document.getElementById('toggle-pro');
  const proKey = 'aly_pro_view';

  function setPro(on){
    body.classList.toggle('pro-view', !!on);
    proBtn?.setAttribute('aria-pressed', on ? 'true' : 'false');
    try { localStorage.setItem(proKey, on ? '1' : '0'); } catch(e){}
  }

  try { setPro(localStorage.getItem(proKey) === '1'); } catch(e){}

  proBtn?.addEventListener('click', () => setPro(!body.classList.contains('pro-view')));

  // ---------- SFX (optional, lightweight) ----------
  const sfxBtn = document.getElementById('toggle-sfx');
  const sfxKey = 'aly_sfx';
  let sfxOn = false;

  // tiny inlined oscillator click (no asset files needed)
  function playBlip(){
    if (!sfxOn) return;
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 520;
      g.gain.value = 0.05;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.045);
      setTimeout(() => ctx.close(), 120);
    }catch(e){}
  }

  function setSfx(on){
    sfxOn = !!on;
    sfxBtn?.setAttribute('aria-pressed', on ? 'true' : 'false');
    try { localStorage.setItem(sfxKey, on ? '1' : '0'); } catch(e){}
  }

  try { setSfx(localStorage.getItem(sfxKey) === '1'); } catch(e){}

  sfxBtn?.addEventListener('click', () => {
    setSfx(!sfxOn);
    playBlip();
  });

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.closest && t.closest('[data-sfx]')) playBlip();
  });

  // ---------- CmdK ----------
  const cmdk = document.getElementById('cmdk');
  const cmdkInput = document.getElementById('cmdk-input');
  const openCmdkBtn = document.getElementById('open-cmdk');

  function openCmdk(){
    if (!cmdk) return;
    cmdk.hidden = false;
    cmdkInput?.focus();
    playBlip();
  }
  function closeCmdk(){
    if (!cmdk) return;
    cmdk.hidden = true;
  }

  openCmdkBtn?.addEventListener('click', openCmdk);

  document.addEventListener('keydown', (e) => {
    const isK = (e.key || '').toLowerCase() === 'k';
    if ((e.ctrlKey || e.metaKey) && isK){
      e.preventDefault();
      openCmdk();
    }
    if (e.key === 'Escape') closeCmdk();
  });

  cmdk?.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.matches && (t.matches('[data-cmdk-close]') || t.classList.contains('cmdk-backdrop'))){
      closeCmdk();
    }
  });

  document.querySelectorAll('#cmdk [data-go]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-go');
      const target = sel ? document.querySelector(sel) : null;
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeCmdk();
      playBlip();
    });
  });

  document.querySelectorAll('#cmdk [data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (action === 'toggle-pro') setPro(!body.classList.contains('pro-view'));
      if (action === 'toggle-sfx') setSfx(!sfxOn);
      closeCmdk();
      playBlip();
    });
  });

  // ---------- Hero Portals -> Project Filters + Phase4 Portal Sync ----------
  document.querySelectorAll('.portal[data-portal]').forEach(portal => {
    const filter = portal.getAttribute('data-portal');
    const color = (filter === 'techart') ? '#3dffd0' : (filter === 'pipeline') ? '#1d8870' : '#9d78f5';

    portal.addEventListener('mouseenter', () => {
      window.dispatchEvent(new CustomEvent('aly:portalHover', { detail: { filter, color } }));
    });
    portal.addEventListener('mouseleave', () => {
      window.dispatchEvent(new CustomEvent('aly:portalHover', { detail: { filter: null, color: null } }));
    });

    portal.addEventListener('click', () => {
      // route: portal click filters projects and scrolls
      window.dispatchEvent(new CustomEvent('aly:setFilter', { detail: { filter } }));
      window.dispatchEvent(new CustomEvent('aly:portalActivate', { detail: { filter, color } }));

      const projects = document.getElementById('projects');
      projects?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      playBlip();
    });
  });

})();
