/* ═══════════════════════════════════════════════════════
   data/projects.js — project + R&D data
   Uses var so globals are available to renderer scripts
═══════════════════════════════════════════════════════ */

var PROJECTS = [
  {
    id: "maya-pipeline-tools",
    featured: true,
    roles: ["pipeline"],
    category: "Pipeline & Tools",
    title: "Maya Pipeline Tools",
    oneliner: "Production-grade Scene Validator and Asset Publisher for Maya — built to mirror studio TD conventions.",
    bullets: [
      "Scene Validator checks geometry, naming, transforms, materials, and scene units with a threaded PySide2 UI that never freezes",
      "Asset Publisher copies files to a versioned directory, writes a JSON manifest, exports a USD stub, and commits a semantic Git version tag",
      "Graceful degradation runs in demo mode without Maya, and falls back to a plain-text USD stub if usd-core is missing"
    ],
    tools: ["Python", "Maya API", "PySide2", "OpenUSD", "Git"],
    image: "",
    imageAlt: "Maya Pipeline Tools",
    links: [
      { label: "GitHub", url: "https://github.com/AlyBarr/AssetMayaTooling" },
      { label: "Docs", url: "pipeline-tools.html" }
    ]
  },
  {
    id: "ml-rig-predictor",
    featured: true,
    roles: ["ml"],
    category: "Machine Learning · Virtual Production",
    title: "Virtual Prod ML Rig Predictor",
    oneliner: "Two-model Random Forest system that classifies 18 human motion actions from 3D skeletal joint data — built for virtual production rigs.",
    bullets: [
      "Model 1 uses a full 4,998-dimensional feature pipeline with StandardScaler to Random Forest and 300 trees for maximum accuracy",
      "Model 2 uses PCA compression with 100 components for faster inference in latency-sensitive live VP environments",
      "Root-space normalisation, temporal resampling to 60 frames, and velocity features extracted from the KARD dataset"
    ],
    tools: ["Python", "Scikit-learn", "Random Forest", "PCA", "NumPy", "Pandas", "Matplotlib"],
    image: "",
    imageAlt: "ML Rig Predictor",
    links: [
      { label: "GitHub", url: "https://github.com/AlyBarr/VirtualProdMLPredict" },
      { label: "Docs", url: "MLrigPredictor.html" }
    ]
  },
  {
    id: "shifting-interface",
    featured: true,
    roles: ["creative"],
    category: "Creative Technology · AI Systems",
    title: "Shifting Interface — AI-Driven Visual State System",
    oneliner: "An interactive visual system where structured AI state data shapes atmosphere, motion, composition, and interaction in real time.",
    bullets: [
      "State machine pattern translates AI JSON output into live CSS custom properties across layered visual states",
      "Parallax depth system uses AI-governed energy scaling to make changes feel physically present, not just cosmetic",
      "Echo transition layer spawns ghosted after-images of outgoing geometry during each state shift"
    ],
    tools: ["HTML5", "CSS Custom Properties", "Vanilla JS", "State Machine", "mix-blend-mode", "IntersectionObserver"],
    image: "",
    imageAlt: "Shifting Interface",
    links: [
      { label: "Live", url: "https://alybarr.github.io/shifting_interface/" },
      { label: "Docs", url: "Shifting-interface-docs.html" }
    ]
  },
  {
    id: "raytracer-dev",
    featured: false,
    roles: ["graphics"],
    category: "Graphics Programming · C++",
    title: "Raytracer Dev — OpenGL Graphics Engine",
    oneliner: "A C++ graphics pipeline built from scratch across six assignments with shading, parametric curves, skeletal animation, and cloth physics.",
    bullets: [
      "Raw OpenGL 3.3 Core throughout with manual VAO, VBO, and EBO setup, GLSL shaders, and MVP matrix management",
      "Bezier and B-Spline curve support with Frenet-Serret frame computation and surface-of-revolution mesh generation",
      "Reusable ODE framework driving pendulum, chain, and cloth simulations through multiple swappable integrators"
    ],
    tools: ["C++17", "OpenGL 3.3", "GLSL", "GLM", "GLFW", "GLAD", "Dear ImGui", "OBJ Parser"],
    image: "",
    imageAlt: "Raytracer Dev",
    links: [
      { label: "GitHub", url: "https://github.com/AlyBarr/RaytracerDev" },
      { label: "Docs", url: "raytracer.html" }
    ]
  },
  {
    id: "aoi-xr",
    featured: false,
    roles: ["creative", "ml"],
    category: "Augmented Reality · Unity · AI",
    title: "AOI XR — Augmented Object Intelligence XR",
    oneliner: "Mobile AR capstone that anchors AI-generated context directly onto physical objects in 3D space.",
    bullets: [
      "Four-stage pipeline: AR Foundation capture to MediaPipe detection to LLM REST query to world-space AR anchor",
      "Cross-platform Unity build targeting ARKit, ARCore, and Meta Quest 3 through a shared C# codebase",
      "Includes an AR scavenger hunt flow with tap-to-detect interaction and CI-tested session logic"
    ],
    tools: ["Unity 2022.3", "C# / URP", "AR Foundation", "ARKit", "ARCore", "MediaPipe", "LLM API", "GitHub Actions"],
    image: "",
    imageAlt: "AOI XR",
    links: [
      { label: "GitHub", url: "https://github.com/bautista-aa/Augmented-Object-Intelligence-with-XR-Objects" },
      { label: "Docs", url: "aoi-xr.html" }
    ]
  }
];

