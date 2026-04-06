# AlyArtBar — Multi-Page Architecture
## "Cosmic Ocean Codex · World-Builder's Field Manual"

*Senior creative technologist review · April 2026*
*Grounded in: current index.html, recruiter.html, 6 project detail pages, 17 CSS files, 17 JS files*

---

## Premise: The Split You Actually Need

Before any URL decisions — you have a real tension to resolve. Right now `index.html` tries to be:
- A creative showcase (WebGL, portals, constellation, fantasy layer)
- A technical portfolio (project cards, filter chips, skills data)
- An R&D notebook (hypothesis/finding format)
- A recruiter one-pager (fast scan, contact form)

That tension is good. The answer is not to collapse it into one mode or scatter it across 12 URLs. The answer is **two roots and one shared world**:

```
alyartbar.github.io/           ← WORLD HUB (creative, maximal, the experience)
alyartbar.github.io/portfolio  ← PORTFOLIO ROOT (recruiter.html, already exists)
```

Everything else is a satellite of the hub. Not separate apps — satellite pages that feel like going deeper into the same world.

---

## 1. Recommended Sitemap

```
/                           index.html — Master Hub
│                           Terminal boot → portal choice → full experience
│                           All current sections remain here
│
├── /portfolio              recruiter.html — already exists
│                           Fast, no WebGL, ATS-safe, NDA vault
│
├── /projects               projects/index.html
│                           Full artifact catalog with filters
│                           All 6 real projects + future additions
│                           Links out to case study pages
│
├── /projects/maya-pipeline-tools       → pipeline-tools.html (already exists)
├── /projects/ml-rig-predictor          → MLrigPredictor.html (already exists)
├── /projects/aoi-xr                    → aoi-xr.html (already exists)
├── /projects/raytracer                 → raytracer.html (already exists)
├── /projects/aov-manager              → Aov-manager-docs.html (already exists)
├── /projects/shifting-interface       → Shifting-interface-docs.html (already exists)
│
├── /lab                    lab/index.html
│                           R&D + Experiments Sandbox unified
│                           Research booklet UI (binder aesthetic)
│                           Links to individual experiment logs
│
├── /systems                systems/index.html
│                           Pipeline diagrams + tool architecture breakdowns
│                           ASCII diagram blocks + SVG flowcharts
│
├── /about                  about/index.html
│                           Logbook / Timeline / Background
│                           Story of how you got here
│
├── /games                  games/index.html (Big Swing, build later)
│                           Easter egg stamp gallery
│                           Mini-game entry points
│
└── /contact                (optional) redirect to index.html#contact
                            Contact form + comms terminal aesthetic
```

**GitHub Pages routing note:** All routes are real files or folders with index.html. No SPA router needed. Folder structure:
```
/projects/index.html        (catalog)
/projects/pipeline-tools/index.html  OR  keep flat: pipeline-tools.html at root
/lab/index.html
/systems/index.html
/about/index.html
```

Flat is fine for GitHub Pages. Use `/projects/index.html` style only if you want clean URLs without `.html`. For now, flat files at root work perfectly — `pipeline-tools.html`, `recruiter.html` etc. Move to folders only when there are 10+ project pages.

---

## 2. What Stays on the Hub vs What Moves

### Stays on `index.html` (the Hub)
Everything currently there stays. The Hub is the experience.
- Terminal boot + portal choice dialog
- WebGL world + depth rail + Art Bar
- Hero with portals + name + tagline
- About summary (2–3 paragraphs, not the full timeline)
- Projects section (featured only — 2–3 cards, "See all →" to /projects)
- Skills constellation
- R&D teaser (3 entries, "Enter the Lab →" to /lab)
- NDA vault
- Contact form

### Moves to satellite pages
- Full project catalog → `/projects`
- Full timeline / background story → `/about`
- Full R&D + experiments → `/lab`
- Pipeline architecture diagrams → `/systems`
- Recruiter mode → `/portfolio` (already built)

