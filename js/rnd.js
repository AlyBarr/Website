/* ═══════════════════════════════════════════
   js/rnd.js — Render R&D Entries + Nebula FX
═══════════════════════════════════════════ */
(function renderRnD() {
  if (typeof RND_ENTRIES === 'undefined') {
    console.warn('[AlyArtBar] RND_ENTRIES not defined — check inline data block');
    return;
  }
  const wrap = document.getElementById('rnd-list');
  if (!wrap) return;

  const statusConfig = {
    live:      { dotClass: 'dot-live',      badgeClass: 'status-live',      label: 'LIVE'      },
    wip:       { dotClass: 'dot-wip',       badgeClass: 'status-wip',       label: 'WIP'       },
    exploring: { dotClass: 'dot-exploring', badgeClass: 'status-exploring', label: 'EXPLORING' },
    archived:  { dotClass: 'dot-archived',  badgeClass: 'status-archived',  label: 'ARCHIVED'  },
  };

  RND_ENTRIES.forEach(function(entry, i) {
    var cfg = statusConfig[entry.status] || statusConfig.wip;
    var links = Array.isArray(entry.artifacts) ? entry.artifacts
              : Array.isArray(entry.links) ? entry.links
              : [];

    var row = document.createElement('div');
    // Use 'reveal in' so entries are visible immediately —
    // reveal.js IntersectionObserver only fires when scrolled to, which
    // breaks deep-page injected content. We own the animation here.
    row.className = 'rnd-entry reveal in';
    row.style.transitionDelay = (i * 60) + 'ms';

    row.innerHTML =
      '<div class="rnd-badge ' + cfg.badgeClass + '">' +
        '<span class="rnd-dot ' + cfg.dotClass + '"></span>' +
        cfg.label +
      '</div>' +
      '<div class="rnd-body">' +
        '<h3 class="rnd-title">' + (entry.title || '') + '</h3>' +
        '<p class="rnd-hypothesis">' + (entry.hypothesis || '') + '</p>' +
        '<p class="rnd-finding">' + (entry.finding || '') + '</p>' +
        (links.length
          ? '<div class="rnd-artifacts">' +
              links.map(function(l) {
                return '<a href="' + l.url + '" class="rnd-artifact-link" target="_blank" rel="noopener">↗ ' + l.label + '</a>';
              }).join('') +
            '</div>'
          : '') +
      '</div>';

    wrap.appendChild(row);
  });

  // Nebula atmosphere reveal when R&D comes into view
  var section = document.getElementById('rnd');
  if (section) {
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        section.classList.add('nebula-lit');
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(section);
  }
})();