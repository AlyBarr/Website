/* ═══════════════════════════════════════════════════════════
   js/projects.js — Artifact Catalog Renderer
   
   Reads: global var PROJECTS (inline data block)
   Targets:
     #featured-projects  ← large alternating featured rows
     #project-grid       ← smaller grid cards
   
   Fantasy aesthetic: cards feel like discovered artifacts.
   Each card has a unique environment glow based on category.
   Hover = shimmer/depth. Click = expand inspect overlay.
═══════════════════════════════════════════════════════════ */
(function renderProjects() {
  'use strict';

  if (typeof PROJECTS === 'undefined') {
    console.warn('[AlyArtBar] PROJECTS not defined — check inline data block');
    return;
  }

  var featuredWrap = document.getElementById('featured-projects');
  var gridWrap     = document.getElementById('project-grid');
  if (!featuredWrap && !gridWrap) return;

  /* ── Environment color by category keyword ── */
  function envColor(category) {
    var c = (category || '').toLowerCase();
    if (c.includes('pipeline') || c.includes('tools') || c.includes('usd') || c.includes('render'))
      return 'env-pipeline'; /* structured grid light */
    if (c.includes('ml') || c.includes('machine') || c.includes('ai') || c.includes('learning'))
      return 'env-ml';       /* neural violet pulses */
    if (c.includes('graphics') || c.includes('shader') || c.includes('opengl') || c.includes('c++'))
      return 'env-graphics'; /* energy pulses / electric */
    if (c.includes('ar') || c.includes('xr') || c.includes('augment') || c.includes('creative'))
      return 'env-creative'; /* nebula / creative cosmos */
    return 'env-default';
  }

  /* ── Build tool chips HTML ── */
  function chipsHtml(tools) {
    if (!tools || !tools.length) return '';
    return '<div class="project-tools">' +
      tools.map(function(t) {
        return '<span class="project-tool-chip">' + escHtml(t) + '</span>';
      }).join('') +
    '</div>';
  }

  /* ── Build links HTML ── */
  function linksHtml(links, featured) {
    if (!links || !links.length) return '';
    return '<div class="project-links">' +
      links.map(function(l) {
        return '<a href="' + escHtml(l.url) + '" class="project-link" target="_blank" rel="noopener">' +
          escHtml(l.label) + ' ↗' +
        '</a>';
      }).join('') +
    (featured ? '<button class="project-inspect-btn" aria-label="Deep dive">// inspect</button>' : '') +
    '</div>';
  }

  /* ── Build bullets ── */
  function bulletsHtml(bullets) {
    if (!bullets || !bullets.length) return '';
    return '<ul class="project-bullets">' +
      bullets.map(function(b) {
        return '<li>' + escHtml(b) + '</li>';
      }).join('') +
    '</ul>';
  }

  /* ── Escape HTML ── */
  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Featured row ── */
  function buildFeatured(p, idx) {
    var el = document.createElement('article');
    el.className = 'featured-row reveal ' + envColor(p.category);
    el.setAttribute('data-roles', (p.roles || []).join(' '));
    el.setAttribute('data-project-id', p.id || idx);
    el.setAttribute('data-project-idx', idx);
    el.style.transitionDelay = (idx * 80) + 'ms';

    var imgHtml = '';
    if (p.image) {
      imgHtml = '<div class="featured-visual">' +
        '<img src="' + escHtml(p.image) + '" alt="' + escHtml(p.imageAlt || p.title) + '" loading="lazy"/>' +
        '<div class="featured-visual-overlay"></div>' +
      '</div>';
    } else {
      /* No image: show a sigil/category mark placeholder */
      imgHtml = '<div class="featured-visual featured-visual-placeholder">' +
        '<div class="featured-sigil" aria-hidden="true">' +
          '<span class="featured-sigil-cat">' + escHtml(p.category) + '</span>' +
          '<div class="featured-sigil-glyph"></div>' +
        '</div>' +
      '</div>';
    }

    el.innerHTML =
      imgHtml +
      '<div class="featured-content">' +
        '<p class="featured-category eyebrow">' + escHtml(p.category) + '</p>' +
        '<h3 class="featured-title">' + escHtml(p.title) + '</h3>' +
        '<p class="featured-oneliner">' + escHtml(p.oneliner) + '</p>' +
        bulletsHtml(p.bullets) +
        chipsHtml(p.tools) +
        linksHtml(p.links, true) +
      '</div>';

    return el;
  }

  /* ── Grid card ── */
  function buildCard(p, idx) {
    var el = document.createElement('article');
    el.className = 'project-card reveal ' + envColor(p.category);
    el.setAttribute('data-roles', (p.roles || []).join(' '));
    el.setAttribute('data-project-id', p.id || idx);
    el.setAttribute('data-project-idx', idx);
    el.style.transitionDelay = (idx * 60) + 'ms';
    el.setAttribute('title', 'Click to inspect artifact');
    el.style.cursor = 'pointer';

    el.innerHTML =
      '<div class="card-glow-ring" aria-hidden="true"></div>' +
      '<p class="card-category eyebrow">' + escHtml(p.category) + '</p>' +
      '<h3 class="card-title">' + escHtml(p.title) + '</h3>' +
      '<p class="card-oneliner">' + escHtml(p.oneliner) + '</p>' +
      chipsHtml(p.tools) +
      linksHtml(p.links, false);

    return el;
  }

  /* ── Render ── */
  var featuredIdx = 0;
  var gridIdx     = 0;

  PROJECTS.forEach(function(p, i) {
    if (p.featured && featuredWrap) {
      featuredWrap.appendChild(buildFeatured(p, featuredIdx++));
    } else if (gridWrap) {
      gridWrap.appendChild(buildCard(p, gridIdx++));
    }
  });

  /* ── Mouse ripple on featured rows ── */
  document.querySelectorAll('.featured-row, .project-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      var y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  /* ── Expose for artifact-inspect.js ── */
  window._PROJECTS_RENDERED = true;

})();
