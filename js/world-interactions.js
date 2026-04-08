/* ═══════════════════════════════════════════════════════════
   js/world-interactions.js — Living World Layer
   
   1. Hero: click → biolume ripple distortion
   2. Hero: mouse movement → gentle particle disturbance
   3. Projects ↔ Constellation: bidirectional filter bridge
   4. R&D: inject log numbers, "system boot" effect
   5. Easter eggs: hidden clickable stars
   6. Scroll depth: body class for atmospheric shifts
═══════════════════════════════════════════════════════════ */
(function initWorldInteractions() {
  'use strict';

  /* ── 1. Hero click ripple ── */
  var hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('click', function(e) {
      /* Don't fire on buttons/links */
      if (e.target.closest('a, button, .portal')) return;
      var ripple = document.createElement('div');
      ripple.className = 'hero-ripple';
      ripple.style.left = e.clientX - hero.getBoundingClientRect().left + 'px';
      ripple.style.top  = e.clientY - hero.getBoundingClientRect().top  + 'px';
      hero.appendChild(ripple);
      ripple.addEventListener('animationend', function() {
        ripple.remove();
      });
    });

    /* Secondary ripple at random when idle > 6s */
    var idleTimer;
    function scheduleIdleRipple() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function() {
        var rect = hero.getBoundingClientRect();
        var ripple = document.createElement('div');
        ripple.className = 'hero-ripple';
        ripple.style.left = (Math.random() * rect.width) + 'px';
        ripple.style.top  = (Math.random() * rect.height * 0.6) + 'px';
        ripple.style.borderColor = 'rgba(61,255,208,0.22)';
        hero.appendChild(ripple);
        ripple.addEventListener('animationend', function() { ripple.remove(); });
        scheduleIdleRipple();
      }, 5000 + Math.random() * 5000);
    }
    document.addEventListener('mousemove', scheduleIdleRipple, { once: true });
    scheduleIdleRipple();
  }

  /* ── 2. Project filter ↔ Constellation bridge ── */
  /* When a filter chip is clicked, fire event to constellation */
  document.addEventListener('click', function(e) {
    var chip = e.target.closest('.filter-chip');
    if (!chip) return;
    var filter = chip.getAttribute('data-filter') || 'all';
    try {
      window.dispatchEvent(new CustomEvent('projectFilter:active', {
        detail: { filter: filter },
        bubbles: true,
      }));
    } catch(er) {}
    /* Update active chip state */
    document.querySelectorAll('.filter-chip').forEach(function(c) {
      c.classList.toggle('is-active', c === chip);
    });
  });

  /* When constellation fires a filter, apply to project cards */
  window.addEventListener('constellation:filter', function(e) {
    var ids = e.detail && e.detail.ids;
    if (!ids || !ids.length) {
      /* deselect — show all */
      document.querySelectorAll('.project-card, .featured-row').forEach(function(card) {
        card.style.opacity = '';
        card.style.transform = '';
      });
      /* Reset filter chips */
      document.querySelectorAll('.filter-chip').forEach(function(c) {
        c.classList.toggle('is-active', c.getAttribute('data-filter') === 'all');
      });
      removeFilterPill();
      return;
    }

    /* Map skill IDs → project roles */
    var roleMap = {
      'python':   ['pipeline','ml'],
      'cpp':      ['graphics'],
      'opengl':   ['graphics'],
      'glsl':     ['graphics'],
      'ml':       ['ml'],
      'numpy':    ['ml'],
      'maya':     ['pipeline'],
      'usd':      ['pipeline'],
      'houdini':  ['pipeline'],
      'unity':    ['creative'],
      'ar':       ['creative','ml'],
      'xr':       ['creative'],
      'pyside':   ['pipeline'],
      'css':      ['creative'],
      'git':      ['pipeline'],
      'ue5':      ['pipeline'],
    };

    var matchRoles = new Set();
    ids.forEach(function(id) {
      var roles = roleMap[id];
      if (roles) roles.forEach(function(r) { matchRoles.add(r); });
    });

    if (!matchRoles.size) {
      /* selected skills don't map to project roles — show all */
      document.querySelectorAll('.project-card, .featured-row').forEach(function(card) {
        card.style.opacity = '1';
        card.style.transform = '';
      });
      removeFilterPill();
      return;
    }

    document.querySelectorAll('.project-card, .featured-row').forEach(function(card) {
      var cardRoles = (card.getAttribute('data-roles') || '').split(' ').filter(Boolean);
      var match = cardRoles.some(function(r) { return matchRoles.has(r); });
      card.style.opacity = match ? '1' : '0.22';
      card.style.transform = match ? '' : 'scale(0.98)';
    });

    /* Show filter pill near constellation */
    showFilterPill(ids.join(', ') + ' →');
  });

  function showFilterPill(label) {
    removeFilterPill();
    var constSection = document.getElementById('skills');
    if (!constSection) return;
    var pill = document.createElement('div');
    pill.className = 'constellation-active-filter';
    pill.id = 'constellation-filter-pill';
    pill.innerHTML =
      'energy trace: ' + label +
      '<button aria-label="Clear filter" title="Clear">✕</button>';
    pill.querySelector('button').addEventListener('click', function() {
      removeFilterPill();
      document.querySelectorAll('.project-card, .featured-row').forEach(function(c) {
        c.style.opacity = ''; c.style.transform = '';
      });
      try {
        window.dispatchEvent(new CustomEvent('constellation:filter', {
          detail: { ids: [] }, bubbles: true
        }));
      } catch(er) {}
    });
    constSection.querySelector('.container').appendChild(pill);
  }

  function removeFilterPill() {
    var pill = document.getElementById('constellation-filter-pill');
    if (pill) pill.remove();
  }

  /* ── 3. R&D log numbers ── */
  setTimeout(function() {
    var entries = document.querySelectorAll('.rnd-entry');
    entries.forEach(function(el, i) {
      el.setAttribute('data-log-num', 'LOG-' + String(i + 1).padStart(2, '0'));
    });
  }, 100);

  /* R&D section boot effect */
  var rndSection = document.getElementById('rnd');
  if (rndSection) {
    var rndObs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        /* Small stagger on entries to simulate a "system loading" sequence */
        var rnds = rndSection.querySelectorAll('.rnd-entry');
        rnds.forEach(function(el, i) {
          setTimeout(function() {
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
          }, i * 90);
        });
        rndObs.disconnect();
      }
    }, { threshold: 0.1 });
    rndObs.observe(rndSection);
  }

  /* ── 4. Easter egg hidden stars ── */
  var starPositions = [
    /* [parentSelector, top%, left%, hint] */
    ['#about',    '15%', '92%',  'echo point alpha'],
    ['#projects', '8%',  '4%',   'artifact trace'],
    ['#skills',   '88%', '88%',  'node resonance'],
    ['#rnd',      '12%', '88%',  'signal anomaly'],
    ['#contact',  '20%', '5%',   'comms ping'],
  ];

  var foundStars = 0;
  var totalStars = starPositions.length;

  starPositions.forEach(function(pos, i) {
    var parent = document.querySelector(pos[0]);
    if (!parent) return;
    parent.style.position = 'relative';
    var star = document.createElement('button');
    star.className = 'easter-star';
    star.setAttribute('aria-label', 'Hidden discovery');
    star.setAttribute('title', '');
    star.style.top  = pos[1];
    star.style.left = pos[2];
    star.setAttribute('data-hint', pos[3]);

    star.addEventListener('click', function(e) {
      e.stopPropagation();
      if (star.classList.contains('found')) return;
      star.classList.add('found');
      foundStars++;
      star.setAttribute('title', pos[3]);
      /* Ripple */
      var ripple = document.createElement('div');
      ripple.className = 'hero-ripple';
      ripple.style.cssText = 'position:absolute;left:' + pos[2] + ';top:' + pos[1] + ';border-color:rgba(61,255,208,0.6)';
      parent.appendChild(ripple);
      ripple.addEventListener('animationend', function() { ripple.remove(); });
      /* SFX */
      try { if (window.AlyModes && window.AlyModes.get('sfx')) window._sfx && window._sfx('hover'); } catch(er) {}
      /* Check completion */
      if (foundStars === totalStars) {
        setTimeout(function() {
          console.log('%c◈ ALL ECHO POINTS LOCATED · navigator badge earned', 'color:#3dffd0;font-family:monospace;font-size:14px');
          /* Future: trigger stamp earn */
          try {
            window.dispatchEvent(new CustomEvent('stamp:earn', { detail: { id: 'navigator' } }));
          } catch(er) {}
        }, 200);
      }
    });

    parent.appendChild(star);
  });

  /* ── 5. Scroll depth: body class for atmosphere ── */
  var sections = ['hero','about','projects','skills','rnd','nda','contact'];
  var sectionEls = sections.map(function(id) { return document.getElementById(id); }).filter(Boolean);

  var scrollObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        document.body.setAttribute('data-depth-section', entry.target.id);
      }
    });
  }, { threshold: 0.4, rootMargin: '-10% 0px -40% 0px' });

  sectionEls.forEach(function(el) { scrollObs.observe(el); });

  /* ── 6. Project card mouse-position CSS vars ── */
  /* Already set by projects.js on mousemove, but ensure cards injected later also get it */
  document.addEventListener('mousemove', function(e) {
    var card = e.target.closest('.project-card, .featured-row');
    if (!card) return;
    var rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
    card.style.setProperty('--mouse-y', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
  });

})();
