// Immediately apply saved theme hues to prevent layout color flash
(function() {
  const savedHue = localStorage.getItem('selected-hue');
  if (savedHue) {
    document.documentElement.style.setProperty('--hue', savedHue);
  }
  const savedHue2 = localStorage.getItem('selected-hue2');
  if (savedHue2) {
    document.documentElement.style.setProperty('--hue2', savedHue2);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC CONTENT INJECTION
  initPortfolioContent();
  initTestimonials();
  initGitHubContributions();
  initGithubProjects();

  // 2. INTERACTIVE UI HANDLERS
  initNavigation();
  initThemeToggle();
  initScrollEffects();
  initTypingEffect();
  initProjectFiltering();
  initContactForm();
  initProjectModals();
  initScrollReveal();
  initSecretDashboard();
  initSkillHighlighting();
  initColorCustomizer();
  initSkillsRadar();
});

/* ==================== PROJECT BOOKMARKING & FAVORITES HELPERS ==================== */
function getFavoriteProjects() {
  try {
    return JSON.parse(localStorage.getItem('portfolio_favorite_projects') || '[]');
  } catch (e) {
    return [];
  }
}

function toggleFavoriteProject(title) {
  let favorites = getFavoriteProjects();
  const index = favorites.indexOf(title);
  let isFav = false;
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push(title);
    isFav = true;
  }
  localStorage.setItem('portfolio_favorite_projects', JSON.stringify(favorites));
  return isFav;
}

function updateFavoriteBadge() {
  const badge = document.getElementById('favorite-filter-count');
  if (badge) {
    badge.textContent = getFavoriteProjects().length;
  }
}