**The hub shows teasers. The satellites show depth.**

---

## 3. Two Modes Across the Whole Site

### Mode A: World Mode (default on hub)
- WebGL active, ocean→cosmos visible
- Portal gems animated, sparks, rings
- Fantasy layer: field notes, stamps, runes, scanlines
- Custom cursor
- Art Bar dock + depth rail
- Terminal boot on first visit
- SFX available (off by default)

### Mode B: Portfolio Mode (default on recruiter.html)
- No WebGL
- No custom cursor
- Simplified nav bar only (no Art Bar, no depth rail)
- Clean white background
- All content readable without interaction
- NDA vault present but understated
- Same data, different presentation

**Pro View toggle** (already in `modes.js`) is a *softened World Mode* — not Portfolio Mode. It reduces WebGL opacity, hides grain/scanlines, collapses fantasy layer, but keeps the dark theme and Art Bar. Think: "I'm at work and my manager is watching."

**The Portfolio route is Portfolio Mode by default, always.** Recruiter gets there via the terminal choice dialog `[R]`.

**Implementation:** Both modes already exist. The missing piece is that `modes.js` needs one more key: `aly_world_engine` — a separate toggle from pro view, controlling only the WebGL canvas visibility. This lets someone kill Three.js on low-end devices without entering Pro View.

---

## 4. Page-by-Page Specs

### 4A · `/` — Master Hub (index.html)
**Purpose:** The experience. Communicates range, voice, world-building craft, and technical ambition simultaneously.

**Layout:** Current layout, no change. Hub structure remains.

**Unique interactions:** Terminal boot, portal choice, WebGL scroll parallax, constellation, NDA vault, mini-games (future).

**Assets to prepare:** None blocking. Images for project cards when ready.

**Hub change needed:** Truncate sections to teasers:
- Projects section: show only 2 featured cards, add a `[→ Full Catalog]` link styled as a field-note callout
- R&D section: show only 2 entries, add `[→ Enter the Lab]`
- About section: keep current 3 paragraphs, add a small `logbook-entry` block with 1–2 dated ship-log lines as a preview of `/about`

---

### 4B · `/portfolio` — Portfolio Mode (recruiter.html)
**Purpose:** A recruiter opens this URL. In 60 seconds they understand: what you build, what you've shipped, how to contact you. No distractions.

**Layout:** Already built. White/light bg, sticky nav, semantic HTML. Current structure is correct.

**Unique interactions:** NDA vault (password gate, already built). Nothing else interactive.

**Missing pieces:**
- The "Working Style" section needs real content (it has placeholder philosophy text — good, keep it)
- Add 1–2 real impact numbers per project wherever you have them
- The NDA vault redundancy has been fixed (previous session)

**Assets needed:** Impact metrics (line counts, iteration time reductions, test pass rates — you have these in project docs).

---

### 4C · `/projects` — Artifact Catalog

