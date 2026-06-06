document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC CONTENT INJECTION
  initPortfolioContent();

  // 2. INTERACTIVE UI HANDLERS
  initNavigation();
  initThemeToggle();
  initScrollEffects();
  initTypingEffect();
  initProjectFiltering();
  initContactForm();
});

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
  skillsContainer.innerHTML = '';

  const categoryIcons = {
    'Frontend': 'fa-solid fa-code',
    'Backend & DB': 'fa-solid fa-server',
    'Backend': 'fa-solid fa-server',
    'Database': 'fa-solid fa-database',
    'Tools & DevOps': 'fa-solid fa-screwdriver-wrench',
    'Design': 'fa-solid fa-compass-drafting'
  };

  skills.forEach(skillGroup => {
    const iconClass = categoryIcons[skillGroup.category] || 'fa-solid fa-layer-group';
    const card = document.createElement('div');
    card.className = 'skills-category-card';
    
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

  // Projects Grid & Filters
  const projectsGrid = document.getElementById('projects-grid');
  const filtersContainer = document.getElementById('projects-filters');
  projectsGrid.innerHTML = '';

  // Get unique categories for projects to build tabs
  const categories = ['all', ...new Set(projects.map(p => p.category.toLowerCase()))];
  
  // Re-build category filters
  filtersContainer.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${cat === 'all' ? 'active-filter' : ''}`;
    btn.setAttribute('data-filter', cat);
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
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
    
    // Category icons & dynamic colors
    const categoryIcon = projectCategoryIcons[proj.category.toLowerCase()] || 'fa-solid fa-gears';

    card.innerHTML = `
      <div class="project-img-container">
        <!-- Overlay links -->
        <div class="project-img-overlay">
          <a href="${proj.githubUrl}" target="_blank" class="project-overlay-link" aria-label="GitHub Source">
            <i class="fa-brands fa-github"></i>
          </a>
          <a href="${proj.demoUrl}" target="_blank" class="project-overlay-link" aria-label="Live Demo">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
        <!-- Decorative abstract graphic fallback -->
        <div class="project-placeholder-visual">
          <i class="${categoryIcon}"></i>
          <span>${proj.category}</span>
        </div>
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
  const iconTheme = 'fa-sun'; // sun icon for light mode

  // Retrieve saved preference
  const selectedTheme = localStorage.getItem('selected-theme');
  
  // Set default state based on preference
  if (selectedTheme === 'light') {
    document.body.classList.remove(darkTheme);
    document.body.classList.add(lightTheme);
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  } else {
    document.body.classList.add(darkTheme);
    document.body.classList.remove(lightTheme);
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  }

  // Toggle button event
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

/* ==================== PROJECTS FILTERING ==================== */
function initProjectFiltering() {
  const filtersContainer = document.getElementById('projects-filters');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filtersContainer) return;

  filtersContainer.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;

    // Toggle active filter button style
    document.querySelector('.active-filter').classList.remove('active-filter');
    e.target.classList.add('active-filter');

    const filterValue = e.target.getAttribute('data-filter');

    projectCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');

      if (filterValue === 'all' || cardCategory === filterValue) {
        card.style.display = 'flex';
        // Add soft scale animation
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

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

      // Show Success Banner
      statusEl.className = 'form-message-status success';
      statusEl.textContent = 'Thank you! Your message has been sent successfully.';
      
      // Auto-hide success banner after 5 seconds
      setTimeout(() => {
        statusEl.className = 'form-message-status';
        statusEl.textContent = '';
      }, 5000);

    }, 2000);
  });
}