/* ==================== DYNAMIC CONTENT INJECTION ==================== */
function initPortfolioContent() {
  if (typeof portfolioData === 'undefined') {
    console.error('portfolioData is not defined. Make sure data.js is loaded first.');
    return;
  }

  const { personal, skills, projects, experience, education } = portfolioData;

  // Personal Info
  document.title = `${personal.name} | Portfolio`;
  document.getElementById('home-title-name').textContent = personal.name;
  document.getElementById('nav-logo').innerHTML = `${personal.name.charAt(0)}<span>.</span>`;
  document.querySelector('.footer-logo').innerHTML = `${personal.name.charAt(0)}<span>.</span>`;
  document.getElementById('avatar-letter').textContent = personal.name.charAt(0);
  document.getElementById('home-desc').textContent = personal.subBio;

  // Set dynamic time-of-day greeting
  const homeSubtitle = document.getElementById('home-subtitle');
  if (homeSubtitle) {
    const hour = new Date().getHours();
    let greeting = "Hello, I'm";
    if (hour < 12) {
      greeting = "Good morning, I'm";
    } else if (hour < 18) {
      greeting = "Good afternoon, I'm";
    } else {
      greeting = "Good evening, I'm";
    }
    homeSubtitle.textContent = greeting;
  }
  document.getElementById('about-bio-detail').textContent = personal.bio;
  document.getElementById('about-sub-bio-detail').textContent = personal.subBio;
  document.getElementById('about-location').textContent = personal.location;
  document.getElementById('about-email').textContent = personal.email;
  document.getElementById('contact-card-email').textContent = personal.email;
  document.getElementById('contact-link-email').href = `mailto:${personal.email}`;
  document.getElementById('contact-card-location').textContent = personal.location;
  
  if (personal.resumeUrl) {
    document.getElementById('btn-resume').href = personal.resumeUrl;
  }

  // Profile Avatar Image handling
  if (personal.profileImage) {
    const avatarEl = document.getElementById('profile-avatar');
    avatarEl.innerHTML = `<img src="${personal.profileImage}" alt="${personal.name}" class="profile-img">`;
  }

  // Social Links
  const socialsContainer = document.getElementById('home-socials-container');
  const footerSocialsContainer = document.getElementById('footer-socials-container');
  socialsContainer.innerHTML = '';
  footerSocialsContainer.innerHTML = '';

  const socialIcons = {
    github: 'fa-brands fa-github',
    linkedin: 'fa-brands fa-linkedin-in',
    twitter: 'fa-brands fa-x-twitter',
    facebook: 'fa-brands fa-facebook-f',
    instagram: 'fa-brands fa-instagram',
    youtube: 'fa-brands fa-youtube',
    email: 'fa-solid fa-envelope'
  };

  Object.entries(personal.socials).forEach(([key, url]) => {
    if (!url || url === '#') return;
    
    const iconClass = socialIcons[key.toLowerCase()] || 'fa-solid fa-link';
    const cleanKey = key.charAt(0).toUpperCase() + key.slice(1);

    // Hero Socials
    const heroLink = document.createElement('a');
    heroLink.href = url;
    heroLink.target = '_blank';
    heroLink.className = 'home-social-link';
    heroLink.ariaLabel = cleanKey;
    heroLink.innerHTML = `<i class="${iconClass}"></i>`;
    socialsContainer.appendChild(heroLink);

    // Footer Socials
    const footerLink = document.createElement('a');
    footerLink.href = url;
    footerLink.target = '_blank';
    footerLink.className = 'footer-social-link';
    footerLink.ariaLabel = cleanKey;
    footerLink.innerHTML = `<i class="${iconClass}"></i>`;
    footerSocialsContainer.appendChild(footerLink);

    // Special bindings for contact cards
    if (key.toLowerCase() === 'linkedin') {
      document.getElementById('contact-link-linkedin').href = url;
    }
  });

  // Skills
  const skillsContainer = document.getElementById('skills-container-el');
  const skillsFilters = document.getElementById('skills-filters');
  const skillsSubtitle = document.getElementById('skills-subtitle');
  
  if (skillsSubtitle && skills) {
    let totalItems = 0;
    skills.forEach(g => { if (g.items) totalItems += g.items.length; });
    skillsSubtitle.textContent = `My technical stack • ${totalItems} core competencies across ${skills.length} categories`;
  }
  
  if (skillsContainer) {
    skillsContainer.innerHTML = '';

    const categoryIcons = {
      'Frontend': 'fa-solid fa-code',
      'Backend & DB': 'fa-solid fa-server',
      'Backend': 'fa-solid fa-server',
      'Database': 'fa-solid fa-database',
      'Tools & DevOps': 'fa-solid fa-screwdriver-wrench',
      'Design': 'fa-solid fa-compass-drafting'
    };

    // Populate skill group cards
    skills.forEach(skillGroup => {
      const iconClass = categoryIcons[skillGroup.category] || 'fa-solid fa-layer-group';
      const card = document.createElement('div');
      card.className = 'skills-category-card';
      const categorySlug = skillGroup.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
      card.setAttribute('data-skill-category', categorySlug);
      
      let itemsHtml = '';
      skillGroup.items.forEach(skill => {
        itemsHtml += `
          <div class="skill-data">
            <div class="skill-names">
              <span class="skill-name">${skill.name}</span>
              <span class="skill-bar-percentage">${skill.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-percentage" data-level="${skill.level}"></div>
            </div>
          </div>
        `;
      });

      card.innerHTML = `
        <h3 class="skills-category-title">
          <i class="${iconClass}"></i> ${skillGroup.category}
        </h3>
        <div class="skills-list">
          ${itemsHtml}
        </div>
      `;
      skillsContainer.appendChild(card);
    });

    // Populate skills filter buttons dynamically
    if (skillsFilters) {
      skillsFilters.innerHTML = '';
      
      // "All" filter button
      const allBtn = document.createElement('button');
      allBtn.className = 'filter-btn active-filter';
      allBtn.setAttribute('data-skill-filter', 'all');
      allBtn.textContent = 'All';
      skillsFilters.appendChild(allBtn);
      
      // Category buttons
      skills.forEach(skillGroup => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        const categorySlug = skillGroup.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
        btn.setAttribute('data-skill-filter', categorySlug);
        btn.textContent = skillGroup.category;
        skillsFilters.appendChild(btn);
      });

      // Filter click handler
      skillsFilters.addEventListener('click', (e) => {
        if (!e.target.classList.contains('filter-btn')) return;

        skillsFilters.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active-filter');
        });
        e.target.classList.add('active-filter');

        const filterValue = e.target.getAttribute('data-skill-filter');
        const cards = skillsContainer.querySelectorAll('.skills-category-card');

        cards.forEach(card => {
          const cardCategory = card.getAttribute('data-skill-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.4s ease forwards';
            
            // Animate percentages
            const bars = card.querySelectorAll('.skill-percentage');
            bars.forEach(bar => {
              const level = bar.getAttribute('data-level');
              bar.style.width = '0%';
              setTimeout(() => {
                bar.style.width = `${level}%`;
              }, 50);
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    // Populate Skills on scroll (progressive reveal)
    const skillBars = document.querySelectorAll('.skill-percentage');
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const level = bar.getAttribute('data-level');
          bar.style.width = `${level}%`;
          skillObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.1 });
    
    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  // Projects Grid & Filters
  const projectsGrid = document.getElementById('projects-grid');
  const filtersContainer = document.getElementById('projects-filters');
  projectsGrid.innerHTML = '';

  const favorites = getFavoriteProjects();
  // Get unique categories for projects to build tabs + Favorites tab
  const categories = ['all', 'favorites', ...new Set(projects.map(p => p.category.toLowerCase()))];
  
  // Re-build category filters
  filtersContainer.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${cat === 'all' ? 'active-filter' : ''}`;
    btn.setAttribute('data-filter', cat);
    if (cat === 'favorites') {
      btn.innerHTML = `<i class="fa-solid fa-star" style="color: #f59e0b; margin-right: 4px;"></i> Favorites <span class="favorite-filter-badge" id="favorite-filter-count">${favorites.length}</span>`;
    } else {
      btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    }
    filtersContainer.appendChild(btn);
  });

  const projectCategoryIcons = {
    frontend: 'fa-solid fa-laptop-code',
    backend: 'fa-solid fa-server',
    fullstack: 'fa-solid fa-layer-group',
    mobile: 'fa-solid fa-mobile-screen-button',
    design: 'fa-solid fa-palette'
  };

  projects.forEach((proj, index) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', proj.category.toLowerCase());
    card.setAttribute('data-index', index);
    
    const isFav = favorites.includes(proj.title);
    
    card.innerHTML = `
      <div class="project-img-container">
        <button class="project-bookmark-btn ${isFav ? 'active' : ''}" aria-label="Bookmark project" data-title="${proj.title}">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
        </button>
        <!-- Overlay links -->
        <div class="project-img-overlay">
          <a href="${proj.githubUrl}" target="_blank" class="project-overlay-link" aria-label="GitHub Source">
            <i class="fa-brands fa-github"></i>
          </a>
          <a href="${proj.demoUrl}" target="_blank" class="project-overlay-link" aria-label="Live Demo">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
        <!-- Dynamic inline SVG visual generator -->
        ${createProjectSVG(proj, index)}
      </div>
      <div class="project-info">
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-desc">${proj.description}</p>
        <div class="project-tags">
          ${proj.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
    projectsGrid.appendChild(card);
  });

  // Experience Timeline
  const expTimeline = document.getElementById('experience-timeline');
  expTimeline.innerHTML = '';
  
  experience.forEach(item => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    
    const descList = item.description.map(desc => `<li>${desc}</li>`).join('');

    timelineItem.innerHTML = `
      <div class="timeline-header">
        <h4 class="timeline-role">${item.role}</h4>
        <span class="timeline-org">${item.company}</span>
        <div><span class="timeline-period">${item.period}</span></div>
      </div>
      <div class="timeline-desc">
        <ul>${descList}</ul>
      </div>
    `;
    expTimeline.appendChild(timelineItem);
  });

  // Education Timeline
  const eduTimeline = document.getElementById('education-timeline');
  eduTimeline.innerHTML = '';
  
  education.forEach(item => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';

    timelineItem.innerHTML = `
      <div class="timeline-header">
        <h4 class="timeline-role">${item.degree}</h4>
        <span class="timeline-org">${item.institution}</span>
        <div><span class="timeline-period">${item.period}</span></div>
      </div>
      <div class="timeline-desc">
        <p>${item.description}</p>
      </div>
    `;
    eduTimeline.appendChild(timelineItem);
  });

  // Footer year update
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

/* ==================== DYNAMIC SVG PROJECT THUMBNAIL UTILITY ==================== */
function createProjectSVG(proj, index) {
  if (proj.isGithubRepo) {
    return `
    <svg viewBox="0 0 400 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="project-thumbnail-svg">
      <defs>
        <linearGradient id="bg-grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--container-color)" />
          <stop offset="100%" stop-color="var(--body-color)" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-grad-${index})" />
      <g stroke="var(--border-color)" stroke-width="1" opacity="0.3">
        <line x1="40" y1="0" x2="40" y2="220" /><line x1="80" y1="0" x2="80" y2="220" /><line x1="120" y1="0" x2="120" y2="220" /><line x1="160" y1="0" x2="160" y2="220" /><line x1="200" y1="0" x2="200" y2="220" /><line x1="240" y1="0" x2="240" y2="220" /><line x1="280" y1="0" x2="280" y2="220" /><line x1="320" y1="0" x2="320" y2="220" /><line x1="360" y1="0" x2="360" y2="220" />
        <line x1="0" y1="40" x2="400" y2="40" /><line x1="0" y1="80" x2="400" y2="80" /><line x1="0" y1="120" x2="400" y2="120" /><line x1="0" y1="160" x2="400" y2="160" /><line x1="0" y1="200" x2="400" y2="200" />
      </g>
      <g opacity="0.95">
        <rect x="50" y="35" width="300" height="150" rx="12" fill="var(--container-color)" stroke="var(--first-color)" stroke-width="1.5" />
        <rect x="50" y="35" width="300" height="30" rx="12" fill="var(--body-color)" opacity="0.8" />
        <circle cx="70" cy="50" r="4.5" fill="#ef4444" />
        <circle cx="82" cy="50" r="4.5" fill="#f59e0b" />
        <circle cx="94" cy="50" r="4.5" fill="#10b981" />
        <text x="115" y="54" font-family="monospace" font-size="9" fill="var(--text-color-light)">github.com/Di-pesh/${proj.githubName.toLowerCase()}</text>
        <path d="M 200 110 c -16.5 0 -30 13.5 -30 30 c 0 13.2 8.5 24.5 20.3 28.4 c 1.5 0.3 2 -0.6 2 -1.4 c 0 -0.7 0 -2.6 0 -5.1 c -8.3 1.8 -10 -4 -10 -4 c -1.4 -3.5 -3.3 -4.4 -3.3 -4.4 c -2.7 -1.8 0.2 -1.8 0.2 -1.8 c 3 0.2 4.6 3.1 4.6 3.1 c 2.7 4.6 7 3.3 8.7 2.5 c 0.3 -2 1.1 -3.3 2 -4.1 c -6.7 -0.8 -13.7 -3.3 -13.7 -14.9 c 0 -3.3 1.2 -6 3.1 -8.1 c -0.3 -0.8 -1.4 -3.8 0.3 -8 c 0 0 2.5 -0.8 8.3 3.1 c 2.4 -0.7 5 -1 7.6 -1 c 2.6 0 5.2 0.3 7.6 1 c 5.8 -3.9 8.3 -3.1 8.3 -3.1 c 1.7 4.2 0.6 7.2 0.3 8 c 1.9 2.1 3.1 4.8 3.1 8.1 c 0 11.6 -7 14.1 -13.8 14.9 c 1.1 0.9 2.1 2.8 2.1 5.6 c 0 4.1 0 7.4 0 8.4 c 0 0.8 0.5 1.7 2 1.4 c 11.8 -3.9 20.3 -15.2 20.3 -28.4 c 0 -16.5 -13.5 -30 -30 -30 z" fill="var(--first-color)" opacity="0.12" transform="translate(0, -25) scale(1.3)" transform-origin="200 110" />
        <text x="200" y="105" font-family="var(--title-font)" font-size="14" font-weight="bold" fill="var(--title-color)" text-anchor="middle">${proj.language || 'Code'}</text>
        <g transform="translate(100, 130)" fill="var(--text-color-light)">
          <path d="M 9.5 1 L 12 6 L 17.5 6.7 L 13.5 10.6 L 14.7 16 L 9.5 13.3 L 4.3 16 L 5.5 10.6 L 1.5 6.7 L 7 6 Z" fill="var(--first-color)" transform="scale(0.8) translate(-10, -5)" />
          <text x="10" y="10" font-family="var(--body-font)" font-size="9" font-weight="bold" fill="var(--title-color)">${proj.stars} stars</text>
          <path d="M 4 2 L 4 6 C 4 7.2 4.8 8 6 8 L 9 8 C 10.2 8 11 8.8 11 10 L 11 14" fill="none" stroke="var(--first-color)" stroke-width="1.8" transform="scale(0.8) translate(105, -3)" />
          <circle cx="87" cy="11.2" r="2" fill="var(--first-color)" />
          <circle cx="87" cy="1.6" r="2" fill="var(--first-color)" />
          <circle cx="92.6" cy="7.2" r="2" fill="var(--first-color)" />
          <text x="83" y="10" font-family="var(--body-font)" font-size="9" font-weight="bold" fill="var(--title-color)">${proj.forks} forks</text>
        </g>
      </g>
      <text x="20" y="28" font-family="var(--title-font)" font-size="9" fill="var(--first-color)" letter-spacing="1.5" opacity="0.8" font-weight="bold">GITHUB REPO</text>
      <text x="380" y="28" font-family="var(--body-font)" font-size="9" fill="var(--text-color-light)" opacity="0.4" text-anchor="end">OPEN_SOURCE</text>
      <text x="20" y="202" font-family="monospace" font-size="8" fill="var(--text-color-light)" opacity="0.5">${proj.tags.slice(0, 3).join(' / ').toUpperCase()}</text>
    </svg>
    `;
  }

  const category = proj.category.toLowerCase();
  
  // Base background & layout grids
  let svgContent = `
    <svg viewBox="0 0 400 220" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="project-thumbnail-svg">
      <defs>
        <linearGradient id="bg-grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--container-color)" />
          <stop offset="100%" stop-color="var(--body-color)" />
        </linearGradient>
        <linearGradient id="accent-grad-${index}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--first-color)" />
          <stop offset="100%" stop-color="var(--first-color-light)" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg-grad-${index})" />
      
      <!-- Abstract decorative dots/grid -->
      <g stroke="var(--border-color)" stroke-width="1" opacity="0.3">
        <line x1="40" y1="0" x2="40" y2="220" />
        <line x1="80" y1="0" x2="80" y2="220" />
        <line x1="120" y1="0" x2="120" y2="220" />
        <line x1="160" y1="0" x2="160" y2="220" />
        <line x1="200" y1="0" x2="200" y2="220" />
        <line x1="240" y1="0" x2="240" y2="220" />
        <line x1="280" y1="0" x2="280" y2="220" />
        <line x1="320" y1="0" x2="320" y2="220" />
        <line x1="360" y1="0" x2="360" y2="220" />
        
        <line x1="0" y1="40" x2="400" y2="40" />
        <line x1="0" y1="80" x2="400" y2="80" />
        <line x1="0" y1="120" x2="400" y2="120" />
        <line x1="0" y1="160" x2="400" y2="160" />
        <line x1="0" y1="200" x2="400" y2="200" />
      </g>
  `;

  // Dynamic visual overlay elements based on category
  if (category === 'fullstack') {
    svgContent += `
      <!-- Interconnected network graph nodes -->
      <g opacity="0.8">
        <!-- Connecting lines -->
        <line x1="200" y1="110" x2="110" y2="70" stroke="var(--first-color)" stroke-dasharray="4 4" stroke-width="2" class="svg-code-line" />
        <line x1="200" y1="110" x2="290" y2="70" stroke="var(--first-color)" stroke-dasharray="4 4" stroke-width="2" class="svg-code-line" />
        <line x1="200" y1="110" x2="200" y2="175" stroke="var(--first-color)" stroke-dasharray="4 4" stroke-width="2" class="svg-code-line" />
        <line x1="110" y1="70" x2="290" y2="70" stroke="var(--border-color)" stroke-width="1" />
        
        <!-- Satellite Nodes -->
        <g class="svg-node svg-node-sat">
          <circle cx="110" cy="70" r="14" fill="var(--container-color)" stroke="var(--first-color)" stroke-width="2" />
          <path d="M 105 70 A 5 5 0 0 1 115 70" fill="none" stroke="var(--first-color-light)" stroke-width="1.5" />
          <text x="110" y="93" font-family="var(--body-font)" font-size="8" fill="var(--text-color-light)" text-anchor="middle">CLIENT</text>
        </g>
        
        <g class="svg-node svg-node-sat">
          <circle cx="290" cy="70" r="14" fill="var(--container-color)" stroke="var(--first-color)" stroke-width="2" />
          <path d="M 285 66 L 295 74 M 295 66 L 285 74" stroke="var(--first-color-light)" stroke-width="1.5" />
          <text x="290" y="93" font-family="var(--body-font)" font-size="8" fill="var(--text-color-light)" text-anchor="middle">API</text>
        </g>
        
        <g class="svg-node svg-node-sat">
          <circle cx="200" cy="175" r="14" fill="var(--container-color)" stroke="var(--first-color)" stroke-width="2" />
          <rect x="194" y="169" width="12" height="12" rx="2" fill="none" stroke="var(--first-color-light)" stroke-width="1.5" />
          <text x="200" y="198" font-family="var(--body-font)" font-size="8" fill="var(--text-color-light)" text-anchor="middle">DB</text>
        </g>
        
        <!-- Central Node -->
        <circle cx="200" cy="110" r="22" fill="url(#accent-grad-${index})" stroke="var(--container-color)" stroke-width="4" class="svg-node svg-node-center" style="cursor: pointer;" />
        <!-- Inner logo icon (stack symbol) -->
        <path d="M 192 105 L 200 101 L 208 105 L 200 109 Z M 192 110 L 200 114 L 208 110 M 192 115 L 200 119 L 208 115" fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" />
      </g>
    `;
  } else if (category === 'frontend') {
    svgContent += `
      <g opacity="0.85">
        <!-- Browser Window -->
        <rect x="80" y="45" width="240" height="130" rx="8" fill="var(--container-color)" stroke="var(--border-color)" stroke-width="2" />
        <rect x="80" y="45" width="240" height="24" rx="8" fill="var(--body-color)" stroke="var(--border-color)" stroke-width="1" />
        
        <!-- Window Controls -->
        <circle cx="95" cy="57" r="4" fill="#ef4444" />
        <circle cx="107" cy="57" r="4" fill="#f59e0b" />
        <circle cx="119" cy="57" r="4" fill="#10b981" />
        
        <!-- Browser address box -->
        <rect x="135" y="51" width="165" height="12" rx="4" fill="var(--container-color)" opacity="0.6" />
        
        <!-- Code / Brackets Visuals -->
        <g stroke="var(--first-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <!-- Open Bracket < -->
          <path d="M 130 100 L 115 110 L 130 120" class="svg-code-line" />
          <!-- Close Bracket > -->
          <path d="M 270 100 L 285 110 L 270 120" class="svg-code-line" />
          <!-- Slash / -->
          <path d="M 210 92 L 190 128" stroke="var(--first-color-light)" stroke-width="2" class="svg-code-line" />
        </g>
        
        <!-- Sub lines representing browser rows -->
        <rect x="150" y="103" width="100" height="4" rx="2" fill="var(--border-color)" />
        <rect x="160" y="113" width="80" height="4" rx="2" fill="var(--border-color)" />
      </g>
    `;
  } else if (category === 'backend') {
    svgContent += `
      <g opacity="0.85">
        <!-- Server 1 -->
        <rect x="90" y="50" width="220" height="32" rx="6" fill="var(--container-color)" stroke="var(--first-color)" stroke-width="1.5" />
        <line x1="90" y1="66" x2="310" y2="66" stroke="var(--border-color)" stroke-width="0.5" />
        <circle cx="115" cy="66" r="4" fill="#4ade80" class="svg-server-led" />
        <circle cx="130" cy="66" r="4" fill="#facc15" class="svg-server-led" style="animation-delay: 0.3s;" />
        <line x1="160" y1="66" x2="280" y2="66" stroke="var(--first-color)" stroke-width="2" stroke-dasharray="6 4" class="svg-code-line" />
        
        <!-- Server 2 -->
        <rect x="90" y="94" width="220" height="32" rx="6" fill="var(--container-color)" stroke="var(--first-color)" stroke-width="1.5" />
        <line x1="90" y1="110" x2="310" y2="110" stroke="var(--border-color)" stroke-width="0.5" />
        <circle cx="115" cy="110" r="4" fill="#4ade80" class="svg-server-led" style="animation-delay: 0.5s;" />
        <circle cx="130" cy="110" r="4" fill="#4ade80" class="svg-server-led" style="animation-delay: 0.1s;" />
        <line x1="160" y1="110" x2="280" y2="110" stroke="var(--first-color)" stroke-width="2" stroke-dasharray="3 3" class="svg-code-line" />

        <!-- Server 3 -->
        <rect x="90" y="138" width="220" height="32" rx="6" fill="var(--container-color)" stroke="var(--first-color)" stroke-width="1.5" />
        <line x1="90" y1="154" x2="310" y2="154" stroke="var(--border-color)" stroke-width="0.5" />
        <circle cx="115" cy="154" r="4" fill="#4ade80" class="svg-server-led" style="animation-delay: 0.2s;" />
        <circle cx="130" cy="154" r="4" fill="#ef4444" class="svg-server-led" style="animation-delay: 0.7s;" />
        <line x1="160" y1="154" x2="280" y2="154" stroke="var(--first-color)" stroke-width="2" stroke-dasharray="10 4" class="svg-code-line" />
      </g>
    `;
  } else {
    svgContent += `
      <g opacity="0.85">
        <!-- Draw vector grid line and curved path -->
        <path d="M 80 160 C 140 30, 260 30, 320 160" fill="none" stroke="url(#accent-grad-${index})" stroke-width="3" class="svg-design-curve" />
        
        <!-- Vector Control Points -->
        <line x1="80" y1="160" x2="140" y2="30" stroke="var(--text-color-light)" stroke-width="1" stroke-dasharray="3 3" />
        <line x1="320" y1="160" x2="260" y2="30" stroke="var(--text-color-light)" stroke-width="1" stroke-dasharray="3 3" />
        
        <circle cx="140" cy="30" r="5" fill="var(--container-color)" stroke="var(--first-color)" stroke-width="2" />
        <circle cx="260" cy="30" r="5" fill="var(--container-color)" stroke="var(--first-color)" stroke-width="2" />
        
        <!-- Main coordinates -->
        <rect x="74" y="154" width="12" height="12" rx="2" fill="var(--first-color)" />
        <rect x="314" y="154" width="12" height="12" rx="2" fill="var(--first-color)" />
        
        <!-- Rotating gear / circular outline -->
        <circle cx="200" cy="105" r="26" fill="none" stroke="var(--border-color)" stroke-width="1.5" stroke-dasharray="4 6" />
        <circle cx="200" cy="105" r="10" fill="none" stroke="var(--border-color)" stroke-width="1.5" />
      </g>
    `;
  }

  svgContent += `
      <!-- Labels inside SVG -->
      <text x="20" y="32" font-family="var(--title-font)" font-size="10" fill="var(--first-color)" letter-spacing="2" opacity="0.75" font-weight="bold">${proj.category.toUpperCase()}</text>
      <text x="380" y="32" font-family="var(--body-font)" font-size="10" fill="var(--text-color-light)" opacity="0.5" text-anchor="end">CODE_VISUAL</text>
      
      <!-- Tags list inside SVG background at bottom -->
      <text x="20" y="196" font-family="monospace" font-size="9" fill="var(--text-color-light)" opacity="0.5">${proj.tags.slice(0, 3).join(' / ').toUpperCase()}</text>
    </svg>
  `;
  return svgContent;
}

/* ==================== INTERACTIVE UI NAVIGATION ==================== */
function initNavigation() {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav-link');

  // Open Menu
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
    });
  }

  // Close Menu
  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  }

  // Auto-close Menu when menu items are clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  });
}

