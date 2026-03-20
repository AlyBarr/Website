/* ═══════════════════════════════════════════════════════
   data/projects.js - PROJECTS CONTENT
   Editing this file will update the website's projects.
   
   featured: true  → large alternating row (max 2–3)
   featured: false → smaller grid card
   image: ""       → shows placeholder until image added
   image: "assets/images/filename.jpg" → example image
═══════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════
   data/projects.js
   Variable names must match main.js exactly:
     - PROJECTS       (array)
     - RND_ENTRIES    (array, uses "artifacts" not "links")
═══════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    id: "maya-pipeline-tools",
    featured: true,
    category: "Pipeline & Tools",
    title: "Maya Pipeline Tools",
    oneliner: "Production-grade Scene Validator and Asset Publisher for Maya - built to mirror studio TD conventions.",
    bullets: [
      "Scene Validator: checks geometry, naming, transforms, materials, and scene units with a threaded PySide2 UI that never freezes",
      "Asset Publisher: copies files to a versioned directory, writes a JSON manifest, exports a USD stub, and commits a semantic Git version tag",
      "Graceful degradation - runs in demo mode without Maya, and falls back to a plain-text USD stub if usd-core is missing"
    ],
    tools: ["Python", "Maya API", "PySide2", "OpenUSD", "Git"],
    //image: "",
    imageAlt: "Maya Pipeline Tools",
    links: [
      { label: "GitHub", url: "https://github.com/AlyBarr/AssetMayaTooling" },
      { label: "Docs",   url: "pipeline-tools.html" }
    ]
  },
    {
      id: "ml-rig-predictor",
      featured: true,
      category: "Machine Learning · Virtual Production",
      title: "Virtual Prod ML Rig Predictor",
      oneliner: "Two-model Random Forest system that classifies 18 human motion actions from 3D skeletal joint data - built for virtual production rigs.",
      bullets: [
        "Model 1: full 4,998-dimensional feature pipeline (StandardScaler → Random Forest, 300 trees) for maximum accuracy",
        "Model 2: PCA-compressed pipeline (100 components) for faster inference in latency-sensitive live VP environments",
        "Root-space normalization, temporal resampling to 60 frames, and velocity features extracted from KARD dataset"
      ],
      tools: ["Python", "Scikit-learn", "Random Forest", "PCA", "NumPy", "Pandas", "Matplotlib"],
      //image: "",
      imageAlt: "ML Rig Predictor - skeletal action classification",
      links: [
        { label: "GitHub", url: "https://github.com/AlyBarr/VirtualProdMLPredict"},
        { label: "Docs",   url: "MLrigPredictor.html"}
      ]
    },
    {
      id: "aoi-xr",
      featured: false,
      category: "Augmented Reality · Unity · AI",
      title: "Augmented Object Intelligence XR",
      oneliner: "Mobile AR capstone that anchors AI-generated context directly onto physical objects in 3D space — point your camera at anything and an LLM explains it back to you.",
      bullets: [
        "Four-stage pipeline: AR Foundation camera capture → MediaPipe on-device object detection → LLM REST query (PaLI / LLaMA) → world-space anchor rendered by AR Foundation",
        "Cross-platform Unity 2022.3 build targeting ARKit (iOS 12+), ARCore (Android 8+), and Meta Quest 3 via a single C# codebase using AR Foundation's subsystem abstraction",
        "Sprint 4 pivot: LLM-generated AR scavenger hunt with tap-to-detect input, surface-placed AR markers, session lifecycle, and 100% CI pass rate across 31 test cases"
      ],
      tools: ["Unity 2022.3", "C# / URP", "AR Foundation", "ARKit", "ARCore", "MediaPipe", "LLM API (REST)", "GitHub Actions", "Xcode", "Meta Quest 3"],
      //image: "",
      imageAlt: "AOI XR - AR object intelligence with spatial anchors",
      links: [
        { label: "GitHub", url: "https://github.com/bautista-aa/Augmented-Object-Intelligence-with-XR-Objects" },
        { label: "Docs",   url: "aoi-xr.html" }
      ]
    },
    {
      id: "raytracer-dev",
      featured: false,
      category: "Graphics Programming · C++",
      title: "Raytracer Dev — OpenGL Graphics Engine",
      oneliner: "A C++ graphics pipeline built from scratch across six assignments — Phong shading, OBJ import, parametric curves, skeletal animation, and real-time cloth physics with four interchangeable ODE integrators.",
      bullets: [
        "Raw OpenGL 3.3 Core throughout — manual VAO/VBO/EBO setup, GLSL shaders, MVP matrix stack, Phong lighting with normal-matrix correction",
        "Bezier and B-Spline curves via Bernstein basis evaluation, Frenet-Serret frame computation, and surface-of-revolution mesh generation",
        "Generic ODE physics framework: pure-virtual evalF(state) drives pendulum, chain, and NxN cloth simulations through ForwardEuler, Trapezoid, Midpoint, and RK4 integrators swappable at runtime"
      ],
      tools: ["C++17", "OpenGL 3.3", "GLSL", "GLM", "GLFW", "GLAD", "Dear ImGui", "OBJ Parser"],
      //image: "",
      imageAlt: "Raytracer Dev - C++ OpenGL graphics engine with cloth simulation",
      links: [
        { label: "GitHub", url: "https://github.com/AlyBarr/RaytracerDev" },
        { label: "Docs",   url: "raytracer.html" }
      ]
    },
   {
     id: "shifting-interface",
     featured: true,
     category: "Creative Technology · AI Systems",
     title: "Shifting Interface — AI-Driven Visual State System",
     oneliner: "An interactive visual system where structured AI state data shapes atmosphere, motion, composition, and interaction in real time — treating the model as a behavioral engine rather than a text generator.",
     bullets: [
       "State machine pattern translates AI JSON output into live CSS custom properties — two variables cascade simultaneously through eight composited visual layers via color-mix(), screen blend mode, and radial gradients",
       "Parallax depth system with per-fragment data-depth coefficients and AI-governed energy scaling; GPU-composited translate3d transforms keep motion off the main thread entirely",
       "Echo transition layer spawns ghost clones of outgoing fragment geometry on each state shift, with animationend cleanup and CSS keyframe after-image fade"
     ],
     tools: ["HTML5", "CSS Custom Properties", "Vanilla JS", "State Machine", "mix-blend-mode", "IntersectionObserver"],
     //image: "",
     imageAlt: "Shifting Interface - AI-driven visual state system with layered atmospheric composition",
     links: [
       { label: "Live",  url: "https://alybarr.github.io/shifting_interface/" },
       { label: "Docs",  url: "Shifting-interface-docs.html" }
     ]
   },
  /* ═══════════════════════════════════════════════════════
  {
    id: "proc-terrain",
    featured: true,
    category: "Procedural Systems",
    title: "Procedural Terrain Generator",
    oneliner: "A Houdini HDA for generating layered, art-directable terrain with biome masking.",
    bullets: [
      "Designed node graph with exposed parameters for art direction without breaking procedural rules",
      "Implemented multi-layer noise blending with custom VEX wrangles for erosion simulation",
      "Packaged as an HDA for pipeline integration with LOD-aware output for game engine export"
    ],
    tools: ["Houdini", "VEX", "Python", "Unreal Engine"],
    image: "",
    imageAlt: "Procedural Terrain Generator",
    links: [
      { label: "GitHub", url: "#" },
      { label: "Video",  url: "#" }
    ]
  },
  {
    id: "shader-studies",
    featured: false,
    category: "Rendering",
    title: "GLSL Shader Studies",
    oneliner: "Real-time shader experiments: procedural noise, SDF rendering, and stylization.",
    bullets: [
      "Fragment shaders with domain-warped noise and animated SDF shapes",
      "Documented mathematical approach for each in accompanying writeups"
    ],
    tools: ["GLSL", "WebGL", "Shadertoy"],
    links: [{ label: "Shadertoy", url: "#" }]
  },
  {
    id: "fluid-sim",
    featured: false,
    category: "Simulation",
    title: "Fluid FX Study",
    oneliner: "Houdini FLIP simulations for directable ocean and splash FX.",
    bullets: [
      "Explored FLIP solver parameters for large-scale water behavior",
      "Built lightweight caching and rendering pipeline for sim outputs"
    ],
    tools: ["Houdini", "Karma", "VEX"],
    links: [{ label: "Video", url: "#" }]
  }
    ═══════════════════════════════════════════════════════*/
];

