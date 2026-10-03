const portfolioGrid = document.getElementById('portfolio-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

const FALLBACK_PORTFOLIO_ITEMS = [
  { id: 1, title: 'Aster Brand Identity', description: 'Positioning and visual identity crafted for a lifestyle brand.', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', category_name: 'Branding', project_type: 'Identity System' },
  { id: 2, title: 'Launch Campaign Assets', description: 'Social-ready campaign graphics to drive engagement and product visibility.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', category_name: 'Social Media', project_type: 'Marketing Design' },
  { id: 3, title: 'Luma Poster Series', description: 'Event artwork and poster system designed for high-impact storytelling.', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80', category_name: 'Posters', project_type: 'Print Campaign' },
  { id: 4, title: 'Northpeak Logo System', description: 'A clean, memorable logo system designed to scale across print and digital use.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', category_name: 'Logos', project_type: 'Brand Design' },
  { id: 5, title: 'Tara Business Cards', description: 'Luxury business card design that reinforces brand credibility and polish.', image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80', category_name: 'Business Cards', project_type: 'Print Design' },
  { id: 6, title: 'Summit Print Kit', description: 'Flyers and promotional collateral for an event launch with strong visual hierarchy.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', category_name: 'Print Design', project_type: 'Collateral' },
  { id: 7, title: 'Glowline Flyers', description: 'Dynamic promotional flyer set for a retail campaign across physical and online channels.', image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80', category_name: 'Flyers', project_type: 'Campaign' },
  { id: 8, title: 'Nova Social Suite', description: 'A cohesive social media visual set designed for launch consistency and speed.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', category_name: 'Social Media', project_type: 'Creative Suite' },
];

let allProjects = [];

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

function renderPortfolio(projects) {
  if (!portfolioGrid) return;

  portfolioGrid.innerHTML = projects.map((project) => `
    <article class="project-card" data-category="${project.category_name || 'Design'}">
      <div class="project-image"><img src="${project.image}" alt="${project.title}"></div>
      <div class="project-body">
        <div class="project-meta"><span>${project.category_name || 'Design'}</span><span>${project.project_type || 'Creative'}</span></div>
        <h3>${project.title}</h3>
        <p>${(project.description || '').slice(0, 120)}...</p>
        <a href="project-details.html?id=${project.id}" class="btn btn-secondary">View Details</a>
      </div>
    </article>
  `).join('');
}

async function loadProjects() {
  try {
    const data = await fetchJsonSafe(`${window.location.pathname.includes('/admin/') ? '../php' : 'php'}/projects/read.php?limit=12`, { success: false });
    allProjects = data.success && Array.isArray(data.projects) && data.projects.length ? data.projects : FALLBACK_PORTFOLIO_ITEMS;
    renderPortfolio(allProjects);

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter || 'all';
        filterButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));

        const filtered = filter === 'all'
          ? allProjects
          : allProjects.filter((project) => String(project.category_name || '').toLowerCase() === filter.toLowerCase());

        renderPortfolio(filtered);
      });
    });
  } catch (error) {
    console.error('Unable to load portfolio', error);
    allProjects = FALLBACK_PORTFOLIO_ITEMS;
    renderPortfolio(allProjects);

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter || 'all';
        filterButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));

        const filtered = filter === 'all'
          ? allProjects
          : allProjects.filter((project) => String(project.category_name || '').toLowerCase() === filter.toLowerCase());

        renderPortfolio(filtered);
      });
    });
  }
}

if (portfolioGrid) {
  loadProjects();
}