/* ==================== THEME TOGGLE (DARK/LIGHT) ==================== */
function initThemeToggle() {
  const themeButton = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const darkTheme = 'dark-theme';
  const lightTheme = 'light-theme';

  // Retrieve saved preference
  let selectedTheme = localStorage.getItem('selected-theme');
  if (!selectedTheme) {
    selectedTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  
  // Set default state based on preference
  if (selectedTheme === 'light') {
    document.body.classList.remove(darkTheme);
    document.body.classList.add(lightTheme);
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  } else {
    document.body.classList.add(darkTheme);
    document.body.classList.remove(lightTheme);
    if (themeIcon) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }

  // Toggle button event
  if (themeButton && themeIcon) {
    themeButton.addEventListener('click', () => {
      if (document.body.classList.contains(lightTheme)) {
        document.body.classList.replace(lightTheme, darkTheme);
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('selected-theme', 'dark');
      } else {
        document.body.classList.replace(darkTheme, lightTheme);
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('selected-theme', 'light');
      }
    });
  }

  // Listen for system theme changes dynamically if no preference is stored
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('selected-theme')) {
      if (e.matches) {
        document.body.classList.replace(darkTheme, lightTheme);
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
      } else {
        document.body.classList.replace(lightTheme, darkTheme);
        if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
      }
    }
  });
}

/* ==================== SCROLL EFFECTS & NAVBAR STICKY ==================== */
function initScrollEffects() {
  const header = document.getElementById('header');
  const scrollUp = document.getElementById('scroll-up');
  const progressBar = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Page Scroll Progress Bar Width
    if (docHeight > 0) {
      const scrolled = (scrollY / docHeight) * 100;
      progressBar.style.width = `${scrolled}%`;
    }

    // Sticky Header Border + Background blur
    if (scrollY >= 50) {
      header.classList.add('scroll-header');
    } else {
      header.classList.remove('scroll-header');
    }

    // Back to top button visibility
    if (scrollY >= 560) {
      scrollUp.classList.add('show-scroll');
    } else {
      scrollUp.classList.remove('show-scroll');
    }

    // Navigation Active Link Highlighting on Scroll
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active-link');
        } else {
          navLink.classList.remove('active-link');
        }
      }
    });
  });
}

/* ==================== HERO TYPING EFFECTS ==================== */
function initTypingEffect() {
  const typingTextSpan = document.getElementById('typing-text');
  
  if (!typingTextSpan || typeof portfolioData === 'undefined') return;
  
  const words = portfolioData.personal.titles;
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingTextSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      typingTextSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Regular typing speed
    }

    // Word finished typing
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1500; // Pause at full word
    } 
    // Word fully deleted
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Brief pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  // Bootstrap typing cycle
  setTimeout(type, 1000);
}

/* ==================== PROJECTS FILTERING & SEARCH ==================== */
function initProjectFiltering() {
  const filtersContainer = document.getElementById('projects-filters');
  const searchInput = document.getElementById('projects-search-input');
  const searchClear = document.getElementById('projects-search-clear');
  const projectsGrid = document.getElementById('projects-grid');
  const sortSelect = document.getElementById('projects-sort-select');

  if (!filtersContainer || !searchInput || !projectsGrid) return;

  let currentCategory = 'all';
  let currentSearch = '';
  let currentSort = 'default';

  function applyFilter() {
    const projectCards = document.querySelectorAll('.project-card');
    let visibleCount = 0;
    
    // Remove existing empty state if any
    const existingEmpty = projectsGrid.querySelector('.projects-empty-state');
    if (existingEmpty) {
      existingEmpty.remove();
    }

    const favs = getFavoriteProjects();

    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const index = parseInt(card.getAttribute('data-index'));
      const project = portfolioData.projects[index];
      
      let categoryMatch = false;
      if (currentCategory === 'all') {
        categoryMatch = true;
      } else if (currentCategory === 'favorites') {
        categoryMatch = project ? favs.includes(project.title) : false;
      } else {
        categoryMatch = (cardCategory === currentCategory);
      }
      
      let searchMatch = true;
      if (currentSearch && project) {
        const query = currentSearch.toLowerCase();
        const titleMatch = project.title.toLowerCase().includes(query);
        const descMatch = project.description.toLowerCase().includes(query);
        const detailedDescMatch = (project.detailedDescription || '').toLowerCase().includes(query);
        const tagMatch = project.tags.some(tag => tag.toLowerCase().includes(query));
        
        searchMatch = titleMatch || descMatch || detailedDescMatch || tagMatch;
      }

      if (categoryMatch && searchMatch) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.4s ease forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Re-order project cards in DOM according to sorting selection
    const cardsArray = Array.from(projectCards);
    cardsArray.sort((a, b) => {
      if (currentSort === 'name-asc') {
        const titleA = a.querySelector('.project-title').textContent.toLowerCase();
        const titleB = b.querySelector('.project-title').textContent.toLowerCase();
        return titleA.localeCompare(titleB);
      } else if (currentSort === 'name-desc') {
        const titleA = a.querySelector('.project-title').textContent.toLowerCase();
        const titleB = b.querySelector('.project-title').textContent.toLowerCase();
        return titleB.localeCompare(titleA);
      } else if (currentSort === 'tags-desc') {
        const tagsA = a.querySelectorAll('.project-tag').length;
        const tagsB = b.querySelectorAll('.project-tag').length;
        return tagsB - tagsA;
      } else {
        // default: sort by index
        const indexA = parseInt(a.getAttribute('data-index'));
        const indexB = parseInt(b.getAttribute('data-index'));
        return indexA - indexB;
      }
    });

    // Re-append sorted cards
    cardsArray.forEach(card => projectsGrid.appendChild(card));

    // Render empty state if no visible projects
    if (visibleCount === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'projects-empty-state';
      if (currentCategory === 'favorites') {
        emptyState.innerHTML = `
          <i class="fa-solid fa-star" style="color: #f59e0b;"></i>
          <h3>No Bookmarked Projects</h3>
          <p>Click the bookmark icon on any project card to save your favorite projects here!</p>
        `;
      } else {
        emptyState.innerHTML = `
          <i class="fa-solid fa-hourglass-empty"></i>
          <h3>No Projects Found</h3>
          <p>We couldn't find any projects matching "${escapeHtml(currentSearch)}" in the "${currentCategory}" category.</p>
        `;
      }
      projectsGrid.appendChild(emptyState);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  // Category filter click event
  filtersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    // Toggle active filter button style
    const activeFilter = document.querySelector('#projects-filters .active-filter');
    if (activeFilter) activeFilter.classList.remove('active-filter');
    btn.classList.add('active-filter');

    currentCategory = btn.getAttribute('data-filter');
    applyFilter();
  });

  // Bookmark button click handler via grid event delegation
  projectsGrid.addEventListener('click', (e) => {
    const bookmarkBtn = e.target.closest('.project-bookmark-btn');
    if (!bookmarkBtn) return;

    e.stopPropagation(); // Prevent opening project details modal
    e.preventDefault();

    const title = bookmarkBtn.getAttribute('data-title');
    if (!title) return;

    const isFav = toggleFavoriteProject(title);

    if (isFav) {
      bookmarkBtn.classList.add('active');
      bookmarkBtn.querySelector('i').className = 'fa-solid fa-bookmark';
      if (typeof showToast === 'function') {
        showToast(`Saved "${title}" to your favorites!`, 'info');
      }
    } else {
      bookmarkBtn.classList.remove('active');
      bookmarkBtn.querySelector('i').className = 'fa-regular fa-bookmark';
      if (typeof showToast === 'function') {
        showToast(`Removed "${title}" from your favorites.`, 'info');
      }
    }

    updateFavoriteBadge();

    if (currentCategory === 'favorites') {
      applyFilter();
    }
  });

  // Search input typing event
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    
    // Show/hide clear button
    if (currentSearch) {
      searchClear.style.display = 'flex';
    } else {
      searchClear.style.display = 'none';
    }
    
    applyFilter();
  });

  // Search clear button click event
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      currentSearch = '';
      searchClear.style.display = 'none';
      searchInput.focus();
      applyFilter();
    });
  }

  // Sort select change event
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFilter();
    });
  }
}

