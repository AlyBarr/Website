/* ═══════════════════════════════════════════════════
   js/sfx.js — Micro SFX (Web Audio, OFF by default)
   Enable via CTRL+K → Toggle SFX  or AlyModes.toggle('sfx')
═══════════════════════════════════════════════════ */
(function initSFX() {
  'use strict';
  var ctx = null;

  function getCtx() {
    if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return null; } }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function isOn() { return document.body.classList.contains('sfx-on'); }

  function tone(freq, type, dur, gain, delay) {
    var c = getCtx(); if (!c) return;
    delay = delay || 0;
    var o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = type; o.frequency.setValueAtTime(freq, c.currentTime + delay);
    g.gain.setValueAtTime(0, c.currentTime + delay);
    g.gain.linearRampToValueAtTime(gain, c.currentTime + delay + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + dur);
    o.start(c.currentTime + delay); o.stop(c.currentTime + delay + dur + 0.01);
  }

  var sounds = {
    hover:      function() { tone(780, 'sine', 0.06, 0.03); },
    click:      function() { tone(420, 'sine', 0.10, 0.05); tone(320, 'sine', 0.14, 0.025, 0.04); },
    portalOpen: function() { tone(200,'sine',0.4,0.07); tone(300,'sine',0.3,0.04,0.05); tone(600,'triangle',0.2,0.03,0.12); },
    toggleOn:   function() { tone(440,'sine',0.08,0.05); tone(660,'sine',0.07,0.03,0.06); },
    toggleOff:  function() { tone(660,'sine',0.07,0.04); tone(440,'sine',0.08,0.05,0.05); },
    key:        function() { tone(1100 + Math.random()*200, 'square', 0.04, 0.012); },
  };

  window.AlySFX = {
    play: function(name) { if (isOn() && sounds[name]) sounds[name](); }
  };

  document.addEventListener('mouseenter', function(e) {
    if (!isOn()) return;
    if (e.target && e.target.matches && e.target.matches('a,button,.chip,.portal,.depth-pip')) AlySFX.play('hover');
  }, true);

  document.addEventListener('click', function(e) {
    if (!isOn()) return;
    var t = e.target.closest && e.target.closest('button,a');
    if (!t) return;
    if (t.matches && t.matches('.portal')) { AlySFX.play('portalOpen'); return; }
    AlySFX.play('click');
  }, true);

  window.addEventListener('aly:portalActivate', function() { AlySFX.play('portalOpen'); });
  window.addEventListener('aly:modeChange', function(e) {
    if (e.detail.mode !== 'sfx') AlySFX.play(e.detail.active ? 'toggleOn' : 'toggleOff');
  });
})();
