# AlyArtBar — Site Expansion Plan
## "Cosmic Ocean Codex · World-Builder's Field Manual"

*Senior creative technologist review · April 2026*
*Assumes: vanilla HTML/CSS/JS, GitHub Pages, current site at depth: Hero → About → Projects → Skills → R&D → NDA → Contact*

---

## 1. Narrative Architecture — The Cosmic Ocean Codex

The site is already a deep-sea / space-ocean codex. Every section is a log entry, every scroll is a descent. The expansion commits fully to that metaphor.

```
SURFACE LAYER  (0m)    ── Hero / Terminal Boot / Portal Hub
MID WATER      (200m)  ── About / Logbook
THERMOCLINE    (500m)  ── Projects / Case Studies
DEEP ZONE      (1000m) ── Systems & Toolbox / Skills Constellation
ABYSS          (4000m) ── R&D Lab / Experiments Sandbox
TRENCH         (8000m) ── NDA Vault / Confidential
HADAL          (∞)     ── Contact / Comms Array
```

Each zone-div label updates to reflect this. The depth rail on the right (already in phase4.js) becomes the narrative spine.

---

## 2. Current Architecture Gap Analysis

| Section | Status | Gap |
|---|---|---|
| Hero + Portal Hub | ✅ Exists | Portal gems need destination clarity (done) |
| About / Logbook | ✅ Exists | Missing logbook timeline entries |
| Projects + Filters | ✅ Exists | Missing case study overlays |
| Skills Constellation | ✅ Exists | Static labels; could expand to show "used in:" on hover |
| R&D Lab | ✅ Exists | No "Experiments Sandbox" distinction |
| NDA Vault | ✅ Exists | Complete |
| Contact | ✅ Exists | Complete |
| **Systems / Toolbox** | ❌ Missing | Pipeline diagrams, tool breakdowns |
| **Process Logbook Timeline** | ❌ Missing | Chronological ship-log entries |
| **Case Studies** | ❌ Missing | Deep per-project modal/page |
| **Experiments Sandbox** | ❌ Missing | Clearly-labeled "in progress" lab |
| **Hidden Mini-Games** | ❌ Missing | Easter egg layer |
| **Creative ↔ Pro toggle** | ⚠️ Partial | Pro View toggle exists; needs more effect on layout |

---

## 3. New Section Design Specs

### 3A · Process Logbook Timeline
*Depth: mid water · between About and Projects*

**Narrative:** A captain's log of how you actually build things — not polished retrospectives, but dated entries that show thinking, iteration, and growth.

**Content structure per entry:**
```
LOG-YYYY-MM  ·  [PROJECT / CONTEXT]
Objective: one line
What changed: 2–3 sentences
Status: active | closed | pivoted
Tags: #pipeline #python #ml
```

**UI:** Vertical timeline, alternating left/right at desktop. Each entry is a `.logbook-card` with:
- Mono timestamp top-left
- Teal left border (active) / amber (pivoted) / ghost (closed)
- Expandable "full entry" via `<details>` (no JS needed, progressively enhanced)
- Fantasy layer: faint depth-mark annotation on hover

**Recruiter safety:** Collapsed by default — shows date + title + one-liner. Recruiters scan the dates and growth arc. Full entries behind `<details>`.

**Implementation:** Pure HTML/CSS. No new JS needed. One new `logbook.css` file.

---

### 3B · Systems / Toolbox
*Depth: deep zone · between Skills and R&D*

**Narrative:** "The tools I build and the pipelines I design." Not what you made, but *how* you think as a systems engineer.

**Content structure:**
```
SYSTEM NAME
Problem:   one line
Approach:  one line  
Result:    one line + metric if possible
Diagram:   SVG or ASCII block diagram
Tools:     chips
Status:    stamp (live/wip/exploring)
```

**UI:** Two-column alternating layout (mirrors Projects but feels more technical). Left = text breakdown, right = SVG diagram or ASCII block. No images needed — diagrams are inline SVG so they work at any resolution and load instantly.

**Example entry: Maya Pipeline Tools**
```
┌─ VALIDATE ─┐    ┌─ PUBLISH ─┐    ┌─ VERSION ─┐
│ geo check  │───▶│ copy/USD  │───▶│ Git tag   │
│ naming     │    │ manifest  │    │ semver    │
│ transforms │    │ export    │    │           │
└────────────┘    └───────────┘    └───────────┘
```

**Implementation:** New `systems.html` section and `systems.css`. Diagrams are inline SVG blocks in the HTML — ASCII-art SVGs for the lo-fi manual aesthetic. No JS needed for core display; optional expand-on-hover via CSS.