// Add simple fade keyframes programmatically to keep CSS cleaner
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95) translateY(5px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(style);

/* ==================== CONTACT FORM HANDLER ==================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-message-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form) return;

  const messageInput = document.getElementById('form-message');
  const charCounter = document.getElementById('form-char-counter');

  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const length = messageInput.value.length;
      charCounter.textContent = `${length} / 500 characters`;
      if (length >= 450) {
        charCounter.style.color = 'var(--first-color)';
        charCounter.style.fontWeight = 'bold';
      } else {
        charCounter.style.color = 'var(--text-color-light)';
        charCounter.style.fontWeight = 'normal';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Capture input values for the secret logs
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    const newMessage = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      name,
      email,
      subject,
      message,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    // Save to local storage
    const messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
    messages.unshift(newMessage);
    localStorage.setItem('portfolio_contact_messages', JSON.stringify(messages));

    // Visual loading state
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

    // Simulate sending email message (2 seconds delay)
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Reset contact details inputs
      form.reset();
      if (charCounter) {
        charCounter.textContent = '0 / 500 characters';
        charCounter.style.color = 'var(--text-color-light)';
        charCounter.style.fontWeight = 'normal';
      }

      // Show Success Banner & Toast
      statusEl.className = 'form-message-status success';
      statusEl.textContent = 'Thank you! Your message has been sent successfully.';
      showToast('Thank you! Your message has been sent successfully.', 'success');
      
      // Trigger Confetti Celebration
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      
      // Auto-hide success banner after 5 seconds
      setTimeout(() => {
        statusEl.className = 'form-message-status';
        statusEl.textContent = '';
      }, 5000);

    }, 2000);
  });
}

/* ==================== INTERACTIVE PROJECT DETAILS MODAL ==================== */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('project-modal-close');
  const modalBody = document.getElementById('project-modal-body');
  
  if (!modal || !closeBtn || !modalBody) return;

  // Add event listener delegation to the projects grid
  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      // Find the card element
      const card = e.target.closest('.project-card');
      if (!card) return;

      // If clicked on an external link in the overlay, don't open the modal
      if (e.target.closest('.project-overlay-link')) return;

      const index = card.getAttribute('data-index');
      if (index === null || typeof portfolioData === 'undefined') return;

      const project = portfolioData.projects[index];
      if (!project) return;

      openProjectModal(project);
    });
  }

  // Close modal click triggers
  closeBtn.addEventListener('click', () => {
    closeProjectModal();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show-modal')) {
      closeProjectModal();
    }
  });

  function openProjectModal(project) {
    // Icons based on category
    const projectCategoryIcons = {
      frontend: 'fa-solid fa-laptop-code',
      backend: 'fa-solid fa-server',
      fullstack: 'fa-solid fa-layer-group',
      mobile: 'fa-solid fa-mobile-screen-button',
      design: 'fa-solid fa-palette'
    };
    const categoryIcon = projectCategoryIcons[project.category.toLowerCase()] || 'fa-solid fa-gears';

    // Populate content
    const featuresListHtml = (project.features || [])
      .map(feat => `<li><i class="fa-solid fa-circle-check"></i> <span>${feat}</span></li>`)
      .join('');

    modalBody.innerHTML = `
      <div class="modal-project-header">
        <span class="modal-project-category">${project.category}</span>
        <h2 class="modal-project-title">${project.title}</h2>
      </div>
      
      <div class="modal-project-img-placeholder" style="height:250px; overflow:hidden;">
        ${createProjectSVG(project, 99)}
      </div>
      
      <p class="modal-project-description">${project.detailedDescription || project.description}</p>
      
      ${featuresListHtml ? `
        <h3 class="modal-project-section-title">Key Features</h3>
        <ul class="modal-project-features-list">
          ${featuresListHtml}
        </ul>
      ` : ''}
      
      <h3 class="modal-project-section-title">Technologies</h3>
      <div class="modal-project-tags">
        ${project.tags.map(tag => `<span class="modal-project-tag">${tag}</span>`).join('')}
      </div>
      
      <div class="modal-project-buttons">
        <a href="${project.demoUrl}" target="_blank" class="btn btn-primary">
          Live Demo <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
        <a href="${project.githubUrl}" target="_blank" class="btn btn-secondary">
          View Code <i class="fa-brands fa-github"></i>
        </a>
      </div>

      <h3 class="modal-project-section-title" style="margin-top: 1.5rem; font-size: var(--h3-font-size); color: var(--title-color); margin-bottom: 0.75rem;">Share Project</h3>
      <div class="modal-project-share" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
        <button id="modal-share-copy-btn" class="btn btn-secondary" style="padding: 0.5rem 0.85rem; font-size: var(--small-font-size); display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer; border-radius: 0.5rem; background: var(--container-color); border: 1px solid var(--border-color); color: var(--title-color);">
          <i class="fa-solid fa-copy"></i> Copy Link
        </button>
        <a href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20project%3A%20${encodeURIComponent(project.title)}&url=${encodeURIComponent(project.demoUrl || project.githubUrl)}" target="_blank" class="btn btn-secondary" style="padding: 0.5rem 0.85rem; font-size: var(--small-font-size); display: inline-flex; align-items: center; gap: 0.4rem; border-radius: 0.5rem; background: var(--container-color); border: 1px solid var(--border-color); color: var(--title-color);">
          <i class="fa-brands fa-x-twitter"></i> X / Twitter
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(project.demoUrl || project.githubUrl)}" target="_blank" class="btn btn-secondary" style="padding: 0.5rem 0.85rem; font-size: var(--small-font-size); display: inline-flex; align-items: center; gap: 0.4rem; border-radius: 0.5rem; background: var(--container-color); border: 1px solid var(--border-color); color: var(--title-color);">
          <i class="fa-brands fa-linkedin-in"></i> LinkedIn
        </a>
      </div>
    `;

    // Clipboard share handling
    const copyBtn = document.getElementById('modal-share-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const link = project.demoUrl || project.githubUrl;
        navigator.clipboard.writeText(link).then(() => {
          showToast('Project link copied to clipboard!', 'success');
        }).catch(err => {
          console.error('Failed to copy link:', err);
          showToast('Could not copy link.', 'error');
        });
      });
    }

    // Accessibility
    modal.classList.add('show-modal');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock scroll
  }

  function closeProjectModal() {
    modal.classList.remove('show-modal');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock scroll
  }
}

/* ==================== SCROLL REVEAL ANIMATIONS ==================== */
function initScrollReveal() {
  const sections = document.querySelectorAll('section.section');
  
  // Add base reveal class to all sections
  sections.forEach(sec => {
    sec.classList.add('reveal-section');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active-reveal');
        // Unobserve after revealing to prevent repeating animation
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // animate slightly before they fully enter the viewport
  });

  sections.forEach(sec => {
    revealObserver.observe(sec);
  });
}

