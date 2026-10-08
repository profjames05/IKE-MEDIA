const projectDetailsTarget = document.getElementById('project-details');

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safeImageUrl(value) {
  return /^https?:\/\//i.test(String(value || '')) ? escapeHtml(value) : '';
}

async function fetchJsonSafe(url, fallbackValue = null) {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      return fallbackValue;
    }
    return await response.json();
  } catch (error) {
    return fallbackValue;
  }
}

const FALLBACK_CASE_STUDIES = [
  { id: 1, title: 'Aster Brand Identity', description: 'A premium identity redesign focused on lifestyle storytelling, refined typography, and polished digital touchpoints.', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', category_name: 'Branding', project_type: 'Identity System', client: 'Aster Studio', project_date: 'May 2025', tools: 'Adobe Illustrator, Figma', },
  { id: 2, title: 'Launch Campaign Assets', description: 'A visual campaign suite built for product awareness, social engagement, and conversion-focused creative direction.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', category_name: 'Social Media', project_type: 'Marketing Design', client: 'Northpeak', project_date: 'April 2025', tools: 'Photoshop, After Effects', },
  { id: 3, title: 'Luma Poster Series', description: 'A bold event poster set with cinematic contrast, strong hierarchy, and memorable call-to-action design.', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80', category_name: 'Posters', project_type: 'Print Campaign', client: 'Luma Events', project_date: 'March 2025', tools: 'InDesign, Illustrator', },
  { id: 4, title: 'Northpeak Logo System', description: 'A scalable identity built to work across web, packaging, signage, and social channels.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', category_name: 'Logos', project_type: 'Brand Design', client: 'Northpeak', project_date: 'February 2025', tools: 'Illustrator, Figma', },
  { id: 5, title: 'Tara Business Cards', description: 'A premium print identity system for a professional service business ready for client-facing touchpoints.', image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80', category_name: 'Business Cards', project_type: 'Print Design', client: 'Tara Advisory', project_date: 'January 2025', tools: 'InDesign, Photoshop', },
  { id: 6, title: 'Summit Print Kit', description: 'Print collateral designed for a product launch with polished support materials and stronger brand consistency.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', category_name: 'Print Design', project_type: 'Collateral', client: 'Summit Labs', project_date: 'December 2024', tools: 'Illustrator, InDesign', },
];

async function loadProjectDetails() {
  if (!projectDetailsTarget) return;

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');
  if (!projectId) {
    projectDetailsTarget.innerHTML = '<p>No project selected.</p>';
    return;
  }

  const apiBase = window.location.pathname.includes('/admin/') ? '../php' : 'php';

  try {
    const data = await fetchJsonSafe(`${apiBase}/projects/read.php?id=${projectId}`, { success: false });
    const project = data.success && data.project ? data.project : FALLBACK_CASE_STUDIES.find((item) => Number(item.id) === Number(projectId)) || null;
    if (!project) {
      projectDetailsTarget.innerHTML = '<p>Project not found.</p>';
      return;
    }

    const allData = await fetchJsonSafe(`${apiBase}/projects/read.php?limit=20`, { success: false });
    const list = Array.isArray(allData.projects) && allData.projects.length ? allData.projects : FALLBACK_CASE_STUDIES;
    const index = list.findIndex((item) => Number(item.id) === Number(projectId));
    const previousProject = list[index - 1] || null;
    const nextProject = list[index + 1] || null;

    projectDetailsTarget.innerHTML = `
      <div class="project-detail-card">
        <div class="project-detail-image"><img src="${safeImageUrl(project.image)}" alt="${escapeHtml(project.title)}"></div>
        <div class="project-detail-body">
          <div class="project-meta"><span>${escapeHtml(project.category_name || 'Design')}</span><span>${escapeHtml(project.project_type || 'Project')}</span></div>
          <h2>${escapeHtml(project.title)}</h2>
          <p>${escapeHtml(project.description)}</p>
          <div class="project-meta-list">
            <div><strong>Client</strong><span>${escapeHtml(project.client || 'N/A')}</span></div>
            <div><strong>Date</strong><span>${escapeHtml(project.project_date || 'N/A')}</span></div>
            <div><strong>Tools</strong><span>${escapeHtml(project.tools || 'N/A')}</span></div>
            <div><strong>Project Type</strong><span>${escapeHtml(project.project_type || 'N/A')}</span></div>
          </div>
        </div>
      </div>
      <div class="project-nav">
        ${previousProject ? `<a href="project-details.html?id=${Number(previousProject.id) || ''}" class="btn btn-secondary">Previous Project</a>` : '<span class="btn btn-secondary disabled">Previous Project</span>'}
        ${nextProject ? `<a href="project-details.html?id=${Number(nextProject.id) || ''}" class="btn btn-secondary">Next Project</a>` : '<span class="btn btn-secondary disabled">Next Project</span>'}
      </div>
    `;
  } catch (error) {
    console.error('Project details failed to load', error);
    const fallbackProject = FALLBACK_CASE_STUDIES.find((item) => Number(item.id) === Number(projectId)) || FALLBACK_CASE_STUDIES[0];
    const list = FALLBACK_CASE_STUDIES;
    const index = list.findIndex((item) => Number(item.id) === Number(fallbackProject.id));
    const previousProject = list[index - 1] || null;
    const nextProject = list[index + 1] || null;

    projectDetailsTarget.innerHTML = `
      <div class="project-detail-card">
        <div class="project-detail-image"><img src="${safeImageUrl(fallbackProject.image)}" alt="${escapeHtml(fallbackProject.title)}"></div>
        <div class="project-detail-body">
          <div class="project-meta"><span>${escapeHtml(fallbackProject.category_name || 'Design')}</span><span>${escapeHtml(fallbackProject.project_type || 'Project')}</span></div>
          <h2>${escapeHtml(fallbackProject.title)}</h2>
          <p>${escapeHtml(fallbackProject.description)}</p>
          <div class="project-meta-list">
            <div><strong>Client</strong><span>${escapeHtml(fallbackProject.client || 'N/A')}</span></div>
            <div><strong>Date</strong><span>${escapeHtml(fallbackProject.project_date || 'N/A')}</span></div>
            <div><strong>Tools</strong><span>${escapeHtml(fallbackProject.tools || 'N/A')}</span></div>
            <div><strong>Project Type</strong><span>${escapeHtml(fallbackProject.project_type || 'N/A')}</span></div>
          </div>
        </div>
      </div>
      <div class="project-nav">
        ${previousProject ? `<a href="project-details.html?id=${Number(previousProject.id) || ''}" class="btn btn-secondary">Previous Project</a>` : '<span class="btn btn-secondary disabled">Previous Project</span>'}
        ${nextProject ? `<a href="project-details.html?id=${Number(nextProject.id) || ''}" class="btn btn-secondary">Next Project</a>` : '<span class="btn btn-secondary disabled">Next Project</span>'}
      </div>
    `;
  }
}

if (projectDetailsTarget) {
  loadProjectDetails();
}
