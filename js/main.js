const API_BASE = window.location.pathname.includes('/admin/') ? '../php' : 'php';

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: 'Aster Brand Identity',
    description: 'A premium brand refresh for a lifestyle startup, combining refined typography and high-conversion marketing visuals.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Branding',
    project_type: 'Identity System',
  },
  {
    id: 2,
    title: 'Launch Campaign Assets',
    description: 'A social-first campaign bundle for product awareness, engagement, and digital ad creative.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Social Media',
    project_type: 'Marketing Design',
  },
  {
    id: 3,
    title: 'Luma Poster Series',
    description: 'Event poster concepts designed for bold storytelling and high visual impact across print and digital channels.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Posters',
    project_type: 'Print Campaign',
  },
  {
    id: 4,
    title: 'Northpeak Logo System',
    description: 'A clean and memorable logo identity with scalable brand applications across web, print, and packaging.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Logos',
    project_type: 'Brand Design',
  },
  {
    id: 5,
    title: 'Tara Business Cards',
    description: 'Luxury business card system created to add polish and brand credibility for a professional services firm.',
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Business Cards',
    project_type: 'Print Design',
  },
  {
    id: 6,
    title: 'Summit Print Kit',
    description: 'A print collateral set featuring brochures, flyers, and supports for a multi-location product launch.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    category_name: 'Print Design',
    project_type: 'Collateral',
  },
];

const FALLBACK_SERVICES = [
  { icon: '✦', title: 'Brand Identity', description: 'Logo systems, visual positions, brand guidelines, and audience-driven design systems.' },
  { icon: '◎', title: 'Social Media Design', description: 'Scroll-stopping creatives for campaigns, launch weeks, and content consistency.' },
  { icon: '▣', title: 'Print Design', description: 'Flyers, posters, business cards, and premium print-ready marketing materials.' },
  { icon: '◈', title: 'Marketing Collateral', description: 'Sales sheets, brochures, and polished communication assets built to convert.' },
  { icon: '✧', title: 'Packaging Design', description: 'Packaging concepts that elevate shelf presence and strengthen brand recall.' },
  { icon: '⬢', title: 'Creative Direction', description: 'Visual strategy, campaign guidance, and content planning for growing businesses.' },
];