/* ==================== SECRET MESSAGE CONTROL CONSOLE ==================== */
function initSecretDashboard() {
  const dashboard = document.getElementById('dashboard-modal');
  const closeBtn = document.getElementById('dashboard-modal-close');
  const tableBody = document.getElementById('dashboard-table-body');
  const msgCountEl = document.getElementById('dashboard-message-count');
  const clearAllBtn = document.getElementById('dashboard-clear-all');
  
  // Secret trigger: clicking the footer logo 5 times
  const footerLogo = document.querySelector('.footer-logo');
  let clickCount = 0;
  let clickTimer = null;

  if (footerLogo) {
    footerLogo.style.cursor = 'pointer';
    footerLogo.addEventListener('click', (e) => {
      e.preventDefault();
      clickCount++;

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 3000); // Reset count if 3s passes without clicks

      if (clickCount >= 5) {
        clickCount = 0;
        openDashboard();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeDashboard();
    });
  }

  if (dashboard) {
    dashboard.addEventListener('click', (e) => {
      if (e.target === dashboard) {
        closeDashboard();
      }
    });
  }

  // Keyboard shortcut: Ctrl + Shift + L
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      openDashboard();
    }
    if (e.key === 'Escape' && dashboard && dashboard.classList.contains('show-modal')) {
      closeDashboard();
    }
  });

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all message logs?')) {
        localStorage.removeItem('portfolio_contact_messages');
        renderMessages();
      }
    });
  }

  // CLI Command prompt input handler
  const cliInput = document.getElementById('dashboard-cli-input');
  if (cliInput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const commandText = cliInput.value.trim();
        cliInput.value = '';
        if (commandText) {
          executeCliCommand(commandText);
        }
      }
    });
  }

  function hexToHue(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    if (!result) return null;
    
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;

    if (max === min) {
      h = 0;
    } else {
      const d = max - min;
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return Math.round(h * 360);
  }

  function executeCliCommand(cmd) {
    const args = cmd.split(' ');
    const mainCmd = args[0].toLowerCase();

    switch (mainCmd) {
      case '/help':
        showToast(`Available administrative terminal commands:\n\n` +
                  `/help - Displays this help manual.\n` +
                  `/profile - Renders stylized developer ASCII profile card.\n` +
                  `/skills - Renders retro ASCII skill level bar charts.\n` +
                  `/quote - Displays a random inspiring programming quote.\n` +
                  `/stats - Compiles statistical summary of the database.\n` +
                  `/mock - Generates 3 mock logs for testing UI layouts.\n` +
                  `/theme <hue|hex|random|reset> - Adjusts real-time accent color hue/hex.\n` +
                  `/export - Downloads contact messages log as a JSON file.\n` +
                  `/delete <id> - Deletes a specific contact message by its ID.\n` +
                  `/matrix - Spawns retro matrix digital rain screensaver.\n` +
                  `/play - Play a classic retro Snake game easter egg.\n` +
                  `/credits - Renders retro AI partner pair-programming credits.\n` +
                  `/purge - Destroys all stored logs permanently.`, 'info', 11000);
        break;


      case '/skills':
        if (typeof portfolioData === 'undefined') {
          showToast('Data source not loaded.', 'error');
          break;
        }
        let skillsAscii = "--- RETRO ASCII SKILL LEVELS ---\n\n";
        portfolioData.skills.forEach(cat => {
          skillsAscii += `${cat.category.toUpperCase()}\n`;
          cat.items.forEach(skill => {
            const barLength = Math.round(skill.level / 10);
            const bar = '█'.repeat(barLength) + '░'.repeat(10 - barLength);
            skillsAscii += `  ${skill.name.padEnd(20)} [${bar}] ${skill.level}%\n`;
          });
          skillsAscii += '\n';
        });
        showToast(skillsAscii, 'monospace', 12000);
        break;

      case '/quote':
        const quotes = [
          "\"Talk is cheap. Show me the code.\" - Linus Torvalds",
          "\"Programs must be written for people to read, and only coincidentally for machines to execute.\" - Harold Abelson",
          "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" - Martin Fowler",
          "\"First, solve the problem. Then, write the code.\" - John Johnson",
          "\"Experience is the name everyone gives to their mistakes.\" - Oscar Wilde",
          "\"In order to be irreplaceable one must always be different.\" - Coco Chanel",
          "\"Java is to JavaScript what car is to Carpet.\" - Chris Heilmann",
          "\"Simplicity is the soul of efficiency.\" - Austin Freeman",
          "\"Code is like humor. When you have to explain it, it's bad.\" - Cory House"
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        showToast(`--- PROGRAMMING INSPIRATION ---\n\n${randomQuote}`, 'monospace', 8000);
        break;

      case '/profile':
        // Show base profile info first
        let profileInfo = 
          " ____  _pesh\n" +
          "|  _ \\(_)_ __   ___  ___| |__\n" +
          "| | | | | '_ \\ / _ \\/ __| '_ \\\n" +
          "| |_| | | |_) |  __/\\__ \\ | | |\n" +
          "|____/|_| .__/ \\___||___/_| |_|\n" +
          "        |_|\n\n" +
          `Name:      ${portfolioData.personal.name}\n` +
          `Title:     ${portfolioData.personal.titles[0]}\n` +
          `Location:  ${portfolioData.personal.location}\n` +
          `Email:     ${portfolioData.personal.email}\n` +
          `Github:    ${portfolioData.personal.socials.github}\n\n` +
          `Fetching recent repository commits...`;
        
        showToast(profileInfo, 'monospace', 8000);

        // Fetch recent commits from GitHub API
        fetch('https://api.github.com/repos/Di-pesh/Portfolio/commits?per_page=5')
          .then(res => {
            if (!res.ok) throw new Error('API Error');
            return res.json();
          })
          .then(commits => {
            let commitLines = '\n--- RECENT COMMITS ---\n';
            commits.forEach(c => {
              const date = new Date(c.commit.author.date).toLocaleDateString();
              const msg = c.commit.message.split('\n')[0];
              const sha = c.sha.substring(0, 7);
              commitLines += `[${date}] (${sha}) ${msg}\n`;
            });
            
            const updatedCard = 
              " ____  _pesh\n" +
              "|  _ \\(_)_ __   ___  ___| |__\n" +
              "| | | | | '_ \\ / _ \\/ __| '_ \\\n" +
              "| |_| | | |_) |  __/\\__ \\ | | |\n" +
              "|____/|_| .__/ \\___||___/_| |_|\n" +
              "        |_|\n\n" +
              `Name:      ${portfolioData.personal.name}\n` +
              `Title:     ${portfolioData.personal.titles[0]}\n` +
              `Location:  ${portfolioData.personal.location}\n` +
              `Email:     ${portfolioData.personal.email}\n` +
              `Github:    ${portfolioData.personal.socials.github}\n` +
              commitLines;
              
            showToast(updatedCard, 'monospace', 15000);
          })
          .catch(err => {
            console.error('Error fetching commits:', err);
            const fallbackCard = 
              " ____  _pesh\n" +
              "|  _ \\(_)_ __   ___  ___| |__\n" +
              "| | | | | '_ \\ / _ \\/ __| '_ \\\n" +
              "| |_| | | |_) |  __/\\__ \\ | | |\n" +
              "|____/|_| .__/ \\___||___/_| |_|\n" +
              "        |_|\n\n" +
              `Name:      ${portfolioData.personal.name}\n` +
              `Title:     ${portfolioData.personal.titles[0]}\n` +
              `Location:  ${portfolioData.personal.location}\n` +
              `Email:     ${portfolioData.personal.email}\n` +
              `Github:    ${portfolioData.personal.socials.github}\n\n` +
              `Unable to fetch live commits. Please verify your internet connection.`;
            showToast(fallbackCard, 'monospace', 10000);
          });
        break;

      case '/theme':
        if (!args[1]) {
          const currentHue = getComputedStyle(document.documentElement).getPropertyValue('--hue').trim();
          showToast(`Current theme hue is ${currentHue}.\nTry: /theme <0-360>, /theme random, or /theme reset`, 'info');
          break;
        }

        const option = args[1].toLowerCase();
        const customizerColorBtns = document.querySelectorAll('.color-option-btn');
        const syncCustomizer = (hue) => {
          customizerColorBtns.forEach(btn => {
            if (btn.getAttribute('data-hue') === String(hue)) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });
        };

        if (option === 'random') {
          const randomHue = Math.floor(Math.random() * 361);
          document.documentElement.style.setProperty('--hue', randomHue);
          localStorage.setItem('selected-hue', randomHue);
          syncCustomizer(randomHue);
          showToast(`Accent color set to random hue: ${randomHue}`, 'success');
        } else if (option === 'reset') {
          const defaultHue = '250';
          document.documentElement.style.setProperty('--hue', defaultHue);
          localStorage.removeItem('selected-hue');
          syncCustomizer(defaultHue);
          showToast('Accent color reset to default (Indigo).', 'success');
        } else if (option.startsWith('#') || /^[a-f\d]{3}$/i.test(option) || /^[a-f\d]{6}$/i.test(option)) {
          const calculatedHue = hexToHue(option);
          if (calculatedHue !== null) {
            document.documentElement.style.setProperty('--hue', calculatedHue);
            localStorage.setItem('selected-hue', calculatedHue);
            syncCustomizer(calculatedHue);
            showToast(`Accent color set to Hex ${option.toUpperCase()} (Hue: ${calculatedHue})`, 'success');
          } else {
            showToast('Invalid hex color format.', 'error');
          }
        } else {
          const hueVal = parseInt(option);
          if (!isNaN(hueVal) && hueVal >= 0 && hueVal <= 360) {
            document.documentElement.style.setProperty('--hue', hueVal);
            localStorage.setItem('selected-hue', hueVal);
            syncCustomizer(hueVal);
            showToast(`Accent color updated to hue: ${hueVal}`, 'success');
          } else {
            showToast('Invalid option. Use: /theme <0-360>, /theme <hex>, /theme random, or /theme reset', 'error');
          }
        }
        break;
        
      case '/stats':
        const messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
        if (messages.length === 0) {
          showToast('Database stats: No messages logged yet.', 'warning');
          break;
        }
        
        const senders = [...new Set(messages.map(m => m.name))].length;
        const subjects = [...new Set(messages.map(m => m.subject))].length;
        
        // Compile stats on screen resolutions
        let resCounts = {};
        let platformCounts = {};
        messages.forEach(m => {
          if (m.screenResolution) {
            resCounts[m.screenResolution] = (resCounts[m.screenResolution] || 0) + 1;
          }
          if (m.userAgent) {
            let platform = 'Unknown';
            if (m.userAgent.includes('Windows')) platform = 'Windows';
            else if (m.userAgent.includes('Macintosh') || m.userAgent.includes('Mac OS')) platform = 'macOS';
            else if (m.userAgent.includes('Linux')) platform = 'Linux';
            else if (m.userAgent.includes('Android')) platform = 'Android';
            else if (m.userAgent.includes('iPhone') || m.userAgent.includes('iPad')) platform = 'iOS';
            platformCounts[platform] = (platformCounts[platform] || 0) + 1;
          }
        });
        
        // Find top resolution and platform
        let topRes = 'N/A';
        let topResCount = 0;
        Object.entries(resCounts).forEach(([res, count]) => {
          if (count > topResCount) {
            topResCount = count;
            topRes = res;
          }
        });
        
        let topPlatform = 'N/A';
        let topPlatformCount = 0;
        Object.entries(platformCounts).forEach(([plat, count]) => {
          if (count > topPlatformCount) {
            topPlatformCount = count;
            topPlatform = plat;
          }
        });

        showToast(`--- SYSTEM CONTROL STATS ---\n\n` +
                  `Total Messages: ${messages.length}\n` +
                  `Unique Senders: ${senders}\n` +
                  `Unique Subjects: ${subjects}\n` +
                  `Top OS Platform: ${topPlatform} (${topPlatformCount} entries)\n` +
                  `Top Resolution:  ${topRes} (${topResCount} entries)`, 'info', 9000);
        break;

      case '/mock':
        const mockMsgs = [
          {
            id: 1,
            date: new Date().toLocaleString(),
            name: "John Doe",
            email: "john.doe@google.com",
            subject: "Job Offer / Hiring opportunities",
            message: "Hello Dipesh, we loved your interactive workspace portfolio. We would love to schedule a follow-up screening interview for a Full Stack Developer position next Tuesday.",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            screenResolution: "1920x1080"
          },
          {
            id: 2,
            date: new Date(Date.now() - 3600000).toLocaleString(),
            name: "Jane Smith",
            email: "jane@shopify.com",
            subject: "Freelance Project Inquiry",
            message: "Hi Dipesh! I need a high-fidelity glassmorphic landing page styled with clean vanilla CSS. Your portfolios styling is perfect. Let me know your rates.",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
            screenResolution: "1440x900"
          },
          {
            id: 3,
            date: new Date(Date.now() - 7200000).toLocaleString(),
            name: "David Miller",
            email: "d.miller@gmail.com",
            subject: "Feedback on open source kit",
            message: "Hey Dipesh, your glassmorphic design system kit was extremely helpful for my side project. Keep up the excellent work!",
            userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            screenResolution: "2560x1440"
          }
        ];
        
        const currentMsgs = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
        localStorage.setItem('portfolio_contact_messages', JSON.stringify([...mockMsgs, ...currentMsgs]));
        renderMessages();
        showToast('Mock seed data injected successfully.', 'success');
        break;

      case '/export':
        const msgsToExport = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
        if (msgsToExport.length === 0) {
          showToast('Database empty: No messages to export.', 'warning');
          break;
        }
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(msgsToExport, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `portfolio_contact_messages_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Messages exported as JSON.', 'success');
        break;

      case '/matrix':
        startMatrixRain();
        break;

      case '/play':
      case '/snake':
        startSnakeGame();
        break;
        
      case '/credits':
        showToast(
          "--- AI DEVELOPMENT CO-PILOT CREDITS ---\n\n" +
          "Project Lead: Dipesh Mehra\n" +
          "AI Assistant: Antigravity (Advanced Agentic Coding @ DeepMind)\n\n" +
          "Engineered using pure frontend technologies, custom CSS variable tokens, " +
          "and canvas celebrations. Dynamic SVGs, bookmark manager systems, " +
          "and radar map layouts are built for maximum interactive fidelity.",
          'monospace', 10000
        );
        break;

      case '/delete':
        if (!args[1]) {
          showToast('Error: Please specify the message ID to delete.\nUsage: /delete <id>', 'error');
          break;
        }
        const deleteId = parseInt(args[1]);
        if (isNaN(deleteId)) {
          showToast('Error: Message ID must be a valid number.\nUsage: /delete <id>', 'error');
          break;
        }
        let messagesList = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
        const originalLength = messagesList.length;
        messagesList = messagesList.filter(msg => msg.id !== deleteId);
        if (messagesList.length === originalLength) {
          showToast(`Error: No message found with ID ${deleteId}.`, 'error');
        } else {
          localStorage.setItem('portfolio_contact_messages', JSON.stringify(messagesList));
          renderMessages();
          showToast(`Success: Message with ID ${deleteId} has been deleted.`, 'success');
        }
        break;

      case '/purge':
        if (confirm('Verify: Purge all local contact logs?')) {
          localStorage.removeItem('portfolio_contact_messages');
          renderMessages();
          showToast('Database purged.', 'success');
        }
        break;
        
      default:
        showToast(`Error: Command "${mainCmd}" not recognized.\nType /help to see all available commands.`, 'error');
    }
  }

  function openDashboard() {
    renderMessages();
    if (dashboard) {
      dashboard.classList.add('show-modal');
      dashboard.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDashboard() {
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
      canvas.click();
    }
    const snakeContainer = document.getElementById('snake-container');
    if (snakeContainer) {
      const exitBtn = document.getElementById('snake-exit-btn');
      if (exitBtn) exitBtn.click();
    }
    if (dashboard) {
      dashboard.classList.remove('show-modal');
      dashboard.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function startMatrixRain() {
    const dashboardContent = document.querySelector('.dashboard-content');
    if (!dashboardContent) return;

    let canvas = document.getElementById('matrix-canvas');
    if (canvas) return;

    canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    dashboardContent.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const rect = dashboardContent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const resizeHandler = () => {
      const newRect = dashboardContent.getBoundingClientRect();
      canvas.width = newRect.width;
      canvas.height = newRect.height;
    };
    window.addEventListener('resize', resizeHandler);

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=<>[]{}()&%#@!^~|';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const rainDrops = Array(columns).fill(1);

    let animationId;

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#4ade80'; // matrix green to match CLI text color!
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    }

    draw();

    showToast('Entering matrix digital rain. Click canvas or press any key to exit.', 'success', 4000);

    const exitMatrix = () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeHandler);
      canvas.remove();
      document.removeEventListener('keydown', keydownExitHandler, true);
      const cliInput = document.getElementById('dashboard-cli-input');
      if (cliInput) cliInput.focus();
    };

    canvas.addEventListener('click', exitMatrix);

    const keydownExitHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      exitMatrix();
    };
    document.addEventListener('keydown', keydownExitHandler, true);
  }

  function startSnakeGame() {
    const dashboardContent = document.querySelector('.dashboard-content');
    if (!dashboardContent) return;

    let container = document.getElementById('snake-container');
    if (container) return;

    container = document.createElement('div');
    container.id = 'snake-container';
    
    // Theme sync - check if there's a custom accent color, we use var(--first-color)
    const customAccent = getComputedStyle(document.documentElement).getPropertyValue('--first-color').trim();
    const customAccentLight = getComputedStyle(document.documentElement).getPropertyValue('--first-color-light').trim();

    container.innerHTML = `
      <div class="snake-header">=== RETRO SNAKE OS CLI ===</div>
      <div class="snake-scores">
        <span>SCORE: <span id="snake-score-val">00</span></span>
        <span>HI-SCORE: <span id="snake-hiscore-val">00</span></span>
      </div>
      <canvas id="snake-canvas" width="400" height="400"></canvas>
      <div class="snake-instructions">
        Use Arrow keys or WASD to navigate. Esc to exit.
      </div>
      <button id="snake-exit-btn" class="btn btn-secondary btn-small">
        <i class="fa-solid fa-power-off"></i> Exit Game
      </button>
    `;
    
    dashboardContent.appendChild(container);

    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const scoreValEl = document.getElementById('snake-score-val');
    const hiscoreValEl = document.getElementById('snake-hiscore-val');
    const exitBtn = document.getElementById('snake-exit-btn');

    let score = 0;
    let hiScore = parseInt(localStorage.getItem('portfolio_snake_hiscore') || '0');
    hiscoreValEl.textContent = String(hiScore).padStart(2, '0');

    const gridSize = 20;
    let snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    let direction = 'right';
    let nextDirection = 'right';
    let food = { x: 15, y: 10 };
    let speed = 130;
    let gameInterval = null;
    let isGameOver = false;

    function generateFood() {
      let newFood;
      while (true) {
        newFood = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize)
        };
        const onSnake = snake.some(part => part.x === newFood.x && part.y === newFood.y);
        if (!onSnake) break;
      }
      food = newFood;
    }

    function gameLoop() {
      if (isGameOver) return;

      direction = nextDirection;
      const head = { x: snake[0].x, y: snake[0].y };

      if (direction === 'right') head.x++;
      if (direction === 'left') head.x--;
      if (direction === 'up') head.y--;
      if (direction === 'down') head.y++;

      // Check wall collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        triggerGameOver();
        return;
      }

      // Check self collision
      const selfCollide = snake.some(part => part.x === head.x && part.y === head.y);
      if (selfCollide) {
        triggerGameOver();
        return;
      }

      snake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreValEl.textContent = String(score).padStart(2, '0');
        if (score > hiScore) {
          hiScore = score;
          localStorage.setItem('portfolio_snake_hiscore', String(hiScore));
          hiscoreValEl.textContent = String(hiScore).padStart(2, '0');
        }
        generateFood();
        
        // Increase speed slightly
        clearInterval(gameInterval);
        speed = Math.max(70, 130 - Math.floor(score / 20) * 5);
        gameInterval = setInterval(gameLoop, speed);
      } else {
        snake.pop();
      }

      draw();
    }

    function draw() {
      // Clear canvas
      ctx.fillStyle = '#060e08';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Faint scanlines/grid
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 20, 0);
        ctx.lineTo(i * 20, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * 20);
        ctx.lineTo(canvas.width, i * 20);
        ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = 'hsl(345, 75%, 55%)'; // Rose red for food
      ctx.beginPath();
      ctx.arc(food.x * 20 + 10, food.y * 20 + 10, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw snake
      snake.forEach((part, idx) => {
        if (idx === 0) {
          ctx.fillStyle = customAccent || '#22c55e';
        } else {
          ctx.fillStyle = customAccentLight || '#86efac';
        }
        ctx.fillRect(part.x * 20 + 1, part.y * 20 + 1, 18, 18);
        
        if (idx === 0) {
          ctx.fillStyle = '#000';
          if (direction === 'right' || direction === 'left') {
            ctx.fillRect(part.x * 20 + 8, part.y * 20 + 4, 3, 3);
            ctx.fillRect(part.x * 20 + 8, part.y * 20 + 12, 3, 3);
          } else {
            ctx.fillRect(part.x * 20 + 4, part.y * 20 + 8, 3, 3);
            ctx.fillRect(part.x * 20 + 12, part.y * 20 + 8, 3, 3);
          }
        }
      });
    }

    function triggerGameOver() {
      isGameOver = true;
      clearInterval(gameInterval);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('*** GAME OVER ***', canvas.width / 2, canvas.height / 2 - 20);
      
      ctx.fillStyle = '#22c55e';
      ctx.font = '14px monospace';
      ctx.fillText(`FINAL SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillText('PRESS ANY KEY TO RESTART', canvas.width / 2, canvas.height / 2 + 40);
    }

    function restartGame() {
      snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ];
      direction = 'right';
      nextDirection = 'right';
      score = 0;
      scoreValEl.textContent = '00';
      speed = 130;
      isGameOver = false;
      generateFood();
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, speed);
    }

    function handleKeyDown(e) {
      const key = e.key;
      
      if (key === 'Escape') {
        exitGame();
        return;
      }

      if (isGameOver) {
        restartGame();
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(key)) {
        e.preventDefault();
      }

      if ((key === 'ArrowUp' || key.toLowerCase() === 'w') && direction !== 'down') nextDirection = 'up';
      if ((key === 'ArrowDown' || key.toLowerCase() === 's') && direction !== 'up') nextDirection = 'down';
      if ((key === 'ArrowLeft' || key.toLowerCase() === 'a') && direction !== 'right') nextDirection = 'left';
      if ((key === 'ArrowRight' || key.toLowerCase() === 'd') && direction !== 'left') nextDirection = 'right';
    }

    function exitGame() {
      clearInterval(gameInterval);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', blockEscapeClose, true);
      container.remove();
      const cliInput = document.getElementById('dashboard-cli-input');
      if (cliInput) cliInput.focus();
    }

    function blockEscapeClose(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        exitGame();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', blockEscapeClose, true);
    exitBtn.addEventListener('click', exitGame);

    generateFood();
    draw();
    gameInterval = setInterval(gameLoop, speed);
    showToast('Terminal game started! Use arrows/WASD to play.', 'success');
  }

  function renderMessages() {
    if (!tableBody) return;
    
    const messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
    msgCountEl.textContent = `Total Messages: ${messages.length}`;
    tableBody.innerHTML = '';

    if (messages.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="dashboard-empty-state">
              <i class="fa-solid fa-folder-open"></i>
              <p>No messages recorded yet. Submit the contact form to generate logs!</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    messages.forEach((msg) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="dashboard-date">${msg.date}</span></td>
        <td><span class="dashboard-sender-name">${escapeHtml(msg.name)}</span></td>
        <td><a href="mailto:${escapeHtml(msg.email)}" style="color: var(--first-color); text-decoration: underline;">${escapeHtml(msg.email)}</a></td>
        <td><strong>${escapeHtml(msg.subject)}</strong></td>
        <td><div class="dashboard-msg-text" title="${escapeHtml(msg.message)}">${escapeHtml(msg.message)}</div></td>
        <td>
          <button class="btn-delete-msg" data-id="${msg.id}" aria-label="Delete message">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Add delete listeners
    tableBody.querySelectorAll('.btn-delete-msg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.getAttribute('data-id'));
        deleteMessage(id);
      });
    });
  }

  function deleteMessage(id) {
    let messages = JSON.parse(localStorage.getItem('portfolio_contact_messages') || '[]');
    messages = messages.filter(msg => msg.id !== id);
    localStorage.setItem('portfolio_contact_messages', JSON.stringify(messages));
    renderMessages();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

/* ==================== SKILL TAG MATCH HIGH-LIGHTING ==================== */
function initSkillHighlighting() {
  const skillsContainer = document.getElementById('skills-container-el');
  if (!skillsContainer) return;

  skillsContainer.addEventListener('click', (e) => {
    const skillData = e.target.closest('.skill-data');
    if (!skillData) return;

    const skillName = skillData.querySelector('.skill-name').textContent;
    const projectCards = document.querySelectorAll('.project-card');
    
    // Toggle active state on the clicked skill
    const wasActive = skillData.classList.contains('active-skill');
    
    // Deactivate all other skills
    document.querySelectorAll('.skill-data').forEach(el => {
      el.classList.remove('active-skill');
    });

    if (!wasActive) {
      skillData.classList.add('active-skill');
      
      // Highlight matching projects
      projectCards.forEach(card => {
        const title = card.querySelector('.project-title').textContent;
        // Find project object from portfolioData
        if (typeof portfolioData === 'undefined') return;
        const project = portfolioData.projects.find(p => p.title === title);
        if (project && matchSkillWithProject(skillName, project.tags, project.category)) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1.03)';
          card.style.borderColor = 'var(--first-color)';
          card.style.boxShadow = '0 10px 25px hsla(var(--hue), 75%, 60%, 0.15)';
        } else {
          card.style.opacity = '0.25';
          card.style.transform = 'scale(0.97)';
          card.style.borderColor = 'var(--border-color)';
          card.style.boxShadow = 'none';
        }
      });
    } else {
      // Reset all project cards styling
      projectCards.forEach(card => {
        card.style.opacity = '';
        card.style.transform = '';
        card.style.borderColor = '';
        card.style.boxShadow = '';
      });
    }
  });

  function matchSkillWithProject(skillName, projectTags, projectCategory) {
    const normSkill = skillName.toLowerCase().trim();
    
    // Direct or substring match on category
    if (projectCategory.toLowerCase().includes(normSkill) || normSkill.includes(projectCategory.toLowerCase())) {
      return true;
    }
    
    // Substring match on tags
    return projectTags.some(tag => {
      const normTag = tag.toLowerCase().trim();
      return normSkill.includes(normTag) || normTag.includes(normSkill);
    });
  }
}