**Purpose:** "Here is everything I've shipped." Filterable, browsable, linkable. A recruiter can share a direct link to this page.

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│  // ARTIFACT CATALOG                                │
│  "Things built. Problems solved."                   │
├────────────┬────────────────────────────────────────┤
│ FILTERS    │  [Pipeline] [ML] [Graphics] [Creative] │
│            │                                        │
│ SORT       │  [Newest] [Category] [Language]        │
├────────────┴────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ Maya Pipeline│ │ ML Predictor │ │  Shifting    │ │
│  │ Tools        │ │              │ │  Interface   │ │
│  │ ─────────── │ │ ─────────── │ │ ─────────── │ │
│  │ Python · USD │ │ Python · RF  │ │ CSS · JS    │ │
│  │ [Docs] [Git] │ │ [Docs] [Git] │ │ [Live] [Doc]│ │
│  └──────────────┘ └──────────────┘ └──────────────┘ │
│                                                     │
│  [Load More / Show All]                             │
└─────────────────────────────────────────────────────┘
```

**Dark theme** (matches hub). Subtle WebGL background at 15% opacity (World Engine if enabled). Art Bar present. Depth rail hidden on this page (no scroll depth narrative needed — it's a catalog grid).

**Unique interactions:**
- Filter chips (same logic as current `project-filters.js` — reuse it)
- Click card → goes to existing project detail page (pipeline-tools.html etc.)
- Hover card → corner bracket expand (already in `fantasy.css`)
- "Case Study" badge on 3 flagship projects — clicking opens `/projects/maya-pipeline-tools` directly

**Implementation:** New `projects/index.html`. Data loaded from same inline `PROJECTS` var (copy from hub, or load via `<script src="../js/data.js">` — see Section 6).

---

### 4D · `/lab` — Research Booklet

**Purpose:** "Here is how I think about hard problems." Shows intellectual rigour, honest documentation of process, willingness to publish failures.

**Layout:** Binder / research notebook aesthetic. Tab navigation at top:

```
┌────────────────────────────────────────────────────┐
│  R&D LAB  ·  log-04 · abyss · 4000m               │
│  ┌──────────┬──────────┬──────────┬──────────────┐ │
│  │ ALL      │ LIVE     │ WIP      │ EXPERIMENTS  │ │
│  └──────────┴──────────┴──────────┴──────────────┘ │
│                                                    │
│  ── ENTRY 01 ─────────────────────────────────── │
│  ● LIVE  ·  Maya Pipeline Tools                   │
│  HYPOTHESIS: ...                                  │
│  FINDING: ...                                     │
│  [GitHub ↗]  [Docs ↗]                            │
│                                                   │
│  ── ENTRY 02 ─────────────────────────────────── │
│  ○ WIP  ·  Raytracer Dev                          │
│  ...                                              │
└────────────────────────────────────────────────────┘
```

**Visual distinction:** Left margin rule (notebook paper lines, already in `fantasy.css` for `.section-rnd`). Tab nav uses `<button role="tab">` for accessibility. The three `[PROTOTYPE]` / `[UNSTABLE]` sandbox entries appear under "Experiments" tab — visually distinct with amber/red stamps.

**Unique interactions:**
- Tab switching (pure CSS `details` or minimal JS toggle)
- Inline artifact links open project detail pages
- Hypothesis/finding expandable — collapsed to one-liner by default, full text on hover/click
- Faint nebula background (CSS only, radial-gradient, no Three.js needed)

**Implementation:** New `lab/index.html`. Reuses `RND_ENTRIES` data structure directly.

---

### 4E · `/systems` — Toolbox / Pipeline Architecture

**Purpose:** "Here is how I think about system design." Shows pipeline engineering mindset. Not what I made — *how* I approach building infrastructure.

**Layout:** Two-column alternating: text breakdown left, ASCII/SVG diagram right.

```
┌─────────────────────────────────────────────────────┐
│  SYSTEMS LOG  ·  Pipeline thinking                  │
│                                                     │
│  MAYA PIPELINE TOOLS                                │
│  Problem → Approach → Result                        │
│                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │ VALIDATE │───▶│ PUBLISH  │───▶│ VERSION  │      │
│  │ geo      │    │ copy+USD │    │ Git tag  │      │
│  │ naming   │    │ manifest │    │ semver   │      │
│  └──────────┘    └──────────┘    └──────────┘      │
│  Tools: Python · Maya API · OpenUSD · PySide2       │
│  Impact: one-click validate → publish → tag         │
│                                                     │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                                     │
│  AOV MANAGER                                        │
│  ...                                                │
└─────────────────────────────────────────────────────┘
```

Diagrams are inline SVGs — monochrome teal strokes, `font-family: var(--font-mono)`. No images. Fast, scalable, printable.

**Unique interactions:** Hover over a diagram node → highlights the corresponding tool chip below. Pure CSS `:hover` on `.diagram-node` + adjacent sibling selector.

**Implementation:** `systems/index.html`. Fully static HTML + CSS. No JS needed except `modes.js` for Pro View.

---

### 4F · `/about` — Logbook / Timeline

**Purpose:** "Here is who I am and how I got here." Shows growth arc, not just skills. Makes you feel like a person, not a credentials list.

**Layout:** Ship's logbook. Left margin with vertical timeline spine. Entries alternate sides.

```
┌─────────────────────────────────────────────────────┐
│  LOGBOOK  ·  Alyssa Barrientos                      │
│  "I build systems for worlds."                      │
│                                                     │
│  2024-Q3 ──────────────────────────────────────── │
│  │  ⬡ Maya Pipeline Tools shipped                  │
│  │  First time I built something that removed      │
│  │  manual steps for other people. That changed    │
│  │  what I wanted to do.                           │
│  │                                                 │
│  2024-Q1 ──────────────────────────────────────── │
│  │  ◈ AOI XR · capstone · cross-platform AR       │
│  │  Learned: Unity's URP has AR-specific failure  │
│  │  modes you can't find in any tutorial.          │
│  │                                                 │
│  2023-Q4 ──────────────────────────────────────── │
│  │  ○ Raytracer Dev · 6 assignments · C++          │
│  │  Built a cloth sim from first principles.       │
│  │  ODE integrators are beautiful.                 │
└─────────────────────────────────────────────────────┘
```

Entries use `<details>` for expand/collapse. Collapsed = date + title + one sentence. Expanded = full reflection.

**At top:** Brief statement of who you are + current status badge (already built pattern from recruiter.html).

**Unique interactions:** Timeline entries use `<details>` (zero JS needed). On the side, a small "currently exploring" panel shows 2–3 active interests. The About section on the hub links here with "→ Full Logbook".

**Assets to prepare:** 6–8 dated log entries (real reflection on your real projects — not marketing copy, actual thoughts on what you learned).

---

### 4G · `/games` — Stamp Gallery (Big Swing, build later)

**Purpose:** "There are things hidden in this site. Here's what you found." Easter egg meta-layer.

**Layout:** Dark, grid of earned artifact stamps. Unearned stamps show as redacted placeholders. Instructions disguised as field notes.

Do not build this until at least 2 mini-games are functional.

---

## 5. Navigation Spec Across Pages

### Top Nav — appears on all pages, adapts per page

```
ALL PAGES:
  [AB logo] AlyArtBar    About  Projects  Lab  Systems  Portfolio↗    [Vault ◈]  [Resume ↗]

