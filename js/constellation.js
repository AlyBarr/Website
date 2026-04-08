/* ═══════════════════════════════════════════
   js/constellation.js — Skills Canvas (Upgraded)
   Hover + click to select, stronger glow + links pop
═══════════════════════════════════════════ */
(function initConstellation() {
  const canvas = document.getElementById('skill-canvas');
  if (!canvas || typeof SKILLS === 'undefined') return;

  const ctx = canvas.getContext('2d');
  let W, H;
  let hoveredId = null;
  let selectedId = null;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    // HiDPI crispness
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.floor(rect.width);
    H = 520; // a bit taller = more “space”
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Hydrate nodes with animation state
  const nodes = SKILLS.map(s => ({
    ...s,
    cx: s.x, cy: s.y,
    phase: Math.random() * Math.PI * 2,
    floatAmp: 0.010 + Math.random() * 0.010,
    floatSpd: 0.35  + Math.random() * 0.35,
  }));

  // Build edge list from links
  const edges = [];
  nodes.forEach(n => {
    (n.links || []).forEach(targetId => {
      const target = nodes.find(x => x.id === targetId);
      if (target) edges.push({ a: n, b: target });
    });
  });

  // Helper: whether node is connected to active node
  function isConnected(aId, bId) {
    const a = nodes.find(n => n.id === aId);
    if (!a) return false;
    return (a.links || []).includes(bId);
  }

  // Mouse tracking
  let mouseX = -999, mouseY = -999;

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    hoveredId = null;
    for (const n of nodes) {
      const dx = mouseX - n.cx * W;
      const dy = mouseY - n.cy * H;
      if (Math.sqrt(dx*dx + dy*dy) < (n.r + 16)) {
        hoveredId = n.id;
        break;
      }
    }
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredId = null;
    mouseX = -999;
    mouseY = -999;
  });

  // Click to select (lock glow)
  canvas.addEventListener('click', () => {
    if (!hoveredId) { selectedId = null; return; }
    selectedId = (selectedId === hoveredId) ? null : hoveredId;
  });

  let t = 0;

  function drawBackground() {
    // Subtle nebula wash behind nodes (inside canvas)
    const g = ctx.createRadialGradient(W*0.55, H*0.45, 10, W*0.55, H*0.45, Math.max(W,H)*0.7);
    g.addColorStop(0, 'rgba(61,255,208,0.05)');
    g.addColorStop(0.45, 'rgba(29,136,112,0.03)');
    g.addColorStop(1, 'rgba(2,8,16,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.012;

    drawBackground();

    // Animate node float
    nodes.forEach(n => {
      n.cx = n.x + Math.sin(t * n.floatSpd + n.phase) * n.floatAmp;
      n.cy = n.y + Math.cos(t * n.floatSpd * 0.7 + n.phase) * n.floatAmp * 0.65;
    });

    const activeId = selectedId || hoveredId;

    // Draw edges
    edges.forEach(({ a, b }) => {
      const ax = a.cx * W, ay = a.cy * H;
      const bx = b.cx * W, by = b.cy * H;

      // REPLACE edge alpha/width in draw():
      const isActiveEdge =
        activeId && (activeId === a.id || activeId === b.id ||
        isConnected(activeId, a.id) || isConnected(activeId, b.id));

      const alpha = isActiveEdge ? 0.75 : 0.08;   // was 0.42 / 0.08
      const width = isActiveEdge ? 2.5  : 0.75;   // was 1.8 / 0.75

      const grad = ctx.createLinearGradient(ax, ay, bx, by);
      grad.addColorStop(0, `rgba(61,255,208,${alpha})`);
      grad.addColorStop(1, `rgba(126,232,216,${alpha * 0.65})`);

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = grad;
      ctx.lineWidth = width;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(n => {
      const x = n.cx * W, y = n.cy * H;

      const isHovered  = hoveredId === n.id;
      const isSelected = selectedId === n.id;
      const isActive   = isHovered || isSelected;

      const pulse = isSelected ? 1.15 : (0.88 + 0.12 * Math.sin(t * 1.6 + n.phase));
      const r = n.r + (isActive ? 9 : 0);

      // Strong bloom halo 
      const bloomStrength = isSelected ? 0.55 : (isHovered ? 0.38 : (n.glow ? 0.14 : 0.06));
      const bloomRadius   = isSelected ? r * 7.0 : (isHovered ? r * 5.5 : r * 3.5);

      const halo = ctx.createRadialGradient(x, y, 0, x, y, bloomRadius);
      halo.addColorStop(0,    `rgba(61,255,208,${bloomStrength})`);
      halo.addColorStop(0.25, `rgba(61,255,208,${bloomStrength * 0.65})`);
      halo.addColorStop(0.6,  `rgba(61,255,208,${bloomStrength * 0.18})`);
      halo.addColorStop(1,    'rgba(61,255,208,0)');
      ctx.beginPath();
      ctx.arc(x, y, bloomRadius, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      // Second inner core glow for the "star" feel
      if (isSelected || isHovered) {
        const coreG = ctx.createRadialGradient(x, y, 0, x, y, r * 1.4);
        coreG.addColorStop(0, `rgba(200,255,245,${isSelected ? 0.9 : 0.6})`);
        coreG.addColorStop(1, 'rgba(61,255,208,0)');
        ctx.beginPath();
        ctx.arc(x, y, r * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = coreG;
        ctx.fill();
      }

      // Node body
      const bg = ctx.createRadialGradient(x - r*0.3, y - r*0.3, 0, x, y, r);
      bg.addColorStop(0, `rgba(61,255,208,${0.28 * pulse})`);
      bg.addColorStop(0.6, `rgba(26,96,112,${0.55 * pulse})`);
      bg.addColorStop(1,   `rgba(9,24,40,${0.86 * pulse})`);

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();

      // Border ring
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected
        ? 'rgba(61,255,208,0.98)'
        : isHovered
          ? 'rgba(61,255,208,0.82)'
          : `rgba(61,255,208,${0.35 * pulse})`;
      ctx.lineWidth = isActive ? 2.1 : 0.8;
      ctx.stroke();

      // Selected “spark” ticks
      if (isSelected) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * 0.25);
        ctx.strokeStyle = 'rgba(61,255,208,0.45)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
          ctx.rotate(Math.PI / 4);
          ctx.beginPath();
          ctx.moveTo(r + 6, 0);
          ctx.lineTo(r + 12, 0);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Label
      const fontSize = isActive ? 12.5 : 10.5;
      ctx.font = `${isActive ? 600 : 400} ${fontSize}px 'Fira Code', monospace`;
      ctx.fillStyle = isSelected
        ? 'rgba(230,243,248,0.98)'
        : isHovered
          ? 'rgba(230,243,248,0.92)'
          : 'rgba(135,176,196,0.72)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, x, y + r + (isActive ? 16 : 12));
    });

    requestAnimationFrame(draw);
  }

  // Only start when visible
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      resize();
      draw();
      obs.disconnect();
    }
  }, { threshold: 0.12 });
  obs.observe(canvas);

  window.addEventListener('resize', resize);
})();