---

### 3C · Case Studies
*Triggered from: project cards (click) or featured project "Deep Dive" button*

**Narrative:** Not every project gets this — only the ones with real depth worth showing: Maya Pipeline Tools, ML Rig Predictor, AOI XR.

**Content structure:**
```
HEADER:    project name + category + year
PROBLEM:   what was broken / missing
CONSTRAINTS: time, tooling, team size
APPROACH:  your decision tree (what you tried, why)
TECH:      inline diagram + annotated code snippet
RESULTS:   metric or quote
ARTIFACTS: links to GitHub, docs, demo
NEXT:      what you'd do differently / future iteration
```

**UI:** Full-height overlay modal (already pattern-matched in `artifact-inspect.js`). Extend that system — add a "Deep Dive" link on featured project cards that opens a richer case study panel. The panel has:
- Dark background with amber accent (different from the project inspect overlay)
- Left scrollable nav for sections within the study
- Code snippet blocks in Fira Code with line highlights
- ASCII diagram blocks in `.case-diagram` pre elements
- Keyboard nav: Esc to close, arrow keys for section-within-study

**Implementation:** Extend `js/artifact-inspect.js` to check for `data-case-study="true"` on project cards and load from a `CASE_STUDIES` object in the data block. No new pages needed.

---

### 3D · Experiments Sandbox
*Depth: abyss · after R&D Lab, before NDA*

**Narrative:** "Things that are not done. Explorations that may never finish. This is the part of the lab where the lights flicker."

**Visual distinction from R&D:** R&D has a hypothesis/finding structure — scientific. Sandbox has a looser format — "I was trying to see if..." and "Result: interesting but broken."

**Content structure per entry:**
```
STATUS STAMP: [ PROTOTYPE ] [ UNSTABLE ] [ WILD IDEA ]
Title
"Trying to see if:" (replaces "hypothesis")
What happened / current state
Optional: embedded iframe or canvas if lightweight enough
```

**Implementation:** Reuse the `RND_ENTRIES` renderer with a new `type: 'sandbox'` field. The `rnd.js` renderer checks this and applies a different CSS class. New `.stamp-prototype` and `.stamp-unstable` stamps added to `imperfections.css`.

---

### 3E · Hidden Mini-Games (Easter Egg Layer)
*Scattered across all sections — never intrusive*

**Design principle:** The site tells you to look. The games find you when you do.

#### Game 1: Biolume Plankton Collector (Hero)
- **Trigger:** 10 seconds of idle on the hero, OR hovering the sigil SVG for 3s
- **Reveal:** A field note appears: `// depth anomaly detected · tap to investigate`
- **Game:** 6–8 glowing dots drift across the WebGL ocean. Click to collect. Counter shows as `SAMPLES: 0/8` in mono font. When all collected: unlock a `[BIOLUME RESEARCHER]` ASCII stamp in the UI (cosmetic, persisted in localStorage).
- **Implementation:** ~80 lines of vanilla JS hooked into `phase4.js`'s existing particle system. New dots are just extra point sprites in the Three.js scene.

#### Game 2: Logbook Cipher (About/Timeline)
- **Trigger:** Finding 3 hidden `◈` rune characters in the logbook section (buried in ::before pseudo-elements visible at certain zoom levels, or on specific scroll positions)
- **Game:** A cipher puzzle appears — 8 mono characters that map to a short phrase ("SYSTEMS NOMINAL"). Type it into the CMD-K palette to unlock `[CIPHER SOLVED]` stamp.
- **Implementation:** Pure JS. CMD-K palette already handles text input. Add a special handler.

#### Game 3: Portal Ring Alignment (Hero portals)
- **Trigger:** Hovering all three portals in sequence within 4 seconds
- **Game:** The three portal sigils briefly animate as if "aligning" — rings sync up, flash, and a rune sequence reveals. A field note appears in the corner: `// resonance detected · 3-ring alignment complete`.
- **Unlock:** `[NAVIGATOR]` stamp.
- **Implementation:** ~40 lines. Track hover events on portals, setTimeout reset. CSS animation for the alignment flash.

#### Game 4: Coral Growth Clicker (Skills section)
- **Trigger:** Clicking a skill node 5 times rapidly
- **Game:** A small canvas appears beside the skill constellation with a tiny procedural "coral" growing (Lindenmayer system, ~60 lines). Each click adds a branch. After 20 branches, full growth — `[ECOSYSTEMS ENGINEER]` stamp.
- **Implementation:** Standalone `js/coral-game.js`, loaded lazily (`import()`) only when triggered.