/* ==================== TESTIMONIALS SLIDER CAROUSEL ==================== */
function initTestimonials() {
  if (typeof portfolioData === 'undefined' || !portfolioData.testimonials) return;

  const carousel = document.getElementById('testimonials-carousel');
  const indicatorsContainer = document.getElementById('testimonials-indicators');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (!carousel || !indicatorsContainer) return;

  // 1. Render Cards & Indicators
  carousel.innerHTML = '';
  indicatorsContainer.innerHTML = '';

  portfolioData.testimonials.forEach((test, index) => {
    // Card HTML
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <div class="testimonial-avatar">${test.avatarLetter}</div>
      <p class="testimonial-quote">"${test.quote}"</p>
      <div class="testimonial-author-info">
        <span class="testimonial-name">${test.name}</span>
        <span class="testimonial-role">${test.role} @ ${test.company}</span>
      </div>
    `;
    carousel.appendChild(card);

    // Indicator Dot HTML
    const dot = document.createElement('span');
    dot.className = `testimonial-dot ${index === 0 ? 'active-dot' : ''}`;
    dot.setAttribute('data-slide', index);
    indicatorsContainer.appendChild(dot);
  });

  // 2. Slider Navigation Logic
  let currentSlide = 0;
  const totalSlides = portfolioData.testimonials.length;
  let autoSlideInterval = null;

  function goToSlide(slideIndex) {
    if (slideIndex < 0) {
      slideIndex = totalSlides - 1;
    } else if (slideIndex >= totalSlides) {
      slideIndex = 0;
    }
    
    currentSlide = slideIndex;
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active dot
    document.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active-dot');
      } else {
        dot.classList.remove('active-dot');
      }
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000); // Swipe every 6 seconds
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  // Hook event listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startAutoSlide(); // Reset timer
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startAutoSlide(); // Reset timer
    });
  }

  indicatorsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('testimonial-dot')) {
      const slideIndex = parseInt(e.target.getAttribute('data-slide'));
      goToSlide(slideIndex);
      startAutoSlide(); // Reset timer
    }
  });

  // Pause autoslide on mouse hover
  const wrapper = document.querySelector('.testimonials-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoSlide);
    wrapper.addEventListener('mouseleave', startAutoSlide);
  }

  // Bootstrap autoslide
  startAutoSlide();
}

/* ==================== INTERACTIVE COLOR CUSTOMIZER ==================== */
function initColorCustomizer() {
  const toggleBtn = document.getElementById('customizer-toggle');
  const closeBtn = document.getElementById('customizer-close');
  const panel = document.getElementById('customizer-panel');
  const overlay = document.getElementById('customizer-overlay');
  const colorBtns = document.querySelectorAll('.color-option-btn');
  const modeBtn = document.getElementById('customizer-mode-toggle');
  const resetBtn = document.getElementById('customizer-reset-btn');
  
  const hueSlider = document.getElementById('customizer-hue-slider');
  const hueVal = document.getElementById('customizer-hue-val');
  const hue2Slider = document.getElementById('customizer-hue2-slider');
  const hue2Val = document.getElementById('customizer-hue2-val');

  // Load and apply saved hue immediately
  const savedHue = localStorage.getItem('selected-hue') || '250';
  const savedHue2 = localStorage.getItem('selected-hue2') || '280';
  const defaultHue = '250';
  const defaultHue2 = '280';
  
  // Apply initially
  document.documentElement.style.setProperty('--hue', savedHue);
  document.documentElement.style.setProperty('--hue2', savedHue2);

  if (hueSlider && hueVal) {
    hueSlider.value = savedHue;
    hueVal.textContent = savedHue;
  }
  if (hue2Slider && hue2Val) {
    hue2Slider.value = savedHue2;
    hue2Val.textContent = savedHue2;
  }

  // Set active class on correct preset button
  colorBtns.forEach(btn => {
    if (btn.getAttribute('data-hue') === savedHue) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (!toggleBtn || !panel || !closeBtn || !overlay) return;

  // Toggle Panel Open/Close
  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('show-customizer');
    overlay.classList.toggle('show-overlay');
    panel.setAttribute('aria-hidden', panel.classList.contains('show-customizer') ? 'false' : 'true');
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('show-customizer');
    overlay.classList.remove('show-overlay');
    panel.setAttribute('aria-hidden', 'true');
  });

  overlay.addEventListener('click', () => {
    panel.classList.remove('show-customizer');
    overlay.classList.remove('show-overlay');
    panel.setAttribute('aria-hidden', 'true');
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('show-customizer')) {
      panel.classList.remove('show-customizer');
      overlay.classList.remove('show-overlay');
      panel.setAttribute('aria-hidden', 'true');
    }
  });

  // Color Selection Handlers (Solid presets)
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const hue = btn.getAttribute('data-hue');
      
      // Update CSS Variable
      document.documentElement.style.setProperty('--hue', hue);
      
      // Persist choice
      localStorage.setItem('selected-hue', hue);
      
      // Update UI active state
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Sync slider
      if (hueSlider && hueVal) {
        hueSlider.value = hue;
        hueVal.textContent = hue;
      }
    });
  });

  // Sliders input event handlers
  if (hueSlider && hueVal) {
    hueSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      hueVal.textContent = val;
      document.documentElement.style.setProperty('--hue', val);
      localStorage.setItem('selected-hue', val);

      // Deactivate all preset buttons since it's a custom hue
      colorBtns.forEach(b => b.classList.remove('active'));
    });
  }

  if (hue2Slider && hue2Val) {
    hue2Slider.addEventListener('input', (e) => {
      const val = e.target.value;
      hue2Val.textContent = val;
      document.documentElement.style.setProperty('--hue2', val);
      localStorage.setItem('selected-hue2', val);
    });
  }

  // Synchronize Mode Toggle with header toggle button
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      const mainThemeToggle = document.getElementById('theme-toggle');
      if (mainThemeToggle) {
        mainThemeToggle.click();
      }
    });
  }

  // Reset to default
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Revert CSS custom variables to default
      document.documentElement.style.setProperty('--hue', defaultHue);
      document.documentElement.style.setProperty('--hue2', defaultHue2);
      
      // Remove from localStorage
      localStorage.removeItem('selected-hue');
      localStorage.removeItem('selected-hue2');
      
      // Reset active button state
      colorBtns.forEach(btn => {
        if (btn.getAttribute('data-hue') === defaultHue) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Sync sliders UI
      if (hueSlider && hueVal) {
        hueSlider.value = defaultHue;
        hueVal.textContent = defaultHue;
      }
      if (hue2Slider && hue2Val) {
        hue2Slider.value = defaultHue2;
        hue2Val.textContent = defaultHue2;
      }
      
      // Close the panel
      panel.classList.remove('show-customizer');
      overlay.classList.remove('show-overlay');
      panel.setAttribute('aria-hidden', 'true');
    });
  }
}

/* ==================== TOAST NOTIFICATION UTILITY ==================== */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Icon based on notification type
  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-exclamation',
    info: 'fa-solid fa-circle-info',
    warning: 'fa-solid fa-triangle-exclamation'
  };
  const iconClass = icons[type] || icons.info;

  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <div class="toast-content">
      <p class="toast-message">${message}</p>
    </div>
    <button class="toast-close-btn" aria-label="Close notification">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  // Trigger animation in next frame
  requestAnimationFrame(() => {
    toast.classList.add('show-toast');
  });

  // Automatically remove toast
  let autoDismissTimer = setTimeout(() => {
    dismissToast();
  }, duration);

  // Close button trigger
  const closeBtn = toast.querySelector('.toast-close-btn');
  closeBtn.addEventListener('click', () => {
    clearTimeout(autoDismissTimer);
    dismissToast();
  });

  function dismissToast() {
    toast.classList.remove('show-toast');
    toast.addEventListener('transitionend', () => {
      toast.remove();
      // Remove container if empty to clean up DOM
      if (container.children.length === 0) {
        container.remove();
      }
    });
  }
}

/* ==================== INTERACTIVE SKILLS RADAR CHART ==================== */
function initSkillsRadar() {
  const toggleBtn = document.getElementById('skills-radar-toggle');
  const wrapper = document.getElementById('skills-radar-wrapper');
  const svgContainer = document.getElementById('skills-radar-svg-container');
  const tooltip = document.getElementById('radar-tooltip');

  if (!toggleBtn || !wrapper || !svgContainer || typeof portfolioData === 'undefined') return;

  const { skills } = portfolioData;
  const numCats = skills.length;
  if (numCats < 3) return;

  const cx = 200;
  const cy = 200;
  const maxR = 140;

  const categories = skills.map(g => g.category);
  const averages = skills.map(group => {
    const sum = group.items.reduce((acc, item) => acc + item.level, 0);
    return sum / group.items.length;
  });

  const angleStep = (Math.PI * 2) / numCats;

  function getCoords(index, val) {
    const angle = angleStep * index - Math.PI / 2;
    const r = (val / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  }

  let svgHtml = `
    <svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
      <defs>
        <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="var(--first-color)" stop-opacity="0.15" />
          <stop offset="100%" stop-color="var(--first-color-light)" stop-opacity="0" />
        </radialGradient>
      </defs>
      
      <circle cx="${cx}" cy="${cy}" r="${maxR}" fill="url(#radar-glow)" />
  `;

  const gridLevels = [25, 50, 75, 100];
  gridLevels.forEach(level => {
    const pts = [];
    for (let i = 0; i < numCats; i++) {
      const coords = getCoords(i, level);
      pts.push(`${coords.x},${coords.y}`);
    }
    svgHtml += `
      <polygon points="${pts.join(' ')}" fill="none" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="${level === 100 ? 'none' : '4 4'}" />
      <text x="${cx}" y="${cy - (level / 100) * maxR + 12}" font-family="monospace" font-size="8" fill="var(--text-color-light)" opacity="0.5" text-anchor="middle">${level}%</text>
    `;
  });

  categories.forEach((cat, i) => {
    const borderCoords = getCoords(i, 100);
    const labelAngle = angleStep * i - Math.PI / 2;
    const labelOffset = 18;
    const labelX = cx + (maxR + labelOffset) * Math.cos(labelAngle);
    const labelY = cy + (maxR + labelOffset) * Math.sin(labelAngle) + 4;
    
    let textAnchor = 'middle';
    if (Math.cos(labelAngle) > 0.1) textAnchor = 'start';
    else if (Math.cos(labelAngle) < -0.1) textAnchor = 'end';

    svgHtml += `
      <line x1="${cx}" y1="${cy}" x2="${borderCoords.x}" y2="${borderCoords.y}" stroke="var(--border-color)" stroke-width="1.5" />
      <text x="${labelX}" y="${labelY}" font-family="var(--title-font)" font-size="10" font-weight="bold" fill="var(--title-color)" text-anchor="${textAnchor}">${cat.toUpperCase()}</text>
    `;
  });

  const dataPts = [];
  averages.forEach((avg, i) => {
    const coords = getCoords(i, avg);
    dataPts.push(`${coords.x},${coords.y}`);
  });
  
  svgHtml += `
    <polygon points="${dataPts.join(' ')}" fill="hsla(var(--hue), 75%, 60%, 0.25)" stroke="var(--first-color)" stroke-width="3.5" class="radar-poly" />
  `;

  averages.forEach((avg, i) => {
    const coords = getCoords(i, avg);
    const skillsList = skills[i].items
      .map(item => `<div>• ${item.name}: <strong>${item.level}%</strong></div>`)
      .join('');

    svgHtml += `
      <circle cx="${coords.x}" cy="${coords.y}" r="6" fill="var(--first-color-light)" stroke="var(--first-color)" stroke-width="2" class="radar-dot" data-category="${categories[i]}" data-avg="${avg.toFixed(0)}%" data-skills="${encodeURIComponent(skillsList)}" style="cursor: pointer; transition: transform 0.2s;" />
    `;
  });

  svgHtml += `</svg>`;
  svgContainer.innerHTML = svgHtml;

  toggleBtn.addEventListener('click', () => {
    const isHidden = wrapper.style.display === 'none';
    if (isHidden) {
      wrapper.style.display = 'block';
      setTimeout(() => {
        wrapper.style.opacity = '1';
      }, 50);
      
      const poly = svgContainer.querySelector('.radar-poly');
      if (poly) {
        poly.style.transform = 'scale(0)';
        poly.style.transformOrigin = '200px 200px';
        poly.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        setTimeout(() => {
          poly.style.transform = 'scale(1)';
        }, 100);
      }
      
      const dots = svgContainer.querySelectorAll('.radar-dot');
      dots.forEach((dot, idx) => {
        dot.style.transform = 'scale(0)';
        dot.style.transformOrigin = `${dot.getAttribute('cx')}px ${dot.getAttribute('cy')}px`;
        dot.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        setTimeout(() => {
          dot.style.transform = 'scale(1)';
        }, 400 + idx * 100);
      });

      toggleBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> Hide Radar Map`;
      toggleBtn.classList.add('active-filter');
    } else {
      wrapper.style.opacity = '0';
      setTimeout(() => {
        wrapper.style.display = 'none';
      }, 400);
      toggleBtn.innerHTML = `<i class="fa-solid fa-circle-nodes"></i> Toggle Radar Map`;
      toggleBtn.classList.remove('active-filter');
    }
  });

  svgContainer.addEventListener('mouseover', (e) => {
    const dot = e.target.closest('.radar-dot');
    if (!dot) return;

    dot.setAttribute('r', '8');
    dot.style.transform = 'scale(1.2)';

    const category = dot.getAttribute('data-category');
    const average = dot.getAttribute('data-avg');
    const skillsHtml = decodeURIComponent(dot.getAttribute('data-skills'));

    tooltip.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 0.4rem; color: var(--first-color); border-bottom: 1px solid var(--border-color); padding-bottom: 0.2rem;">${category} Average: ${average}</div>
      <div style="font-size: 0.75rem; color: var(--text-color); display: flex; flex-direction: column; row-gap: 0.2rem;">
        ${skillsHtml}
      </div>
    `;

    const wrapperRect = wrapper.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();
    
    const x = dotRect.left - wrapperRect.left + (dotRect.width / 2) + 12;
    const y = dotRect.top - wrapperRect.top + (dotRect.height / 2) - 40;

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.display = 'block';
  });

  svgContainer.addEventListener('mouseout', (e) => {
    const dot = e.target.closest('.radar-dot');
    if (!dot) return;

    dot.setAttribute('r', '6');
    dot.style.transform = 'scale(1)';
    tooltip.style.display = 'none';
  });
}

// Bind showToast to window so it is accessible globally
window.showToast = showToast;

/* ==================== GITHUB INTEGRATION LOGIC ==================== */

async function initGitHubContributions() {
  const username = getGitHubUsername();
  const calendarContainer = document.getElementById('github-weeks-container');
  const calendarTitle = document.getElementById('github-calendar-title');
  const calendarSubtitle = document.getElementById('github-calendar-subtitle');
  
  if (!calendarContainer) return;

  // Render skeleton loading
  renderContributionsSkeleton(calendarContainer);

  try {
    const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
    if (!response.ok) throw new Error('API response was not ok');
    const data = await response.json();
    
    if (!data.contributions || data.contributions.length === 0) {
      throw new Error('No contribution data found');
    }

    setupContributionsCalendar(data);
    initGitHubCommits(username);
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    if (calendarSubtitle) calendarSubtitle.textContent = 'Unable to load live activity data.';
    calendarContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-color-light);">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 0.8rem; color: var(--first-color);"></i>
        <p>Could not connect to GitHub contributions scraper. View my live work directly on my GitHub profile below.</p>
      </div>
    `;
  }
}