var RND_ENTRIES = [
  {
    status: "wip",
    title: "Maya Pipeline Tools - Scene Validator & Asset Publisher",
    hypothesis: "Two production-grade tools covering the full validate to publish to version pipeline could be built in pure Python with no proprietary dependencies.",
    finding: "Both ship. Validator catches geo, naming, transform, and material issues. Publisher handles file copy, USD export, JSON manifest, and Git tagging in one click.",
    artifacts: [
      { label: "GitHub", url: "https://github.com/AlyBarr/AssetMayaTooling" },
      { label: "Docs", url: "pipeline-tools.html" }
    ]
  },
  {
    status: "live",
    title: "Virtual Prod ML Rig Predictor - Motion Action Classification",
    hypothesis: "A Random Forest pipeline with hand-crafted skeletal features could reliably classify 18 motion actions from 3D joint data without deep learning.",
    finding: "Both models ship. The full-feature model maximises accuracy while the PCA-reduced model improves inference speed.",
    artifacts: [
      { label: "GitHub", url: "https://github.com/AlyBarr/VirtualProdMLPredict" },
      { label: "Docs", url: "MLrigPredictor.html" }
    ]
  },
  {
    status: "live",
    title: "Shifting Interface — AI-Driven Visual State System",
    hypothesis: "Structured AI state data could govern a layered visual system's atmosphere, motion, and composition in real time.",
    finding: "Two CSS variables cascading across layered systems are enough to create clearly distinct atmospheric states with felt motion changes.",
    artifacts: [
      { label: "Live", url: "https://alybarr.github.io/shifting_interface/" },
      { label: "Docs", url: "Shifting-interface-docs.html" }
    ]
  },
  {
    status: "live",
    title: "AOI XR — Augmented Object Intelligence with XR Objects",
    hypothesis: "An on-device MediaPipe detection pass paired with a swappable LLM REST backend could deliver real-time, context-aware AR overlays on consumer mobile hardware.",
    finding: "The prototype ships and runs on physical devices, validating the full tap to detect to match to anchor flow.",
    artifacts: [
      { label: "GitHub", url: "https://github.com/bautista-aa/Augmented-Object-Intelligence-with-XR-Objects" },
      { label: "Docs", url: "aoi-xr.html" }
    ]
  },
  {
    status: "wip",
    title: "Raytracer Dev — C++ Graphics Pipeline",
    hypothesis: "A full rasterisation pipeline with shaders, parametric geometry, skeletal rigs, and ODE-driven physics could be implemented from scratch in C++ without a game engine.",
    finding: "All six assignments ship, with a reusable integrator architecture across multiple physics systems.",
    artifacts: [
      { label: "GitHub", url: "https://github.com/AlyBarr/RaytracerDev" },
      { label: "Docs", url: "raytracer.html" }
    ]
  }
];