const FALLBACK_TESTIMONIALS = [
  { name: 'Ama Serwaa', company: 'Sample client · Accra, Ghana', position: 'Business owner', rating: 5, message: 'The new brand identity feels confident and consistent. The process was thoughtful, and the final designs represent our business beautifully.', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80' },
  { name: 'Kofi Mensah', company: 'Sample client · Kumasi, Ghana', position: 'Marketing lead', rating: 5, message: 'The campaign designs brought our ideas to life with clear messaging and a strong visual style that works across our channels.', image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=600&q=80' },
  { name: 'Nana Akua Boateng', company: 'Sample client · Tema, Ghana', position: 'Creative entrepreneur', rating: 5, message: 'I appreciated the care and communication throughout the project. The finished visuals gave our launch a polished, memorable look.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
];

const FALLBACK_SETTINGS = {
  developer_name: 'JTECH SOLUTIONS',
  designer_name: 'Ike Peniel Media',
  website_title: 'Ike Peniel Media | Creative Designer Portfolio',
  website_name: 'Ike Peniel Media',
  hero_heading: 'Design that speaks before you do.',
  hero_description: 'Ghanaian graphic designer creating distinctive brand identities, campaign visuals, and digital experiences that help ambitious businesses stand out.',
  primary_button_text: 'View My Work',
  primary_button_link: 'portfolio.html',
  secondary_button_text: 'Hire Me',
  secondary_button_link: 'contact.html#hire',
  projects_completed: '120+',
  happy_clients: '80+',
  client_satisfaction: '98%',
  years_experience: '6+',
  about_heading: 'Meet Ike Peniel',
  about_biography: 'Ike Peniel is the founder and CEO of Ike Peniel Media, a Ghana-based creative studio expanding brands through thoughtful graphic design, visual storytelling, and polished digital and print experiences.',
  footer_copyright: '© 2026 Ike Peniel Media. All Rights Reserved.',
  designer_email: 'istawiah2134@gmail.com',
  designer_phone: '+233 20 696 3041',
  designer_whatsapp: '+233 53 234 9114',
  designer_location: 'Ghana',
  hero_image: 'assets/images/profile/ike-peniel.jpg',
  profile_image: 'assets/images/profile/ike-peniel.jpg',
  facebook: '#',
  instagram: '#',
  tiktok: '#',
  linkedin: '#',
  behance: '#',
  dribbble: '#',
  youtube: '#',
};

function getApiUrl(path) {
  return `${API_BASE}${path}`;
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

function renderProjectCards(projects) {
  return projects.map((project) => `
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

function renderServiceCards(services) {
  return services.map((service) => `
    <article class="service-card">
      <div class="service-icon">${service.icon || '✦'}</div>
      <h3>${service.title}</h3>
      <p>${service.description}</p>
      <a href="contact.html#hire" class="btn btn-secondary">Request Service</a>
    </article>
  `).join('');
}

function renderTestimonialCards(testimonials) {
  return testimonials.map((item) => `
    <article class="testimonial-card">
      <div class="testimonial-head">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <span>${item.company || 'Client'} • ${item.position || 'Customer'}</span>
        </div>
      </div>
      <div class="rating" aria-label="${item.rating} out of 5 stars">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</div>
      <p>“${item.message}”</p>
    </article>
  `).join('');
}

function renderToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value || '';
  }
}

function setAttribute(id, attribute, value) {
  const el = document.getElementById(id);
  if (el) {
    el.setAttribute(attribute, value || '');
  }
}

function setupTheme() {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('theme');
  } catch (error) {
    savedTheme = null;
  }
  const preferredTheme = 'dark';
  document.body.classList.toggle('light-mode', (savedTheme || preferredTheme) === 'light');

  document.querySelectorAll('.theme-toggle').forEach((button) => {
    const updateButton = () => {
      const isLight = document.body.classList.contains('light-mode');
      button.textContent = isLight ? '☾' : '☀';
      button.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
      button.setAttribute('title', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    };
    updateButton();
    button.addEventListener('click', () => {
      const next = document.body.classList.toggle('light-mode') ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch (error) {
        // Theme still applies for the current page when storage is unavailable.
      }
      updateButton();
    });
  });
}

function setupNavigation() {
  const toggleButton = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggleButton || !nav) return;

  toggleButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

function populateCurrentYear() {
  const target = document.getElementById('current-year');
  if (target) {
    target.textContent = new Date().getFullYear();
  }
}

function updateBrandNames(settings) {
  const developerName = settings.developer_name || 'JTECH SOLUTIONS';
  const designerName = settings.designer_name || 'Ike Peniel Media';

  document.querySelectorAll('[data-brand-name]').forEach((el) => {
    el.textContent = designerName;
  });

  document.querySelectorAll('[data-brand-motto]').forEach((el) => {
    el.textContent = 'Expanding brands through creativity';
  });

  const pageBrand = document.getElementById('page-brand-name');
  if (pageBrand) {
    pageBrand.textContent = designerName;
  }

  if (document.getElementById('brand-name-inline')) {
    document.getElementById('brand-name-inline').textContent = developerName;
  }
}

async function loadSettings() {
  try {
    const data = await fetchJsonSafe(getApiUrl('/settings/read.php'), { success: false });
    if (!data.success) {
      const fallbackSettings = { ...FALLBACK_SETTINGS };
      updateBrandNames(fallbackSettings);
      document.title = fallbackSettings.website_title;
      setText('site-name', fallbackSettings.website_name);
      setText('website-name', fallbackSettings.website_name);
      setText('hero-heading', fallbackSettings.hero_heading);
      setText('hero-description', fallbackSettings.hero_description);
      setText('projects-completed', fallbackSettings.projects_completed);
      setText('happy-clients', fallbackSettings.happy_clients);
      setText('client-satisfaction', fallbackSettings.client_satisfaction);
      setText('years-experience', fallbackSettings.years_experience);
      setText('about-heading', fallbackSettings.about_heading);
      setText('about-biography', fallbackSettings.about_biography);
      setText('footer-copyright', fallbackSettings.footer_copyright);
      setAttribute('hero-image', 'src', fallbackSettings.hero_image);
      setAttribute('profile-image', 'src', fallbackSettings.profile_image);
      setAttribute('about-image', 'src', fallbackSettings.profile_image);
      return;
    }

    const settings = data.settings || {};
    updateBrandNames(settings);

    document.title = settings.website_title || 'Ike Peniel Media | Creative Designer Portfolio';
    setText('site-name', settings.website_name || 'Ike Peniel Media');
    setText('website-name', settings.website_name || 'Ike Peniel Media');
    setText('developer-name', settings.developer_name || 'JTECH SOLUTIONS');
    setText('designer-name', settings.designer_name || 'Ike Peniel Media');
    setText('hero-heading', settings.hero_heading || 'Design that speaks before you do.');
    setText('hero-description', settings.hero_description || 'Ghanaian graphic designer creating distinctive brand identities, campaign visuals, and digital experiences that help ambitious businesses stand out.');
    setText('hero-tagline', 'Expanding brands through creativity');
    setText('primary-button-text', settings.primary_button_text || 'View My Work');
    const primaryAction = document.getElementById('primary-action');
    if (primaryAction) {
      primaryAction.textContent = settings.primary_button_text || 'View My Work';
      primaryAction.href = settings.primary_button_link || 'portfolio.html';
    }

    const secondaryAction = document.getElementById('secondary-action');
    if (secondaryAction) {
      secondaryAction.textContent = settings.secondary_button_text || 'Hire Me';
      secondaryAction.href = settings.secondary_button_link || 'contact.html#hire';
    }

    setText('projects-completed', settings.projects_completed || '120+');
    setText('happy-clients', settings.happy_clients || '80+');
    setText('client-satisfaction', settings.client_satisfaction || '98%');
    setText('years-experience', settings.years_experience || '6+');
    setText('about-heading', settings.about_heading || 'Meet Ike Peniel');
    setText('about-biography', settings.about_biography || 'Ike Peniel is the founder and CEO of Ike Peniel Media, a Ghana-based creative studio expanding brands through thoughtful graphic design, visual storytelling, and polished digital and print experiences.');
    setText('about-skills', settings.skills || 'Brand Identity, Print Design, Social Media Design, UI Design, Marketing Creative, Campaign Art Direction');
    setText('about-years-experience', settings.about_years_experience || '6+');
    setText('about-projects-completed', settings.about_projects_completed || '120+');
    setText('about-happy-clients', settings.about_happy_clients || '80+');
    setText('website-description', settings.website_description || 'Expanding brands through creativity. Ghanaian graphic design for brand identity, campaigns, and visual communication.');
    setText('footer-copyright', settings.footer_copyright || '© 2026 Ike Peniel Media. All Rights Reserved.');
    setText('contact-email', settings.designer_email || 'istawiah2134@gmail.com');
    setText('contact-phone', settings.designer_phone || '+233 20 696 3041');
    setText('contact-whatsapp', settings.designer_whatsapp || '+233 53 234 9114');
    setText('contact-location', settings.designer_location || 'Ghana');
    setAttribute('contact-email', 'href', `mailto:${settings.designer_email || 'istawiah2134@gmail.com'}`);
    setAttribute('contact-phone', 'href', `tel:${(settings.designer_phone || '+233 20 696 3041').replace(/[^+\d]/g, '')}`);
    setAttribute('contact-whatsapp', 'href', `https://wa.me/${(settings.designer_whatsapp || '+233 53 234 9114').replace(/\D/g, '')}`);
    const heroImage = settings.hero_image && !settings.hero_image.includes('photo-1531123897727-8f129e1688ce')
      ? settings.hero_image
      : FALLBACK_SETTINGS.hero_image;
    const profileImage = settings.profile_image && !settings.profile_image.includes('photo-1531123897727-8f129e1688ce')
      ? settings.profile_image
      : FALLBACK_SETTINGS.profile_image;
    setAttribute('hero-image', 'src', heroImage);
    setAttribute('profile-image', 'src', profileImage);
    setAttribute('about-image', 'src', profileImage);

    const socialIds = ['facebook', 'instagram', 'tiktok', 'linkedin', 'behance', 'dribbble', 'youtube'];
    const footerLinks = document.getElementById('footer-social-links');
    if (footerLinks) {
      const links = socialIds
        .filter((key) => settings[key])
        .map((key) => `<li><a href="${settings[key]}" target="_blank" rel="noreferrer">${key.charAt(0).toUpperCase() + key.slice(1)}</a></li>`)
        .join('');
      footerLinks.innerHTML = links || '<li>Social links not set</li>';
    }
  } catch (error) {
    console.error('Unable to load settings', error);
  }
}

async function loadFeaturedProjects() {
  const target = document.getElementById('featured-projects');
  if (!target) return;

  try {
    const data = await fetchJsonSafe(getApiUrl('/projects/read.php?featured=1&limit=3'), { success: false });
    const projects = data.success && Array.isArray(data.projects) && data.projects.length ? data.projects : FALLBACK_PROJECTS.slice(0, 3);
    target.innerHTML = renderProjectCards(projects);
  } catch (error) {
    console.error('Unable to load featured projects', error);
    target.innerHTML = renderProjectCards(FALLBACK_PROJECTS.slice(0, 3));
  }
}

async function loadServices() {
  const target = document.getElementById('services-grid');
  if (!target) return;

  try {
    const data = await fetchJsonSafe(getApiUrl('/services/read.php?published=1'), { success: false });
    const services = data.success && Array.isArray(data.services) && data.services.length ? data.services : FALLBACK_SERVICES;
    target.innerHTML = renderServiceCards(services);
  } catch (error) {
    console.error('Unable to load services', error);
    target.innerHTML = renderServiceCards(FALLBACK_SERVICES);
  }
}

async function loadTestimonials() {
  const target = document.getElementById('testimonial-carousel');
  if (!target) return;
  const note = document.getElementById('testimonial-note');

  try {
    const data = await fetchJsonSafe(getApiUrl('/testimonials/read.php?status=published'), { success: false });
    const testimonials = data.success && Array.isArray(data.testimonials) && data.testimonials.length ? data.testimonials : FALLBACK_TESTIMONIALS;
    target.innerHTML = renderTestimonialCards(testimonials);
    if (note) {
      note.hidden = !testimonials.some((item) => (item.company || '').toLowerCase().includes('sample'));
    }
  } catch (error) {
    console.error('Unable to load testimonials', error);
    target.innerHTML = renderTestimonialCards(FALLBACK_TESTIMONIALS);
    if (note) note.hidden = false;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupTheme();
    setupNavigation();
    populateCurrentYear();
    loadSettings();
    loadFeaturedProjects();
    loadServices();
    loadTestimonials();
  });
} else {
  setupTheme();
  setupNavigation();
  populateCurrentYear();
  loadSettings();
  loadFeaturedProjects();
  loadServices();
  loadTestimonials();
}