#### Stamp UI
All stamps appear in a `#artifact-stamps` panel (initially hidden, fades in when first stamp earned). Located bottom-left, above the Art Bar. Each stamp is:
```
┌──────────────────┐
│ ◈ BIOLUME        │
│   RESEARCHER     │  ← rotated ±1°, amber border
└──────────────────┘
```
Persisted in localStorage. Visible in both Creative and Pro view (cosmetic only, not distracting).

---

## 4. Roadmap

### QUICK WINS — 1–3 days, CSS + small JS, zero risk

| Item | File(s) | Effort |
|---|---|---|
| Process Logbook Timeline section | `logbook.css`, HTML | 4h |
| Systems/Toolbox section (static) | `systems.css`, HTML | 4h |
| `[PROTOTYPE]` + `[UNSTABLE]` stamps | `imperfections.css` | 1h |
| Sandbox entries in existing RND renderer | inline data block | 1h |
| Fix zone-div labels to full depth metaphor | `index.html` | 30m |
| Pro View: hide logbook details + sandbox on toggle | `modes.js` | 1h |
| Ctrl+K: add new sections to palette | `index.html` | 30m |
| Stamp panel HTML/CSS (no game logic yet) | `stamps.css`, HTML | 2h |

**Total: ~1.5 days**

---

### MID UPGRADES — 1–2 weeks, new JS, case studies

| Item | File(s) | Effort |
|---|---|---|
| Case study data structure + renderer | `artifact-inspect.js` extension | 1d |
| Case study overlay UI (extended modal) | `case-study.css` | 1d |
| Case study content: Maya Pipeline Tools | data block | 3h |
| Case study content: ML Rig Predictor | data block | 3h |
| Case study content: AOI XR | data block | 3h |
| Portal alignment mini-game | `js/games/portal-align.js` | 4h |
| Plankton collector mini-game | `js/games/plankton.js` | 6h |
| Stamp unlock logic + localStorage | `js/stamps.js` | 3h |
| Skills constellation: "used in:" hover expansion | `constellation.js` patch | 2h |
| Ctrl+K: case study commands | `ux-overlays.js` | 1h |
| Sandbox type distinction in rnd.js | `rnd.js` patch | 1h |

**Total: ~8–10 days**

---

### BIG SWINGS — 3–6 weeks, WebGL, full game systems

| Item | File(s) | Effort |
|---|---|---|
| Coral growth L-system clicker | `js/games/coral.js` | 2d |
| Logbook cipher puzzle | `js/games/cipher.js` | 1d |
| Portal Hub: WebGL ring sync on hover | `phase4.js` extension | 3d |
| Portal warp flash on click (Three.js) | `phase4.js` extension | 1d |
| Deeper case study: inline Three.js diagram | per case study | 2d each |
| Section world-states (body class per IntersectionObserver) | `js/world-states.js` | 2d |
| "Creative View" skin-swap (ambient + layout changes) | `js/modes.js` + CSS vars | 3d |
| Ambient generative audio (Tone.js, SFX-gated) | `js/audio-engine.js` | 3d |
| Full mini-game save system + stamp gallery page | `js/stamps.js` extension | 2d |

**Total: 4–6 weeks**

---

## 5. Figma Component List & Export Checklist

### Components to design

**Navigation**
- `ArtBar / Dock` — bottom floating nav, active state, hover lift, stamps badge
- `Depth Rail` — right side pips, active pip, section label tooltip
- `Nav brand` — AB logo + wordmark, hover state

**Cards & Entries**
- `Logbook Card` — collapsed, expanded, active border colors (teal/amber/ghost)
- `Project Card` — grid variant, featured variant, "Deep Dive" button state
- `Case Study Panel` — full overlay, left nav, section headings, code block, diagram block
- `System Entry` — two-column, diagram slot, breakdown text
- `R&D Entry` — badge + hypothesis + finding, artifact links
- `Sandbox Entry` — prototype/unstable stamps, looser format

**Fantasy / Imperfection elements**
- `Field Note` — NOTE / WARNING / SPELL / OBSERVATION variants
- `Stamp` — LIVE / WIP / PROTOTYPE / UNSTABLE / NAVIGATOR / BIOLUME (earned)
- `Rune accent` — ◈ ◉ ⬡ as section openers, in mono, low opacity
- `Zone Divider` — line with centered depth label
- `Section Rule` — animated trace dot
- `Corner brackets` — TL + BR variants, teal/amber/ghost colors

