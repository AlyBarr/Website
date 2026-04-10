/* ═══════════════════════════════
   js/nav.js — Navigation (mobile-friendly)
═══════════════════════════════ */
(function initNav() {
  const nav    = document.getElementById('site-nav');
  const burger = document.getElementById('nav-burger');
  const links  = document.getElementById('nav-links');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile overlay (created once)
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.hidden = true;
    document.body.appendChild(overlay);
  }

  let lastFocus = null;

  function closeMenu() {
    if (!links?.classList.contains('open')) return;
    links.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    overlay.hidden = true;
    overlay.classList.remove('show');

    // restore focus
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function openMenu() {
    if (!links) return;
    lastFocus = document.activeElement;
    links.classList.add('open');
    burger?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    overlay.hidden = false;
    // force reflow so transition plays
    overlay.offsetHeight; // eslint-disable-line no-unused-expressions
    overlay.classList.add('show');

    // focus first link for keyboard users
    const firstLink = links.querySelector('a');
    firstLink?.focus();
  }

  burger?.addEventListener('click', () => {
    const willOpen = !links.classList.contains('open');
    willOpen ? openMenu() : closeMenu();
  });

  // Close when clicking overlay
  overlay.addEventListener('click', closeMenu);

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close when a nav link is clicked
  document.querySelectorAll('#nav-links a').forEach(a =>
    a.addEventListener('click', () => {
      closeMenu();
    })
  );

  // Close if window resized up past mobile
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 721px)').matches) closeMenu();
  });

})();