function getGitHubUsername() {
  if (typeof portfolioData !== 'undefined' && portfolioData.personal && portfolioData.personal.socials && portfolioData.personal.socials.github) {
    const url = portfolioData.personal.socials.github;
    const match = url.match(/github\.com\/([a-zA-Z0-9-]+)\/?$/);
    if (match && match[1]) return match[1];
  }
  return 'Di-pesh';
}

function renderContributionsSkeleton(container) {
  container.innerHTML = '';
  let skeletonHtml = '';
  // 53 columns * 7 rows of skeleton squares
  for (let c = 2; c <= 54; c++) {
    for (let r = 2; r <= 8; r++) {
      skeletonHtml += `<div class="contrib-day github-skeleton" style="grid-column: ${c}; grid-row: ${r}; background-color: var(--border-color); opacity: 0.3; animation-delay: ${(c % 5) * 0.1}s;"></div>`;
    }
  }
  container.innerHTML = skeletonHtml;
}

function setupContributionsCalendar(data) {
  const contributions = data.contributions;
  const total = data.total;
  const yearSelect = document.getElementById('github-year-select');

  if (!yearSelect) return;

  calculateStreaks(contributions);

  const years = Object.keys(total).sort((a, b) => b - a);
  
  yearSelect.innerHTML = '';
  
  const lastYearBtn = document.createElement('button');
  lastYearBtn.className = 'github-year-btn active';
  lastYearBtn.textContent = 'Last Year';
  lastYearBtn.addEventListener('click', () => {
    setActiveYearBtn(lastYearBtn);
    renderCalendarPeriod(contributions, 'last-year');
  });
  yearSelect.appendChild(lastYearBtn);

  years.forEach(year => {
    const btn = document.createElement('button');
    btn.className = 'github-year-btn';
    btn.textContent = year;
    btn.addEventListener('click', () => {
      setActiveYearBtn(btn);
      renderCalendarPeriod(contributions, year);
    });
    yearSelect.appendChild(btn);
  });

  renderCalendarPeriod(contributions, 'last-year');
}

function setActiveYearBtn(clickedBtn) {
  const buttons = document.querySelectorAll('.github-year-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');
}

function renderCalendarPeriod(contributions, period) {
  const container = document.getElementById('github-weeks-container');
  const calendarTitle = document.getElementById('github-calendar-title');
  const calendarSubtitle = document.getElementById('github-calendar-subtitle');
  const gridEl = document.getElementById('github-calendar-grid');
  
  if (!container || !gridEl) return;
  container.innerHTML = '';

  let filtered = [];
  let titleText = '';
  let startDate;

  if (period === 'last-year') {
    filtered = contributions.slice(-365);
    const totalCount = filtered.reduce((sum, day) => sum + day.count, 0);
    titleText = 'Recent Open Source Contributions';
    if (calendarSubtitle) calendarSubtitle.textContent = `${totalCount} contributions in the last 365 days`;
    startDate = new Date(filtered[0].date + 'T00:00:00');
  } else {
    filtered = contributions.filter(day => day.date.startsWith(`${period}-`));
    const totalCount = filtered.reduce((sum, day) => sum + day.count, 0);
    titleText = `${period} Contributions`;
    if (calendarSubtitle) calendarSubtitle.textContent = `${totalCount} contributions in ${period}`;
    startDate = new Date(`${period}-01-01T00:00:00`);
  }

  if (calendarTitle) calendarTitle.textContent = titleText;

  const startD = startDate.getDay();
  const diffDaysMap = {};
  
  filtered.forEach(day => {
    const currentDate = new Date(day.date + 'T00:00:00');
    const diffTime = currentDate - startDate;
    const diffDays = Math.round(diffTime / 86400000);
    const D = currentDate.getDay();
    const W = Math.floor((diffDays + startD) / 7);
    
    diffDaysMap[day.date] = { W, D, level: day.level, count: day.count };
  });

  let maxW = 0;
  Object.values(diffDaysMap).forEach(item => {
    if (item.W > maxW) maxW = item.W;
  });

  gridEl.style.gridTemplateColumns = `35px repeat(${maxW + 1}, 10px)`;

  let cellsHtml = '';
  filtered.forEach(day => {
    const item = diffDaysMap[day.date];
    if (item) {
      cellsHtml += `
        <div class="contrib-day contrib-level-${item.level}" 
             style="grid-column: ${item.W + 2}; grid-row: ${item.D + 2};" 
             data-date="${day.date}" 
             data-count="${day.count}"></div>
      `;
    }
  });

  let monthsHtml = '';
  let lastMonthW = -99;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  filtered.forEach((day, index) => {
    const item = diffDaysMap[day.date];
    if (!item) return;

    const parts = day.date.split('-');
    const monthIndex = parseInt(parts[1]) - 1;
    const dayOfMonth = parseInt(parts[2]);

    if (dayOfMonth === 1 || index === 0) {
      if (item.W - lastMonthW >= 3) {
        monthsHtml += `<div class="github-month-label" style="grid-column: ${item.W + 2}; grid-row: 1;">${monthNames[monthIndex]}</div>`;
        lastMonthW = item.W;
      }
    }
  });

  container.innerHTML = monthsHtml + cellsHtml;
  setupTooltipEvents();
}