**Portals**
- `Portal Gem` — rest state, hover awaken, all-three-hover alignment flash
- `Portal Choice` — terminal entry card, F/R key variants

**Games / Stamps**
- `Stamp Panel` — hidden, 1-stamp state, full state
- `Earned Stamp` — per artifact (biolume / navigator / cipher / ecosystems)
- `Game trigger note` — field note style, subtle

**Modals**
- `Artifact Inspect` — existing, already built
- `Case Study` — new, richer, left nav + scrollable body

---

### Figma Variables → CSS Token Mapping

```
Figma Variable         → CSS Token
─────────────────────────────────────────────────
color/void             → --c-void: #020810
color/abyss            → --c-abyss: #050e1c
color/trench           → --c-trench: #091828
color/biolume          → --c-biolume: #3dffd0
color/biolume-soft     → --c-biolume-soft: #7ee8d8
color/nebula           → --c-nebula: #9d78f5
color/amber            → --c-amber: #f0a050
color/classified       → #f0c060  (NDA amber)
color/star             → --c-star: #e6f3f8
color/mist             → --c-mist: #87afc4
color/ghost            → --c-ghost: #3e5f72
font/serif             → --font-serif: 'Cormorant Garamond'
font/mono              → --font-mono: 'Fira Code'
font/sans              → --font-sans: 'DM Sans'
radius/default         → --radius: 5px
radius/large           → --radius-lg: 10px
motion/ease            → cubic-bezier(0.16, 1, 0.3, 1)
motion/fast            → 160ms
motion/mid             → 340ms
motion/slow            → 700ms
```

---

### Motion Guidelines

| Element | Duration | Easing | Trigger |
|---|---|---|---|
| Page reveal (scroll) | 700ms | ease-out (0.16,1,0.3,1) | IntersectionObserver |
| Card hover lift | 240ms | ease-out | mouseenter |
| Portal hover awaken | 300ms | ease-out | mouseenter |
| Portal alignment flash | 900ms | ease-in-out | all 3 hovered in sequence |
| Case study modal open | 400ms | ease-out | click |
| Stamp earn animation | 600ms | spring-like (cubic-bezier(0.34,1.56,0.64,1)) | unlock event |
| Terminal typewriter char | 14ms | linear | sequential |
| Section rule dot trace | 4500ms | ease-in-out | page load (loop) |
| Sigil spin (about) | 80s | linear | always (very slow) |
| Game trigger note | 500ms | ease-out | idle/hover trigger |
| Coral branch grow | 200ms | ease-out | click |
| Plankton collect | 300ms | ease-out | click |

**prefers-reduced-motion rules:**
- All CSS animations: `animation: none !important`
- All CSS transitions: reduce to 100ms max (not zero — zero feels broken)
- Three.js animations: cut to static single frame or slow to ≤ 1 rotation per 120s
- Mini-games: disable entirely (show a static "motion reduced" note instead)

---

## 6. Code File Scaffold

```
/ (root)
├── index.html                  ← main, add: logbook + systems sections
├── recruiter.html              ← already exists
├── favicon.svg                 ← AB logo
│
├── css/
│   ├── tokens.css              ← no change
│   ├── base.css                ← no change
│   ├── terminal.css            ← choice dialog already added
│   ├── nav.css                 ← no change
│   ├── hero.css                ← no change
│   ├── artbar.css              ← add stamp badge dot
│   ├── sections.css            ← no change
│   ├── projects.css            ← no change
│   ├── constellation.css       ← add hover expand labels
│   ├── rnd.css                 ← add sandbox stamp styles
│   ├── contact.css             ← no change
│   ├── phase4.css              ← no change
│   ├── fantasy.css             ← add game trigger note style
│   ├── imperfections.css       ← add PROTOTYPE/UNSTABLE stamps
│   ├── ascii.css               ← no change
│   ├── nda.css                 ← no change
│   ├── logbook.css             ← NEW: timeline section
│   ├── systems.css             ← NEW: toolbox section
│   ├── case-study.css          ← NEW: deep dive modal
│   └── stamps.css              ← NEW: stamp panel + earned stamps
│
├── js/
│   ├── terminal.js             ← choice dialog (done)
│   ├── cursor.js               ← no change
│   ├── nav.js                  ← no change
│   ├── parallax.js             ← no change
│   ├── particles.js            ← no change
│   ├── stars.js                ← no change
│   ├── projects.js             ← renderer (no change)
│   ├── rnd.js                  ← patch: sandbox type
│   ├── constellation.js        ← patch: hover expand
│   ├── contact.js              ← no change
│   ├── phase4.js               ← patch: plankton collect, portal sync
│   ├── project-filters.js      ← no change
│   ├── modes.js                ← patch: pro view hides sandbox/logbook details
│   ├── sfx.js                  ← no change
│   ├── ux-overlays.js          ← patch: new Ctrl+K items
│   ├── artifact-inspect.js     ← patch: case study extension
│   ├── reveal.js               ← no change
│   ├── stamps.js               ← NEW: stamp unlock + localStorage + panel
│   └── games/
│       ├── portal-align.js     ← NEW: portal hover sequence game
│       ├── plankton.js         ← NEW: biolume collector
│       ├── coral.js            ← NEW: L-system clicker (lazy loaded)
│       └── cipher.js           ← NEW: CMD-K cipher handler
│
├── assets/
│   ├── resume.pdf
│   └── images/                 ← project images when ready
│
├── NDA_GUIDE.md                ← already exists
└── STYLEGUIDE.md               ← already exists, update with new sections
```

