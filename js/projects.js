/* ═══════════════════════════════════════════
   js/projects.js — Render Projects (safe)
═══════════════════════════════════════════ */
(function renderProjects() {
  var featuredWrap = document.getElementById("featured-projects");
  var gridWrap = document.getElementById("project-grid");

  if (!featuredWrap || !gridWrap) {
    console.error("[AlyArtBar] Project containers not found");
    return;
  }

  if (!Array.isArray(window.PROJECTS)) {
    console.error("[AlyArtBar] PROJECTS is not defined or not an array");
    return;
  }

function inferLabel(url) {
  var u = String(url || '').toLowerCase();
  if (u.indexOf('github.com') !== -1) return 'GitHub';
  if (u.indexOf('docs.google.com') !== -1 || u.indexOf('notion.') !== -1 || u.slice(-4) === '.pdf') return 'Docs';
  if (u.indexOf('youtube.com') !== -1 || u.indexOf('youtu.be') !== -1 || u.indexOf('vimeo.com') !== -1) return 'Video';
  if (u.indexOf('itch.io') !== -1) return 'Play';
  if (u.indexOf('vercel.app') !== -1 || u.indexOf('netlify.app') !== -1 || u.indexOf('github.io') !== -1) return 'Live';
  return 'Link';
}

  featuredWrap.innerHTML = "";
  gridWrap.innerHTML = "";

  window.PROJECTS.forEach(function(project, index) {
    var id = project.id || ("project-" + index);
    var title = project.title || "Untitled Project";
    var category = project.category || "";
    var oneliner = project.oneliner || "";
    var bullets = Array.isArray(project.bullets) ? project.bullets : [];
    var tools = Array.isArray(project.tools) ? project.tools : [];
    var links = Array.isArray(project.links) ? project.links : [];
    var image = project.image || "";
    var imageAlt = project.imageAlt || title;
    var featured = !!project.featured;
    var roles = Array.isArray(project.roles) ? project.roles : [];

    var card = document.createElement("article");
    card.className = featured ? "featured-card reveal" : "project-card reveal";
    card.setAttribute("data-project-idx", String(index));
    card.setAttribute("data-project-id", id);
    card.setAttribute("data-roles", roles.join(" "));

    var mediaHTML = image
      ? '<div class="project-media"><img src="' + image + '" alt="' + escapeHtml(imageAlt) + '"></div>'
      : '<div class="project-media project-media-placeholder" aria-hidden="true"></div>';

    var bulletsHTML = bullets.length
      ? '<ul class="project-bullets">' +
          bullets.map(function(b) {
            return "<li>" + escapeHtml(b) + "</li>";
          }).join("") +
        "</ul>"
      : "";

    var toolsHTML = tools.length
      ? '<div class="project-tools">' +
          tools.map(function(t) {
            return '<span class="chip">' + escapeHtml(t) + "</span>";
          }).join("") +
        "</div>"
      : "";

    var linksHTML = links.length
      ? '<div class="project-links">' +
          links.map(function(link) {
            var url = (link && link.url) ? link.url : (typeof link === 'string' ? link : '#');
            var label = (link && link.label) ? link.label : inferLabel(url);
            return '<a class="project-link" href="' + escapeAttr(url) + '" target="_blank" rel="noopener">↗ ' + escapeHtml(label) + "</a>";
          }).join("") +
        "</div>"
      : "";

    if (featured) {
      card.innerHTML =
        mediaHTML +
        '<div class="project-copy">' +
          '<p class="project-category">// ' + escapeHtml(category) + "</p>" +
          '<h3 class="project-title">' + escapeHtml(title) + "</h3>" +
          '<p class="project-oneliner">' + escapeHtml(oneliner) + "</p>" +
          bulletsHTML +
          toolsHTML +
          linksHTML +
        "</div>";
      featuredWrap.appendChild(card);
    } else {
      card.innerHTML =
        mediaHTML +
        '<div class="project-copy">' +
          '<p class="project-category">// ' + escapeHtml(category) + "</p>" +
          '<h3 class="project-title">' + escapeHtml(title) + "</h3>" +
          '<p class="project-oneliner">' + escapeHtml(oneliner) + "</p>" +
          toolsHTML +
          linksHTML +
        "</div>";
      gridWrap.appendChild(card);
    }
  });

  console.log("[AlyArtBar] Projects rendered:", window.PROJECTS.length);

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttr(value) {
    return String(value).replace(/"/g, "&quot;");
  }
})();