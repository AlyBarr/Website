/* ═══════════════════════════════════════════════════════════
   js/phase4.js — Phase 4: Full Immersive Universe

   1. Three.js WebGL
      - Deep bioluminescent ocean with vertex displacement
      - Scroll-driven ocean → nebula/cosmos transition
      - Drifting biolume plankton + 10k cosmic particles
      - Wormhole portal rings with counter-rotation, void disc,
        accretion particles — all fully animated
      - Fantasy fog layer over ocean surface
   2. SVG wormhole shockwave on section transitions
   3. Right-rail depth navigation pips
   4. Section warp-in + atmosphere halos
═══════════════════════════════════════════════════════════ */
(function initPhase4() {
  'use strict';

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let proView = false;
  try { proView = (localStorage.getItem('aly_pro_view') === '1'); } catch(e){}
  proView = proView || document.body.classList.contains('pro-view');
  if (reduceMotion || proView) return;

  /* ── Injected CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    #webgl-canvas{
    position: fixed;
    inset: 0;
    z-index: 1;         /* <- was 0; keep it above stars */
    pointer-events: none;
    opacity: 0;         /* still starts hidden */
  }

  /* when active (phase4.js should add this class) */
  body.world-on #webgl-canvas{ opacity: 0.9; }
  body.world-on #stars{ opacity: 0.85; }
    #webgl-canvas.p4-warming { opacity:0.08 !important; }
    #webgl-canvas.p4-active  { opacity:0.92 !important; transition:opacity 2.8s ease !important; }

    .depth-indicator{
      position:fixed;right:1.8rem;top:50%;transform:translateY(-50%);
      z-index:50;display:flex;flex-direction:column;gap:.9rem;
      opacity:0;transition:opacity .8s ease;background:none;border:none;padding:0;
    }
    .depth-indicator.visible{opacity:1}
    .depth-pip{
      display:flex;align-items:center;gap:0;
      background:none;border:none;cursor:none;padding:0;position:relative;
      transition:gap .25s ease;flex-direction:row-reverse;
    }
    .depth-pip:hover{gap:.7rem}
    .depth-pip:hover .pip-label{opacity:1;transform:translateX(0)}
    .pip-dot{
      width:7px;height:7px;border-radius:50%;background:var(--c-ghost);flex-shrink:0;
      transition:background .25s,box-shadow .25s,transform .25s;
    }
    .depth-pip.active .pip-dot{
      background:var(--c-biolume);box-shadow:0 0 10px var(--c-biolume);transform:scale(1.5);
    }
    .pip-label{
      display:flex;flex-direction:column;align-items:flex-end;
      opacity:0;transform:translateX(8px);
      transition:opacity .2s,transform .2s;pointer-events:none;white-space:nowrap;
    }
    .pip-name{font-family:var(--font-mono);font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--c-mist);line-height:1.2;}
    .pip-depth{font-family:var(--font-mono);font-size:.52rem;letter-spacing:.1em;color:var(--c-ghost);}
    .depth-pip.active .pip-name{color:var(--c-biolume)}
    .depth-pip.active .pip-depth{color:var(--c-biolume-soft)}

    #portal-svg{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:399;opacity:0;transition:opacity .1s;}

    @keyframes warp-ripple{0%{opacity:0;transform:scale(.97)}50%{opacity:1}100%{opacity:1;transform:scale(1)}}
    .warp-in{animation:warp-ripple .9s cubic-bezier(.16,1,.3,1) forwards}
    @media(max-width:900px){.depth-indicator{display:none}}
  `;
  document.head.appendChild(style);

  /* ── Terminal done utility ── */
  function onTerminalDone(cb) {
    const el = document.getElementById('terminal');
    if (!el || el.classList.contains('hidden')) { setTimeout(cb, 200); return; }
    const obs = new MutationObserver(() => {
      if (el.classList.contains('hidden')) { obs.disconnect(); setTimeout(cb, 400); }
    });
    obs.observe(el, { attributes: true });
  }

  /* ── Portal event buffer (before Three loads) ── */
  let _lastPortalHover = null, _lastPortalActivate = null;
  window.addEventListener('aly:portalHover',    e => { _lastPortalHover    = e; });
  window.addEventListener('aly:portalActivate', e => { _lastPortalActivate = e; });

  /* ── Load Three.js ── */
  function loadThree(cb) {
    if (typeof THREE !== 'undefined') { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = cb;
    s.onerror = () => console.warn('[AlyArtBar] Three.js unavailable');
    document.head.appendChild(s);
  }

  loadThree(function() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x020810, 1);

    const scene  = new THREE.Scene();
    // Atmospheric fog — dense near camera, clears at depth (fantasy ocean mist)
    scene.fog = new THREE.FogExp2(0x020c18, 0.008);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 8, 22);

    /* ══════════════════════════════════════
       OCEAN
    ══════════════════════════════════════ */
    const oceanGeo = new THREE.PlaneGeometry(180, 180, 100, 100);
    oceanGeo.rotateX(-Math.PI / 2);
    const baseY = Float32Array.from(oceanGeo.attributes.position.array);

    const oceanMat = new THREE.MeshPhongMaterial({
      color:     0x0a2a44,
      emissive:  0x051828,
      specular:  0x3dffd0,
      shininess: 70,
      transparent: true,
      opacity: 1,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.position.y = -4;
    scene.add(ocean);

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0x051828, 1.0));

    const bl1 = new THREE.PointLight(0x3dffd0, 2.2, 120);
    bl1.position.set(-20, 12, 10);
    scene.add(bl1);

    const bl2 = new THREE.PointLight(0x1a8888, 1.4, 90);
    bl2.position.set(25, 8, -15);
    scene.add(bl2);

    // Warm accent — fantasy amber light for the "handmade" feel
    const warmLight = new THREE.PointLight(0xf0a050, 0.6, 60);
    warmLight.position.set(0, 5, 8);
    scene.add(warmLight);

    // Nebula deep light (cosmos transition)
    const nebLight = new THREE.PointLight(0x9d78f5, 0, 140);
    nebLight.position.set(0, 50, -40);
    scene.add(nebLight);

    /* ── Bioluminescent plankton ── */
    /* ── Square bioluminescent plankton ── */
    // Create a tiny square sprite texture (no external file needed)
    function makeSquareSprite(color) {
      const c = document.createElement('canvas');
      c.width = 8; c.height = 8;
      const cx = c.getContext('2d');
      cx.fillStyle = color || '#3dffd0';
      cx.fillRect(0, 0, 8, 8);
      return new THREE.CanvasTexture(c);
    }

    const plankN   = 1400;
    const plankPos = new Float32Array(plankN * 3);
    for (let i = 0; i < plankN; i++) {
      plankPos[i*3]   = (Math.random()-0.5)*160;
      plankPos[i*3+1] = (Math.random()-0.5)*10 - 1;
      plankPos[i*3+2] = (Math.random()-0.5)*110;
    }
    const plankGeo = new THREE.BufferGeometry();
    plankGeo.setAttribute('position', new THREE.BufferAttribute(plankPos, 3));
    const plankMat = new THREE.PointsMaterial({
      color: 0x3dffd0,
      size: 2.8,                      // larger = more visible squares
      map: makeSquareSprite('#3dffd0'),
      transparent: true,
      opacity: 0.85,
      alphaTest: 0.1,
      sizeAttenuation: true,
    });
    const plankton = new THREE.Points(plankGeo, plankMat);
    scene.add(plankton);

    /* ── Deep surface glow strips (fantasy biolume lines on water) ── */
    const glowLineCount = 12;
    const glowLines = [];
    for (let g = 0; g < glowLineCount; g++) {
      const pts = [];
      const z0  = -60 + g * 10;
      for (let i = 0; i < 20; i++) pts.push(new THREE.Vector3(-60 + i*6, -3.5, z0 + (Math.random()-0.5)*3));
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x1dffd0, transparent: true, opacity: 0.12 });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      glowLines.push({ line, lineMat, z0, phase: Math.random()*Math.PI*2 });
    }

    /* ── Cosmic particles ── */
    const N = 12000;
    const pPos = new Float32Array(N * 3);
    const pCol = new Float32Array(N * 3);
    const palette = [
      [0.24, 1.00, 0.82], [0.49, 0.91, 0.85],
      [0.78, 0.90, 0.94], [0.62, 0.47, 0.96],
      [0.10, 0.38, 0.44], [0.95, 0.65, 0.30],
    ];
    for (let i = 0; i < N; i++) {
      const r     = 150 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pPos[i*3+1] = r * Math.cos(phi) * 0.5 + 40;
      pPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
      const c = palette[i % palette.length];
      pCol[i*3] = c[0]; pCol[i*3+1] = c[1]; pCol[i*3+2] = c[2];
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.85, vertexColors: true, transparent: true, opacity: 0 });
    scene.add(new THREE.Points(pGeo, pMat));

    /* ══════════════════════════════════════
       WORMHOLE PORTALS
    ══════════════════════════════════════ */
    const portalDefs = [
      { x:  0,  y:  0,  z:   0,  color: 0x3dffd0, r: 6.0 },
      { x: -9,  y: 11,  z: -11,  color: 0x1d8870, r: 5.5 },
      { x:  7,  y: 22,  z: -24,  color: 0x9d78f5, r: 7.0 },
      { x: -5,  y: 34,  z: -38,  color: 0x3dffd0, r: 5.5 },
      { x:  4,  y: 46,  z: -54,  color: 0x7ee8d8, r: 6.0 },
    ];

    function makePortal(pp) {
      const grp = new THREE.Group();
      const R   = pp.r;
      const col = new THREE.Color(pp.color);

      /* 1 — Heavy outer structural frame */
      // REPLACE these two lines inside makePortal():
      const outerMesh = new THREE.Mesh(
        new THREE.TorusGeometry(R, 0.32, 20, 96),   // slightly thicker tube
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.95 })
      );

      const haloMesh = new THREE.Mesh(
        new THREE.TorusGeometry(R, 0.85, 8, 96),     // wider soft halo
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.35 })
      );
      grp.add(haloMesh);

      /* 3 — Mid ring counter-rotating */
      const midGroup = new THREE.Group();
      midGroup.add(new THREE.Mesh(
        new THREE.TorusGeometry(R * 0.76, 0.13, 12, 72),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.65 })
      ));
      grp.add(midGroup);

      /* 4 — Inner ring (fastest, forward spin) */
      const innerGroup = new THREE.Group();
      innerGroup.add(new THREE.Mesh(
        new THREE.TorusGeometry(R * 0.52, 0.08, 8, 56),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.50 })
      ));
      grp.add(innerGroup);

      /* 5 — Event horizon: dark void disc behind rings */
      const voidMesh = new THREE.Mesh(
        new THREE.CircleGeometry(R * 0.90, 72),
        new THREE.MeshBasicMaterial({ color: 0x000408, transparent: true, opacity: 0.88, side: THREE.DoubleSide })
      );
      voidMesh.position.z = -0.05;
      grp.add(voidMesh);

      /* 6 — Rim colour bleed (colour disc slightly smaller than void, behind it) */
      const rimMesh = new THREE.Mesh(
        new THREE.CircleGeometry(R * 0.94, 72),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.14, side: THREE.DoubleSide })
      );
      rimMesh.position.z = -0.08;
      grp.add(rimMesh);

      /* 7 — Accretion disc: 300 spiralling particles */
      const accN   = 300;
      const accPos = new Float32Array(accN * 3);
      for (let i = 0; i < accN; i++) {
        const frac   = i / accN;
        const angle  = frac * Math.PI * 2 * 4;           // 4 full spirals
        const radius = R * (0.55 + frac * 0.85);
        const scatter = (Math.random() - 0.5) * 0.5;
        accPos[i*3]   = Math.cos(angle) * (radius + scatter);
        accPos[i*3+1] = (Math.random() - 0.5) * 0.4;    // thin disc
        accPos[i*3+2] = Math.sin(angle) * (radius + scatter) * 0.18; // perspective flatten
      }
      const accGeo = new THREE.BufferGeometry();
      accGeo.setAttribute('position', new THREE.BufferAttribute(accPos, 3));
      const accMat = new THREE.PointsMaterial({ color: col, size: 0.15, transparent: true, opacity: 0.65 });
      const accPoints = new THREE.Points(accGeo, accMat);
      grp.add(accPoints);

      /* 8 — Bright inner spark ring (tiny, glows the most) */
      const sparkMesh = new THREE.Mesh(
        new THREE.TorusGeometry(R * 0.88, 0.04, 8, 80),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })
      );
      grp.add(sparkMesh);

      grp.position.set(pp.x, pp.y, pp.z);
      grp.rotation.y = (Math.random() - 0.5) * 0.5;
      grp.rotation.x = -0.08 + (Math.random() - 0.5) * 0.12; // slight tilt toward viewer

      // Store everything cleanly — no positional destructuring anywhere
      grp.userData = {
        // animation state
        spin:       0.004 + Math.random() * 0.004,
        focus:      0,
        clickPulse: 0,
        baseScale:  new THREE.Vector3(1, 1, 1),
        baseColor:  pp.color,
        // material handles
        outerMat:  outerMesh.material,
        haloMat:   haloMesh.material,
        midMat:    midGroup.children[0].material,
        innerMat:  innerGroup.children[0].material,
        voidMat:   voidMesh.material,
        rimMat:    rimMesh.material,
        accMat:    accMat,
        sparkMat:  sparkMesh.material,
        // group handles for rotation
        midGroup,
        innerGroup,
        accPoints,
      };

      return grp;
    }

    const portals = portalDefs.map(pp => {
      const g = makePortal(pp);
      scene.add(g);
      return g;
    });

    /* ── Portal routing ── */
    const portalRouteIndex = { techart: 0, pipeline: 1, creative: 2, graphics: 2 };
    const portalRouteColor = { techart: 0x3dffd0, pipeline: 0x1d8870, creative: 0x9d78f5, graphics: 0x9d78f5 };
    let focusedRoute = null, focusedPortal = null;

    function setPortalFocusByRoute(route) {
      const idx = route ? portalRouteIndex[route] : null;
      focusedPortal = (typeof idx === 'number') ? idx : null;
      focusedRoute  = route || null;
    }

    window.addEventListener('aly:portalHover', (e) => {
      const route = e?.detail?.filter || null;
      const hex   = e?.detail?.color  || null;
      setPortalFocusByRoute(route);
      if (route && hex) portalRouteColor[route] = parseInt(String(hex).replace('#',''), 16);
    });
    window.addEventListener('aly:portalActivate', (e) => {
      const route = e?.detail?.filter || null;
      const hex   = e?.detail?.color  || null;
      setPortalFocusByRoute(route);
      if (route && hex) portalRouteColor[route] = parseInt(String(hex).replace('#',''), 16);
      const idx = route ? portalRouteIndex[route] : null;
      if (typeof idx === 'number' && portals[idx]) portals[idx].userData.clickPulse = 1.0;
    });

    // Replay buffered events
    if (_lastPortalHover)    window.dispatchEvent(new CustomEvent('aly:portalHover',    { detail: _lastPortalHover.detail }));
    if (_lastPortalActivate) window.dispatchEvent(new CustomEvent('aly:portalActivate', { detail: _lastPortalActivate.detail }));

    /* ── Scroll ── */
    let scrollT = 0, scrollTarget = 0;
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget = max > 0 ? window.scrollY / max : 0;
    }, { passive: true });

    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    /* ── Activate ── */
    canvas.classList.add('p4-warming');
    onTerminalDone(() => {
      canvas.classList.remove('p4-warming');
      canvas.classList.add('p4-active');
    });

    /* ══════════════════════════════════════
       ANIMATION LOOP
    ══════════════════════════════════════ */
    let t = 0;
    (function loop() {
      requestAnimationFrame(loop);
      t += 0.008;
      scrollT += (scrollTarget - scrollT) * 0.035;
      const s = Math.pow(scrollT, 0.7);

      /* ── Ocean wave displacement ── */
      const pos = oceanGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const ox = baseY[i*3], oz = baseY[i*3+2];
        pos.setY(i, baseY[i*3+1]
          + Math.sin(ox*0.15 + t*1.1)*1.1
          + Math.sin(oz*0.12 + t*0.8)*0.9
          + Math.sin((ox+oz)*0.09 + t*1.4)*0.6
          + Math.sin(ox*0.22 - t*0.6)*0.4
          + Math.sin(oz*0.18 + t*0.5)*0.25
        );
      }
      pos.needsUpdate = true;
      oceanGeo.computeVertexNormals();

      /* ── Ocean → cosmos transition ── */
      oceanMat.opacity   = Math.max(0, 1 - s * 0.92);
      plankMat.opacity   = 0.70 * Math.max(0, 1 - s * 1.2);
      pMat.opacity       = Math.min(0.92, s * 1.1);
      nebLight.intensity = s * 3.0;

      /* ── Fog: dense at hero (fantasy mist), clears as cosmos opens ── */
      scene.fog.density = 0.008 * (1 - s * 0.85);

      /* ── Glow lines breathe on ocean surface ── */
      glowLines.forEach(({ lineMat, phase }, i) => {
        lineMat.opacity = Math.max(0, (0.08 + 0.10 * Math.sin(t * 0.7 + phase)) * (1 - s * 1.4));
      });

      /* ── Camera dives ── */
      camera.position.y = 8  + scrollT * 58;
      camera.position.z = 22 - scrollT * 18;
      camera.position.x = Math.sin(t * 0.08) * 1.8;
      camera.lookAt(Math.sin(t*0.05)*2, camera.position.y - 8, -scrollT * 22);

      /* ── Warm light flickers slightly (candle-like fantasy feel) ── */
      warmLight.intensity = (0.5 + 0.15 * Math.sin(t * 2.3 + 1.1)) * (1 - s);

      /* ── Biolume lights drift ── */
      bl1.position.x = Math.sin(t*0.4)*28;
      bl1.position.z = Math.cos(t*0.3)*18;
      bl2.position.x = Math.cos(t*0.35)*22;
      bl2.position.z = Math.sin(t*0.45)*20;

      /* ── Plankton drift ── */
      const pa = plankGeo.attributes.position.array;
      for (let i = 0; i < plankN; i++)
        pa[i*3+1] += Math.sin(t*0.9 + i*0.7) * 0.004;
      plankGeo.attributes.position.needsUpdate = true;

      /* ══════════════════════════════════════
         WORMHOLE PORTAL ANIMATION
      ══════════════════════════════════════ */
      portals.forEach((p, i) => {
        const ud = p.userData;

        // Base slow rotation of whole portal
        p.rotation.z += ud.spin;
        p.rotation.x = -0.08 + Math.sin(t * 0.22 + i) * 0.04; // gentle tilt breathe

        // Counter-rotating inner rings — creates wormhole twist effect
        ud.midGroup.rotation.z   -= ud.spin * 2.5;
        ud.innerGroup.rotation.z += ud.spin * 5.0;

        // Accretion disc rotates with outer frame (child of grp, gets p.rotation.z)

        // Focus lerp
        const focusTarget = (focusedPortal === i) ? 1 : 0;
        ud.focus = ud.focus + (focusTarget - ud.focus) * 0.06;

        // Click pulse decay
        ud.clickPulse *= 0.91;
        if (ud.clickPulse < 0.01) ud.clickPulse = 0;

        const f     = ud.focus;
        const click = ud.clickPulse;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.0 + i * 1.5);

        // ── Resolve current colour ──
        const activeColor = (focusedPortal === i && focusedRoute && portalRouteColor[focusedRoute])
          ? portalRouteColor[focusedRoute]
          : ud.baseColor;
        const setC = mat => mat && mat.color && mat.color.setHex(activeColor);
        setC(ud.outerMat); setC(ud.haloMat); setC(ud.midMat);
        setC(ud.innerMat); setC(ud.rimMat);  setC(ud.accMat);

        // ── Opacities ──
        // In the portals.forEach animation block, REPLACE the opacity lines:
        ud.outerMat.opacity = Math.min(0.98, 0.95 + f*0.03  + click*0.02  + pulse*0.03);
        ud.haloMat.opacity  = Math.min(0.75, 0.35 + f*0.38  + click*0.28  + pulse*0.14);
        ud.sparkMat.opacity = Math.min(0.90, 0.55 + f*0.32  + click*0.38  + pulse*0.20);
        ud.midMat.opacity   = Math.min(0.90, 0.65 + f*0.22  + click*0.15  + pulse*0.08);
        ud.innerMat.opacity = Math.min(0.85, 0.50 + f*0.28  + click*0.20  + pulse*0.12);
        ud.rimMat.opacity   = Math.min(0.60, 0.14 + f*0.42  + click*0.35  + pulse*0.10);
        ud.accMat.opacity   = Math.min(0.92, 0.65 + f*0.27  + click*0.20  + pulse*0.06);
        // Void darkens further when focused (deeper wormhole)
        ud.voidMat.opacity  = Math.max(0.40, 0.88 - f*0.28  - click*0.20);

        // ── Scale: breathe + focus swell + click shockwave ──
        const sc = (1 + Math.sin(t*0.45 + i*0.9)*0.015) * (1 + f*0.20 + click*0.32);
        p.scale.setScalar(sc);

        // ── Extra spin burst on click ──
        if (click > 0.05) {
          ud.midGroup.rotation.z   -= click * 0.08;
          ud.innerGroup.rotation.z += click * 0.13;
        }
      });

      renderer.render(scene, camera);
    })();
  });


  /* ══════════════════════════════════════════════════
     SVG WORMHOLE SHOCKWAVE
  ══════════════════════════════════════════════════ */
  (function initPortalFX() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.id = 'portal-svg';
    svg.innerHTML = `
      <defs>
        <radialGradient id="pg" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#000408"  stop-opacity=".80"/>
          <stop offset="35%"  stop-color="#051828"  stop-opacity=".50"/>
          <stop offset="70%"  stop-color="#1a6070"  stop-opacity=".18"/>
          <stop offset="100%" stop-color="#020810"  stop-opacity="0"/>
        </radialGradient>
        <filter id="pb"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="pb2"><feGaussianBlur stdDeviation="2.5"/></filter>
      </defs>
      <ellipse id="pe"  cx="50%" cy="50%" rx="0" ry="0" fill="url(#pg)" filter="url(#pb)"/>
      <ellipse id="pr1" cx="50%" cy="50%" rx="0" ry="0" fill="none" stroke="#3dffd0" stroke-width="3"   opacity="0" filter="url(#pb2)"/>
      <ellipse id="pr2" cx="50%" cy="50%" rx="0" ry="0" fill="none" stroke="#3dffd0" stroke-width="1.2" opacity="0"/>
      <ellipse id="pr3" cx="50%" cy="50%" rx="0" ry="0" fill="none" stroke="#3dffd0" stroke-width="0.6" opacity="0"/>
    `;
    document.body.appendChild(svg);

    const pe=document.getElementById('pe'), pr1=document.getElementById('pr1'),
          pr2=document.getElementById('pr2'), pr3=document.getElementById('pr3');

    const sectionColors = {
      hero:'#3dffd0', about:'#7ee8d8', projects:'#3dffd0',
      skills:'#1d8870', rnd:'#9d78f5', contact:'#3dffd0',
    };

    let busy = false;
    function flash(color) {
      if (busy) return;
      busy = true;
      svg.style.opacity = '1';
      pr1.setAttribute('stroke', color);
      pr2.setAttribute('stroke', color);
      pr3.setAttribute('stroke', color);

      const W = window.innerWidth * 0.5, H = window.innerHeight * 0.5;
      const FRAMES = 60;
      let f = 0;

      (function step() {
        f++;
        const raw = f / FRAMES;
        const e1  = 1 - Math.pow(1 - raw, 2.4);
        const e2  = 1 - Math.pow(1 - Math.max(0, raw - 0.12), 2.4);
        const e3  = 1 - Math.pow(1 - Math.max(0, raw - 0.26), 2.4);

        // Dark void expands first — tunnel opening
        pe.setAttribute('rx', W * Math.min(1, e1 * 1.2) * 0.88);
        pe.setAttribute('ry', H * Math.min(1, e1 * 1.2) * 0.88);

        // Shockwave ring 1
        pr1.setAttribute('rx', W * e1 * 1.5);
        pr1.setAttribute('ry', H * e1 * 1.5);
        pr1.setAttribute('opacity', Math.max(0, 0.95 - e1 * 1.05).toFixed(3));

        // Echo ring 2
        if (e2 > 0) {
          pr2.setAttribute('rx', W * e2 * 1.5);
          pr2.setAttribute('ry', H * e2 * 1.5);
          pr2.setAttribute('opacity', Math.max(0, 0.60 - e2 * 1.05).toFixed(3));
        }

        // Echo ring 3
        if (e3 > 0) {
          pr3.setAttribute('rx', W * e3 * 1.5);
          pr3.setAttribute('ry', H * e3 * 1.5);
          pr3.setAttribute('opacity', Math.max(0, 0.35 - e3 * 1.05).toFixed(3));
        }

        if (f < FRAMES) {
          requestAnimationFrame(step);
        } else {
          svg.style.opacity = '0';
          setTimeout(() => {
            [pe,pr1,pr2,pr3].forEach(el => { el.setAttribute('rx',0); el.setAttribute('ry',0); el.setAttribute('opacity',0); });
            busy = false;
          }, 350);
        }
      })();
    }

    window.addEventListener('aly:portalActivate', e => { const c=e?.detail?.color; if(c) flash(c); });

    let last = null;
    const ids = ['hero','about','projects','skills','rnd','contact'];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        if (last && last !== id) flash(sectionColors[id] || '#3dffd0');
        last = id;
      });
    }, { threshold: 0.5 });

    onTerminalDone(() => {
      ids.map(id => document.getElementById(id)).filter(Boolean).forEach(el => obs.observe(el));
    });

    document.querySelectorAll('#nav-links a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => flash(sectionColors[a.getAttribute('href').slice(1)] || '#3dffd0'));
    });
  })();


  /* ══════════════════════════════════════════════════
     DEPTH NAV PIPS
  ══════════════════════════════════════════════════ */
  (function initDepthNav() {
    const defs = [
      { id:'hero',     name:'Surface',     depth:'0m'    },
      { id:'about',    name:'Mid Water',   depth:'200m'  },
      { id:'projects', name:'Thermocline', depth:'500m'  },
      { id:'skills',   name:'Deep Zone',   depth:'1000m' },
      { id:'rnd',      name:'Abyss',       depth:'4000m' },
      { id:'contact',  name:'Core',        depth:'∞'     },
    ];
    const nav = document.createElement('nav');
    nav.className = 'depth-indicator';
    nav.setAttribute('aria-label', 'Section depth navigation');
    defs.forEach(d => {
      const btn = document.createElement('button');
      btn.className = 'depth-pip';
      btn.setAttribute('aria-label', `Go to ${d.name}`);
      btn.innerHTML = `<span class="pip-dot"></span><span class="pip-label"><span class="pip-name">${d.name}</span><span class="pip-depth">${d.depth}</span></span>`;
      btn.addEventListener('click', () => document.getElementById(d.id)?.scrollIntoView({ behavior:'smooth' }));
      nav.appendChild(btn);
    });
    document.body.appendChild(nav);
    onTerminalDone(() => setTimeout(() => nav.classList.add('visible'), 700));

    const sEls = defs.map(d => document.getElementById(d.id)).filter(Boolean);
    const pips = nav.querySelectorAll('.depth-pip');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const i = sEls.indexOf(e.target);
        if (e.isIntersecting && i !== -1) {
          pips.forEach(p => p.classList.remove('active'));
          pips[i]?.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    sEls.forEach(el => obs.observe(el));
  })();


  /* ══════════════════════════════════════════════════
     WARP-IN + ATMOSPHERE HALOS
  ══════════════════════════════════════════════════ */
  (function initSectionFX() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('warp-in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.section, .constellation-section').forEach(s => obs.observe(s));

    [
      { id:'about',    c:'rgba(61,255,208,.05)',  sz:'70vw', x:'80%', y:'50%' },
      { id:'projects', c:'rgba(29,136,112,.06)',  sz:'60vw', x:'10%', y:'50%' },
      { id:'skills',   c:'rgba(61,255,208,.05)',  sz:'80vw', x:'50%', y:'60%' },
      { id:'rnd',      c:'rgba(157,120,245,.06)', sz:'65vw', x:'50%', y:'40%' },
      { id:'contact',  c:'rgba(61,255,208,.05)',  sz:'55vw', x:'70%', y:'50%' },
    ].forEach(h => {
      const sec = document.getElementById(h.id);
      if (!sec) return;
      const halo = document.createElement('div');
      halo.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;z-index:0;width:${h.sz};height:${h.sz};left:${h.x};top:${h.y};transform:translate(-50%,-50%);background:radial-gradient(circle,${h.c} 0%,transparent 70%);filter:blur(60px);`;
      sec.style.position = 'relative';
      sec.insertBefore(halo, sec.firstChild);
    });
  })();

})();