HUB (index.html):
  Same as above. Nav links scroll within page OR navigate out.
  "Projects" → #projects (within page, teaser)
  "Lab" → /lab (out to satellite)

SATELLITE PAGES (/projects, /lab, /about, /systems):
  Add breadcrumb under brand: AlyArtBar › Projects
  "Projects" → active state, no scroll jump
  Add "← Hub" link on mobile collapsed nav

PORTFOLIO (/portfolio = recruiter.html):
  Simplified nav: no Vault link, no fancy hover states
  "← Full Site" link where Vault was
```

**Implementation:** `nav.css` already handles this. Add `data-page="hub|satellite|portfolio"` attribute to `<body>`. Nav CSS uses `body[data-page="portfolio"] .nav-nda { display: none; }`.

---

### Art Bar Dock — hub + satellites only, never portfolio

The Art Bar currently has: Projects | Lab | Map | Log | Vault | Comms + Pro View | SFX | Ctrl K

**Multi-page Art Bar:**
```
HUB:
  ⬡ Projects → #projects (within page)
  🧪 Lab → /lab
  ✶ Skills → #skills (within page)
  📜 About → /about
  🔒 Vault → #nda
  📡 Contact → #contact
  [Pro View] [SFX] [Ctrl K]

/projects:
  ← Hub → /
  🧪 Lab → /lab
  📜 About → /about
  🔒 Vault → / (hub has vault)
  📡 Contact → /#contact
  [Pro View] [SFX] [Ctrl K]

