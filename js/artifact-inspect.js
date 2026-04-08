/* ═══════════════════════════════════════════════════
   js/artifact-inspect.js — Project inspect overlay
   Click a project card to open a field-manual panel.
═══════════════════════════════════════════════════ */
(function initArtifactInspect() {
  'use strict';

  // ── Build overlay DOM ──
  var ov = document.createElement('div');
  ov.id = 'artifact-overlay';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.innerHTML = [
    '<div class="aov-backdrop" id="aov-bd"></div>',
    '<div class="aov-panel" id="aov-panel" tabindex="-1">',
      '<div class="aov-top">',
        '<span class="aov-label">// artifact · field manual</span>',
        '<button class="aov-close" id="aov-close" aria-label="Close">✕</button>',
      '</div>',
      '<div class="aov-meta" id="aov-meta"></div>',
      '<h2 class="aov-title" id="aov-title"></h2>',
      '<div class="aov-cat" id="aov-cat"></div>',
      '<div class="aov-body">',
        '<div class="aov-main">',
          '<div class="aov-sec-label">// hypothesis</div>',
          '<p class="aov-oneliner" id="aov-ol"></p>',
          '<div class="aov-sec-label" style="margin-top:1.2rem">// field notes</div>',
          '<ul class="aov-bullets" id="aov-bl"></ul>',
        '</div>',
        '<div class="aov-side">',
          '<div class="aov-sec-label">// tools</div>',
          '<div class="aov-tools" id="aov-tools"></div>',
          '<div class="aov-sec-label" style="margin-top:1.2rem">// artifacts</div>',
          '<div class="aov-links" id="aov-links"></div>',
          '<div class="aov-stamp-wrap" id="aov-stamp"></div>',
        '</div>',
      '</div>',
      '<div class="aov-foot">AlyArtBar · field manual · esc to close <span class="aov-sigil">◈</span></div>',
    '</div>'
  ].join('');
  document.body.appendChild(ov);

  // ── Styles ──
  var css = document.createElement('style');
  css.textContent = [
    '#artifact-overlay{position:fixed;inset:0;z-index:8000;display:flex;align-items:center;justify-content:center;padding:1.5rem;opacity:0;pointer-events:none;transition:opacity 0.22s ease}',
    '#artifact-overlay.open{opacity:1;pointer-events:all}',
    '.aov-backdrop{position:absolute;inset:0;background:rgba(2,6,14,0.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);cursor:pointer}',
    '.aov-panel{position:relative;z-index:1;width:100%;max-width:820px;max-height:88vh;overflow-y:auto;background:rgba(3,9,20,0.98);border:1px solid rgba(61,255,208,0.18);border-radius:1px;padding:0;transform:translateY(14px) scale(0.98);transition:transform 0.26s cubic-bezier(0.16,1,0.3,1)}',
    '#artifact-overlay.open .aov-panel{transform:translateY(0) scale(1)}',
    '.aov-panel::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(to right,transparent,rgba(61,255,208,0.55) 35%,rgba(61,255,208,0.25) 70%,transparent)}',
    '.aov-top{display:flex;justify-content:space-between;align-items:center;padding:1.4rem 1.8rem 0.8rem;border-bottom:1px solid rgba(61,255,208,0.07)}',
    '.aov-label{font-family:var(--font-mono);font-size:0.55rem;letter-spacing:0.22em;color:rgba(61,255,208,0.35);text-transform:uppercase}',
    '.aov-close{background:none;border:1px solid rgba(61,255,208,0.15);color:var(--c-mist);font-size:0.70rem;width:26px;height:26px;border-radius:1px;cursor:pointer;transition:border-color 0.15s,color 0.15s}',
    '.aov-close:hover{border-color:var(--c-biolume);color:var(--c-biolume)}',
    '.aov-meta{font-family:var(--font-mono);font-size:0.52rem;letter-spacing:0.18em;color:rgba(61,255,208,0.22);text-transform:uppercase;padding:0.7rem 1.8rem 0.3rem}',
    '.aov-title{font-family:var(--font-serif);font-size:clamp(1.3rem,3vw,1.9rem);font-weight:700;color:var(--c-star);padding:0 1.8rem;margin:0 0 0.3rem;line-height:1.15}',
    '.aov-cat{font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.14em;color:var(--c-biolume-soft);text-transform:uppercase;padding:0 1.8rem 1.2rem;border-bottom:1px solid rgba(61,255,208,0.06)}',
    '.aov-body{display:grid;grid-template-columns:1fr 260px}',
    '@media(max-width:600px){.aov-body{grid-template-columns:1fr}}',
    '.aov-main,.aov-side{padding:1.4rem 1.8rem}',
    '.aov-side{border-left:1px solid rgba(61,255,208,0.05);background:rgba(2,8,16,0.28)}',
    '.aov-sec-label{font-family:var(--font-mono);font-size:0.52rem;letter-spacing:0.22em;color:rgba(61,255,208,0.32);text-transform:uppercase;margin-bottom:0.45rem}',
    '.aov-oneliner{font-family:var(--font-serif);font-size:0.96rem;line-height:1.65;color:var(--c-mist);margin:0}',
    '.aov-bullets{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.45rem}',
    '.aov-bullets li{font-family:var(--font-mono);font-size:0.75rem;line-height:1.5;color:var(--c-mist);padding-left:1.1rem;position:relative}',
    '.aov-bullets li::before{content:"→";position:absolute;left:0;color:rgba(61,255,208,0.35)}',
    '.aov-tools{display:flex;flex-wrap:wrap;gap:0.3rem}',
    '.aov-tool{font-family:var(--font-mono);font-size:0.60rem;letter-spacing:0.08em;color:var(--c-teal);border:1px solid rgba(29,136,112,0.22);padding:0.12rem 0.4rem;background:rgba(29,136,112,0.05)}',
    '.aov-links{display:flex;flex-direction:column;gap:0.38rem}',
    '.aov-link{font-family:var(--font-mono);font-size:0.68rem;letter-spacing:0.08em;color:var(--c-biolume);text-decoration:none;transition:opacity 0.15s}',
    '.aov-link:hover{opacity:0.65}',
    '.aov-stamp-wrap{margin-top:1rem}',
    '.aov-foot{padding:0.7rem 1.8rem;border-top:1px solid rgba(61,255,208,0.05);font-family:var(--font-mono);font-size:0.50rem;letter-spacing:0.16em;color:rgba(61,255,208,0.18);text-transform:uppercase;display:flex;justify-content:space-between}',
    '.aov-sigil{color:rgba(61,255,208,0.20);font-size:0.85rem}',
    '.aov-panel::-webkit-scrollbar{width:3px}.aov-panel::-webkit-scrollbar-thumb{background:rgba(61,255,208,0.12)}',
  ].join('\n');
  document.head.appendChild(css);

  var stampMap = {
    techart:  { cls:'stamp-live',      label:'◈ TECH ART'  },
    pipeline: { cls:'stamp-wip',       label:'⬡ PIPELINE'  },
    graphics: { cls:'stamp-live',      label:'◉ GRAPHICS'  },
    creative: { cls:'stamp-tested',    label:'✦ CREATIVE'  },
  };

  function open(p) {
    document.getElementById('aov-title').textContent  = p.title || '';
    document.getElementById('aov-cat').textContent    = p.category || '';
    document.getElementById('aov-ol').textContent     = p.oneliner || '';
    document.getElementById('aov-meta').textContent   =
      'entry // ' + (p.category || 'artifact').toLowerCase() + ' // field manual';

    var bl = document.getElementById('aov-bl');
    bl.innerHTML = (p.bullets || []).map(function(b) { return '<li>' + b + '</li>'; }).join('');

    var toolsEl = document.getElementById('aov-tools');
    toolsEl.innerHTML = (p.tools || []).map(function(t) {
      return '<span class="aov-tool">' + t + '</span>';
    }).join('');

    var linksEl = document.getElementById('aov-links');
    linksEl.innerHTML = (p.links || []).map(function(l) {
      return '<a class="aov-link" href="' + l.url + '" target="_blank" rel="noopener">↗ ' + l.label + '</a>';
    }).join('');

    var r = (p.roles || [])[0];
    var s = stampMap[r] || { cls:'stamp-live', label:'◈ ARTIFACT' };
    document.getElementById('aov-stamp').innerHTML =
      '<span class="stamp ' + s.cls + '"><span class="stamp-dot"></span>' + s.label + '</span>';

    ov.classList.add('open');
    document.getElementById('aov-panel').focus();
    document.body.style.overflow = 'hidden';
    if (window.AlySFX) AlySFX.play('portalOpen');
  }

  function close() {
    ov.classList.remove('open');
    document.body.style.overflow = '';
    if (window.AlySFX) AlySFX.play('click');
  }

  document.getElementById('aov-close').addEventListener('click', close);
  document.getElementById('aov-bd').addEventListener('click', close);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && ov.classList.contains('open')) close();
  });

  // Delegated — catches cards injected by projects.js
  document.addEventListener('click', function(e) {
    var card = e.target.closest && e.target.closest('.project-card,.featured-row');
    if (!card) return;
    if (e.target.closest('a,button')) return;
    var idx = card.dataset.projectIdx;
    if (idx !== undefined && window.PROJECTS) open(window.PROJECTS[parseInt(idx, 10)]);
  });

  window.AlyInspect = { open: open };
})();