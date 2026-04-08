/* ═══════════════════════════════════════════════════════
   js/terminal.js — Boot intro + view-choice dialog
   Flow:
     1. Typewriter boot sequence (richer, ~2.4s)
     2. Choice dialog: [F] Full experience | [R] Accessible
     3. Auto-proceeds full site after 8s countdown
     4. Esc / click background = full site immediately
═══════════════════════════════════════════════════════ */
(function initTerminal() {
  'use strict';

  var screen   = document.getElementById('term-screen');
  var terminal = document.getElementById('terminal');
  var skipBtn  = document.getElementById('term-skip');
  if (!screen || !terminal) return;

  /* ── Boot lines ─────────────────────────────────────────
     Each line: text, CSS class, delay (ms from start)
  ─────────────────────────────────────────────────────── */
  var LINES = [
    { text: '> alyartbar.universe — boot sequence initiated',  cls: 'tl tl-dim',  delay: 0    },
    { text: '> mounting asset manifests\u2026',                     cls: 'tl tl-dim',  delay: 300  },
    { text: '> linking pipeline modules\u2026                [OK]', cls: 'tl tl-ok',  delay: 560  },
    { text: '> loading constellation data\u2026             [OK]',  cls: 'tl tl-ok',  delay: 780  },
    { text: '> WebGL context\u2026                           [OK]',  cls: 'tl tl-ok',  delay: 980  },
    { text: '',                                                cls: 'tl',         delay: 1140 },
    { text: 'ALYSSA BARRIENTOS',                              cls: 'tl tl-name', delay: 1180 },
    { text: 'Technical Artist  \u00b7  Pipeline TD  \u00b7  AlyArtBar',  cls: 'tl tl-role', delay: 1380 },
    { text: '',                                                cls: 'tl',         delay: 1560 },
    { text: '> all systems nominal.',                          cls: 'tl tl-sys',  delay: 1600 },
    { text: '> choose entry point\u2026',                          cls: 'tl tl-dim',  delay: 1800 },
  ];

  var CHAR_DELAY   = 14;
  var AUTO_PROCEED = 8000;

  var dismissed = false;
  var timers    = [];

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  /* ── Dismiss → full site ── */
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    clearTimers();
    terminal.classList.add('hidden');
    try { window.dispatchEvent(new CustomEvent('terminalDone')); } catch(e) {}
    window.terminalDone = true;
    setTimeout(function() { terminal.setAttribute('aria-hidden','true'); }, 900);
  }

  /* ── Redirect → recruiter ── */
  function goRecruiter() {
    if (dismissed) return;
    dismissed = true;
    clearTimers();
    terminal.style.transition = 'opacity 0.35s ease';
    terminal.style.opacity = '0';
    setTimeout(function() { window.location.href = 'recruiter.html'; }, 380);
  }

  /* ── Typewriter ── */
  function typeLine(lineEl, text, onDone) {
    if (!text) { if (onDone) onDone(); return; }
    var i = 0;
    var caret = document.createElement('span');
    caret.className = 'term-caret';
    caret.setAttribute('aria-hidden','true');
    lineEl.appendChild(caret);

    function next() {
      if (dismissed) return;
      if (i < text.length) {
        caret.insertAdjacentText('beforebegin', text[i++]);
        timers.push(setTimeout(next, CHAR_DELAY));
      } else {
        lineEl.removeChild(caret);
        if (onDone) onDone();
      }
    }
    next();
  }

  /* ── Choice dialog ── */
  function showChoice() {
    if (dismissed) return;

    var card = document.createElement('div');
    card.id = 'term-choice';
    card.className = 'term-choice';
    card.setAttribute('role','group');
    card.setAttribute('aria-label','Choose view mode');

    card.innerHTML = [
      '<p class="term-choice-label">// select entry point</p>',
      '<div class="term-choice-options">',
        '<button class="term-choice-btn term-choice-full" id="tc-full" type="button" aria-keyshortcuts="F">',
          '<span class="tc-key">[F]</span>',
          '<span class="tc-title">Full Experience</span>',
          '<span class="tc-sub">WebGL \u00b7 animations \u00b7 interactive</span>',
        '</button>',
        '<button class="term-choice-btn term-choice-lite" id="tc-lite" type="button" aria-keyshortcuts="R">',
          '<span class="tc-key">[R]</span>',
          '<span class="tc-title">Accessible View</span>',
          '<span class="tc-sub">fast \u00b7 clean \u00b7 recruiter-optimised</span>',
        '</button>',
      '</div>',
      '<p class="term-choice-hint">',
        'press <kbd>F</kbd> or <kbd>R</kbd>',
        ' \u00b7 auto-proceed in <span id="tc-countdown">8</span>s',
        ' \u00b7 click anywhere to enter full site',
      '</p>',
    ].join('');

    var win = terminal.querySelector('.term-window');
    if (win && win.parentNode) {
      win.parentNode.insertBefore(card, win.nextSibling);
    } else {
      terminal.appendChild(card);
    }

    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        card.classList.add('term-choice-visible');
      });
    });

    document.getElementById('tc-full').addEventListener('click', function(e) {
      e.stopPropagation();
      dismiss();
    });
    document.getElementById('tc-lite').addEventListener('click', function(e) {
      e.stopPropagation();
      goRecruiter();
    });

    function onKey(e) {
      if (e.key==='f'||e.key==='F')  { document.removeEventListener('keydown',onKey); dismiss();     }
      if (e.key==='r'||e.key==='R')  { document.removeEventListener('keydown',onKey); goRecruiter(); }
      if (e.key==='Escape')          { document.removeEventListener('keydown',onKey); dismiss();     }
    }
    document.addEventListener('keydown', onKey);

    /* Countdown */
    var remaining = 8;
    var countEl = document.getElementById('tc-countdown');
    var interval = setInterval(function() {
      remaining--;
      if (countEl) countEl.textContent = remaining;
      if (remaining <= 0) { clearInterval(interval); dismiss(); }
    }, 1000);

    /* Focus first button */
    var fullBtn = document.getElementById('tc-full');
    if (fullBtn) setTimeout(function() { fullBtn.focus(); }, 60);
  }

  /* ── Boot sequence ── */
  function runSequence() {
    var lastIdx = LINES.length - 1;
    LINES.forEach(function(line, idx) {
      timers.push(setTimeout(function() {
        if (dismissed) return;
        var el = document.createElement('span');
        el.className = line.cls;
        screen.appendChild(el);
        typeLine(el, line.text, function() {
          if (idx === lastIdx) {
            timers.push(setTimeout(showChoice, 120));
          }
        });
      }, line.delay));
    });
  }

  /* ── Skip button → full site ── */
  if (skipBtn) skipBtn.addEventListener('click', dismiss);

  /* ── Click backdrop (not card) → full site ── */
  terminal.addEventListener('click', function(e) {
    if (!e.target.closest('#term-choice') && !e.target.closest('.term-window')) {
      dismiss();
    }
  });

  runSequence();

})();