/lab:
  ← Hub → /
  ⬡ Projects → /projects
  📜 About → /about
  [Pro View] [SFX] [Ctrl K]
```

**Implementation:** Each page includes `js/artbar.js` (new file, splits artbar logic from ux-overlays.js). The artbar HTML is templated per page — not a shared include (GitHub Pages is static, no server-side includes). Each page's artbar has the correct `href` values hardcoded.

---

### Depth Rail — hub only

The right-side depth rail (Surface → Core) is specific to the hub's vertical scroll narrative. On satellite pages it is **hidden** — satellites have their own section navigation (tab bars for /lab, filter chips for /projects, timeline sidebar for /about).

`phase4.js` already hides the depth indicator at `<900px`. Add: `body[data-page="satellite"] .depth-indicator { display: none !important; }`.

---

### Ctrl+K (Command Palette) — hub + satellites

The command palette is a global navigation tool. On satellite pages, include the same `ux-overlays.js` but seed it with that page's available commands.

Pattern: each page defines `window.PAGE_COMMANDS` before `ux-overlays.js` loads. The overlay reads this list and falls back to a default set if undefined.

```javascript
// On /projects/index.html, before ux-overlays.js:
window.PAGE_COMMANDS = [
  { label: 'Filter: Pipeline', action: () => setFilter('pipeline') },
  { label: 'Filter: ML', action: () => setFilter('ml') },
  { label: 'Open Hub', action: () => location.href = '/' },
  { label: 'Open Lab', action: () => location.href = '/lab' },
];
```

---

## 6. Technical Implementation Plan

### 6A · Shared CSS Pattern

All pages share a **core bundle** (5 files, loaded in order):
```html
<!-- Every page: -->
<link rel="stylesheet" href="/css/tokens.css" />
<link rel="stylesheet" href="/css/base.css" />
<link rel="stylesheet" href="/css/nav.css" />
<link rel="stylesheet" href="/css/artbar.css" />
<link rel="stylesheet" href="/css/fantasy.css" />
```

Then page-specific CSS:
```html
<!-- Hub only: -->
<link rel="stylesheet" href="/css/terminal.css" />
<link rel="stylesheet" href="/css/hero.css" />
<link rel="stylesheet" href="/css/sections.css" />
<!-- ... all current CSS ... -->

<!-- /projects only: -->
<link rel="stylesheet" href="/css/catalog.css" />    <!-- NEW -->

<!-- /lab only: -->
<link rel="stylesheet" href="/css/lab.css" />        <!-- NEW -->

<!-- /about only: -->
<link rel="stylesheet" href="/css/logbook.css" />    <!-- NEW -->

<!-- /systems only: -->
<link rel="stylesheet" href="/css/systems.css" />    <!-- NEW -->
```

**CSS paths:** Use absolute paths from root (`/css/tokens.css`) so they work regardless of folder nesting. This is the only change needed for GitHub Pages — relative paths break in subfolders.

---

### 6B · Shared JS Pattern

Shared JS (every page):
```html
<!-- Every non-portfolio page: -->
<script src="/js/modes.js"></script>     <!-- Pro View, ASCII, SFX, World Engine -->
<script src="/js/nav.js"></script>       <!-- Scrolled class, mobile burger -->
<script src="/js/sfx.js"></script>       <!-- SFX manager -->
<script src="/js/ux-overlays.js"></script> <!-- Ctrl+K, artbar toggles -->
```

Hub-only JS (index.html only):
```html
<script src="/js/terminal.js"></script>
<script src="/js/cursor.js"></script>
<script src="/js/parallax.js"></script>
<script src="/js/particles.js"></script>
<script src="/js/stars.js"></script>
<script src="/js/phase4.js"></script>    <!-- WebGL world -->
```

Satellite-page optional JS:
```html
<!-- /projects: -->
<script src="/js/project-filters.js"></script>

