/* ═══════════════════════════════
   js/reveal.js — Scroll Reveal (dynamic-safe)
═══════════════════════════════ */
(function initReveal() {
  const observed = new WeakSet();

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);

      setTimeout(() => el.classList.add("in"), delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.1 });

  function applyStaggerAndObserve(root = document) {
    const nodes = root.querySelectorAll ? root.querySelectorAll(".reveal") : [];
    nodes.forEach((el) => {
      if (observed.has(el)) return;
      observed.add(el);

      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          (child) => child.classList && child.classList.contains("reveal")
        );
        const idx = siblings.indexOf(el);
        if (!el.dataset.delay) el.dataset.delay = String(idx * 80);
      }

      obs.observe(el);
    });
  }

  applyStaggerAndObserve(document);

  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;

        if (node.classList && node.classList.contains("reveal")) {
          applyStaggerAndObserve(node.parentElement || document);
        } else {
          applyStaggerAndObserve(node);
        }
      }
    }
  });

  const startMO = () => {
    const target = document.body || document.documentElement;
    mo.observe(target, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startMO, { once: true });
  } else {
    startMO();
  }
})();