/* ═══════════════════════════════════════════════════
   js/modes.js — Site-wide toggle modes
   ascii | scanlines | sfx | pro
   State persisted to localStorage.
═══════════════════════════════════════════════════ */
(function initModes() {
  'use strict';
  var KEYS = { ascii:'aly_ascii', scanlines:'aly_scanlines', sfx:'aly_sfx', pro:'aly_pro_view' };

  function get(k) { try { return localStorage.getItem(k) === '1'; } catch(e) { return false; } }
  function set(k, v) { try { localStorage.setItem(k, v ? '1' : '0'); } catch(e) {} }

  function applyAll() {
    document.body.classList.toggle('ascii-mode', get(KEYS.ascii));
    document.body.classList.toggle('scanlines',  get(KEYS.scanlines));
    document.body.classList.toggle('sfx-on',     get(KEYS.sfx));
    document.body.classList.toggle('pro-view',   get(KEYS.pro));
  }

  window.AlyModes = {
    toggle: function(mode) {
      var k = KEYS[mode]; if (!k) return;
      var next = !get(k); set(k, next); applyAll();
      window.dispatchEvent(new CustomEvent('aly:modeChange', { detail: { mode: mode, active: next } }));
      return next;
    },
    get: function(mode) { return get(KEYS[mode]); },
    applyAll: applyAll,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll, { once: true });
  } else {
    applyAll();
  }
})();