---

## 7. Script Order — Safe Addition Protocol

Current safe order (never change):
```
1. terminal.js, cursor.js
2. nav.js, parallax.js, particles.js, stars.js
3. [inline data: PROJECTS, SKILLS, RND_ENTRIES, CASE_STUDIES, LOGBOOK_ENTRIES]
4. projects.js, rnd.js, constellation.js
5. contact.js, phase4.js, project-filters.js
6. modes.js, sfx.js, ux-overlays.js, artifact-inspect.js
7. stamps.js                          ← NEW, add here
8. reveal.js                          ← always last
```

**Lazy-loaded games (never block main thread):**
```javascript
// Inside portal-align.js trigger:
import('./games/portal-align.js').then(m => m.init());

// Inside coral.js trigger:
import('./games/coral.js').then(m => m.init());
```

These use dynamic `import()` so they only download when the user actually triggers the game.

---

## 8. Recruiter Safety Rules (for every new feature)

Before shipping any new section or game:

1. **Scan test**: Can a recruiter read the page in < 90 seconds without confusion? New sections must have a clear heading, one-liner, and NOT autoplay anything.
2. **Pro View test**: Toggle Pro View. All games must disappear. All logbook details must collapse. All sandbox entries must grey out or compress.
3. **Keyboard test**: Every interactive element (modal, game, stamp) must be reachable and closeable by keyboard alone.
4. **Load test**: No new section should add more than 15KB of CSS/JS to the initial bundle. Games are lazy-loaded only.
5. **Motion test**: Enable `prefers-reduced-motion`. Nothing should animate. Static layout must still communicate the same information.

---

## 9. Framer Motion Decision

**Recommendation: Do not add Framer Motion.** You don't need it.

Your current stack (CSS custom properties + CSS transitions + vanilla JS + Three.js) already achieves everything Framer Motion does for a static site, with zero framework overhead. Framer Motion's real value is in React component trees where mount/unmount animations are complex. You don't have that problem.

If you want spring-physics-feel for stamps and game unlocks specifically, add **`popmotion`** (7KB gzipped, no framework) as a single script:

```html
<script src="https://unpkg.com/popmotion@11/dist/popmotion.global.js"></script>
```

Use it only for the stamp earn animation and portal alignment flash — two moments that benefit from overshoot/spring easing. Everything else stays CSS.

If you ever want to add a React island (e.g. for a complex interactive diagram), wrap it in a single `<div id="react-island-diagram">` and use `ReactDOM.createRoot()` to mount it. It will not affect anything else on the page.

---

## 10. Where to Start Today

In priority order given what you already have:

1. **Fix the logbook section** — add 4–6 real dated entries about your actual build process on the shipped projects. This immediately makes the site feel like a real person's journey, not a gallery. Pure HTML.

2. **Add the Systems/Toolbox section** — two entries (Maya Pipeline Tools breakdown + AOV Manager architecture). The ASCII-style SVG diagrams are distinctive and fast to write.

3. **Write the three case study data entries** — in the inline data block. The modal renderer already exists (artifact-inspect.js); just extend it with richer fields. No new page needed.

4. **Add stamps.css + the panel HTML** — visual design only, no game logic. Show recruiters the stamp panel exists (it signals that the site has hidden depth without requiring them to find the games).

5. **Portal alignment game** — the lowest-effort game (40 lines), most visible, and thematically perfect since portals are the first interactive element recruiters see.