<!-- /lab: -->
<script src="/js/rnd.js"></script>   <!-- reuse rnd renderer -->
```

---

### 6C · Data Strategy — How to Share PROJECTS/SKILLS/RND_ENTRIES

**Current problem:** Data is inlined in `index.html` as `var` globals. Satellite pages need the same data without copy-pasting.

**Solution: `js/data.js` — a separate data file**

```javascript
// js/data.js — single source of truth for all project/skill/rnd data
var PROJECTS = [ ... ];
var SKILLS   = [ ... ];
var RND_ENTRIES = [ ... ];
```

Load order rule (unchanged): `data.js` must load before any renderer.

```html
<!-- Every page that needs data: -->
<script src="/js/data.js"></script>         <!-- data globals -->
<script src="/js/projects.js"></script>     <!-- renderer (if needed) -->
<script src="/js/rnd.js"></script>          <!-- renderer (if needed) -->
<script src="/js/reveal.js"></script>       <!-- ALWAYS LAST -->
```

**Migration:** Extract the inline data block from `index.html` into `js/data.js`. The inline `<script>` block in `index.html` becomes just `<script src="/js/data.js"></script>`.

This is the single most important structural change in the whole plan. It unblocks every satellite page.

---

### 6D · Global Toggles Across Pages

`modes.js` already uses `localStorage` — this means all toggles (Pro View, SFX, ASCII, Scanlines) persist automatically across pages. No change needed.

**New toggle: World Engine**

Add to `modes.js`:
```javascript
var KEYS = {
  ascii:'aly_ascii', scanlines:'aly_scanlines',
  sfx:'aly_sfx', pro:'aly_pro_view',
  world:'aly_world_engine'   // ← NEW
};
```

`World Engine` controls only the WebGL canvas opacity. When off: `#webgl-canvas { display: none; }`. This is separate from Pro View — a user can be in Creative Mode but still disable Three.js on a slow machine.

The Art Bar gets a new toggle button: `[World]` alongside `[Pro View] [SFX]`.

**On satellite pages:** `phase4.js` is not loaded — the World Engine toggle simply has no effect. `modes.js` still runs and sets the class on body, but there's no canvas to show.

---

### 6E · WebGL Visibility Fix

The WebGL canvas (`#webgl-canvas`) is currently `opacity: 0` by default, becoming visible only after the terminal dismisses. Two problems:
1. It fades completely in the lower sections (opacity drops as user scrolls away from hero)
2. It's not visible on satellite pages at all

**Fix for hub:** `phase4.js` scroll handler should keep canvas at minimum `0.12` opacity after initial activate, not fade to zero. Change:

```javascript
// Current (drops to near-zero at bottom):
canvas.style.opacity = Math.max(0, 1 - scrollFraction) * 0.92;

// Fixed (maintain minimum ambient glow):
var ambient = 0.12;
var peak    = 0.88;
canvas.style.opacity = ambient + (peak - ambient) * Math.max(0, 1 - scrollFraction * 1.4);
```

**Fix for satellite pages (optional ambient):** Add a lightweight `bg-ambient.js` (not phase4.js) that creates a simple static radial gradient or a very low-framerate Three.js scene (just the starfield, no ocean, no particles). Load only when `aly_world_engine` is enabled and `window.WebGLRenderingContext` exists.

Graceful degradation: if WebGL fails or World Engine is off, satellite pages use CSS-only backgrounds — the existing dark `--c-void` background with the subtle grain overlay from `imperfections.css`. It looks deliberate, not broken.

---

### 6F · GitHub Pages Routing

GitHub Pages serves static files only. No server-side routing. This means:

**Do:** Use real files/folders.
```
/index.html
/portfolio → /recruiter.html (or /portfolio/index.html)
/projects/index.html
/lab/index.html
/about/index.html
/systems/index.html
```

**Do not:** Use hash routing for multi-page (SPA pattern). Your site already works correctly — you're adding pages, not routes.

**404 handling:** Create `/404.html` that matches your site aesthetics and links back to hub. GitHub Pages serves this automatically on unknown URLs.