/* ═══════════════════════════════════════════════════════
   R&D ENTRIES
   IMPORTANT: uses "artifacts" (not "links") - matches main.js line:
     entry.artifacts.length ? ...
   status: "live" | "wip" | "exploring" | "archived"
═══════════════════════════════════════════════════════ */
const RND_ENTRIES = [
  {
    status: "wip",
    title: "Maya Pipeline Tools - Scene Validator & Asset Publisher",
    hypothesis: "Two production-grade tools covering the full validate → publish → version pipeline could be built in pure Python with no proprietary dependencies.",
    finding: "Both ship. Validator catches geo, naming, transform, and material issues. Publisher handles file copy, USD export, JSON manifest, and Git tagging in one click.",
    artifacts: [
      { label: "GitHub", url: "https://github.com/AlyBarr/AssetMayaTooling" },
      { label: "Docs",   url: "pipeline-tools.html" }
    ]
  },
  {
    status: "live",
    title: "Virtual Prod ML Rig Predictor - Motion Action Classification",
    hypothesis: "A Random Forest pipeline with hand-crafted skeletal features could reliably classify 18 motion actions from 3D joint data without deep learning, keeping the system interpretable and deployable in any DCC tool.",
    finding: "Both models ship. M1 (full feature) maximises accuracy; M2 (PCA-reduced) trades a small margin for faster inference. Feature importances and PCA scatter plots confirm the models learn meaningful motion-space structure.",
    artifacts: [
      { label: "GitHub", url: "https://github.com/AlyBarr/VirtualProdMLPredict"},
        { label: "Docs",   url: "MLrigPredictor.html"}
    ]
  }, 
   {
     status: "live",
     title: "Shifting Interface — AI-Driven Visual State System",
     hypothesis: "Structured AI state data — rather than generated images or text — could govern a layered visual system's atmosphere, motion, and composition in real time, making the model a behavioral author rather than an output generator.",
     finding: "Two CSS variables cascading through eight composited layers via color-mix() and blend modes is sufficient to produce meaningfully distinct atmospheric states. The energy scalar makes AI influence physically felt through parallax amplitude, not just visually through color.",
     artifacts: [
       { label: "Live",  url: "https://alybarr.github.io/shifting_interface/" },
       { label: "Docs",  url: "shifting-interface.html" }
     ]
   },
  {
    status: "live",
    title: "AOI XR — Augmented Object Intelligence with XR Objects",
    hypothesis: "An on-device MediaPipe detection pass paired with a swappable LLM REST backend could deliver real-time, context-aware AR overlays on consumer mobile hardware — extending Google's XR-Objects research into a cross-platform Unity prototype without requiring cloud vision or on-device LLM inference.",
    finding: "Four-sprint prototype ships and runs on physical iOS and Android hardware. MediaPipe holds ≥5 FPS detection; LLM response targets sub-100ms. Sprint 4 scavenger hunt demo validates the full tap → detect → match → anchor → register flow with 31 passing test cases and 100% CI pass rate. Key lesson: Unity's URP pipeline introduces AR-specific rendering failure modes (clear flags, background colour, .meta file drift) that require targeted CI gates and systematic iOS build validation — not just standard unit tests.",
    artifacts: [
      { label: "GitHub", url: "https://github.com/bautista-aa/Augmented-Object-Intelligence-with-XR-Objects" },
      { label: "Docs",   url: "aoi-xr.html" }
    ]
  },
  {
    status: "wip",
    title: "Raytracer Dev — C++ Graphics Pipeline",
    hypothesis: "A full rasterization pipeline — shaders, parametric geometry, skeletal rigs, and ODE-driven physics — could be implemented from scratch in C++ without any game engine or rendering framework, using only OpenGL 3.3 Core, GLM, and GLFW.",
    finding: "All six assignments ship. The ODE integrator design is the clearest result: a pure-virtual evalF(state) interface lets ForwardEuler, Trapezoid, Midpoint, and RK4 operate on pendulum, chain, and cloth systems interchangeably — swapped at runtime from ImGui with no code changes to the physics systems.",
    artifacts: [
      { label: "GitHub", url: "https://github.com/AlyBarr/RaytracerDev" },
      { label: "Docs",   url: "raytracer.html" }
    ]
  },
  /* ═══════════════════════════════════════════════════════
   R&D ENTRIES
  {
    status: "exploring",
    title: "Domain-Warped Noise for Biome Masking",
    hypothesis: "Domain warping creates more organic biome transitions than threshold-based methods.",
    finding: "Visually yes - need to test at high point counts inside Houdini's scatter SOP.",
    artifacts: []
  },
  {
    status: "archived",
    title: "SDF Primitives in GLSL",
    hypothesis: "Learning SDF rendering in fragment shaders would give a foundation for custom procedural shape tooling.",
    finding: "It did. Sphere, box, torus, booleans all implemented. Mental model transfers to Houdini VEX easily.",
    artifacts: [
      { label: "Shadertoy", url: "#" }
    ]
  }
  ═══════════════════════════════════════════════════════ */
];
