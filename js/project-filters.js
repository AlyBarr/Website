
/* ═══════════════════════════════════════════
   js/project-filters.js — Role filter chips
═══════════════════════════════════════════ */
(function initProjectFilters(){
  const chips = Array.from(document.querySelectorAll('.filter-chip'));
  if (!chips.length) return;

  function getCards(){
    return Array.from(document.querySelectorAll('.project-card, .project, .card, [data-project]'))
      .filter(el => (el.classList.contains('project-card') || el.dataset.roles || el.querySelector('.project-title, h3')));
  }

  function setActive(filter){
    chips.forEach(c => c.classList.toggle('is-active', c.dataset.filter === filter));
    const cards = getCards();

    cards.forEach(card => {
      const roles = (card.dataset.roles || '').split(/\s+/).filter(Boolean);
      const show = (filter === 'all') || roles.includes(filter);
      card.style.display = show ? '' : 'none';
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => setActive(chip.dataset.filter || 'all'));
  });

  // Allow other UI to drive filters (portals, constellation, cmdk)
  window.addEventListener('aly:setFilter', (e) => {
    const filter = e?.detail?.filter || 'all';
    setActive(filter);
  });

  // default
  setActive('all');
})();