```html
<!-- 404.html: a terminal-style error page -->
> ERROR: depth-coordinate not found
> route: [requested URL]
> returning to surface layer...
> [← Return to Hub]
```

**Absolute vs relative paths:** When satellite pages are in subfolders (`/projects/index.html`), use absolute paths for all shared assets: `/css/tokens.css` not `../css/tokens.css`. Absolute paths work everywhere on your domain.

---

### 6G · Folder Structure

```
/ (repo root)
│
├── index.html                   Hub
├── recruiter.html               Portfolio mode (flat, keep as-is)
├── 404.html                     NEW: branded error page
│
├── css/
│   ├── tokens.css               Design tokens (shared)
│   ├── base.css                 Reset + body (shared)
│   ├── nav.css                  Nav (shared)
│   ├── artbar.css               Art Bar dock (shared)
│   ├── fantasy.css              Fantasy layer (shared)
│   ├── imperfections.css        Grain, stamps (shared)
│   ├── ascii.css                ASCII mode (shared)
│   ├── modes.css                NEW: Pro View / World Engine classes
│   ├── terminal.css             Hub only
│   ├── hero.css                 Hub only
│   ├── sections.css             Hub only
│   ├── projects.css             Hub + /projects
│   ├── constellation.css        Hub only
│   ├── rnd.css                  Hub + /lab
│   ├── contact.css              Hub only
│   ├── phase4.css               Hub only (depth rail, WebGL)
│   ├── nda.css                  Hub only
│   ├── catalog.css              NEW: /projects page
│   ├── lab.css                  NEW: /lab page
│   ├── logbook.css              NEW: /about page
│   └── systems.css              NEW: /systems page
│
├── js/
│   ├── data.js                  NEW: PROJECTS, SKILLS, RND_ENTRIES (extracted)
│   ├── modes.js                 Shared (Pro, SFX, ASCII, World Engine)
│   ├── nav.js                   Shared
│   ├── sfx.js                   Shared
│   ├── ux-overlays.js           Shared (Ctrl+K + artbar toggles)
│   ├── reveal.js                Shared (ALWAYS LAST)
│   ├── terminal.js              Hub only
│   ├── cursor.js                Hub only
│   ├── parallax.js              Hub only
│   ├── particles.js             Hub only
│   ├── stars.js                 Hub only
│   ├── phase4.js                Hub only
│   ├── projects.js              Hub + /projects
│   ├── rnd.js                   Hub + /lab
│   ├── constellation.js         Hub only
│   ├── contact.js               Hub only
│   ├── project-filters.js       Hub + /projects
│   ├── artifact-inspect.js      Hub + /projects
│   ├── stamps.js                NEW: stamp system (future)
│   └── games/                   NEW: game files (future, lazy-loaded)
│       ├── portal-align.js
│       ├── plankton.js
│       └── coral.js
│
├── projects/
│   └── index.html               Artifact catalog
│
├── lab/
│   └── index.html               R&D booklet
│
├── about/
│   └── index.html               Logbook / Timeline
│
├── systems/
│   └── index.html               Pipeline diagrams
│
├── assets/
│   ├── resume.pdf
│   └── images/
│
├── pipeline-tools.html          Existing project detail (keep flat)
├── MLrigPredictor.html          Existing
├── aoi-xr.html                  Existing
├── raytracer.html               Existing
├── Aov-manager-docs.html        Existing
├── Shifting-interface-docs.html Existing
├── favicon.svg
├── NDA_GUIDE.md
├── STYLEGUIDE.md
└── EXPANSION_PLAN.md
```

---

## 7. Staged Roadmap

### QUICK WINS — 1–3 days, no new pages yet