function calculateStreaks(contributions) {
  let totalContribs = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let busiestCount = 0;
  let busiestDateStr = 'N/A';

  contributions.sort((a, b) => new Date(a.date) - new Date(b.date));

  let tempStreak = 0;
  contributions.forEach(day => {
    totalContribs += day.count;

    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }

    if (day.count > busiestCount) {
      busiestCount = day.count;
      busiestDateStr = day.date;
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  let activeIdx = -1;
  for (let i = contributions.length - 1; i >= 0; i--) {
    if (contributions[i].date === todayStr || contributions[i].date === yesterdayStr) {
      activeIdx = i;
      break;
    }
  }

  if (activeIdx !== -1) {
    const hasRecent = contributions[activeIdx].count > 0 || 
                      (activeIdx > 0 && contributions[activeIdx - 1].count > 0);
    
    if (hasRecent) {
      let startIdx = contributions[activeIdx].count > 0 ? activeIdx : activeIdx - 1;
      for (let i = startIdx; i >= 0; i--) {
        if (contributions[i].count > 0) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  const totalEl = document.getElementById('github-total-contribs');
  const currentEl = document.getElementById('github-current-streak');
  const longestEl = document.getElementById('github-longest-streak');
  const busiestEl = document.getElementById('github-busiest-day');

  if (totalEl) totalEl.textContent = totalContribs;
  if (currentEl) currentEl.textContent = `${currentStreak} day${currentStreak === 1 ? '' : 's'}`;
  if (longestEl) longestEl.textContent = `${longestStreak} day${longestStreak === 1 ? '' : 's'}`;
  
  if (busiestEl) {
    if (busiestCount > 0) {
      const parts = busiestDateStr.split('-');
      const bDate = new Date(parts[0], parts[1] - 1, parts[2]);
      const bDateStr = bDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
      busiestEl.textContent = `${busiestCount} (${bDateStr})`;
    } else {
      busiestEl.textContent = '0';
    }
  }
}

function setupTooltipEvents() {
  const tooltip = document.getElementById('github-tooltip');
  const cells = document.querySelectorAll('#github-weeks-container .contrib-day');
  
  if (!tooltip) return;

  cells.forEach(cell => {
    cell.addEventListener('mouseenter', (e) => {
      const dateStr = cell.getAttribute('data-date');
      const count = parseInt(cell.getAttribute('data-count'));
      
      const parts = dateStr.split('-');
      const date = new Date(parts[0], parts[1] - 1, parts[2]);
      const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      
      tooltip.innerHTML = `<strong>${count}</strong> contribution${count === 1 ? '' : 's'} on ${formattedDate}`;
      tooltip.style.display = 'block';
    });

    cell.addEventListener('mousemove', (e) => {
      tooltip.style.left = `${e.pageX + 12}px`;
      tooltip.style.top = `${e.pageY - 35}px`;
    });

    cell.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
}

async function initGithubProjects() {
  const username = getGitHubUsername();
  const cacheKey = `github_repos_${username}`;
  const cacheTimeKey = `github_repos_${username}_time`;
  const oneHour = 60 * 60 * 1000;
  
  let repos = null;
  const cachedRepos = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(cacheTimeKey);
  const now = new Date().getTime();

  if (cachedRepos && cachedTime && (now - parseInt(cachedTime) < oneHour)) {
    try {
      repos = JSON.parse(cachedRepos);
    } catch (e) {
      console.error("Error parsing cached repos", e);
    }
  }

  if (!repos) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      if (response.ok) {
        const data = await response.json();
        repos = data.filter(repo => !repo.fork).map(repo => {
          return {
            title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
            githubName: repo.name,
            description: repo.description || 'Public code repository hosted on GitHub.',
            detailedDescription: repo.description || 'A public software code project developed and published on GitHub.',
            features: [
              `Primary Programming Language: ${repo.language || 'HTML/CSS'}`,
              `GitHub Stars: ${repo.stargazers_count}`,
              `Repository Forks: ${repo.forks_count}`,
              `Repository Watchers: ${repo.watchers_count}`
            ],
            tags: [repo.language || 'Code', ...(repo.topics || [])].slice(0, 4),
            category: 'github-repo',
            image: 'github',
            demoUrl: repo.homepage || repo.html_url,
            githubUrl: repo.html_url,
            isGithubRepo: true,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language || 'Code'
          };
        });

        localStorage.setItem(cacheKey, JSON.stringify(repos));
        localStorage.setItem(cacheTimeKey, now.toString());
      }
    } catch (error) {
      console.error("Error fetching github repos:", error);
    }
  }

  if (repos && repos.length > 0 && typeof portfolioData !== 'undefined') {
    portfolioData.projects = portfolioData.projects.filter(p => !p.isGithubRepo);
    portfolioData.projects = [...portfolioData.projects, ...repos];
    rebuildProjectsSection();
  }
}

function rebuildProjectsSection() {
  const projectsGrid = document.getElementById('projects-grid');
  const filtersContainer = document.getElementById('projects-filters');
  
  if (!projectsGrid || !filtersContainer || typeof portfolioData === 'undefined') return;

  const projects = portfolioData.projects;
  const favorites = getFavoriteProjects();
  const categories = ['all', 'favorites', ...new Set(projects.map(p => p.category.toLowerCase()))];
  
  const activeBtn = filtersContainer.querySelector('.active-filter');
  const currentActiveFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

  filtersContainer.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${cat === currentActiveFilter ? 'active-filter' : ''}`;
    btn.setAttribute('data-filter', cat);
    
    if (cat === 'favorites') {
      btn.innerHTML = `<i class="fa-solid fa-star" style="color: #f59e0b; margin-right: 4px;"></i> Favorites <span class="favorite-filter-badge" id="favorite-filter-count">${favorites.length}</span>`;
    } else {
      let label = cat.charAt(0).toUpperCase() + cat.slice(1);
      if (cat === 'github-repo') label = 'Github Repos';
      btn.textContent = label;
    }
    filtersContainer.appendChild(btn);
  });

  projectsGrid.innerHTML = '';
  projects.forEach((proj, index) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', proj.category.toLowerCase());
    card.setAttribute('data-index', index);
    
    const sourceBadge = proj.isGithubRepo 
      ? `<div class="project-source-badge"><i class="fa-brands fa-github"></i> GitHub</div>` 
      : '';

    const isFav = favorites.includes(proj.title);

    card.innerHTML = `
      <div class="project-img-container">
        <button class="project-bookmark-btn ${isFav ? 'active' : ''}" aria-label="Bookmark project" data-title="${proj.title}">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
        </button>
        ${sourceBadge}
        <div class="project-img-overlay">
          <a href="${proj.githubUrl}" target="_blank" class="project-overlay-link" aria-label="GitHub Source">
            <i class="fa-brands fa-github"></i>
          </a>
          <a href="${proj.demoUrl}" target="_blank" class="project-overlay-link" aria-label="Live Demo">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
        ${createProjectSVG(proj, index)}
      </div>
      <div class="project-info">
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-desc">${proj.description}</p>
        <div class="project-tags">
          ${proj.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
    projectsGrid.appendChild(card);
  });

  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('projects-search-input');
  const currentSearch = searchInput ? searchInput.value.trim().toLowerCase() : '';

  projectCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    const index = parseInt(card.getAttribute('data-index'));
    const project = portfolioData.projects[index];
    
    let categoryMatch = false;
    if (currentActiveFilter === 'all') {
      categoryMatch = true;
    } else if (currentActiveFilter === 'favorites') {
      categoryMatch = project ? favorites.includes(project.title) : false;
    } else {
      categoryMatch = (cardCategory === currentActiveFilter);
    }
    
    let searchMatch = true;
    if (currentSearch && project) {
      const titleMatch = project.title.toLowerCase().includes(currentSearch);
      const descMatch = project.description.toLowerCase().includes(currentSearch);
      const detailedDescMatch = (project.detailedDescription || '').toLowerCase().includes(currentSearch);
      const tagMatch = project.tags.some(tag => tag.toLowerCase().includes(currentSearch));
      
      searchMatch = titleMatch || descMatch || detailedDescMatch || tagMatch;
    }

    if (categoryMatch && searchMatch) {
      card.style.display = 'flex';
      card.style.animation = 'fadeIn 0.4s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

async function initGitHubCommits(username) {
  const commitListContainer = document.getElementById('github-commits-list');
  if (!commitListContainer) return;

  // Render skeleton loading
  let skeletonHtml = '';
  for (let i = 0; i < 3; i++) {
    skeletonHtml += `
      <div class="github-commit-item skeleton-commit" style="animation-delay: ${i * 0.15}s;">
        <div class="commit-left" style="width: 70%; display: flex; align-items: center; gap: 0.5rem;">
          <div class="skeleton-glow" style="width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;"></div>
          <div class="skeleton-glow" style="width: 60px; height: 16px; border-radius: 0.4rem; flex-shrink: 0;"></div>
          <div class="skeleton-glow" style="width: 150px; height: 16px; border-radius: 0.4rem; flex-grow: 1;"></div>
        </div>
        <div class="commit-right" style="width: 25%; justify-content: flex-end; display: flex; align-items: center; gap: 0.5rem;">
          <div class="skeleton-glow" style="width: 45px; height: 14px; border-radius: 0.4rem;"></div>
          <div class="skeleton-glow" style="width: 35px; height: 14px; border-radius: 0.4rem;"></div>
        </div>
      </div>
    `;
  }
  commitListContainer.innerHTML = skeletonHtml;

  try {
    const response = await fetch(`https://api.github.com/users/${username}/events/public`);
    if (!response.ok) throw new Error('Events response was not ok');
    const events = await response.json();
    
    // Filter for PushEvents which contain commits
    const pushEvents = events.filter(e => e.type === 'PushEvent');
    
    // Extract commits
    const commits = [];
    pushEvents.forEach(e => {
      const repoName = e.repo.name;
      const createdAt = e.created_at;
      if (e.payload && e.payload.commits) {
        e.payload.commits.forEach(c => {
          commits.push({
            repo: repoName,
            date: createdAt,
            message: c.message,
            sha: c.sha,
            url: `https://github.com/${repoName}/commit/${c.sha}`
          });
        });
      }
    });

    if (commits.length === 0) {
      // Fallback: Fetch commits from the Portfolio repository directly
      const repoResponse = await fetch(`https://api.github.com/repos/${username}/Portfolio/commits?per_page=5`);
      if (repoResponse.ok) {
        const repoCommits = await repoResponse.json();
        repoCommits.forEach(c => {
          commits.push({
            repo: `${username}/Portfolio`,
            date: c.commit.author.date,
            message: c.commit.message,
            sha: c.sha,
            url: c.html_url
          });
        });
      }
    }

    // Take the top 5 commits
    const recentCommits = commits.slice(0, 5);

    if (recentCommits.length === 0) {
      commitListContainer.innerHTML = `<p style="font-size: var(--small-font-size); color: var(--text-color-light);">No recent commits found.</p>`;
      return;
    }

    let commitsHtml = '';
    recentCommits.forEach(c => {
      const timeAgoStr = timeAgo(c.date);
      const shortSha = c.sha.substring(0, 7);
      const cleanRepo = c.repo.replace(`${username}/`, ''); // hide username in badge to keep it neat
      const cleanMsg = c.message.split('\n')[0]; // only show first line of message
      
      commitsHtml += `
        <div class="github-commit-item">
          <div class="commit-left">
            <i class="fa-solid fa-code-commit commit-icon"></i>
            <a href="https://github.com/${c.repo}" target="_blank" class="commit-repo" title="View Repository">${cleanRepo}</a>
            <span class="commit-msg" title="${c.message}">${cleanMsg}</span>
          </div>
          <div class="commit-right">
            <span>${timeAgoStr}</span>
            <a href="${c.url}" target="_blank" class="commit-sha" title="View Commit Difference">${shortSha}</a>
          </div>
        </div>
      `;
    });

    commitListContainer.innerHTML = commitsHtml;

  } catch (error) {
    console.error('Error loading GitHub commits:', error);
    commitListContainer.innerHTML = `<p style="font-size: var(--small-font-size); color: var(--text-color-light);">Unable to load live commit feed.</p>`;
  }
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 0) return "just now";
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " year" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
  return "just now";
}

