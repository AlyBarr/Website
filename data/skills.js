const SKILLS = [
  { id: "python",   label: "Python",         x: 0.28, y: 0.32, r: 24, glow: true, links: ["tools", "usd", "ml", "maya"] },
  { id: "houdini",  label: "Houdini",        x: 0.50, y: 0.45, r: 28, glow: true, links: ["vex", "usd", "sim", "render"] },
  { id: "usd",      label: "USD",            x: 0.38, y: 0.68, r: 22, glow: true, links: ["pipeline", "maya", "tools"] },
  { id: "tools",    label: "Tool Dev",       x: 0.72, y: 0.56, r: 22,             links: ["pipeline", "maya", "python"] },
  { id: "sim",      label: "Sim / FX",       x: 0.66, y: 0.72, r: 20,             links: ["render", "vex"] },
  { id: "render",   label: "Rendering",      x: 0.64, y: 0.20, r: 20,             links: ["glsl", "opengl", "cpp"] },
  { id: "vex",      label: "VEX",            x: 0.76, y: 0.34, r: 18,             links: ["sim", "render"] },
  { id: "maya",     label: "Maya",           x: 0.14, y: 0.58, r: 18,             links: ["tools", "usd"] },
  { id: "pipeline", label: "Pipeline",       x: 0.50, y: 0.86, r: 20,             links: ["usd", "tools", "unreal", "unity"] },

  { id: "cpp",      label: "C++",            x: 0.10, y: 0.42, r: 16,             links: ["opengl", "render"] },
  { id: "opengl",   label: "OpenGL",         x: 0.20, y: 0.18, r: 16,             links: ["cpp", "glsl", "render"] },
  { id: "glsl",     label: "GLSL",           x: 0.84, y: 0.18, r: 14,             links: ["render", "opengl"] },

  { id: "unity",    label: "Unity / C#",     x: 0.18, y: 0.82, r: 16,             links: ["xr", "pipeline"] },
  { id: "xr",       label: "AR / XR",        x: 0.30, y: 0.90, r: 16,             links: ["unity", "ml"] },
  { id: "ml",       label: "ML / AI",        x: 0.86, y: 0.46, r: 16,             links: ["python", "xr", "web"] },
  { id: "web",      label: "Web / JS",       x: 0.82, y: 0.76, r: 16,             links: ["tools", "ml"] },

  { id: "unreal",   label: "Unreal",         x: 0.10, y: 0.74, r: 14,             links: ["pipeline"] }
];

/* =====================================================
     SKILLS - derived from actual projects only.
     Radius (r) reflects depth of use across real work:
       core   r:22-28  = used heavily across multiple projects
       strong r:14-18  = used seriously in at least one project
       solid  r:10-12  = used, know it well, less central
     Positions spread to avoid overlap on the canvas.
  ===================================================== */