| Task | What | Risk |
|---|---|---|
| Extract `data.js` | Move PROJECTS/SKILLS/RND_ENTRIES out of index.html inline script | Low — just extraction, no logic change |
| Add `World Engine` to modes.js | New localStorage key + body class + Art Bar toggle | Low |
| Fix WebGL minimum opacity | 2-line change in phase4.js scroll handler | Low |
| Add `data-page` body attributes | `<body data-page="hub">` on index, `data-page="satellite"` on others | Zero |
| Add 404.html | Terminal-style error page | Zero |
| Update existing project detail pages | Add shared nav.css + artbar snippet to pipeline-tools.html etc. | Low |
| Add absolute CSS paths to recruiter.html | Prep for subfolder structure | Zero |

**Total: ~1 day**

---

### MID UPGRADES — 1–2 weeks, first satellite pages

| Task | What | Days |
|---|---|---|
| `/projects/index.html` | Artifact catalog with filters, reuses project-filters.js + data.js | 2 |
| `/lab/index.html` | R&D booklet with tab nav, reuses rnd.js + data.js | 1.5 |
| `/about/index.html` | Logbook timeline with real dated entries (content-heavy) | 2 |
| `/systems/index.html` | Pipeline diagrams — static HTML + inline SVGs | 2 |
| Shared nav HTML snippet | Copy-paste nav block across pages, update active states | 0.5 |
| Shared artbar per-page customisation | Per-page artbar hrefs, modes.js shared | 0.5 |
| Page-specific Ctrl+K commands | `window.PAGE_COMMANDS` per satellite | 0.5 |

**Total: ~9 days**

---

### BIG SWINGS — 3–6 weeks

| Task | What | Weeks |
|---|---|---|
| `/games/index.html` + 2 mini-games | Stamp gallery + portal align + plankton collector | 2 |
| Lightweight ambient WebGL for satellites | `bg-ambient.js` — starfield only, lazy-loaded | 1 |
| Case study overlay system | Extended artifact-inspect.js with case study data | 1.5 |
| Deep Ctrl+K: cross-page search | Search across PROJECTS + RND_ENTRIES + logbook | 1 |
| Spline/Rive portal animation | Replace CSS portal gems with Rive file (optional island) | 1 |
| Full Pro View skin | Separate CSS file swapped on `body.pro-view` | 1 |

---

## 8. Navigation Logic Summary Table

| UI Element | Hub (/) | /projects | /lab | /about | /systems | /portfolio |
|---|---|---|---|---|---|---|
| Top nav | ✅ All links | ✅ + breadcrumb | ✅ + breadcrumb | ✅ + breadcrumb | ✅ + breadcrumb | ✅ Simplified |
| Art Bar | ✅ Full | ✅ No depth | ✅ No depth | ✅ No depth | ✅ No depth | ❌ Hidden |
| Depth rail | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Terminal boot | ✅ First visit | ❌ | ❌ | ❌ | ❌ | ❌ |
| Custom cursor | ✅ | Optional | Optional | Optional | Optional | ❌ |
| WebGL bg | ✅ Full | 🌑 Ambient | 🌑 Ambient | 🌑 Ambient | 🌑 Ambient | ❌ |
| Pro View toggle | ✅ | ✅ | ✅ | ✅ | ✅ | N/A (always pro) |
| World Engine | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| NDA Vault | ✅ In page | Link → hub | Link → hub | ❌ | ❌ | ✅ Inline |
| Ctrl+K | ✅ Full | ✅ Page cmds | ✅ Page cmds | ✅ Page cmds | ✅ Page cmds | ❌ |

---

## 9. First Three Actions (In Order)

**1. Extract `data.js`** — do this first. Every satellite page is blocked until data is portable. It takes 30 minutes and the risk is near-zero (extract, test, deploy). This is the unlock for everything else.

**2. Build `/projects/index.html`** — this is the highest-value satellite. Recruiters can link directly to it. It reuses `project-filters.js` exactly as-is. The data loads from `data.js`. The filter chips already work. You just need the page shell and catalog card styles.

**3. Write 6 logbook entries for `/about`** — content-only, no code. Date them, make them honest, write one per real project. Once written, the `/about` page is 90% of the way there because the layout is straightforward HTML. The logbook entries are the hardest part of that page and they need your voice, not code.
